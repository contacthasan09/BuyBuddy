export function formatCompactNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

export function formatPercent(n: number): string {
  return `${n.toFixed(1)}%`;
}

export function groupOrdersByDay(
  orders: { createdAt: string; total: number; status: string }[],
  days = 7
) {
  const buckets: { date: string; count: number; revenue: number }[] = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const inDay = orders.filter(
      (o) => o.createdAt.slice(0, 10) === key
    );
    buckets.push({
      date: key,
      count: inDay.length,
      revenue: inDay.reduce((s, o) => s + (o.total || 0), 0),
    });
  }
  return buckets;
}

export function topProducts(
  orders: { items: { name: string; quantity: number; subtotal: number }[] }[],
  limit = 5
) {
  const map = new Map<string, { name: string; qty: number; revenue: number }>();
  for (const order of orders) {
    for (const item of order.items || []) {
      const existing = map.get(item.name);
      if (existing) {
        existing.qty += item.quantity;
        existing.revenue += item.subtotal;
      } else {
        map.set(item.name, {
          name: item.name,
          qty: item.quantity,
          revenue: item.subtotal,
        });
      }
    }
  }
  return Array.from(map.values())
    .sort((a, b) => b.qty - a.qty)
    .slice(0, limit);
}