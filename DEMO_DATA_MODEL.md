# Demo data model: a generic cable plant

Every screenshot, chart and demo on the portfolio uses this model and the synthetic data made
from it. Nothing in it comes from the employer: no machine codes, column names, order numbers,
product codes, quantities, rates or report layouts. It is built from public standards and
textbook cable-making, so any cable plant in the world would recognise it and none would
recognise itself.

## Rules

1. **Standard vocabulary only.** Terms come from ISA-95 / IEC 62264 (the international
   standard for factory data) and from the IEC cable standards below. If a word or column name
   came from the employer's ERP export or the tools' code, don't use it, even if it is
   common.
2. **Machines have descriptive names**, never codes: "Rigid strander 61-wire", "Extrusion
   line 90 mm". There are no section-prefix-plus-number IDs.
3. **Products are public cable types** with their standard designations.
4. **Numbers come from physics and the standards** (copper mass from cross-section and
   density, insulation thickness from the IEC table), plus a random seed. They are never
   copied or scaled from real data.
5. **The fictional plant is "Demo Cable Works"**, one site, all data dated in a fixed demo
   year.

## Public sources it draws on

| Standard | Used for |
|---|---|
| **ISA-95 / IEC 62264** | The object model: equipment hierarchy (site → area → work centre → unit), product definition, production order, operations (segments), material, performance. B2MML is its open XML schema. |
| **IEC 60228** | Conductor classes (1 solid, 2 stranded, 5 flexible) and nominal cross-sections (1.5 … 630 mm²). Maximum DC resistance per class is used as the test limit. |
| **IEC 60502-1** | 0.6/1 kV power cables, e.g. Cu/XLPE/PVC, Cu/XLPE/SWA/PVC, Al/XLPE/PVC. Nominal insulation thickness by cross-section. Routine tests (conductor resistance, AC voltage test). |
| **CENELEC HD 361 / HD 21 / HD 22** | Harmonised building wires and cords: H07V-U, H07V-R, H07V-K, H05VV-F, H07RN-F. |

Check the tables against the standards when coding the generator. The values here are the
textbook figures.

## Equipment (ISA-95 hierarchy)

Site **Demo Cable Works** → areas → work centres. Rates are in m/min, or kg/h for drawing. They
are typical published figures for each machine type, banded by cross-section.

| Area | Work centre (examples) | Equipment class |
|---|---|---|
| Wire drawing | Rod breakdown line 1, Multi-wire drawing line 1–2, Annealer | drawing |
| Conductor | Rigid strander 61-wire, Tubular strander 19-wire, Bunching machine 1–3 | stranding, bunching |
| Insulation | Extrusion line 60 mm, Extrusion line 90 mm, Curing room | insulating |
| Assembly | Laying-up machine (drum twister), Armouring line | cabling, armouring |
| Sheathing | Sheathing line 120 mm | sheathing |
| Test & pack | Test bay, Rewinding line | testing, packing |

## Process routes

Each product has an ordered route of operations, each run on an equipment class:

- **Building wire (H07V-U / -R):** drawing → (stranding for -R) → insulating → testing → packing
- **Flexible cord (H05VV-F):** drawing → bunching → insulating → cabling → sheathing → testing → packing
- **LV power cable (Cu/XLPE/PVC 4×16):** drawing → stranding → insulating → curing → cabling → sheathing → testing → packing
- **Armoured (Cu/XLPE/SWA/PVC):** as above + bedding and armouring before the outer sheath

## Entities

```
Product         product_id, designation ("Cu/XLPE/SWA/PVC 0.6/1 kV 4×25 mm²"), standard,
                cores, cross_section_mm2, conductor_material (Cu|Al), conductor_class (1|2|5),
                insulation (PVC|XLPE|rubber), armour (none|SWA|AWA), sheath (PVC|none)
RouteStep       product_id, step_no, operation, equipment_class
Equipment       equipment_id, name, area, equipment_class, rate_by_size[], setup_min
Material        material_id, name (Cu rod 8 mm, Al rod 9.5 mm, XLPE compound, PVC compound,
                galvanised steel wire 1.6 mm), unit (kg)
BomLine         product_id, material_id, kg_per_km   ← computed, see below
ProductionOrder order_id, product_id, quantity_m, unit_length_m (coil or drum), units,
                created_date, due_date, priority, status (waiting|ready|running|held|completed)
Operation       operation_id, order_id, step_no, operation, equipment_id (assigned), unit
                (kg for drawing, m otherwise), planned_qty, produced_qty, run_hours, status,
                hold_reason
Stock           material_id, on_hand_kg, on_order_kg, expected_date, open_need_kg
```

Remaining = planned_qty − produced_qty is computed and never stored. IDs are plain and
sequential (`PO-0001`, `OP-0001-03`, `EQ-01`, `P-01`, `MAT-CU-ROD`), with no ERP-style
compound numbers.

## Computed quantities (textbook formulas)

- Conductor mass (kg/km) = cross-section (mm²) × density (g/cm³) × cores × lay-up factor
  (≈ 1.02 stranded, 1.03 bunched). Cu 8.89, Al 2.703 g/cm³.
- Insulation mass (kg/km) = π × t × (d + t) × density × cores, with t from IEC 60502-1 and
  d the conductor diameter. XLPE 0.92, PVC ≈ 1.45 g/cm³.
- Run time = planned_m ÷ rate + setup.
- Test limit = IEC 60228 maximum resistance for the class and size.

## The generator

A small open-source TypeScript script (`tools/generate-demo-data`, seeded, deterministic)
writes the dataset as JSON and as one CSV per table, in this model's columns. It is
published with the portfolio. That way software clients can see the code, and every demo can
be rebuilt from scratch.

Default size: 18 products, 18 work units, 120 production orders over 6 weeks, about 15 %
held and a few short on material. That's enough to make the schedule, the shortage view and
the KPIs look real.

## What the demos show with it

- **Scheduling:** queues per work centre, a dated Gantt, holds that pull later orders forward.
- **Material check:** orders covered or short against stock, days of cover.
- **Productivity:** a rate that follows the product mix (the drawing-productivity idea),
  shown on the demo plant's own numbers.
