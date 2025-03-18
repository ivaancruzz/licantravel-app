// returns a range of numbers to be used for pagination.
export function getRange({ page, limit }: { page: number; limit: number }) {
  const from = page * limit;
  const to = from + limit - 1;

  return [from, to];
}
