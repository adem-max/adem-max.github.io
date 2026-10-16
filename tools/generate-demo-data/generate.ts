// Builds the "Demo Cable Works" dataset from a seed. Same seed, same data.

import {
  EQUIPMENT, HOLD_REASONS, MATERIALS, PRODUCTS, canRun, rateFor, routeFor,
  type Equipment, type Material, type Operation, type ProductSpec,
} from "./catalog.ts";
import { construct, type BomLine, type Construction } from "./physics.ts";
import { round } from "./standards.ts";

export type Options = {
  seed: number;
  orders: number;
  /** First day of the demo, ISO date. The data reads as "today" on this day. */
  start: string;
  /** Due dates fall within this many days after the start. */
  horizonDays: number;
};

export const DEFAULTS: Options = { seed: 2025, orders: 120, start: "2025-03-03", horizonDays: 42 };

export type Status = "waiting" | "ready" | "running" | "held" | "completed";

export type Product = ProductSpec & Construction & { route: Operation[] };

export type ProductionOrder = {
  order_id: string;
  product_id: string;
  quantity_m: number;
  unit_length_m: number;
  units: number;
  created_date: string;
  due_date: string;
  priority: 1 | 2 | 3;
  status: Status;
};

export type OperationRow = {
  operation_id: string;
  order_id: string;
  step_no: number;
  operation: Operation;
  equipment_id: string;
  unit: "kg" | "m";
  planned_qty: number;
  produced_qty: number;
  run_hours: number;
  status: Status;
  hold_reason: string | null;
};

export type StockRow = {
  material_id: string;
  on_hand_kg: number;
  on_order_kg: number;
  expected_date: string | null;
  /** Open need of every unfinished operation, kg. */
  open_need_kg: number;
};

export type Dataset = {
  meta: {
    name: string;
    description: string;
    seed: number;
    start: string;
    standards: string[];
    generator: string;
  };
  products: Product[];
  equipment: Equipment[];
  materials: Material[];
  bom: BomLine[];
  orders: ProductionOrder[];
  operations: OperationRow[];
  stock: StockRow[];
};

