import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const PAGE = { width: 210, height: 297 };
const MARGIN = { left: 14, right: 14 };

const COLORS = {
  brand: [6, 95, 70],
  brandMid: [5, 150, 105],
  brandSoft: [236, 253, 245],
  ink: [15, 23, 42],
  muted: [71, 85, 105],
  faint: [100, 116, 139],
  line: [226, 232, 240],
  surface: [248, 250, 252],
  income: [4, 120, 87],
  expense: [190, 18, 60],
  white: [255, 255, 255],
};

const formatInr = (amount = 0) =>
  `Rs. ${Number(amount || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatLongDate = (date) =>
  new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

const formatLongDateTime = (date) =>
  new Date(date).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const formatTime = (date) =>
  new Date(date).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });

const slug = (value) =>
  String(value || 'ledger')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 40) || 'ledger';

const setColor = (doc, rgb) => doc.setTextColor(...rgb);
const setFill = (doc, rgb) => doc.setFillColor(...rgb);
const setStroke = (doc, rgb) => doc.setDrawColor(...rgb);

const drawRounded = (doc, x, y, w, h, color) => {
  setFill(doc, color);
  doc.roundedRect(x, y, w, h, 1.5, 1.5, 'F');
};

export const downloadLedgerPdf = ({ ledger, transactions = [] }) => {
  const chronological = [...transactions].sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );

  const incomeTotal = chronological
    .filter((item) => item.type === 'income')
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const expenseTotal = chronological
    .filter((item) => item.type === 'expense')
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const net = incomeTotal - expenseTotal;
  const generatedAt = new Date();
  const periodStart = chronological[0]?.createdAt || ledger.createdAt || generatedAt;
  const periodEnd = chronological[chronological.length - 1]?.createdAt || generatedAt;
  const documentNo = `PF-${String(ledger._id || 'LEDGER').slice(-8).toUpperCase()}-${generatedAt
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, '')}`;

  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
  const contentWidth = PAGE.width - MARGIN.left - MARGIN.right;

  setFill(doc, COLORS.brand);
  doc.rect(0, 0, PAGE.width, 32, 'F');
  setFill(doc, COLORS.brandMid);
  doc.rect(0, 32, PAGE.width, 1.6, 'F');

  setColor(doc, COLORS.white);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('ProFinance', MARGIN.left, 13);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(167, 243, 208);
  doc.text('Personal finance ledger statement', MARGIN.left, 19);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  setColor(doc, COLORS.white);
  doc.text('LEDGER STATEMENT', PAGE.width - MARGIN.right, 13, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(167, 243, 208);
  doc.text('Confidential  ·  Computer generated', PAGE.width - MARGIN.right, 19, {
    align: 'right',
  });

  let y = 42;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  setColor(doc, COLORS.ink);
  const titleLines = doc.splitTextToSize(ledger.name || 'Untitled ledger', contentWidth);
  doc.text(titleLines, MARGIN.left, y);
  y += titleLines.length * 7 + 2;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  setColor(doc, COLORS.muted);
  doc.text(
    `Prepared for internal records  |  Generated ${formatLongDateTime(generatedAt)}`,
    MARGIN.left,
    y
  );
  y += 8;

  const meta = [
    ['Document No.', documentNo],
    ['Ledger ID', String(ledger._id || '—')],
    ['Statement period', `${formatLongDate(periodStart)}  –  ${formatLongDate(periodEnd)}`],
    ['Ledger opened', formatLongDate(ledger.createdAt || generatedAt)],
  ];

  const metaCol = contentWidth / 2;
  meta.forEach((row, index) => {
    const col = index % 2;
    const rowIndex = Math.floor(index / 2);
    const x = MARGIN.left + col * metaCol;
    const rowY = y + rowIndex * 9;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    setColor(doc, COLORS.faint);
    doc.text(row[0].toUpperCase(), x, rowY);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    setColor(doc, COLORS.ink);
    doc.text(row[1], x, rowY + 4.2);
  });
  y += 22;

  const cards = [
    { label: 'Total income', value: formatInr(incomeTotal), color: COLORS.income },
    { label: 'Total expenses', value: formatInr(expenseTotal), color: COLORS.expense },
    { label: 'Net balance', value: formatInr(net), color: net >= 0 ? COLORS.income : COLORS.expense },
    { label: 'Transactions', value: String(chronological.length), color: COLORS.ink },
  ];
  const gap = 3;
  const cardW = (contentWidth - gap * 3) / 4;
  cards.forEach((card, index) => {
    const x = MARGIN.left + index * (cardW + gap);
    drawRounded(doc, x, y, cardW, 16, COLORS.surface);
    setStroke(doc, COLORS.line);
    doc.roundedRect(x, y, cardW, 16, 1.5, 1.5, 'S');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    setColor(doc, COLORS.faint);
    doc.text(card.label.toUpperCase(), x + 3, y + 5);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    setColor(doc, card.color);
    doc.text(card.value, x + 3, y + 11.5);
  });
  y += 22;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  setColor(doc, COLORS.ink);
  doc.text('Transaction register', MARGIN.left, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  setColor(doc, COLORS.muted);
  doc.text(
    'Listed in chronological order with a running balance after each entry.',
    MARGIN.left,
    y + 5
  );

  let running = 0;
  const tableBody = chronological.map((transaction, index) => {
    const amount = Number(transaction.amount || 0);
    running += transaction.type === 'income' ? amount : -amount;
    return [
      String(index + 1).padStart(2, '0'),
      formatLongDate(transaction.createdAt),
      formatTime(transaction.createdAt),
      transaction.activity || '—',
      transaction.type === 'income' ? 'Income' : 'Expense',
      formatInr(amount),
      formatInr(running),
      String(transaction._id || '').slice(-8).toUpperCase() || '—',
    ];
  });

  autoTable(doc, {
    startY: y + 8,
    head: [['#', 'Date', 'Time', 'Description', 'Type', 'Amount (INR)', 'Balance', 'Ref.']],
    body: tableBody.length
      ? tableBody
      : [['—', '—', '—', 'No transactions recorded in this ledger.', '—', '—', '—', '—']],
    theme: 'grid',
    styles: {
      font: 'helvetica',
      fontSize: 7.5,
      cellPadding: { top: 2.2, bottom: 2.2, left: 1.8, right: 1.8 },
      textColor: COLORS.ink,
      lineColor: COLORS.line,
      lineWidth: 0.15,
      valign: 'middle',
      overflow: 'linebreak',
    },
    headStyles: {
      fillColor: COLORS.brand,
      textColor: COLORS.white,
      fontStyle: 'bold',
      fontSize: 7,
      halign: 'center',
      cellPadding: { top: 2.6, bottom: 2.6, left: 1.8, right: 1.8 },
    },
    alternateRowStyles: { fillColor: [252, 253, 254] },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center', textColor: COLORS.muted },
      1: { cellWidth: 22, halign: 'left' },
      2: { cellWidth: 16, halign: 'center' },
      3: { cellWidth: 48, halign: 'left' },
      4: { cellWidth: 18, halign: 'center' },
      5: { cellWidth: 26, halign: 'right', fontStyle: 'bold' },
      6: { cellWidth: 26, halign: 'right' },
      7: { cellWidth: 16, halign: 'center', fontSize: 6.5, textColor: COLORS.faint },
    },
    didParseCell: (data) => {
      if (data.section !== 'body' || !tableBody.length) return;
      const type = data.row.raw[4];
      if (data.column.index === 4) {
        data.cell.styles.textColor = type === 'Income' ? COLORS.income : COLORS.expense;
        data.cell.styles.fontStyle = 'bold';
      }
      if (data.column.index === 5) {
        data.cell.styles.textColor = type === 'Income' ? COLORS.income : COLORS.expense;
      }
    },
    margin: { left: MARGIN.left, right: MARGIN.right, top: 18, bottom: 22 },
    didDrawPage: (data) => {
      if (data.pageNumber === 1) return;
      setFill(doc, COLORS.brand);
      doc.rect(0, 0, PAGE.width, 12, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      setColor(doc, COLORS.white);
      doc.text('ProFinance', MARGIN.left, 7.5);
      doc.setFont('helvetica', 'normal');
      doc.text(
        `${ledger.name || 'Ledger'}  ·  Statement (continued)`,
        PAGE.width - MARGIN.right,
        7.5,
        { align: 'right' }
      );
    },
  });

  let closeY = (doc.lastAutoTable?.finalY || y) + 8;
  if (closeY > PAGE.height - 48) {
    doc.addPage();
    closeY = 22;
  }

  const summaryW = 88;
  const summaryX = PAGE.width - MARGIN.right - summaryW;
  drawRounded(doc, summaryX, closeY, summaryW, 32, COLORS.brandSoft);
  setStroke(doc, [167, 243, 208]);
  doc.roundedRect(summaryX, closeY, summaryW, 32, 1.5, 1.5, 'S');

  const summaryRows = [
    ['Income', formatInr(incomeTotal), COLORS.income],
    ['Expenses', formatInr(expenseTotal), COLORS.expense],
    ['Net balance', formatInr(net), net >= 0 ? COLORS.income : COLORS.expense],
  ];
  summaryRows.forEach((row, index) => {
    const rowY = closeY + 7 + index * 8;
    doc.setFont('helvetica', index === 2 ? 'bold' : 'normal');
    doc.setFontSize(8);
    setColor(doc, COLORS.muted);
    doc.text(row[0], summaryX + 4, rowY);
    doc.setFont('helvetica', 'bold');
    setColor(doc, row[2]);
    doc.text(row[1], summaryX + summaryW - 4, rowY, { align: 'right' });
  });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  setColor(doc, COLORS.muted);
  const notes = [
    'Notes',
    '• Amounts are shown in Indian Rupees (INR).',
    '• Running balance starts at zero and updates after each listed entry.',
    '• This is a computer-generated statement and does not require a signature.',
  ];
  notes.forEach((line, index) => {
    doc.setFont('helvetica', index === 0 ? 'bold' : 'normal');
    doc.text(line, MARGIN.left, closeY + 6 + index * 4.5);
  });

  const pageCount = doc.getNumberOfPages();
  for (let page = 1; page <= pageCount; page += 1) {
    doc.setPage(page);
    setFill(doc, COLORS.brand);
    doc.rect(0, PAGE.height - 12, PAGE.width, 12, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    setColor(doc, [167, 243, 208]);
    doc.text('ProFinance  ·  Ledger statement', MARGIN.left, PAGE.height - 5);
    doc.text(`Page ${page} of ${pageCount}`, PAGE.width / 2, PAGE.height - 5, { align: 'center' });
    doc.text(documentNo, PAGE.width - MARGIN.right, PAGE.height - 5, { align: 'right' });
  }

  const stamp = generatedAt.toISOString().slice(0, 10);
  doc.save(`ProFinance-${slug(ledger.name)}-Statement-${stamp}.pdf`);
};
