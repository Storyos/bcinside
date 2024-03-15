formatDate(dateString);

function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  return new Intl.DateTimeFormat("en-US", options).format(date);
}
