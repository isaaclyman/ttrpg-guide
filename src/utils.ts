export function maxBy<T>(arr: T[], by: (item: T) => number | null): T {
  return arr.slice(1).reduce((max, current) => {
    const byMax = by(max);
    if (!byMax) {
      return current;
    }

    const byCurrent = by(current);
    if (!byCurrent) {
      return max;
    }

    return byMax > byCurrent ? max : current;
  }, arr[0]);
}
