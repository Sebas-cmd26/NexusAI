import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Zap } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 py-20 overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-nexus-dark via-accent-primary/5 to-accent-secondary/5" />
      
      {/* Animated orbs - larger and more vibrant */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-accent-primary/20 blur-[150px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-accent-secondary/20 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-accent-tertiary/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      
      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-accent-primary/30 rounded-full"
          initial={{ 
            x: Math.random() * window.innerWidth, 
            y: Math.random() * window.innerHeight,
            scale: Math.random() * 0.5 + 0.5
          }}
          animate={{ 
            y: [null, Math.random() * window.innerHeight],
            opacity: [0, 1, 0]
          }}
          transition={{ 
            duration: Math.random() * 10 + 10, 
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
      
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10 max-w-6xl"
      >
        {/* Premium badge with glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="inline-flex items-center gap-3 px-6 py-3 bg-accent-primary/10 border border-accent-primary/30 rounded-full mb-12 backdrop-blur-xl shadow-lg shadow-accent-primary/20"
        >
          <Sparkles className="w-5 h-5 text-accent-primary fill-current animate-pulse" />
          <span className="text-sm font-black uppercase tracking-[0.3em] text-accent-primary">AI-Powered Inteligencia Platform</span>
          <Zap className="w-5 h-5 text-accent-secondary fill-current" />
        </motion.div>

        {/* Main title - larger and more impactful */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-7xl md:text-8xl lg:text-9xl font-display font-black tracking-tighter leading-[0.9] mb-8"
        >
          <span className="block text-white">Inteligencia</span>
          <span className="block nexus-gradient-text mt-4">Desplegándose.</span>
        </motion.h1>

        {/* Subtitle - enhanced */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 1 }}
          className="text-xl md:text-2xl lg:text-3xl text-white/70 max-w-4xl mx-auto leading-relaxed mb-12 font-light"
        >
          Insights premium curados desde la frontera neural.
          <br />
          <span className="text-accent-primary font-medium">Resumido por IA</span>, <span className="text-accent-secondary font-medium">verificado</span>, and <span className="text-accent-tertiary font-medium">priorizado</span> para ti.
        </motion.p>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 1 }}
          className="flex flex-wrap justify-center gap-8 mb-12"
        >
          {[
            { icon: TrendingUp, label: 'Actualizaciones en Tiempo Real', value: '24/7' },
            { icon: Sparkles, label: 'Insights IA', value: '100%' },
            { icon: Zap, label: 'Fuentes', value: '3+' }
          ].map((stat, idx) => (
            <div key={idx} className="flex items-center gap-3 px-6 py-3 glass rounded-2xl border border-white/10">
              <stat.icon className="w-5 h-5 text-accent-primary" />
              <div className="text-left">
                <div className="text-2xl font-black text-white">{stat.value}</div>
                <div className="text-xs text-white/60 uppercase tracking-wider">{stat.label}</div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Decorative line with glow */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 1.1, duration: 1.2 }}
          className="relative w-48 h-1 mx-auto"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent-primary to-transparent rounded-full" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent-primary to-transparent rounded-full blur-xl opacity-50" />
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ delay: 1.5, duration: 2, repeat: Infinity }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2 text-white/40">
            <span className="text-xs uppercase tracking-widest">Desplázate para explorar</span>
            <div className="w-6 h-10 border-2 border-white/20 rounded-full flex items-start justify-center p-2">
              <motion.div 
                className="w-1.5 h-1.5 bg-accent-primary rounded-full"
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HeroSection;

