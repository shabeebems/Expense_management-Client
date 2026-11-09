export const formatCurrency = (amount = 0) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount || 0);

export const formatDate = (date, options = { year: 'numeric', month: 'short', day: 'numeric' }) =>
  new Date(date).toLocaleDateString('en-IN', options);

export const todayDateInput = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const isFutureDateInput = (value) => {
  if (!value) return false;
  return toDateInput(value) > todayDateInput();
};

export const toDateInput = (value) => {
  if (!value) return todayDateInput();
  const str = String(value);
  if (/^\d{4}-\d{2}-\d{2}$/.test(str.slice(0, 10)) && !str.includes('T')) {
    return str.slice(0, 10);
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return todayDateInput();
  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, '0');
  const day = String(parsed.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
