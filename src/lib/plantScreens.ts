// Contents of the app-window figures for the plant tools: the scheduler's workflow (import,
// machine queue, holds, export, KPIs) and the planning toolkit (material check, productivity).
// Everything comes from the demo plant and its list schedule. The only fixed values are the
// planner decisions an import keeps (machine moves, typed rates): the generator has no plan
// state, so they are stated here.

import { demoPlant, schedule } from "./schedule.ts";

const plant = demoPlant();
type Product = (typeof plant.products)[number];
type Operation = (typeof plant.operations)[number];

const productById = new Map(plant.products.map((p) => [p.product_id, p]));
const orderById = new Map(plant.orders.map((o) => [o.order_id, o]));
const opById = new Map(plant.operations.map((o) => [o.operation_id, o]));
const unitById = new Map(plant.equipment.map((e) => [e.equipment_id, e]));
const START = Date.parse(`${plant.meta.start}T00:00:00Z`);
const DAY = 86_400_000;
/** The material checks look this many days ahead (the generator's order horizon). */
const HORIZON_DAYS = 42;

export const DEMO_DECISIONS = { moves: 3, typedRates: 2 };

/** Hours from the demo start as a date (UTC, so the build machine's zone doesn't matter). */
export const at = (hours: number) => new Date(START + hours * 3_600_000);
export const productOf = (orderId: string): Product => productById.get(orderById.get(orderId)!.product_id)!;
export const unitName = (id: string) => unitById.get(id)!.name;
const remaining = (o: Operation) => Math.max(o.planned_qty - o.produced_qty, 0);
const hoursLeft = (o: Operation) => (o.planned_qty === 0 ? 0 : o.run_hours * (remaining(o) / o.planned_qty));

const openOrders = plant.orders.filter((o) => o.status !== "completed");
/** Orders created over the weekend before the demo Monday are the ones this import brings in. */
const newOrders = new Set(openOrders.filter((o) => Date.parse(`${o.created_date}T00:00:00Z`) >= START - 2 * DAY).map((o) => o.order_id));

// ── Scheduler ───────────────────────────────────────────────────────────────

export function importSummary() {
  return {
    file: `erp_jobs_${plant.meta.start}.xlsx`,
    orders: openOrders.length,
    added: newOrders.size,
    updated: openOrders.length - newOrders.size,
    finished: plant.orders.length - openOrders.length,
    holds: plant.operations.filter((o) => o.status === "held").length,
    ...DEMO_DECISIONS,
  };
}

export type QueueRow = {
  n: number;
  order: string;
  product: string;
  operation: string;
  remaining: number;
  unit: string;
  hours: number;
  start: Date;
  end: Date;
  /** Changeover before this job when the product changes, minutes. */
  setup: number | null;
  late: boolean;
  isNew: boolean;
};

/** A unit's queue in schedule order. Setups are added between different products. */
export function queue(unitId: string) {
  const unit = unitById.get(unitId)!;
  const bars = schedule()
    .filter((b) => b.equipment_id === unitId && !b.held)
    .sort((a, b) => a.start - b.start);
  let prevProduct: string | null = null;
  let clock = 0;
  const rows: QueueRow[] = bars.map((b, i) => {
    const op = opById.get(b.operation_id)!;
    const p = productOf(b.order_id);
    const setup = prevProduct !== null && prevProduct !== p.product_id ? unit.setup_min : null;
    prevProduct = p.product_id;
    const start = Math.max(b.start, clock + (setup ?? 0) / 60);
    clock = start + (b.end - b.start);
    const due = (Date.parse(`${orderById.get(b.order_id)!.due_date}T00:00:00Z`) - START) / 3_600_000 + 24;
    return {
      n: i + 1,
      order: b.order_id,
      product: p.designation,
      operation: op.operation,
      remaining: remaining(op),
      unit: op.unit,
      hours: b.end - b.start,
      start: at(start),
      end: at(clock),
      setup,
      late: clock > due,
      isNew: newOrders.has(b.order_id),
    };
  });
  const held = plant.operations.filter((o) => o.equipment_id === unitId && o.status === "held").length;
  return {
    rows,
    held,
    runHours: rows.reduce((s, r) => s + r.hours, 0),
    setups: rows.filter((r) => r.setup).length,
    setupHours: rows.reduce((s, r) => s + (r.setup ?? 0), 0) / 60,
    end: rows.length ? rows[rows.length - 1].end : null,
  };
}

