# Finite Automata Simulator
Srishti | 2024UCA1923 | CSAI2

## Project Overview

**Finite Automata Simulator** is a robust, interactive visualization tool designed to render, simulate, and analyze formal computational models in real-time. Created for rigorous academic applications and technical demonstrations, the simulator provides an intuitive canvas for engineering Deterministic Finite Automata (DFA), Non-Deterministic Finite Automata (NFA), and Epsilon-NFA (ε-NFA). It facilitates dynamic string processing, step-by-step state transition evaluation, and deterministic simulation to thoroughly analyze theoretical language boundaries.

## Theory of Automata and Formal Languages (TAFL) Concepts

Finite Automata represent foundational models of computation, vital to understanding state logic, lexical analysis within compilers, and formal language recognition.

*   **Deterministic Finite Automata (DFA):** A theoretical machine strictly enforcing a finite number of states that transitions between them based on input symbols. For every state and valid symbol, there is exactly one deterministic transition mapping ($Q \times \Sigma \rightarrow Q$).
*   **Non-Deterministic Finite Automata (NFA):** Similar to DFA, but conceptually branches its computation logic. Allows multiple transitions for a single symbol from a specific state, effectively spawning parallel computational threads ($\delta : Q \times \Sigma \rightarrow Q$).
*   **ε-NFA (Epsilon-NFA):** An extension of NFA logic that accommodates spontaneous transitions ($\epsilon$-transitions) without consuming an input symbol from the string. Often utilized in forming intermediate structures when compiling regular expressions into standard machines.

This simulator executes mathematical set-theory algorithms to project the complete lifecycle of string processing across these models, allowing users to precisely trace acceptance or rejection pathways.

## Technologies Used

The project is built on a modern, highly optimized JavaScript ecosystem tailored for performance and state-driven visualization.

*   **Core Framework:** React 19 initialized with Vite for rapid compilation and ultra-fast Hot Module Replacement (HMR).
*   **Styling & Theming:** Tailwind CSS integration provides a robust, responsive, design-token-based system. Complemented by `clsx` and `tailwind-merge` to resolve complex dynamic utility class combinations seamlessly.
*   **Animation & Motion:** Framer Motion drives fluid, physics-based UI transitions.
*   **Iconography:** Lucide React supplies modern, scalable, vector-based interface elements.
*   **Export Pipeline:** `html-to-image` is leveraged to perform precise rasterization, allowing users to export their interactive automaton canvas to standardized PNG formats.

## Getting Started / How to Run Locally

To spin up the visualization environment locally on your own machine, execute these commands via your system terminal:

1. **Navigate to the root directory**: Ensure you are in the `finite-automata` folder.
2. **Install core module dependencies**:
   ```bash
   npm install
   ```
3. **Boot up the Vite Dev Server:**
   ```bash
   npm run dev
   ```
4. **Access the Application**: Open your browser and navigate to the localhost port provided in the terminal (typically `http://localhost:5173`).

## Visualization & Engineering Tools Integrated

Achieving exhaustive mathematical correctness alongside optimal UI readability requires carefully integrating multiple software engineering tools.

*   **React Flow (Graph Visualization Engine):** The graphical heartbeat of the tool. React Flow is responsible for rendering the complex graph configurations. It handles coordinate mapping of automaton states (nodes) and directed transitions (edges). 
    *   *Custom Overrides:* Standard out-of-the-box components were replaced with rigorous implementations (`StateNode.jsx`, `ArcEdge.jsx`, `SelfLoopEdge.jsx`) to enforce graph theory aesthetics, ensuring proper quadratic bezier curvature, label bounding, and multi-graph separation.
*   **Dynamic Matrix (`TransitionTable.jsx`):** Accommodates the strict dual-representation requirement common in automata environments. A reactive adjacency matrix translates visual nodes natively into a structured table. Adjusting nodes on the canvas synchronously updates the matrix, verifying structural language integrity.
*   **Deterministic Logic Engine (`AutomataCore.js`):** Fully decoupled from the React execution lifecycle. The underlying logic engine maps mathematical state boundaries, handles string splitting, iterates sequential checks over defined alphabets ($\Sigma$), tracks $\epsilon$-closures, and evaluates final state ($F$) convergence.
*   **State Hooks (`useAutomata.js`):** Bridges the pure `AutomataCore` with the React front-end, packaging the automaton's computational logic, step playback timeline, and current simulated string into a highly available custom reactive hook.

## Conceptual Underpinnings of Simulation Results

*(Note: State convergence concepts and runtime mathematical validations are actively integrated directly into the simulator UI. A dynamic "Theoretical Validation" widget responds to each simulation step in real-time, explaining precisely why a string diverges, traps, or accepts).*

To rigorously validate the computational simulation, it is essential to understand the underlying discrete states and logical boundaries forming an **Accept** or **Reject** result.

*   **String Consumption & State Traversal:** 
    During a simulation step, the automaton consumes the input string sequentially (symbol-by-symbol, left-to-right). A transition function $\delta(q_i, a) = q_j$ maps the current state $q_i$ and the current input symbol $a \in \Sigma$ to a new state (or set of states) $q_j$. If an input symbol is encountered for which no valid transition exists in the current state(s), the current computation path is instantaneously nullified (a "trap" or "dead" state logic occurs implicitly).

