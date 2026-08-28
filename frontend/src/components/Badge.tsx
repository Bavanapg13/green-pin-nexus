interface BadgeProps {
  level: string;
  className?: string;
}

export default function Badge({ level, className = '' }: BadgeProps) {
  const colors: Record<string, string> = {
    LOW: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    MODERATE: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    HIGH: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    CRITICAL: 'bg-red-500/10 text-red-500 border-red-500/20',
    ONLINE: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    OFFLINE: 'bg-red-500/10 text-red-500 border-red-500/20',
  };

  const colorClass = colors[level.toUpperCase()] || 'bg-slate-500/10 text-slate-400 border-slate-500/20';

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${colorClass} ${className}`}>
      {level.toUpperCase()}
    </span>
  );
}
