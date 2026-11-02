const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

export function formatPostDate(date: string) {
  return dateFormatter.format(new Date(date));
}
