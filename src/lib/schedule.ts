// A small list scheduler over the demo plant, used only to draw the illustrations.
// Orders go by priority, then due date; each operation starts when its unit is free and the
// previous step of the same order is done. Held operations, and everything after them, wait.
// The curing room takes any number of batches at once.

import data from "../data/demo-plant.json";

export type Bar = {
  operation_id: string;
  order_id: string;
  equipment_id: string;
  start: number; // hours from the demo start
  end: number;
  late: boolean;
  held: boolean;
  label: string;
};

export type Plant = typeof data;

export function demoPlant(): Plant {
  return data;
}

export function schedule(): Bar[] {
  const orders = [...data.orders]
    .filter((o) => o.status !== "completed")
    .sort((a, b) => a.priority - b.priority || a.due_date.localeCompare(b.due_date) || a.order_id.localeCompare(b.order_id));
  const product = new Map(data.products.map((p) => [p.product_id, p]));
  const free = new Map<string, number>();
  const bars: Bar[] = [];
  const startDay = Date.parse(`${data.meta.start}T00:00:00Z`);

  for (const order of orders) {
    const ops = data.operations.filter((o) => o.order_id === order.order_id).sort((a, b) => a.step_no - b.step_no);
    const due = (Date.parse(`${order.due_date}T00:00:00Z`) - startDay) / 3_600_000 + 24;
    let ready = 0;
    let blocked = false;
    for (const op of ops) {
      if (op.status === "completed") continue;
      const left = op.planned_qty === 0 ? 0 : op.run_hours * (1 - op.produced_qty / op.planned_qty);
      const parallel = op.operation === "curing";
      const unitFree = parallel ? 0 : free.get(op.equipment_id) ?? 0;
      if (op.status === "held" || blocked) {
        // A held step keeps its place on the chart for one shift, but nothing after it is planned.
        if (!blocked) {
          const start = Math.max(unitFree, ready);
          bars.push({ ...barOf(op, order.order_id), start, end: start + 8, late: false, held: true });
        }
        blocked = true;
        continue;
      }
      const start = Math.max(unitFree, ready);
      const end = start + Math.max(left, 0.25);
      if (!parallel) free.set(op.equipment_id, end);
      ready = end;
      bars.push({ ...barOf(op, order.order_id), start, end, late: end > due, held: false });
    }
  }
  return bars;

  function barOf(op: (typeof data.operations)[number], orderId: string) {
    const p = product.get(data.orders.find((o) => o.order_id === orderId)!.product_id)!;
    return { operation_id: op.operation_id, order_id: orderId, equipment_id: op.equipment_id, label: `${orderId} · ${p.designation}` };
  }
}
