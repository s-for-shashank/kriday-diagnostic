'use client';

import { ArrowUp, ArrowDown, TrendingUp } from 'lucide-react';

export default function StatCard({ 
  title, 
  value, 
  change, 
  trend = 'neutral', 
  icon: Icon, 
  color = 'from-cyan-500 to-blue-600',
  description,
  onClick,
  delay = 0
}) {
  const getTrendIcon = () => {
    switch(trend) {
      case 'up': return <ArrowUp className="w-4 h-4 text-green-400" />;
      case 'down': return <ArrowDown className="w-4 h-4 text-red-400" />;
      case 'neutral': return <TrendingUp className="w-4 h-4 text-gray-400" />;
      default: return null;
    }
  };

  const getTrendColor = () => {
    switch(trend) {
      case 'up': return 'text-green-400';
      case 'down': return 'text-red-400';
      case 'neutral': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div 
      className={`bg-white/5 backdrop-blur-2xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 hover:-translate-y-1 animate-fade-in group ${onClick ? 'cursor-pointer' : ''}`}
      style={{ animationDelay: `${delay}s` }}
      onClick={onClick}
    >
      {/* Header with Icon and Trend */}
      <div className="flex items-center justify-between mb-4">
        <div className={`w-14 h-14 bg-gradient-to-r ${color} rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
        <div className="flex items-center gap-2">
          {getTrendIcon()}
          <div className={`text-sm font-medium ${getTrendColor()}`}>
            {change}
          </div>
        </div>
      </div>

      {/* Value */}
      <div className="text-3xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors duration-300">
        {value}
      </div>

      {/* Title */}
      <div className="text-white/70 font-medium mb-1">{title}</div>

      {/* Description */}
      {description && (
        <div className="text-white/50 text-sm">{description}</div>
      )}

      {/* Hover Effect Indicator */}
      {onClick && (
        <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="text-cyan-400 text-xs font-medium flex items-center gap-1">
            Click to view details
            <ArrowUp className="w-3 h-3 rotate-45" />
          </div>
        </div>
      )}

      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
          opacity: 0;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}