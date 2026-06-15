interface StatBadgeProps {
  value: number | string;
  label: string;
  highlight?: boolean;
}

export default function StatBadge({ value, label, highlight = false }: StatBadgeProps) {
  return (
    <div className={`flex flex-col items-center px-3 py-2 rounded ${highlight ? 'bg-yellow-400' : 'bg-gray-800'}`}>
      <span className={`text-lg font-black tabular-nums ${highlight ? 'text-black' : 'text-white'}`}>
        {value}
      </span>
      <span className={`text-xs uppercase tracking-widest ${highlight ? 'text-black/70' : 'text-gray-400'}`}>
        {label}
      </span>
    </div>
  );
}
