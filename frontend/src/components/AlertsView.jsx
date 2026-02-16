import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, TrendingUp, Zap, Clock, ExternalLink, Sparkles } from 'lucide-react';
import APIService from '../services/api';

const AlertsView = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadAlerts();
    const interval = setInterval(loadAlerts, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const loadAlerts = async () => {
    setLoading(true);
    try {
      const data = await APIService.getFeed();
      const highImpactNews = data.filter(item => item.impact_level === 'High' || item.impact_level === 'Medium');
      setAlerts(highImpactNews);
    } catch (error) {
      console.error('Error loading alerts:', error);
      setAlerts([]);
    }
    setLoading(false);
  };

  const getImpactColor = (level) => {
    switch (level) {
      case 'High': return 'from-red-500 to-rose-600';
      case 'Medium': return 'from-yellow-500 to-amber-600';
      case 'Low': return 'from-blue-500 to-cyan-600';
      default: return 'from-white to-white/60';
    }
  };

  const getImpactIcon = (level) => {
    switch (level) {
      case 'High': return AlertTriangle;
      case 'Medium': return TrendingUp;
      case 'Low': return Zap;
      default: return Sparkles;
    }
  };

  const filteredAlerts = filter === 'all' ? alerts : alerts.filter(a => a.impact_level.toLowerCase() === filter);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-32 bg-glass-light rounded-3xl"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight mb-2">Breaking Intelligence</h2>
          <p className="text-white/60">Real-time high-impact news alerts</p>
        </div>
        
        <div className="flex gap-2">
          {['all', 'high', 'medium', 'low'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl font-black uppercase text-xs tracking-widest transition-all ${filter === f ? 'bg-accent-primary text-nexus-black' : 'glass hover:bg-white/10 text-white/60'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="inline-flex items-center gap-3 px-6 py-3 glass rounded-2xl border border-white/10">
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        <span className="text-sm font-black uppercase tracking-widest">
          {filteredAlerts.length} Active Alert{filteredAlerts.length !== 1 ? 's' : ''}
        </span>
      </div>

      <AnimatePresence mode="popLayout">
        {filteredAlerts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center justify-center py-20 text-white/40"
          >
            <Sparkles className="w-16 h-16 mb-4" />
            <p className="text-lg font-medium">Sin Alertas para este filtro</p>
            <p className="text-sm">Vuelve pronto para noticias de última hora</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredAlerts.map((alert, idx) => {
              const ImpactIcon = getImpactIcon(alert.impact_level);
              
              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group relative glass rounded-3xl overflow-hidden border border-white/10 hover:border-white/20 transition-all"
                >
                  <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${getImpactColor(alert.impact_level)}`} />
                  <div className={`absolute inset-0 bg-gradient-to-r ${getImpactColor(alert.impact_level)} opacity-0 group-hover:opacity-5 transition-opacity blur-xl`} />
                  
                  <div className="relative p-6">
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 p-3 rounded-2xl bg-gradient-to-br ${getImpactColor(alert.impact_level)} bg-opacity-10`}>
                        <ImpactIcon className="w-6 h-6 text-white" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-gradient-to-r ${getImpactColor(alert.impact_level)} text-white`}>
                            {alert.impact_level === "High" ? "Alto" : alert.impact_level === "Medium" ? "Medio" : "Bajo"} Impacto
                          </span>
                          <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest glass">
                            {alert.sector}
                          </span>
                          <div className="flex items-center gap-1 text-white/40 text-xs ml-auto">
                            <Clock className="w-3 h-3" />
                            {formatTime(alert.published_at)}
                          </div>
                        </div>

                        <h3 className="text-xl font-black tracking-tight mb-3 group-hover:text-accent-primary transition-colors">
                          {alert.title}
                        </h3>

                        {alert.summary && (
                          <p className="text-white/70 leading-relaxed mb-4 line-clamp-2">
                            {alert.summary}
                          </p>
                        )}

                        <a
                          href={alert.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 glass hover:bg-white/10 rounded-xl text-sm font-black uppercase tracking-widest transition-all group/btn"
                        >
                          Leer Alerta Completa
                          <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AlertsView;

