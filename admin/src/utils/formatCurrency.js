export const formatCurrency = (amount, currency) => {
  const isNGN = String(currency || "").toLowerCase() === "ngn";
  const num = Number(amount) / 100 || 0;

  if (isNGN) {
    return `₦${num.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  return `$${num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};
