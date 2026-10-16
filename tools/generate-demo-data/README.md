# Demo Cable Works: data generator

Synthetic production data for a fictional cable plant, for demos and screenshots. It is built
from public standards only (ISA-95 / IEC 62264, IEC 60228, IEC 60502-1, CENELEC HD 21) and a
random seed, and describes no real company. The model is described in
[DEMO_DATA_MODEL.md](../../DEMO_DATA_MODEL.md).

```bash
npm run data
```

```bash
node tools/generate-demo-data/cli.ts --seed 7 --orders 200
```

```bash
npm test
```

Needs Node 24 or later, which runs the TypeScript directly. No other dependencies.

## Output

- `src/data/demo-plant.json`: the whole dataset, read by the site at build time.
- `public/demo-data/*.csv`: one file per table (products, equipment, materials, bom, orders,
  operations, stock), published with the site for download.

## Files

| File | Holds |
|---|---|
| `standards.ts` | Textbook values from the standards: densities, sections, resistance limits, insulation and sheath thickness, armour wire size |
| `catalog.ts` | The plant: 18 products, 18 work units, 6 materials, the route of each product family, which unit can run what, and at what rate |
| `physics.ts` | Construction (diameters, armour) and material use per km |
| `generate.ts` | Orders, operations and progress, and stock from the seed |
| `cli.ts` | Writes the JSON and the CSVs |
| `generate.test.ts` | Checks: same seed same data, routes and units consistent, progress in order, copper mass, armour, shortages |
