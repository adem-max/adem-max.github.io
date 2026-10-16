// Construction and material use per km, from the textbook formulas in DEMO_DATA_MODEL.md.

import type { ProductSpec } from "./catalog.ts";
import {
  DENSITY, INSULATION_MM, LAY_UP_FACTOR, MAX_RESISTANCE, armourWireMm, round, sheathThickness,
} from "./standards.ts";

/** Stranding takes slightly more metal than the nominal section, because the wires lie on a helix. */
const LAY_LOSS: Record<number, number> = { 1: 1.0, 2: 1.02, 5: 1.03 };
/** Real stranded and bunched conductors are wider than a solid rod of the same section. */
const FILL: Record<number, number> = { 1: 1.0, 2: 1.1, 5: 1.2 };
/** Cord sheaths come from the HD 21.5 table, not the power-cable formula. */
const CORD_SHEATH_MM: Record<string, number> = { "3x1.5": 0.9, "3x2.5": 1.1, "5x1.5": 1.1 };
const BEDDING_MM = 1.0;

export type Construction = {
  conductor_diameter_mm: number;
  insulation_mm: number;
  core_diameter_mm: number;
  laid_up_diameter_mm: number;
  armour_wire_mm: number | null;
  armour_wires: number | null;
  sheath_mm: number | null;
  overall_diameter_mm: number;
  max_resistance_ohm_per_km: number | null;
};

export type BomLine = { product_id: string; material_id: string; kg_per_km: number };

/** Mass of a ring of thickness t around diameter d, kg/km (mm² × g/cm³ = kg/km). */
function ringKgPerKm(innerDiameterMm: number, tMm: number, density: number): number {
  return Math.PI * tMm * (innerDiameterMm + tMm) * density;
}

export function construct(p: ProductSpec): { construction: Construction; bom: BomLine[] } {
  const s = p.cross_section_mm2;
  const dc = Math.sqrt((4 * s) / Math.PI) * FILL[p.conductor_class];
  const ti = INSULATION_MM[p.insulation][s];
  if (ti === undefined) throw new Error(`No insulation thickness for ${p.insulation} ${s} mm²`);
  const dCore = dc + 2 * ti;
  const dLay = dCore * LAY_UP_FACTOR[p.cores];

  let d = dLay;
  let armourWire: number | null = null;
  let armourWires: number | null = null;
  let tSheath: number | null = null;
  const bom: BomLine[] = [];
  const add = (material_id: string, kg: number) =>
    bom.push({ product_id: p.product_id, material_id, kg_per_km: round(kg, 1) });

  const metal = p.conductor_material === "Cu" ? "MAT-CU-ROD" : "MAT-AL-ROD";
  add(metal, s * DENSITY[p.conductor_material] * p.cores * LAY_LOSS[p.conductor_class]);

  const insDensity = p.insulation === "XLPE" ? DENSITY.XLPE : DENSITY.PVC_INSULATION;
  add(p.insulation === "XLPE" ? "MAT-XLPE" : "MAT-PVC-INS", ringKgPerKm(dc, ti, insDensity) * p.cores);

  let sheathKg = 0;
  if (p.armour === "SWA") {
    sheathKg += ringKgPerKm(d, BEDDING_MM, DENSITY.PVC_SHEATH);
    d += 2 * BEDDING_MM;
    armourWire = armourWireMm(d);
    // Wires laid side by side around the bedding, 95 % coverage, 4 % extra length for the lay.
    armourWires = Math.floor(((Math.PI * (d + armourWire)) / armourWire) * 0.95);
    add("MAT-STEEL", armourWires * (Math.PI / 4) * armourWire ** 2 * DENSITY.STEEL * 1.04);
    d += 2 * armourWire;
  }
  if (p.sheath === "PVC") {
    tSheath =
      p.family === "cord"
        ? CORD_SHEATH_MM[`${p.cores}x${s}`] ?? sheathThickness(d, false)
        : sheathThickness(d, p.armour !== "none");
    sheathKg += ringKgPerKm(d, tSheath, DENSITY.PVC_SHEATH);
    d += 2 * tSheath;
  }
  if (sheathKg > 0) add("MAT-PVC-SHE", sheathKg);

  const key = `${p.conductor_material}-${p.conductor_class}`;
  return {
    construction: {
      conductor_diameter_mm: round(dc, 2),
      insulation_mm: ti,
      core_diameter_mm: round(dCore, 2),
      laid_up_diameter_mm: round(dLay, 2),
      armour_wire_mm: armourWire,
      armour_wires: armourWires,
      sheath_mm: tSheath,
      overall_diameter_mm: round(d, 1),
      max_resistance_ohm_per_km: MAX_RESISTANCE[key]?.[s] ?? null,
    },
    bom,
  };
}
