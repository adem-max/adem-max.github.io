// The fixed catalogue of "Demo Cable Works": products, equipment and materials.
// Everything here is generic cable-making (see DEMO_DATA_MODEL.md); nothing comes from a real plant.

export type Metal = "Cu" | "Al";
export type ConductorClass = 1 | 2 | 5;
export type Insulation = "PVC" | "XLPE";
export type Family = "building-wire" | "cord" | "power" | "armoured";

export type Operation =
  | "drawing"
  | "stranding"
  | "bunching"
  | "insulating"
  | "curing"
  | "cabling"
  | "bedding"
  | "armouring"
  | "sheathing"
  | "testing"
  | "packing";

export type ProductSpec = {
  product_id: string;
  designation: string;
  standard: string;
  family: Family;
  cores: number;
  cross_section_mm2: number;
  conductor_material: Metal;
  conductor_class: ConductorClass;
  insulation: Insulation;
  armour: "none" | "SWA";
  sheath: "none" | "PVC";
  /** Length of one coil or drum, m. */
  unit_length_m: number;
  /** Relative share of orders. */
  weight: number;
};

const hd = "CENELEC HD 21";
const lv = "IEC 60502-1";

export const PRODUCTS: ProductSpec[] = [
  bw("P-01", "H07V-U 1.5 mm²", 1.5, 1, 6),
  bw("P-02", "H07V-U 2.5 mm²", 2.5, 1, 6),
  bw("P-03", "H07V-U 4 mm²", 4, 1, 3),
  bw("P-04", "H07V-R 6 mm²", 6, 2, 3),
  bw("P-05", "H07V-R 10 mm²", 10, 2, 2),
  bw("P-06", "H07V-K 1.5 mm²", 1.5, 5, 4),
  bw("P-07", "H07V-K 2.5 mm²", 2.5, 5, 4),
  cord("P-08", "H05VV-F 3G1.5 mm²", 3, 1.5, 5),
  cord("P-09", "H05VV-F 3G2.5 mm²", 3, 2.5, 4),
  cord("P-10", "H05VV-F 5G1.5 mm²", 5, 1.5, 2),
  power("P-11", "Cu/XLPE/PVC 0.6/1 kV 4×16 mm²", 4, 16, "Cu", 4),
  power("P-12", "Cu/XLPE/PVC 0.6/1 kV 4×35 mm²", 4, 35, "Cu", 3),
  power("P-13", "Cu/XLPE/PVC 0.6/1 kV 4×70 mm²", 4, 70, "Cu", 2),
  power("P-14", "Cu/XLPE/PVC 0.6/1 kV 1×240 mm²", 1, 240, "Cu", 1),
  power("P-15", "Al/XLPE/PVC 0.6/1 kV 4×95 mm²", 4, 95, "Al", 2),
  power("P-16", "Al/XLPE/PVC 0.6/1 kV 4×150 mm²", 4, 150, "Al", 1),
  armoured("P-17", "Cu/XLPE/SWA/PVC 0.6/1 kV 4×25 mm²", 25, 2),
  armoured("P-18", "Cu/XLPE/SWA/PVC 0.6/1 kV 4×50 mm²", 50, 1),
];

function bw(id: string, designation: string, s: number, cls: ConductorClass, weight: number): ProductSpec {
  return {
    product_id: id, designation, standard: hd, family: "building-wire", cores: 1,
    cross_section_mm2: s, conductor_material: "Cu", conductor_class: cls, insulation: "PVC",
    armour: "none", sheath: "none", unit_length_m: 100, weight,
  };
}
function cord(id: string, designation: string, cores: number, s: number, weight: number): ProductSpec {
  return {
    product_id: id, designation, standard: "CENELEC HD 21.5", family: "cord", cores,
    cross_section_mm2: s, conductor_material: "Cu", conductor_class: 5, insulation: "PVC",
    armour: "none", sheath: "PVC", unit_length_m: 100, weight,
  };
}
function power(id: string, designation: string, cores: number, s: number, metal: Metal, weight: number): ProductSpec {
  return {
    product_id: id, designation, standard: lv, family: "power", cores, cross_section_mm2: s,
    conductor_material: metal, conductor_class: 2, insulation: "XLPE", armour: "none",
    sheath: "PVC", unit_length_m: s >= 150 ? 500 : 1000, weight,
  };
}
function armoured(id: string, designation: string, s: number, weight: number): ProductSpec {
  return {
    product_id: id, designation, standard: lv, family: "armoured", cores: 4, cross_section_mm2: s,
    conductor_material: "Cu", conductor_class: 2, insulation: "XLPE", armour: "SWA",
    sheath: "PVC", unit_length_m: 500, weight,
  };
}

