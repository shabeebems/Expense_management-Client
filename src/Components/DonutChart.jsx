const SIZE = 160;
const STROKE = 22;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const DonutChart = ({ income = 0, expense = 0, children }) => {
  const total = income + expense;
  const incomeLength = total ? (income / total) * CIRCUMFERENCE : 0;
  const expenseLength = total ? CIRCUMFERENCE - incomeLength : 0;

  return (
    <div className="relative w-48 h-48 shrink-0">
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full h-full -rotate-90">
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke={total ? '#f43f5e' : '#e2e8f0'}
          strokeWidth={STROKE}
          strokeDasharray={total ? `${expenseLength} ${CIRCUMFERENCE}` : undefined}
          strokeDashoffset={total ? -incomeLength : undefined}
        />
        {incomeLength > 0 && (
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="#10b981"
            strokeWidth={STROKE}
            strokeDasharray={`${incomeLength} ${CIRCUMFERENCE}`}
          />
        )}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        {children}
      </div>
    </div>
  );
};

export default DonutChart;
