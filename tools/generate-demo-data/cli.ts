// Writes the demo dataset: one JSON file for the site, one CSV per table for anyone to download.
// Usage: node tools/generate-demo-data/cli.ts [--seed 2025] [--orders 120]

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { DEFAULTS, generate } from "./generate.ts";

function arg(name: string, fallback: number): number {
  const i = process.argv.indexOf(`--${name}`);
  return i > 0 ? Number(process.argv[i + 1]) : fallback;
}

function toCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return "";
  const cols = Object.keys(rows[0]);
  const cell = (v: unknown) => {
    const s = v === null || v === undefined ? "" : Array.isArray(v) ? v.join(" ") : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [cols.join(","), ...rows.map((r) => cols.map((c) => cell(r[c])).join(","))].join("\n") + "\n";
}

const data = generate({ seed: arg("seed", DEFAULTS.seed), orders: arg("orders", DEFAULTS.orders) });
const root = process.cwd();

mkdirSync(join(root, "src", "data"), { recursive: true });
writeFileSync(join(root, "src", "data", "demo-plant.json"), JSON.stringify(data, null, 1) + "\n");

const csvDir = join(root, "public", "demo-data");
mkdirSync(csvDir, { recursive: true });
const tables = {
  products: data.products.map(({ route, ...p }) => ({ ...p, route: route.join(" > ") })),
  equipment: data.equipment.map(({ rates, ...e }) => ({ ...e, rates: rates.map(([s, r]) => `${s}:${r}`).join(" ") })),
  materials: data.materials,
  bom: data.bom,
  orders: data.orders,
  operations: data.operations,
  stock: data.stock,
};
for (const [name, rows] of Object.entries(tables)) {
  writeFileSync(join(csvDir, `${name}.csv`), toCsv(rows as Record<string, unknown>[]));
}

const short = data.stock.filter((s) => s.on_hand_kg < s.open_need_kg).length;
console.log(
  `Demo Cable Works, seed ${data.meta.seed}: ${data.products.length} products, ${data.equipment.length} work units, ` +
    `${data.orders.length} orders, ${data.operations.length} operations, ${short} materials short.`,
);
