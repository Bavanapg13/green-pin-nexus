import { ReactNode } from 'react';

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function Card({ title, children, className = '', onClick }: CardProps) {
  return (
    <div onClick={onClick} className={`bg-panel border border-slate-800 rounded-xl overflow-hidden shadow-xl ${className}`}>
      {title && (
        <div className="px-6 py-4 border-b border-slate-800">
          <h3 className="font-semibold text-slate-200">{title}</h3>
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}