/** mulberry32: small, fast, good enough for demo data. */
export function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function addDays(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Material each operation consumes, if any. */
function materialOf(op: Operation, p: ProductSpec): string | null {
  switch (op) {
    case "drawing":
      return p.conductor_material === "Cu" ? "MAT-CU-ROD" : "MAT-AL-ROD";
    case "insulating":
      return p.insulation === "XLPE" ? "MAT-XLPE" : "MAT-PVC-INS";
    case "sheathing":
      return "MAT-PVC-SHE";
    case "armouring":
      return "MAT-STEEL";
    default:
      return null;
  }
}

export function generate(options: Partial<Options> = {}): Dataset {
  const o: Options = { ...DEFAULTS, ...options };
  const rand = rng(o.seed);
  const int = (lo: number, hi: number) => lo + Math.floor(rand() * (hi - lo + 1));
  const pick = <T>(xs: readonly T[]): T => xs[Math.floor(rand() * xs.length)];

  const built = PRODUCTS.map((spec) => ({ spec, ...construct(spec) }));
  const products: Product[] = built.map(({ spec, construction }) => ({
    ...spec, ...construction, route: routeFor(spec),
  }));
  const bom = built.flatMap((b) => b.bom);
  const bomOf = (productId: string, materialId: string) =>
    bom.find((b) => b.product_id === productId && b.material_id === materialId)?.kg_per_km ?? 0;

  const totalWeight = PRODUCTS.reduce((s, p) => s + p.weight, 0);
  const pickProduct = (): ProductSpec => {
    let r = rand() * totalWeight;
    for (const p of PRODUCTS) {
      r -= p.weight;
      if (r < 0) return p;
    }
    return PRODUCTS[PRODUCTS.length - 1];
  };

  const orders: ProductionOrder[] = [];
  const operations: OperationRow[] = [];
  const need = new Map<string, number>();

  for (let i = 1; i <= o.orders; i++) {
    const p = pickProduct();
    const order_id = `PO-${String(i).padStart(4, "0")}`;
    const units =
      p.family === "building-wire" || p.family === "cord" ? int(50, 400)
      : p.family === "power" ? int(1, 8)
      : int(1, 6);
    const quantity_m = units * p.unit_length_m;
    const km = quantity_m / 1000;
    const route = routeFor(p);

    // Where the order stands: not started, part-way (running or held), or done.
    const r = rand();
    const state: Status = r < 0.05 ? "completed" : r < 0.4 ? "ready" : r < 0.85 ? "running" : "held";
    const current = state === "running" || state === "held" ? int(0, route.length - 1) : -1;
    const holdReason = state === "held" ? pick(HOLD_REASONS) : null;

    route.forEach((op, idx) => {
      const step_no = idx + 1;
      const eligible = EQUIPMENT.filter((e) => canRun(e, p, op));
      if (eligible.length === 0) throw new Error(`No equipment for ${op} of ${p.designation}`);
      const e = pick(eligible);
      const unit = op === "drawing" ? "kg" : "m";
      const perCore = ["drawing", "stranding", "bunching", "insulating", "curing"].includes(op);
      const planned_qty =
        op === "drawing"
          ? round(bomOf(p.product_id, materialOf(op, p)!) * km * 1.02, 0)
          : round(quantity_m * (perCore ? p.cores * 1.02 : 1.01), 0);

      let status: Status;
      let produced = 0;
      if (state === "completed" || idx < current) {
        status = "completed";
        produced = planned_qty;
      } else if (idx === current) {
        status = state;
        produced = round(planned_qty * (0.1 + rand() * 0.8), 0);
      } else {
        status = state === "ready" && idx === 0 ? "ready" : "waiting";
      }

      const rate = rateFor(e, p);
      const hours =
        e.rate_unit === "m/min" ? planned_qty / rate / 60
        : e.rate_unit === "kg/h" ? planned_qty / rate
        : e.rate_unit === "h/unit" ? units * rate
        : rate;

      operations.push({
        operation_id: `OP-${String(i).padStart(4, "0")}-${String(step_no).padStart(2, "0")}`,
        order_id,
        step_no,
        operation: op,
        equipment_id: e.equipment_id,
        unit,
        planned_qty,
        produced_qty: produced,
        run_hours: round(hours + e.setup_min / 60, 2),
        status,
        hold_reason: idx === current ? holdReason : null,
      });

      const material = materialOf(op, p);
      if (material && status !== "completed") {
        const left = planned_qty === 0 ? 0 : (planned_qty - produced) / planned_qty;
        need.set(material, (need.get(material) ?? 0) + bomOf(p.product_id, material) * km * left);
      }
    });

    orders.push({
      order_id,
      product_id: p.product_id,
      quantity_m,
      unit_length_m: p.unit_length_m,
      units,
      created_date: addDays(o.start, -int(1, 21)),
      due_date: addDays(o.start, int(2, o.horizonDays)),
      priority: pick([1, 2, 2, 3, 3, 3] as const),
      status: state,
    });
  }

  // Stock: most materials covered, a couple short, so the material check has something to show.
  const stock: StockRow[] = MATERIALS.map((m) => {
    const open = need.get(m.material_id) ?? 0;
    const cover = 0.6 + rand() * 0.9;
    const onHand = round((open * cover) / 10, 0) * 10;
    const short = onHand < open;
    return {
      material_id: m.material_id,
      on_hand_kg: onHand,
      on_order_kg: short ? round(((open - onHand) * (1 + rand() * 0.5)) / 10, 0) * 10 : 0,
      expected_date: short ? addDays(o.start, int(3, 14)) : null,
      open_need_kg: round(open, 0),
    };
  });

  return {
    meta: {
      name: "Demo Cable Works",
      description:
        "Synthetic data for a fictional cable plant. Built from public standards (ISA-95 / IEC 62264, IEC 60228, IEC 60502-1, CENELEC HD 21) and a random seed. It describes no real company.",
      seed: o.seed,
      start: o.start,
      standards: ["ISA-95 / IEC 62264", "IEC 60228", "IEC 60502-1", "CENELEC HD 21"],
      generator: "tools/generate-demo-data",
    },
    products,
    equipment: EQUIPMENT,
    materials: MATERIALS,
    bom,
    orders,
    operations,
    stock,
  };
}