/** The units of one area with their queue length and flags, for the machine list. */
export function areaUnits(area: string) {
  return plant.equipment
    .filter((e) => e.area === area && e.equipment_class !== "curing")
    .map((e) => {
      const q = queue(e.equipment_id);
      return {
        id: e.equipment_id,
        name: e.name,
        jobs: q.rows.length,
        days: q.runHours / 24 + q.setupHours / 24,
        end: q.end,
        added: q.rows.filter((r) => r.isNew).length,
        held: q.held,
      };
    });
}

export function areas(): string[] {
  return [...new Set(plant.equipment.map((e) => e.area))];
}

/** Open jobs per area, held ones left out, for the section tabs. */
export function areaCounts(): Record<string, number> {
  const out: Record<string, number> = {};
  for (const o of plant.operations) {
    if (o.status === "completed" || o.status === "held") continue;
    const area = unitById.get(o.equipment_id)!.area;
    out[area] = (out[area] ?? 0) + 1;
  }
  return out;
}

export function holds() {
  return plant.operations
    .filter((o) => o.status === "held")
    .map((o) => ({
      order: o.order_id,
      product: productOf(o.order_id).designation,
      operation: o.operation,
      unit: o.equipment_id,
      remaining: remaining(o),
      qtyUnit: o.unit,
      reason: o.hold_reason ?? "",
      due: orderById.get(o.order_id)!.due_date,
    }))
    .sort((a, b) => a.due.localeCompare(b.due));
}

export function kpis() {
  const bars = schedule();
  const lastEnd = new Map<string, number>();
  for (const b of bars) if (!b.held) lastEnd.set(b.order_id, Math.max(lastEnd.get(b.order_id) ?? 0, b.end));
  const late = openOrders.filter((o) => {
    const end = lastEnd.get(o.order_id);
    const due = (Date.parse(`${o.due_date}T00:00:00Z`) - START) / 3_600_000 + 24;
    return end !== undefined && end > due;
  }).length;
  const dueThisWeek = openOrders.filter((o) => Date.parse(`${o.due_date}T00:00:00Z`) < START + 7 * DAY).length;
  const load = areas().map((area) => {
    const units = plant.equipment.filter((e) => e.area === area && e.equipment_class !== "curing");
    const hours = plant.operations
      .filter((o) => o.status !== "completed" && o.status !== "held" && units.some((u) => u.equipment_id === o.equipment_id))
      .reduce((s, o) => s + hoursLeft(o), 0);
    return { area, days: hours / 24 / Math.max(units.length, 1) };
  });
  return {
    open: openOrders.length,
    late,
    held: new Set(plant.operations.filter((o) => o.status === "held").map((o) => o.order_id)).size,
    dueThisWeek,
    load,
  };
}

// ── Planning toolkit ────────────────────────────────────────────────────────

const MATERIAL_OF: Record<string, (p: Product) => string> = {
  drawing: (p) => (p.conductor_material === "Cu" ? "MAT-CU-ROD" : "MAT-AL-ROD"),
  insulating: (p) => (p.insulation === "XLPE" ? "MAT-XLPE" : "MAT-PVC-INS"),
  sheathing: () => "MAT-PVC-SHE",
  armouring: () => "MAT-STEEL",
};

/** Material each open order still needs, kg (same rule as the generator's open need). */
function orderNeed(orderId: string): Map<string, number> {
  const o = orderById.get(orderId)!;
  const p = productById.get(o.product_id)!;
  const need = new Map<string, number>();
  for (const op of plant.operations) {
    if (op.order_id !== orderId || op.status === "completed" || !MATERIAL_OF[op.operation]) continue;
    const material = MATERIAL_OF[op.operation](p);
    const line = plant.bom.find((b) => b.product_id === p.product_id && b.material_id === material);
    if (!line) continue;
    const left = op.planned_qty === 0 ? 0 : remaining(op) / op.planned_qty;
    need.set(material, (need.get(material) ?? 0) + line.kg_per_km * (o.quantity_m / 1000) * left);
  }
  return need;
}

