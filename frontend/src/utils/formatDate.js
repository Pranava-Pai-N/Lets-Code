export const formatDate = (dateInput) => {
  const date = new Date(dateInput);
  if (isNaN(date)) return "Invalid date";

  const options = {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  return date.toLocaleString("en-IN", options);
};

