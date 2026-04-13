import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FolderUp, Crosshair, Loader2 } from 'lucide-react';
import { parseFileList } from '../lib/parser';

export default function Launchpad({ onStart }) {
  const [isExpanding, setIsExpanding] = useState(false);
  const [isParsing, setIsParsing] = useState(false);

  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      setIsParsing(true);
      try {
        const graphData = await parseFileList(files);
        setIsExpanding(true);
        // Weighted physics transition
        setTimeout(() => {
          onStart(graphData);
        }, 800);
      } catch (error) {
        console.error("Failed to parse codebase:", error);
        setIsParsing(false);
      }
    }
  };

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center z-10 overflow-hidden"
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Deep Background */}
      <div className="absolute inset-0 bg-zinc-950"></div>
      
      {/* Hidden File Input */}
      <input 
        type="file" 
        id="folder-upload" 
        webkitdirectory="true" 
        directory="true" 
        className="hidden" 
        onChange={handleFileChange}
        disabled={isParsing}
      />

      {/* Central Glass Portal with layoutId for transition */}
      <label
        htmlFor="folder-upload"
        className="block"
      >
        <motion.div
          layoutId="portal"
          className="relative flex flex-col items-center justify-center w-96 h-96 rounded-sm border border-white/10 bg-white/[0.02] backdrop-blur-3xl cursor-pointer overflow-hidden group shadow-[0_0_100px_rgba(0,0,0,0.8)]"
          whileHover={!isParsing ? { scale: 1.02, backgroundColor: 'rgba(255,255,255,0.05)' } : {}}
          whileTap={!isParsing ? { scale: 0.98 } : {}}
          animate={isExpanding ? { 
            width: '100vw',
            height: '100vh',
            borderRadius: 0,
            borderWidth: 0,
          } : {}}
          transition={{ 
            type: "spring", 
            stiffness: 40, 
            damping: 20,   
            mass: 3        
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
          
          <motion.div
            animate={isExpanding ? { opacity: 0, scale: 0.8, y: 20 } : { opacity: 1, scale: 1, y: 0 }}
            className="flex flex-col items-center z-10"
            transition={{ duration: 0.4 }}
          >
            <div className="p-5 rounded-sm bg-white/5 border border-white/10 mb-8 group-hover:border-white/20 transition-all duration-700">
              {isParsing ? (
                <Loader2 className="w-10 h-10 text-white animate-spin" />
              ) : (
                <Crosshair className="w-10 h-10 text-zinc-500 group-hover:text-white transition-colors duration-700" />
              )}
            </div>
            
            <h1 className="text-2xl font-bold tracking-[0.4em] uppercase text-zinc-100 mb-3">
              {isParsing ? "Mapping..." : "Cartographer"}
            </h1>
            <div className="flex flex-col items-center gap-4">
              <p className="text-[10px] text-zinc-500 tracking-[0.3em] uppercase flex items-center gap-3">
                <FolderUp className="w-4 h-4" />
                {isParsing ? "Analyzing Structure" : "Initialize Sequence"}
              </p>
              <div className="w-12 h-[1px] bg-white/10 group-hover:w-24 group-hover:bg-white/40 transition-all duration-1000"></div>
            </div>
          </motion.div>
        </motion.div>
      </label>

      {/* Accents */}
      <div className="absolute bottom-16 left-16 text-[10px] tracking-[0.5em] uppercase text-zinc-700 font-bold">
        Sys.Core // Active
      </div>
      <div className="absolute top-16 right-16 text-[10px] tracking-[0.5em] uppercase text-zinc-700 font-bold">
        Ver 2.0.0_Flash
      </div>
    </motion.div>
  );
}
