/**
 * Truncates text to a specified maximum length and appends an ellipsis.
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Formats a confidence score decimal (e.g. 0.897) as a percentage string (e.g. "90%").
 */
export function formatConfidence(score: number | undefined): string {
  if (score === undefined) return '0%';
  return `${(score * 100).toFixed(0)}%`;
}

/**
 * Safely parses Date strings and returns local locale string.
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString();
  } catch (e) {
    return dateString;
  }
}
