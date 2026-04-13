export default function TransitionTable({ engine, activeStates = new Set() }) {
  if (!engine) return null;
  const states = Array.from(engine.states).sort();
  const alphabet = Array.from(engine.alphabet).sort();

  return (
    <div className="w-full overflow-x-auto bg-white/50 backdrop-blur-sm rounded-lg p-2 shadow-sm border border-[var(--border-color)]">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b-[2px] border-gray-400 text-xs uppercase text-gray-700 tracking-wider font-semibold">
            <th className="px-4 py-3 text-left w-24">State</th>
            {alphabet.map(sym => (
              <th key={sym} className="px-4 py-3 text-center">{sym}</th>
            ))}
            <th className="px-4 py-3 text-center">ε</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border-color)]">

          {states.map(state => {
            const isStart = state === engine.initialState;
            const isAccept = engine.finalStates.has(state);
            const isActive = activeStates.has(state);
            const prefix = isStart && isAccept ? '➔*' : isStart ? '➔ ' : isAccept ? '* ' : '  ';

            return (
              <tr key={state} className={`group transition-colors ${isActive ? 'bg-[var(--primary-color)]/10 border-l-4 border-[var(--primary-color)]' : 'hover:bg-black/5 border-l-4 border-transparent'}`}>
                <td className="px-4 py-2 font-mono font-bold text-gray-900 whitespace-nowrap text-left border-r border-gray-200/50">
                  {prefix}{state}
                </td>
                {alphabet.map(sym => {
                  const targets = engine.transitions[state]?.[sym] || new Set();
                  const targetStr = Array.from(targets).join(', ');
                  return (
                    <td key={sym} className="px-4 py-2 font-mono text-gray-600 text-center border-r border-gray-200/50">
                      {targets.size > 0 ? (engine.type === 'NFA' ? `{${targetStr}}` : targetStr) : '-'}
                    </td>
                  );
                })}
                <td className="px-4 py-2 font-mono text-gray-400 text-center">
                  {engine.transitions[state]?.['']?.size ? `{${Array.from(engine.transitions[state]['']).join(', ')}}` : '-'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
