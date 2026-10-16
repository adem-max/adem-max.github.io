// Textbook values from public cable standards. Check against the standards before relying on
// them for anything but a demo. Keys are nominal cross-sections in mm².

/** Densities in g/cm³ (IEC 60228 uses 8.89 for copper). */
export const DENSITY = {
  Cu: 8.89,
  Al: 2.703,
  XLPE: 0.92,
  PVC_INSULATION: 1.45,
  PVC_SHEATH: 1.5,
  STEEL: 7.85,
} as const;

/** IEC 60228 nominal cross-sections, mm². */
export const SECTIONS = [
  0.75, 1, 1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240, 300,
] as const;

/** IEC 60228: maximum DC resistance at 20 °C, Ω/km, plain conductors. */
export const MAX_RESISTANCE: Record<string, Record<number, number>> = {
  "Cu-1": { 1.5: 12.1, 2.5: 7.41, 4: 4.61, 6: 3.08, 10: 1.83 },
  "Cu-2": {
    1.5: 12.1, 2.5: 7.41, 4: 4.61, 6: 3.08, 10: 1.83, 16: 1.15, 25: 0.727, 35: 0.524,
    50: 0.387, 70: 0.268, 95: 0.193, 120: 0.153, 150: 0.124, 185: 0.0991, 240: 0.0754,
    300: 0.0601,
  },
  "Cu-5": { 0.75: 26.0, 1: 19.5, 1.5: 13.3, 2.5: 7.98, 4: 4.95, 6: 3.3 },
  "Al-2": {
    16: 1.91, 25: 1.2, 35: 0.868, 50: 0.641, 70: 0.443, 95: 0.32, 120: 0.253, 150: 0.206,
    185: 0.164, 240: 0.125, 300: 0.1,
  },
};

/** Nominal insulation thickness, mm. IEC 60502-1 (0.6/1 kV) for XLPE and PVC power cores;
 *  the harmonised-cable tables (HD 21) for building wires and cords. */
export const INSULATION_MM: Record<string, Record<number, number>> = {
  XLPE: {
    1.5: 0.7, 2.5: 0.7, 4: 0.7, 6: 0.7, 10: 0.7, 16: 0.7, 25: 0.9, 35: 0.9, 50: 1.0, 70: 1.1,
    95: 1.1, 120: 1.2, 150: 1.4, 185: 1.6, 240: 1.7, 300: 1.8,
  },
  PVC: {
    0.75: 0.6, 1: 0.6, 1.5: 0.7, 2.5: 0.8, 4: 0.8, 6: 0.8, 10: 1.0, 16: 1.0, 25: 1.2,
    35: 1.2, 50: 1.4, 70: 1.4, 95: 1.6, 120: 1.6,
  },
};

/** Diameter of n round cores laid up together, as a multiple of one core's diameter. */
export const LAY_UP_FACTOR: Record<number, number> = { 1: 1, 2: 2, 3: 2.16, 4: 2.42, 5: 2.7 };

/** IEC 60502-1: extruded sheath thickness = 0.035 × D + 1.0 mm, with a floor. */
export function sheathThickness(diameterUnderMm: number, armoured: boolean): number {
  const t = 0.035 * diameterUnderMm + 1.0;
  return round(Math.max(t, armoured ? 1.8 : 1.4), 1);
}

/** IEC 60502-1: round steel armour wire diameter from the diameter under the armour. */
export function armourWireMm(diameterUnderMm: number): number {
  if (diameterUnderMm <= 10) return 0.8;
  if (diameterUnderMm <= 15) return 1.25;
  if (diameterUnderMm <= 25) return 1.6;
  if (diameterUnderMm <= 35) return 2.0;
  return 2.5;
}

/** IEC 60502-1 routine AC voltage test for 0.6/1 kV cables. */
export const ROUTINE_TEST = { voltageKv: 3.5, minutes: 5 } as const;

export function round(x: number, digits: number): number {
  const f = 10 ** digits;
  return Math.round(x * f) / f;
}
