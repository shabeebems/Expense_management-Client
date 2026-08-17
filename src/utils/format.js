export const formatCurrency = (amount = 0) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount || 0);

export const formatDate = (date, options = { year: 'numeric', month: 'short', day: 'numeric' }) =>
  new Date(date).toLocaleDateString('en-IN', options);

export const formatTime = (date) =>
  new Date(date).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });

export const getDateLabel = (date) => {
  const value = new Date(date);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (value.toDateString() === today.toDateString()) return 'Today';
  if (value.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return formatDate(value, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
};

export const groupByDate = (transactions = []) => {
  const groups = transactions.reduce((acc, transaction) => {
    const key = new Date(transaction.createdAt).toDateString();
    if (!acc[key]) acc[key] = [];
    acc[key].push(transaction);
    return acc;
  }, {});

  return Object.keys(groups)
    .sort((a, b) => new Date(b) - new Date(a))
    .map((key) => ({
      key,
      label: getDateLabel(key),
      items: groups[key],
    }));
};
