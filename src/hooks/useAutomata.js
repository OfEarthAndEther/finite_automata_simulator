import { useState, useCallback, useRef, useEffect } from 'react';
import { AutomataEngine } from '../engine/AutomataCore';

export function useAutomata(nodes, edges, type = 'DFA') {
  const engineRef = useRef(new AutomataEngine(type));
  const [engineState, setEngineState] = useState({
    activeStates: new Set(),
    inputString: '',
    currentIndex: 0,
    history: [],
    status: 'idle', // 'idle' | 'running' | 'accepted' | 'rejected'
    validationInfo: { valid: true }
  });

  const syncEngine = useCallback(() => {
    engineRef.current.type = type;
    engineRef.current.fromData(nodes, edges);

    // Validate if DFA
    const vInfo = engineRef.current.validateDFA();

    setEngineState(prev => {
      // Re-evaluate initial state based on current topology
      const initial = engineRef.current.initialState;
      const initialEpsilonClosure = initial ? engineRef.current.getEpsilonClosure(new Set([initial])) : new Set();

      return {
        ...prev,
        activeStates: initialEpsilonClosure,
        validationInfo: vInfo,
        status: prev.status === 'idle' ? 'idle' : prev.status,
        currentIndex: prev.status === 'idle' ? 0 : prev.currentIndex
      };
    });
  }, [nodes, edges, type]);

  useEffect(() => {
    syncEngine();
  }, [syncEngine]);

  const setInputString = (str) => {
    setEngineState(prev => {
      const initial = engineRef.current.initialState;
      const initialEpsilonClosure = initial ? engineRef.current.getEpsilonClosure(new Set([initial])) : new Set();

      let newStatus = 'idle';
      if (str === '') {
        newStatus = engineRef.current.isAccepted(initialEpsilonClosure) ? 'accepted' : 'rejected';
      }

      return {
        ...prev,
        inputString: str,
        currentIndex: 0,
        activeStates: initialEpsilonClosure,
        history: [],
        status: newStatus
      };
    });
  };

  const step = () => {
    setEngineState(prev => {
      if (prev.currentIndex >= prev.inputString.length) return prev; // Finish string

      const symbol = prev.inputString[prev.currentIndex];
      const nextStates = engineRef.current.step(prev.activeStates, symbol);

      const nextIndex = prev.currentIndex + 1;
      let newStatus = 'running';

      if (nextIndex >= prev.inputString.length) {
        newStatus = engineRef.current.isAccepted(nextStates) ? 'accepted' : 'rejected';
      }

      const entry = {
        symbol,
        from: new Set(prev.activeStates),
        to: new Set(nextStates)
      };

      return {
        ...prev,
        activeStates: nextStates,
        currentIndex: nextIndex,
        history: [...prev.history, entry],
        status: newStatus
      };
    });
  };

  const reset = () => {
    setEngineState(prev => {
      const initial = engineRef.current.initialState;
      const initialEpsilonClosure = initial ? engineRef.current.getEpsilonClosure(new Set([initial])) : new Set();
      let newStatus = 'idle';
      if (prev.inputString === '') {
        newStatus = engineRef.current.isAccepted(initialEpsilonClosure) ? 'accepted' : 'rejected';
      }
      return {
        ...prev,
        activeStates: initialEpsilonClosure,
        currentIndex: 0,
        history: [],
        status: newStatus
      };
    });
  };

  const stepBack = () => {
    setEngineState(prev => {
      if (prev.history.length === 0) return prev; // Cannot go back

      const newHistory = [...prev.history];
      const lastEntry = newHistory.pop();

      // Recalculate status based on where we are now
      let newStatus = 'running';
      if (prev.inputString === '') {
        newStatus = engineRef.current.isAccepted(lastEntry.from) ? 'accepted' : 'rejected';
      } else if (prev.currentIndex - 1 === 0) {
        newStatus = 'idle'; // Reset to idle if we are back at the start
      }

      return {
        ...prev,
        activeStates: lastEntry.from,
        currentIndex: prev.currentIndex - 1,
        history: newHistory,
        status: newStatus
      };
    });
  };

  return {
    engine: engineRef.current,
    state: engineState,
    setInputString,
    step,
    stepBack,
    reset,
    syncEngine
  };
}
