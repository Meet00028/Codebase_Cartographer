import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { FileCode, Database, Server, Component, Folder, FolderOpen, ChevronRight, ChevronDown } from 'lucide-react';

export default function CustomNode({ data, selected }) {
  const getIcon = () => {
    if (data.isFolder) {
      return data.collapsed ? <Folder className="w-4 h-4 text-amber-500" /> : <FolderOpen className="w-4 h-4 text-amber-500" />;
    }
    switch (data.type) {
      case 'frontend': return <Component className="w-4 h-4 text-zinc-400" />;
      case 'backend': return <Server className="w-4 h-4 text-zinc-400" />;
      case 'database': return <Database className="w-4 h-4 text-zinc-400" />;
      default: return <FileCode className="w-4 h-4 text-zinc-400" />;
    }
  };

  const isHeatmap = data.heatmapActive;
  const comp = data.complexity || 'low';

  let glowClass = selected ? "bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]" : "bg-white/20 group-hover:bg-white/40";
  let borderColorClass = selected ? "border-white/20 bg-white/5" : "border-white/10 hover:bg-white/[0.02]";

  if (isHeatmap) {
    if (comp === 'high') {
      glowClass = "bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.8)]";
      borderColorClass = "border-red-500/30 bg-red-500/[0.02]";
    } else if (comp === 'medium') {
      glowClass = "bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.8)]";
      borderColorClass = "border-amber-500/30 bg-amber-500/[0.02]";
    } else {
      glowClass = "bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.8)]";
      borderColorClass = "border-green-500/30 bg-green-500/[0.02]";
    }
  }

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        type: 'spring', 
        stiffness: 100, 
        damping: 30, 
        mass: 2,
        delay: (data.index || 0) * 0.02 // slightly faster stagger
      }}
      className={cn(
        "relative flex flex-col p-4 min-w-[200px] rounded-sm border-y border-r bg-zinc-950/60 backdrop-blur-xl",
        "shadow-[20px_20px_60px_rgba(0,0,0,0.5)] transition-all duration-500 group",
        borderColorClass
      )}
    >
      {/* Industrial Glowing Left Border */}
      <div 
        className={cn(
          "absolute left-0 top-0 bottom-0 w-[2px] transition-all duration-500",
          glowClass
        )} 
      />

      <div className="flex items-start gap-4">
        <div className="mt-1 p-2 bg-white/5 border border-white/5 rounded-sm">
          {getIcon()}
        </div>
        <div className="flex flex-col gap-1 flex-1 overflow-hidden">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-bold text-zinc-500 tracking-[0.2em] uppercase truncate">
              {data.isFolder ? 'Folder' : (data.type || 'Module')}
            </span>
            {data.isFolder && (
              <div className="text-zinc-600">
                {data.collapsed ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
              </div>
            )}
          </div>
          <span className="text-sm font-medium text-zinc-100 tracking-tight truncate w-full">
            {data.label}
          </span>
          {isHeatmap && (
            <span className="text-[8px] font-mono text-zinc-400 mt-1">
              LOC: {data.loc}
            </span>
          )}
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2 rounded-full bg-white/10 border-none opacity-0"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 rounded-full bg-white/10 border-none opacity-0"
      />
    </motion.div>
  );
}
