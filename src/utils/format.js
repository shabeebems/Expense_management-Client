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

const toLocalDate = (value) => {
  const input = toDateInput(value);
  const [year, month, day] = input.split('-').map(Number);
  return new Date(year, month - 1, day);
};

export const getDateLabel = (date) => {
  const value = toLocalDate(date);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (value.toDateString() === today.toDateString()) return 'Today';
  if (value.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return formatDate(value, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
};

export const groupByDate = (transactions = []) => {
  const groups = transactions.reduce((acc, transaction) => {
    const key = toDateInput(transaction.date || transaction.createdAt);
    if (!acc[key]) acc[key] = [];
    acc[key].push(transaction);
    return acc;
  }, {});

  return Object.keys(groups)
    .sort((a, b) => (a < b ? 1 : -1))
    .map((key) => ({
      key,
      label: getDateLabel(key),
      items: groups[key],
    }));
};

