const tones = {
  emerald: {
    icon: 'bg-emerald-100 text-emerald-600',
    value: 'text-emerald-700',
  },
  rose: {
    icon: 'bg-rose-100 text-rose-600',
    value: 'text-rose-700',
  },
  slate: {
    icon: 'bg-slate-100 text-slate-600',
    value: 'text-slate-800',
  },
};

const StatCard = ({ label, value, hint, icon: Icon, tone = 'slate' }) => {
  const palette = tones[tone] || tones.slate;

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-4 sm:p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs sm:text-sm font-medium text-slate-500">{label}</p>
          <p className={`mt-1 text-xl sm:text-2xl font-bold tracking-tight truncate ${palette.value}`}>
            {value}
          </p>
          {hint ? <p className="mt-1 text-xs text-slate-400">{hint}</p> : null}
        </div>
        {Icon ? (
          <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${palette.icon}`}>
            <Icon className="w-5 h-5" />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default StatCard;
