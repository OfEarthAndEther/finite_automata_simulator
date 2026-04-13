import { Handle, Position, useReactFlow } from 'reactflow';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

export default function StateNode({ id, data, selected }) {
  const { setNodes, setEdges } = useReactFlow();

  const deleteNode = (e) => {
    e.stopPropagation();
    setNodes(nds => nds.filter(n => n.id !== id));
    setEdges(eds => eds.filter(edg => edg.source !== id && edg.target !== id));
  };

  return (
    <motion.div
      className={`group relative rounded-full border-[3px] shadow-sm flex items-center justify-center transition-colors duration-200 ${data.isActive
        ? 'bg-[var(--primary-color)] bg-opacity-20 border-[var(--primary-color)] text-[var(--primary-color)]'
        : selected
          ? 'bg-opacity-10 border-blue-400 text-blue-500'
          : 'bg-[var(--bg-color)] border-[var(--border-color)] text-[var(--text-color)]'
        }`}
      style={{ width: 60, height: 60 }}
      animate={data.isActive ? {
        boxShadow: ['0px 0px 0px 0px rgba(59, 130, 246, 0.4)', '0px 0px 0px 8px rgba(59, 130, 246, 0)'],
      } : {}}
      transition={data.isActive ? { duration: 1.5, repeat: Infinity } : {}}
    >
      <Handle type="target" position={Position.Top} id="top-target" className="w-3 h-3 bg-[var(--primary-color)] border-2 border-[var(--bg-color)] opacity-0 group-hover:opacity-100 transition-all duration-200" />
      <Handle type="source" position={Position.Bottom} id="bottom-source" className="w-3 h-3 bg-[var(--primary-color)] border-2 border-[var(--bg-color)] opacity-0 group-hover:opacity-100 transition-all duration-200" />
      <Handle type="target" position={Position.Left} id="left-target" className="w-3 h-3 bg-[var(--primary-color)] border-2 border-[var(--bg-color)] opacity-0 group-hover:opacity-100 transition-all duration-200" />
      <Handle type="source" position={Position.Right} id="right-source" className="w-3 h-3 bg-[var(--primary-color)] border-2 border-[var(--bg-color)] opacity-0 group-hover:opacity-100 transition-all duration-200" />

      {data.isStart && (
        <div className="absolute -left-[30px] flex items-center text-[var(--text-color)] opacity-60">
          <span className="text-xl">➔</span>
        </div>
      )}

      {/* Final State inner circle */}
      {data.isAccept && (
        <div className="absolute inset-1 border-[2px] rounded-full"
          style={{ borderColor: 'currentColor' }} />
      )}

      <span className="font-bold font-mono z-10 text-sm">{data.label}</span>

      {/* Manual Immediate Delete Button */}
      <div
        onClick={deleteNode}
        className="absolute -top-1 -right-1 w-5 h-5 bg-red-100 border border-red-300 rounded-full flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:bg-red-200 hover:scale-110"
        title="Delete Node"
      >
        <X size={12} className="text-red-600" />
      </div>

    </motion.div>
  );
}
