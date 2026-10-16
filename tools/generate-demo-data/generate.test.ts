import assert from "node:assert/strict";
import { test } from "node:test";
import { EQUIPMENT, PRODUCTS, canRun, routeFor } from "./catalog.ts";
import { generate } from "./generate.ts";
import { construct } from "./physics.ts";

const data = generate();

test("same seed gives the same data, another seed does not", () => {
  assert.deepEqual(generate(), data);
  assert.notDeepEqual(generate({ seed: 7 }).orders, data.orders);
});

test("default size", () => {
  assert.equal(data.products.length, 18);
  assert.equal(data.orders.length, 120);
});

test("every route step has at least one unit that can run it", () => {
  for (const p of PRODUCTS) {
    for (const op of routeFor(p)) {
      assert.ok(EQUIPMENT.some((e) => canRun(e, p, op)), `${p.designation}: ${op}`);
    }
  }
});

test("each order has one operation per route step, on a unit that can run it", () => {
  for (const order of data.orders) {
    const product = data.products.find((p) => p.product_id === order.product_id)!;
    const ops = data.operations.filter((o) => o.order_id === order.order_id);
    assert.deepEqual(ops.map((o) => o.operation), product.route);
    for (const op of ops) {
      const unit = EQUIPMENT.find((e) => e.equipment_id === op.equipment_id)!;
      assert.ok(canRun(unit, product, op.operation));
    }
  }
});

test("progress is consistent: produced never exceeds planned, steps finish in order", () => {
  for (const order of data.orders) {
    const ops = data.operations.filter((o) => o.order_id === order.order_id);
    let open = false;
    for (const op of ops) {
      assert.ok(op.produced_qty >= 0 && op.produced_qty <= op.planned_qty);
      if (op.status !== "completed") open = true;
      else assert.ok(!open, `${op.operation_id} completed after an open step`);
    }
    if (order.status === "completed") assert.ok(ops.every((o) => o.status === "completed"));
  }
});

test("held operations carry a reason, others do not", () => {
  for (const op of data.operations) {
    assert.equal(op.status === "held", op.hold_reason !== null, op.operation_id);
  }
});

test("copper mass follows section × density × cores", () => {
  // 4×16 mm² stranded copper: 16 × 8.89 × 4 × 1.02 ≈ 580 kg/km.
  const p = PRODUCTS.find((x) => x.designation.includes("4×16"))!;
  const cu = construct(p).bom.find((b) => b.material_id === "MAT-CU-ROD")!;
  assert.ok(Math.abs(cu.kg_per_km - 580.3) < 1, String(cu.kg_per_km));
});

test("armoured cables get armour wire and a thicker sheath", () => {
  const p = PRODUCTS.find((x) => x.armour === "SWA")!;
  const { construction, bom } = construct(p);
  assert.ok(construction.armour_wire_mm !== null && construction.armour_wires! > 20);
  assert.ok(construction.sheath_mm! >= 1.8);
  assert.ok(bom.some((b) => b.material_id === "MAT-STEEL"));
});

test("at least one material is short and one is covered", () => {
  assert.ok(data.stock.some((s) => s.on_hand_kg < s.open_need_kg));
  assert.ok(data.stock.some((s) => s.on_hand_kg >= s.open_need_kg));
});

test("ids are plain and sequential", () => {
  data.orders.forEach((o, i) => assert.equal(o.order_id, `PO-${String(i + 1).padStart(4, "0")}`));
  for (const op of data.operations) assert.match(op.operation_id, /^OP-\d{4}-\d{2}$/);
  for (const e of data.equipment) assert.match(e.equipment_id, /^EQ-\d{2}$/);
});
