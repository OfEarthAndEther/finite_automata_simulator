export class AutomataEngine {
  constructor(type = 'NFA') {
    this.type = type; // 'DFA' | 'NFA'
    this.states = new Set(); // Q
    this.alphabet = new Set(); // Sigma
    this.transitions = {}; // delta: stateId -> { symbol -> Set([stateIds]) }
    this.initialState = null; // q0
    this.finalStates = new Set(); // F
  }

  fromData(nodes, edges) {
    this.states.clear();
    this.alphabet.clear();
    this.transitions = {};
    this.initialState = null;
    this.finalStates.clear();

    nodes.forEach(node => {
      const id = node.id;
      this.states.add(id);

      if (node.data?.isStart) {
        if (!this.initialState) this.initialState = id;
      }
      if (node.data?.isAccept) {
        this.finalStates.add(id);
      }
    });

    edges.forEach(edge => {
      const source = edge.source;
      const target = edge.target;
      const rawLabels = edge.label ? edge.label.split(',').map(s => s.trim()) : [''];

      if (!this.transitions[source]) {
        this.transitions[source] = {};
      }

      rawLabels.forEach(label => {
        // Assume empty string lambda/epsilon is '' or 'ε'
        if (label === 'ε') label = '';

        if (label !== '') this.alphabet.add(label);

        if (!this.transitions[source][label]) {
          this.transitions[source][label] = new Set();
        }
        this.transitions[source][label].add(target);
      });
    });
  }

  getEpsilonClosure(stateIds) {
    const closure = new Set(stateIds);
    const stack = [...stateIds];

    while (stack.length > 0) {
      const current = stack.pop();
      const epsilonReach = this.transitions[current]?.[''] || new Set();

      for (const next of epsilonReach) {
        if (!closure.has(next)) {
          closure.add(next);
          stack.push(next);
        }
      }
    }
    return closure;
  }

  validateDFA() {
    if (this.type !== 'DFA') return { valid: true };
    const missing = [];

    for (const state of this.states) {
      if (!this.transitions[state]) {
        missing.push({ state, missing: Array.from(this.alphabet) });
        continue;
      }

      const missingSymbols = [];
      for (const symbol of this.alphabet) {
        const paths = this.transitions[state][symbol];
        if (!paths || paths.size === 0) {
          missingSymbols.push(symbol);
        } else if (paths.size > 1) {
          return { valid: false, error: `DFA Invalid: state ${state} has multiple transitions for '${symbol}'` };
        }
      }

      if (missingSymbols.length > 0) {
        missing.push({ state, missing: missingSymbols });
      }

      // No epsilon transitions in DFA allowed
      if (this.transitions[state][''] && this.transitions[state][''].size > 0) {
        return { valid: false, error: `DFA Invalid: state ${state} has epsilon transitions` };
      }
    }

    if (missing.length > 0) {
      return {
        valid: false,
        error: `Incomplete DFA: Missing transitions`,
        details: missing
      };
    }

    return { valid: true };
  }

  step(currentStates, symbol) {
    const nextStates = new Set();
    currentStates.forEach(state => {
      const targets = this.transitions[state]?.[symbol] || new Set();
      targets.forEach(t => nextStates.add(t));
    });
    return this.getEpsilonClosure(nextStates);
  }

  isAccepted(currentStates) {
    for (const state of currentStates) {
      if (this.finalStates.has(state)) return true;
    }
    return false;
  }
}