*   **$\epsilon$-Closure Computation:**
    A defining characteristic of the $\epsilon$-NFA simulation is its spontaneous movement capability. Before absorbing any new character from the main input string, the engine recursively calculations the $\epsilon$-closure. This is the set of all states reachable from the current active state(s) across any number of $\epsilon$-transitions, without consuming an input character. This mirrors the theoretical parallel-universe branching mechanism, effectively tracking concurrent pathways mapped natively during regular expression compilation.

*   **Acceptance Criteria (Validation):**
    A successful computation path—yielding a validated **Accept** result—is defined mathematically as convergence. After the simulation engine has exhausted the entire input string ($w$), the automaton intercepts the result. If the intersection between the set of currently active states (including their final $\epsilon$-closures) and the designated set of final/accepting states ($F$) is non-empty ($ActiveStates \cap F \neq \emptyset$), the string is formally proven to belong to the language $L(A)$. 

*   **Rejection Criteria (Validation):**
    A **Reject** result indicates the string falls outside the defined formal language boundaries. Rejection manifests in two distinct constraint violations:
    1.  **Premature Exhaustion (Dead Path):** The simulation halts abruptly before reaching the end of the input string because there are zero valid outgoing edges mapping the next character from any currently active computational branch.
    2.  **Failed Convergence:** The entirety of the input string is consumed efficiently, but none of the resulting active terminal states belong to the final state set $F$.

## Best Practices for Constructing Robust Simulations

*(Note: These structural design recommendations are also accessible directly from the simulator canvas via the "Simulation Design Hints" collapsible pane, ensuring topologic engineering references are always available on-the-fly).*

To leverage the visualization tool efficiently and engineer clear, unambiguous, and theoretically sound finite automata, observe the following structural hints:

*   **Minimize Edge Crossings (Planarity):**
    Position your vertices (states) to flow logically in a directed manner, typically projecting the primary computation path horizontally from left (Start State) to right (Accepting States). Utilize standard arc geometry (`ArcEdge`) for forward progression and negative curvature arcs for backward loops/cycles. Minimizing edge intersections geometrically verifies the automaton's conceptual readability.

*   **Explicit Dead States over Implicit Rejection:**
    While the NFA/DFA engine natively handles missing transitions by implicitly dropping the path, explicitly rendering a "Trap" or "Dead" state—especially in DFA construction—creates a more pedagogically transparent simulation environment. It allows observers to visually track the exact state and symbol combination that triggered the string parsing failure.

*   **Leverage Epsilon ($\epsilon$) Bridges for Modularity:**
    When constructing complex mathematical unions or aggregations (e.g., merging two standalone DFAs into a unified NFA), use $\epsilon$-transitions to seamlessly bridge sub-components rather than destructively rewiring absolute transitions. This preserves the isolated integrity of your sub-machines and highlights the precise modular combination step during visual runtime.

*   **Simulate Edge Cases Early:**
    Prior to declaring an automaton fully formed, intentionally probe its boundaries. Execute test simulations against:
    *   The empty string ($\epsilon$)—does it behave predictably according to its start/accept state overlap geometry?
    *   Terminal characters that violently disrupt standard cyclic loops (instant exit conditions).
    *   Truncated strings missing expected termination sequences.
    
    Observing the dynamic state execution along the visual matrix (`TransitionTable`) synchronously against these edge-cases rapidly isolates state boundary failures and refines logic faster.

## Directory Structure

```text
finite-automata/
├── public/                 # Static assets and document roots
│
├── src/                    # Source code and compilation directory
│   ├── assets/             # Project-specific bundled assets (SVGs, icons)
│   │
│   ├── components/         # React presentation and logic components
│   │   ├── ArcEdge.jsx         # Custom React Flow standard arc transition edge
│   │   ├── SelfLoopEdge.jsx    # Custom React Flow self-transition recursive loop
│   │   ├── StateNode.jsx       # Custom React Flow isolated node structure
│   │   ├── GraphCanvas.jsx     # Primary interactive node-editor workspace
│   │   ├── ThemeToggle.jsx     # Light/Dark context switching component
│   │   └── TransitionTable.jsx # Synchronous mathematical transition matrix
│   │
│   ├── engine/             
│   │   └── AutomataCore.js     # Discrete core logic engine for sequence processing
│   │
│   ├── hooks/
│   │   └── useAutomata.js      # Application state router and timeline manager
│   │
│   ├── App.jsx             # Main layout, router injection, and compositional root
│   ├── App.css             # Component-level styling configurations
│   ├── index.css           # Global Tailwind environment and browser resets
│   ├── main.jsx            # Application initialization and DOM injection
│   └── examples.js         # Pre-configured boilerplate automaton definitions
│
├── .eslint.config.js       # Flat ESLint definitions enforcing code quality standards
├── index.html              # Bootstrapped HTML template
├── vite.config.js          # Build configuration and optimization settings
├── package.json            # Project manifest, script hooks, and dependencies
└── package-lock.json       # Deterministic dependency resolution tree
```
