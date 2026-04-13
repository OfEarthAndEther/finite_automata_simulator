import { useCallback, useRef, useState } from 'react';
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  useReactFlow,
  Panel
} from 'reactflow';
import 'reactflow/dist/style.css';
import StateNode from './StateNode';
import SelfLoopEdge from './SelfLoopEdge';
import ArcEdge from './ArcEdge';
import { toPng } from 'html-to-image';

const nodeTypes = { stateNode: StateNode };
const edgeTypes = { selfLoop: SelfLoopEdge, transition: ArcEdge };

export default function GraphCanvas({ nodes, setNodes, edges, setEdges, activeStates }) {
  const reactFlowWrapper = useRef(null);
  const [menu, setMenu] = useState(null);
  const [pendingEdge, setPendingEdge] = useState(null);
  const [edgeInput, setEdgeInput] = useState('');
  const { project } = useReactFlow();

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const onConnect = useCallback(
    (params) => {
      setPendingEdge(params);
      setEdgeInput('');
    },
    []
  );

  const submitPendingEdge = (label) => {
    if (!pendingEdge) return;
    if (label.trim() === '') label = 'ε';
    const newEdge = {
      ...pendingEdge,
      id: `e${pendingEdge.source}-${pendingEdge.target}-${Date.now()}`,
      label: label.trim(),
      type: pendingEdge.source === pendingEdge.target ? 'selfLoop' : 'transition',
      markerEnd: { type: 'arrowclosed', color: label.trim() === 'ε' ? '#94a3b8' : '#64748b' },
      style: {
        strokeWidth: 2,
        stroke: label.trim() === 'ε' ? '#94a3b8' : '#64748b',
        strokeDasharray: label.trim() === 'ε' ? '5 5' : 'none'
      }
    };
    setEdges((eds) => addEdge(newEdge, eds));
    setPendingEdge(null);
    setEdgeInput('');
  };

  const cancelPendingEdge = () => {
    setPendingEdge(null);
    setEdgeInput('');
  };

  const getNextNodeId = useCallback(() => {
    let max = -1;
    nodes.forEach(n => {
      const num = parseInt(n.id.replace('q', ''));
      if (!isNaN(num) && num > max) max = num;
    });
    return `q${max + 1}`;
  }, [nodes]);

  const onPaneDoubleClick = useCallback(
    (e) => {
      e.preventDefault();
      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = project({
        x: e.clientX - bounds.left,
        y: e.clientY - bounds.top,
      });

      const nextId = getNextNodeId();
      const newNode = {
        id: nextId,
        type: 'stateNode',
        position,
        data: { label: nextId, isStart: false, isAccept: false, isActive: false },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [getNextNodeId, project, setNodes]
  );

  const addStateManually = () => {
    // Attempt to drop it vaguely in the center of the viewport
    const position = project({ x: window.innerWidth / 2 - 150, y: window.innerHeight / 2 - 100 });
    const nextId = getNextNodeId();
    const newNode = {
      id: nextId,
      type: 'stateNode',
      position,
      data: { label: nextId, isStart: false, isAccept: false, isActive: false },
    };
    setNodes((nds) => nds.concat(newNode));
  };

  const onNodeContextMenu = useCallback(
    (event, node) => {
      event.preventDefault();
      setMenu({
        type: 'node',
        id: node.id,
        top: event.clientY,
        left: event.clientX,
        nodeData: node.data
      });
    },
    [setMenu]
  );

  const onEdgeContextMenu = useCallback(
    (event, edge) => {
      event.preventDefault();
      setMenu({
        type: 'edge',
        id: edge.id,
        top: event.clientY,
        left: event.clientX,
        edgeData: edge
      });
    },
    [setMenu]
  );

  const closeMenu = () => setMenu(null);

  const toggleAttribute = (attr) => {
    if (!menu) return;
    setNodes((nds) => {
      const targetNode = nds.find(n => n.id === menu.id);
      if (!targetNode) return nds;
      const nextValue = !targetNode.data[attr];

      return nds.map((n) => {
        if (n.id === menu.id) {
          return { ...n, data: { ...n.data, [attr]: nextValue } };
        }
        if (attr === 'isStart' && nextValue && n.id !== menu.id) {
          return { ...n, data: { ...n.data, isStart: false } };
        }
        return n;
      });
    });
    closeMenu();
  };

  // Sync active states for animation
  const mappedNodes = nodes.map(n => ({
    ...n,
    data: { ...n.data, isActive: activeStates.has(n.id) }
  }));

  const exportAsPNG = () => {
    if (reactFlowWrapper.current === null) return;
    toPng(reactFlowWrapper.current, { backgroundColor: 'var(--bg-color)' })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'automaton.png';
        link.href = dataUrl;
        link.click();
      });
  };

  return (
    <div className="w-full h-full relative" ref={reactFlowWrapper} onClick={closeMenu}>
      <ReactFlow
        nodes={mappedNodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onPaneDoubleClick={onPaneDoubleClick}
        onNodeContextMenu={onNodeContextMenu}
        onEdgeContextMenu={onEdgeContextMenu}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="currentColor" className="opacity-10" />
        <Controls />
        <Panel position="top-right" className="flex gap-2">
          <button onClick={addStateManually} className="bg-[var(--primary-color)] text-white text-xs font-semibold px-4 py-1.5 rounded shadow border border-transparent hover:opacity-90 transition-all">
            + Add State
          </button>
          <button onClick={exportAsPNG} className="bg-white/80 backdrop-blur-sm text-xs font-semibold px-3 py-1.5 rounded shadow border border-[var(--border-color)] hover:bg-white transition-colors text-gray-700">
            Export PNG
          </button>
        </Panel>
      </ReactFlow>

      {menu && menu.type === 'node' && (
        <div
          style={{ top: menu.top, left: menu.left }}
          className="absolute z-50 bg-white shadow-xl rounded-lg py-2 border border-gray-100 min-w-[150px]"
        >
          <div className="px-3 pb-2 border-b border-gray-100 mb-1 text-xs text-gray-400 font-semibold uppercase">Edit Node {menu.nodeData.label}</div>
          <button
            className="w-full text-left px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors"
            onClick={(e) => { e.stopPropagation(); toggleAttribute('isStart'); }}
          >
            {menu.nodeData.isStart ? '✓ Initial State' : 'Set Initial'}
          </button>
          <button
            className="w-full text-left px-4 py-2 text-sm hover:bg-amber-50 hover:text-amber-600 transition-colors"
            onClick={(e) => { e.stopPropagation(); toggleAttribute('isAccept'); }}
          >
            {menu.nodeData.isAccept ? '✓ Final State' : 'Set Final'}
          </button>
          <button
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setNodes(nds => nds.filter(n => n.id !== menu.id));
              closeMenu();
            }}
          >
            Delete Node
          </button>
        </div>
      )}

      {menu && menu.type === 'edge' && (
        <div
          style={{ top: menu.top, left: menu.left }}
          className="absolute z-50 bg-white shadow-xl rounded-lg py-2 border border-gray-100 min-w-[150px]"
        >
          <div className="px-3 pb-2 border-b border-gray-100 mb-1 text-xs text-gray-400 font-semibold uppercase">Edit Transition</div>
          <button
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setEdges(eds => eds.filter(edg => edg.id !== menu.id));
              closeMenu();
            }}
          >
            Delete Edge
          </button>
        </div>
      )}

      {/* Modern Edge Prompt Modal */}
      {pendingEdge && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-6 w-[320px] animate-in fade-in zoom-in duration-200">
            <h3 className="font-bold text-gray-800 text-lg mb-1">New Transition</h3>
            <p className="text-xs text-gray-500 mb-4 font-medium leading-relaxed">
              Define the symbols to jump from <span className="font-mono text-blue-600 bg-blue-50 px-1 rounded">{pendingEdge.source}</span> to <span className="font-mono text-blue-600 bg-blue-50 px-1 rounded">{pendingEdge.target}</span>. Leave blank for <span className="font-serif italic font-bold">epsilon</span> (ε).
            </p>
            <input
              type="text"
              autoFocus
              value={edgeInput}
              onChange={(e) => setEdgeInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') submitPendingEdge(edgeInput);
                if (e.key === 'Escape') cancelPendingEdge();
              }}
              placeholder="e.g. 0, 1"
              className="w-full border-2 border-gray-100 focus:border-[var(--primary-color)] outline-none rounded-lg px-3 py-2 text-sm font-mono mb-5 transition-colors"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={cancelPendingEdge}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => submitPendingEdge(edgeInput)}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[var(--primary-color)] hover:opacity-90 shadow border border-transparent transition-all"
              >
                Create Edge
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="absolute top-2 left-2 pointer-events-none opacity-50 text-sm font-mono flex items-center gap-1">
        <span className="bg-white/50 px-2 py-1 rounded">Double-click</span> (or use button) to add state
      </div>
    </div>
  );
}
