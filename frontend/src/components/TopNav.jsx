import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Download, FileDown, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

export default function TopNav({ heatmapActive, onToggleHeatmap, onExport, onGenerateDocs, isGeneratingDocs }) {
  return (
    <motion.div 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20, mass: 1.5 }}
      className="absolute top-8 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 p-1.5 rounded-sm bg-zinc-950/80 backdrop-blur-2xl border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.8)]"
    >
      <button
        onClick={onToggleHeatmap}
        className={cn(
          "flex items-center gap-3 px-5 py-2.5 rounded-sm text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-500",
          heatmapActive 
            ? "bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.1)] border border-white/20" 
            : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5 border border-transparent"
        )}
      >
        <Activity className={cn("w-4 h-4 transition-colors duration-500", heatmapActive && "text-red-500")} />
        Complexity Heatmap
      </button>
      
      <div className="w-[1px] h-6 bg-white/10 mx-2"></div>
      
      <button
        onClick={onExport}
        className="flex items-center gap-3 px-5 py-2.5 rounded-sm text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500 hover:text-zinc-200 hover:bg-white/5 border border-transparent hover:border-white/10 transition-all duration-500"
      >
        <Download className="w-4 h-4" />
        Export Architecture
      </button>

      <div className="w-[1px] h-6 bg-white/10 mx-2"></div>

      <button
        onClick={onGenerateDocs}
        disabled={isGeneratingDocs}
        className={cn(
          "relative flex items-center gap-3 px-5 py-2.5 rounded-sm text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-500 overflow-hidden group",
          isGeneratingDocs 
            ? "text-white bg-white/5" 
            : "text-zinc-500 hover:text-white hover:bg-white/5"
        )}
      >
        {/* Glow effect */}
        <div className="absolute inset-0 border border-white/0 group-hover:border-white/10 transition-all duration-500" />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[0_0_15px_rgba(255,255,255,0.05)]" />
        
        <AnimatePresence mode="wait">
          {isGeneratingDocs ? (
            <motion.div
              key="generating"
              layoutId="button-content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-3"
            >
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Generating...</span>
            </motion.div>
          ) : (
            <motion.div
              key="download"
              layoutId="button-content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-3"
            >
              <FileDown className="w-4 h-4" />
              <span>Download ARCHITECTURE.md</span>
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </motion.div>
  );
}
