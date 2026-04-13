export const PRESET_EXAMPLES = {
  DFA: {
    name: 'DFA: Even number of 0s',
    mode: 'DFA',
    nodes: [
      { id: 'qEven', type: 'stateNode', position: { x: 250, y: 150 }, data: { label: 'qEven', isStart: true, isAccept: true } },
      { id: 'qOdd', type: 'stateNode', position: { x: 450, y: 150 }, data: { label: 'qOdd', isStart: false, isAccept: false } },
    ],
    edges: [
      { id: 'e1', source: 'qEven', target: 'qOdd', label: '0', type: 'transition', markerEnd: { type: 'arrowclosed', color: '#64748b' }, style: { strokeWidth: 2, stroke: '#64748b' } },
      { id: 'e2', source: 'qOdd', target: 'qEven', label: '0', type: 'transition', markerEnd: { type: 'arrowclosed', color: '#64748b' }, style: { strokeWidth: 2, stroke: '#64748b' } },
      { id: 'e3', source: 'qEven', target: 'qEven', type: 'selfLoop', markerEnd: { type: 'arrowclosed', color: '#64748b' }, label: '1', style: { strokeWidth: 2, stroke: '#64748b' } },
      { id: 'e4', source: 'qOdd', target: 'qOdd', type: 'selfLoop', markerEnd: { type: 'arrowclosed', color: '#64748b' }, label: '1', style: { strokeWidth: 2, stroke: '#64748b' } },
    ]
  },
  NFA: {
    name: 'NFA: Ends with 01 (Parallel Branching)',
    mode: 'NFA',
    nodes: [
      { id: 'q0', type: 'stateNode', position: { x: 150, y: 150 }, data: { label: 'q0', isStart: true, isAccept: false } },
      { id: 'q1', type: 'stateNode', position: { x: 350, y: 150 }, data: { label: 'q1', isStart: false, isAccept: false } },
      { id: 'q2', type: 'stateNode', position: { x: 550, y: 150 }, data: { label: 'q2', isStart: false, isAccept: true } },
    ],
    edges: [
      { id: 'e1', source: 'q0', target: 'q0', type: 'selfLoop', markerEnd: { type: 'arrowclosed', color: '#64748b' }, label: '0, 1', style: { strokeWidth: 2, stroke: '#64748b' } },
      { id: 'e2', source: 'q0', target: 'q1', label: '0', type: 'transition', markerEnd: { type: 'arrowclosed', color: '#64748b' }, style: { strokeWidth: 2, stroke: '#64748b' } },
      { id: 'e3', source: 'q1', target: 'q2', label: '1', type: 'transition', markerEnd: { type: 'arrowclosed', color: '#64748b' }, style: { strokeWidth: 2, stroke: '#64748b' } },
    ]
  },
  EPSILON: {
    name: 'NFA (ε): Epsilon Transitions',
    mode: 'NFA',
    nodes: [
      { id: 'qA', type: 'stateNode', position: { x: 150, y: 100 }, data: { label: 'qA', isStart: true, isAccept: false } },
      { id: 'qB', type: 'stateNode', position: { x: 350, y: 100 }, data: { label: 'qB', isStart: false, isAccept: false } },
      { id: 'qC', type: 'stateNode', position: { x: 350, y: 250 }, data: { label: 'qC', isStart: false, isAccept: false } },
      { id: 'qD', type: 'stateNode', position: { x: 550, y: 175 }, data: { label: 'qD', isStart: false, isAccept: true } },
    ],
    edges: [
      { id: 'e1', source: 'qA', target: 'qB', label: '', type: 'transition', markerEnd: { type: 'arrowclosed', color: '#94a3b8' }, style: { strokeWidth: 2, stroke: '#94a3b8', strokeDasharray: '5 5' } }, // Epsilon
      { id: 'e2', source: 'qA', target: 'qC', label: '', type: 'transition', markerEnd: { type: 'arrowclosed', color: '#94a3b8' }, style: { strokeWidth: 2, stroke: '#94a3b8', strokeDasharray: '5 5' } }, // Epsilon
      { id: 'e3', source: 'qB', target: 'qD', label: '1', type: 'transition', markerEnd: { type: 'arrowclosed', color: '#64748b' }, style: { strokeWidth: 2, stroke: '#64748b' } },
      { id: 'e4', source: 'qC', target: 'qD', label: '0', type: 'transition', markerEnd: { type: 'arrowclosed', color: '#64748b' }, style: { strokeWidth: 2, stroke: '#64748b' } },
    ]
  }
};