/** The ordered operations each product goes through. */
export function routeFor(p: ProductSpec): Operation[] {
  const conductor: Operation = p.conductor_class === 5 ? "bunching" : "stranding";
  const start: Operation[] = p.conductor_class === 1 ? ["drawing"] : ["drawing", conductor];
  switch (p.family) {
    case "building-wire":
      return [...start, "insulating", "testing", "packing"];
    case "cord":
      return [...start, "insulating", "cabling", "sheathing", "testing", "packing"];
    case "power":
      return [...start, "insulating", "curing", ...(p.cores > 1 ? (["cabling"] as Operation[]) : []), "sheathing", "testing", "packing"];
    case "armoured":
      return [...start, "insulating", "curing", "cabling", "bedding", "armouring", "sheathing", "testing", "packing"];
  }
}

/** Which equipment class runs an operation (bedding runs on a sheathing line). */
export function equipmentClassFor(op: Operation): string {
  return op === "bedding" ? "sheathing" : op;
}

export type Equipment = {
  equipment_id: string;
  name: string;
  area: string;
  equipment_class: string;
  /** Cross-sections this unit takes, mm² (inclusive). */
  min_section_mm2: number;
  max_section_mm2: number;
  /** Conductor classes it takes; empty = any. */
  conductor_classes: ConductorClass[];
  /** Families it takes; empty = any. */
  families: Family[];
  /** Speed bands: [up to this section mm², speed]. Unit is in `rate_unit`. */
  rates: [number, number][];
  rate_unit: "m/min" | "kg/h" | "h/unit" | "h/batch";
  setup_min: number;
};

const ANY: never[] = [];