/**
 * Stock goes to orders by priority, then due date, as the material planner does. An order is
 * short when any of its materials runs out before it is served.
 */
export function materialCheck() {
  const left = new Map(plant.stock.map((s) => [s.material_id, s.on_hand_kg]));
  const sorted = [...openOrders].sort((a, b) => a.priority - b.priority || a.due_date.localeCompare(b.due_date));
  const shortOrders: { order: string; product: string; due: string; material: string; shortKg: number }[] = [];
  let covered = 0;
  for (const o of sorted) {
    const need = orderNeed(o.order_id);
    let worst: { material: string; shortKg: number } | null = null;
    for (const [m, kg] of need) {
      const have = left.get(m) ?? 0;
      if (have < kg && (!worst || kg - have > worst.shortKg)) worst = { material: m, shortKg: kg - have };
      left.set(m, Math.max(have - kg, 0));
    }
    if (worst) shortOrders.push({ order: o.order_id, product: productById.get(o.product_id)!.designation, due: o.due_date, ...worst });
    else covered++;
  }
  const materials = plant.stock.map((s) => {
    const daily = s.open_need_kg / HORIZON_DAYS;
    return {
      id: s.material_id,
      name: plant.materials.find((m) => m.material_id === s.material_id)!.name,
      need: s.open_need_kg,
      onHand: s.on_hand_kg,
      onOrder: s.on_order_kg,
      expected: s.expected_date,
      coverDays: daily > 0 ? s.on_hand_kg / daily : Infinity,
      short: s.on_hand_kg < s.open_need_kg,
    };
  });
  return {
    orders: openOrders.length,
    covered,
    short: shortOrders.length,
    materialsShort: materials.filter((m) => m.short).length,
    materials,
    shortOrders: shortOrders.sort((a, b) => a.due.localeCompare(b.due)),
  };
}

/** A repeatable number in [0, 1) from a string, so the demo's "actual" output never changes. */
function noise(key: string): number {
  let h = 2166136261;
  for (const c of key) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return ((h >>> 0) % 10_000) / 10_000;
}

/**
 * One day of the productivity report for the units of one area. The mix target is what the unit
 * could have made on the jobs it actually ran (each at its own standard speed, less changeovers);
 * the fixed target is its fastest speed over the same hours, the way a single rate per machine
 * judges it. The "made" figure is synthetic: the mix target times a seeded factor.
 */
export function productivity(area: string, day = 0) {
  const from = day * 24;
  const to = from + 24;
  return plant.equipment
    .filter((e) => e.area === area && e.equipment_class !== "curing")
    .map((e) => {
      const bars = schedule().filter((b) => b.equipment_id === e.equipment_id && !b.held && b.end > from && b.start < to);
      let target = 0;
      let hours = 0;
      let changes = 0;
      let prev: string | null = null;
      for (const b of bars) {
        const op = opById.get(b.operation_id)!;
        const perHour = op.run_hours > 0 ? op.planned_qty / op.run_hours : 0;
        const p = productOf(b.order_id).product_id;
        if (prev !== null && prev !== p) changes++;
        prev = p;
        const ran = Math.min(b.end, to) - Math.max(b.start, from);
        hours += ran;
        target += perHour * ran;
      }
      target = Math.max(target - changes * (e.setup_min / 60) * (target / Math.max(hours, 1)), 0);
      const fastest = Math.max(...e.rates.map((r) => r[1]));
      const fixed = (e.rate_unit === "m/min" ? fastest * 60 : e.rate_unit === "kg/h" ? fastest : 0) * hours;
      const made = target * (0.82 + noise(`${e.equipment_id}-${day}`) * 0.22);
      return {
        id: e.equipment_id,
        name: e.name,
        unit: e.rate_unit === "kg/h" ? "kg" : "m",
        jobs: bars.length,
        changes,
        made,
        target,
        mixPct: target > 0 ? made / target : null,
        fixedPct: fixed > 0 ? made / fixed : null,
      };
    })
    .filter((r) => r.jobs > 0);
}
