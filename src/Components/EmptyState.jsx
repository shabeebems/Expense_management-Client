const EmptyState = ({ icon: Icon, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center px-6 py-14 sm:py-20">
      {Icon ? (
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
          <Icon className="w-7 h-7" />
        </div>
      ) : null}
      <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
      {description ? (
        <p className="mt-2 max-w-md text-sm text-slate-500">{description}</p>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
};

export default EmptyState;