export const EQUIPMENT: Equipment[] = [
  eq("EQ-01", "Rod breakdown line", "Wire drawing", "drawing", 1.5, 300, [1, 2], ANY, [[300, 1600]], "kg/h", 30),
  eq("EQ-02", "Multi-wire drawing line 1", "Wire drawing", "drawing", 0.5, 10, [5], ANY, [[10, 450]], "kg/h", 45),
  eq("EQ-03", "Multi-wire drawing line 2", "Wire drawing", "drawing", 0.5, 10, [5], ANY, [[10, 450]], "kg/h", 45),
  eq("EQ-04", "Tubular strander 19-wire", "Conductor", "stranding", 1.5, 35, ANY, ANY, [[10, 120], [35, 80]], "m/min", 40),
  eq("EQ-05", "Rigid strander 61-wire", "Conductor", "stranding", 25, 300, ANY, ANY, [[70, 40], [150, 25], [300, 15]], "m/min", 90),
  eq("EQ-06", "Bunching machine 1", "Conductor", "bunching", 0.5, 6, ANY, ANY, [[1.5, 220], [6, 150]], "m/min", 20),
  eq("EQ-07", "Bunching machine 2", "Conductor", "bunching", 0.5, 6, ANY, ANY, [[1.5, 220], [6, 150]], "m/min", 20),
  eq("EQ-08", "Extrusion line 60 mm", "Insulation", "insulating", 0.5, 16, ANY, ANY, [[2.5, 1200], [6, 800], [16, 400]], "m/min", 45),
  eq("EQ-09", "Extrusion line 90 mm", "Insulation", "insulating", 16, 300, ANY, ANY, [[35, 250], [95, 120], [185, 70], [300, 50]], "m/min", 60),
  eq("EQ-10", "Curing room", "Insulation", "curing", 0.5, 300, ANY, ANY, [[300, 10]], "h/batch", 0),
  eq("EQ-11", "Core twisting line", "Assembly", "cabling", 0.5, 6, ANY, ["cord"], [[6, 150]], "m/min", 20),
  eq("EQ-12", "Laying-up machine (drum twister)", "Assembly", "cabling", 10, 300, ANY, ANY, [[35, 60], [95, 40], [300, 25]], "m/min", 60),
  eq("EQ-13", "Armouring line", "Assembly", "armouring", 10, 300, ANY, ANY, [[35, 18], [300, 12]], "m/min", 90),
  eq("EQ-14", "Sheathing line 90 mm", "Sheathing", "sheathing", 0.5, 16, ANY, ANY, [[6, 150], [16, 80]], "m/min", 40),
  eq("EQ-15", "Sheathing line 120 mm", "Sheathing", "sheathing", 10, 300, ANY, ANY, [[50, 50], [150, 30], [300, 20]], "m/min", 60),
  eq("EQ-16", "Test bay", "Test & pack", "testing", 0.5, 300, ANY, ANY, [[16, 0.01], [300, 0.5]], "h/unit", 10),
  eq("EQ-17", "Coiling line", "Test & pack", "packing", 0.5, 10, ANY, ["building-wire", "cord"], [[10, 250]], "m/min", 10),
  eq("EQ-18", "Rewinding line", "Test & pack", "packing", 10, 300, ANY, ["power", "armoured"], [[300, 120]], "m/min", 15),
];

function eq(
  equipment_id: string, name: string, area: string, equipment_class: string,
  min_section_mm2: number, max_section_mm2: number, conductor_classes: ConductorClass[],
  families: Family[], rates: [number, number][], rate_unit: Equipment["rate_unit"], setup_min: number,
): Equipment {
  return { equipment_id, name, area, equipment_class, min_section_mm2, max_section_mm2, conductor_classes, families, rates, rate_unit, setup_min };
}

export function canRun(e: Equipment, p: ProductSpec, op: Operation): boolean {
  return (
    e.equipment_class === equipmentClassFor(op) &&
    p.cross_section_mm2 >= e.min_section_mm2 &&
    p.cross_section_mm2 <= e.max_section_mm2 &&
    (e.conductor_classes.length === 0 || e.conductor_classes.includes(p.conductor_class)) &&
    (e.families.length === 0 || e.families.includes(p.family))
  );
}

/** The speed band for a product on a unit. Aluminium draws at half the copper rate. */
export function rateFor(e: Equipment, p: ProductSpec): number {
  const band = e.rates.find(([max]) => p.cross_section_mm2 <= max) ?? e.rates[e.rates.length - 1];
  const rate = band[1];
  return e.equipment_class === "drawing" && p.conductor_material === "Al" ? rate / 2 : rate;
}

export type Material = { material_id: string; name: string; unit: "kg" };

export const MATERIALS: Material[] = [
  { material_id: "MAT-CU-ROD", name: "Copper rod 8 mm", unit: "kg" },
  { material_id: "MAT-AL-ROD", name: "Aluminium rod 9.5 mm", unit: "kg" },
  { material_id: "MAT-XLPE", name: "XLPE compound (silane cure)", unit: "kg" },
  { material_id: "MAT-PVC-INS", name: "PVC insulation compound", unit: "kg" },
  { material_id: "MAT-PVC-SHE", name: "PVC sheath compound", unit: "kg" },
  { material_id: "MAT-STEEL", name: "Galvanised steel armour wire", unit: "kg" },
];

export const HOLD_REASONS = [
  "Material short",
  "Waiting for quality check",
  "Customer changed the order",
  "Equipment maintenance",
] as const;
