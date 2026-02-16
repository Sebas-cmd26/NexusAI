import React from 'react';
import { motion } from 'framer-motion';

const SectorBar = ({ activeSector, setActiveSector }) => {
  const sectors = [
    { id: null, label: 'TODO', color: 'from-white to-white/60' },
    { id: 'Engineering', label: 'INGENIERÍA', color: 'from-accent-primary to-accent-primary/60' },
    { id: 'Health', label: 'SALUD', color: 'from-green-400 to-emerald-500' },
    { id: 'Finance', label: 'FINANZAS', color: 'from-yellow-400 to-amber-500' },
    { id: 'Education', label: 'EDUCACIÓN', color: 'from-purple-400 to-violet-500' },
    { id: 'Legal', label: 'LEGAL', color: 'from-red-400 to-rose-500' },
    { id: 'General', label: 'GENERAL', color: 'from-blue-400 to-cyan-500' },
  ];

  return (
    <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
      {sectors.map((sector, idx) => {
        const isActive = activeSector === sector.id;
        
        return (
          <motion.button
            key={sector.id || 'all'}
            onClick={() => setActiveSector(sector.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`relative px-6 py-3 rounded-2xl font-black text-xs tracking-[0.2em] uppercase whitespace-nowrap transition-all ${
              isActive 
                ? 'bg-white/10 text-white shadow-lg' 
                : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/80'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeSector"
                className={`absolute inset-0 bg-gradient-to-r ${sector.color} opacity-10 rounded-2xl`}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            
            {isActive && (
              <div className={`absolute inset-0 bg-gradient-to-r ${sector.color} opacity-20 blur-xl rounded-2xl`} />
            )}
            
            <span className="relative z-10">{sector.label}</span>
            
            {isActive && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-2 h-2 bg-accent-primary rounded-full"
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
};

export default SectorBar;
