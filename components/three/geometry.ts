/**
 * Low-poly procedural buildings made only of boxes (and a few cylinders for pipes).
 * Units are metres; y is up. Each box carries a `layer` used for draw-in order or explosion.
 */
export interface Box {
  p: [number, number, number]; // centre
  s: [number, number, number]; // size
  layer: number;
  kind?: "solid" | "glass" | "screen" | "pipe";
}

const box = (x: number, y: number, z: number, w: number, h: number, d: number, layer: number, kind: Box["kind"] = "solid"): Box => ({
  p: [x, y + h / 2, z],
  s: [w, h, d],
  layer,
  kind,
});

/**
 * A modern Arabic-contemporary villa: plinth, U-shaped ground floor around a courtyard,
 * a loggia of slim columns, a first floor on one wing, deep parapets and screen walls.
 * Layers: 0 plinth, 1 ground floor, 2 first floor, 3 roof and parapets.
 */
export function buildVilla(detail: "high" | "low" = "high"): Box[] {
  const b: Box[] = [];
  const H = 3.6; // floor height
  // 0 · plinth and steps
  b.push(box(0, 0, 0, 22, 0.45, 16, 0));
  b.push(box(0, -0.0, 8.6, 5, 0.3, 1.2, 0));
  b.push(box(0, -0.0, 9.4, 4, 0.15, 0.8, 0));

  // 1 · ground floor: U around a courtyard open to the front
  b.push(box(-7.5, 0.45, -1, 7, H, 13, 1)); // west wing
  b.push(box(7.5, 0.45, -1, 7, H, 13, 1)); // east wing
  b.push(box(0, 0.45, -5.5, 8, H, 4, 1)); // back link
  // courtyard pool
  b.push(box(0, 0.45, 1.5, 5, 0.1, 6, 1, "glass"));
  // loggia: slim columns along the courtyard edges
  for (let i = 0; i < 5; i++) {
    b.push(box(-3.6, 0.45, -3 + i * 2.2, 0.22, H, 0.22, 1));
    b.push(box(3.6, 0.45, -3 + i * 2.2, 0.22, H, 0.22, 1));
  }
  // entrance screen wall on the street side
  const fins = detail === "high" ? 14 : 7;
  for (let i = 0; i < fins; i++) {
    b.push(box(-10.6 + i * (21.2 / (fins - 1)), 0.45, 6.4, 0.12, H * 0.9, 0.6, 1, "screen"));
  }

  // 2 · first floor on the east wing, cantilevered toward the courtyard
  b.push(box(7, 0.45 + H, -1.5, 8, H, 11, 2));
  // first-floor terrace screen
  const fins2 = detail === "high" ? 9 : 5;
  for (let i = 0; i < fins2; i++) {
    b.push(box(3.1, 0.45 + H, -6.5 + i * (10 / (fins2 - 1)), 0.5, H * 0.85, 0.1, 2, "screen"));
  }
  // windows (recessed glass)
  b.push(box(11.05, 0.45 + H + 0.9, -1.5, 0.1, 1.8, 6, 2, "glass"));
  b.push(box(-11.05, 0.45 + 0.9, -1, 0.1, 1.8, 6, 1, "glass"));

  // 3 · parapets and roof slabs
  b.push(box(-7.5, 0.45 + H, -1, 7.4, 0.35, 13.4, 3));
  b.push(box(0, 0.45 + H, -5.5, 8.4, 0.35, 4.4, 3));
  b.push(box(7, 0.45 + 2 * H, -1.5, 8.4, 0.35, 11.4, 3));
  // deep parapet walls
  b.push(box(-7.5, 0.8 + H, 5.5, 7.4, 0.9, 0.25, 3));
  b.push(box(-11.1, 0.8 + H, -1, 0.25, 0.9, 13.4, 3));
  b.push(box(7, 0.8 + 2 * H, 4.1, 8.4, 0.9, 0.25, 3));
  b.push(box(11.1, 0.8 + 2 * H, -1.5, 0.25, 0.9, 11.4, 3));
  // courtyard shade pergola
  for (let i = 0; i < 6; i++) b.push(box(0, 0.45 + H - 0.1, -3 + i * 1.6, 7.2, 0.12, 0.18, 3));
  return b;
}

/**
 * A G+4 residential block for the exploded axonometric.
 * Layers: 0 foundation, 1 structural frame, 2 MEP, 3 facade, 4 interiors.
 */
export function buildBlock(detail: "high" | "low" = "high"): Box[] {
  const b: Box[] = [];
  const W = 14;
  const D = 10;
  const H = 3.2;
  const floors = 5;
  const grid = [-6, -2, 2, 6];
  const gridZ = [-4, 0, 4];

  // 0 · foundation: raft and pad footings
  b.push(box(0, -1.2, 0, W + 1.4, 0.6, D + 1.4, 0));
  for (const x of grid) for (const z of gridZ) b.push(box(x, -0.6, z, 1.4, 0.6, 1.4, 0));

  // 1 · frame: columns and slabs
  for (let f = 0; f < floors; f++) {
    for (const x of grid) for (const z of gridZ) b.push(box(x, f * H, z, 0.35, H - 0.25, 0.35, 1));
    b.push(box(0, f * H + H - 0.25, 0, W, 0.25, D, 1));
  }

  // 2 · MEP: risers, horizontal runs and a duct per floor
  for (const x of [-4, 4]) b.push(box(x, -0.6, -4.6, 0.2, floors * H + 0.6, 0.2, 2, "pipe"));
  b.push(box(0, -0.6, -4.6, 0.6, floors * H + 0.6, 0.4, 2, "pipe"));
  for (let f = 0; f < floors; f++) {
    b.push(box(0, f * H + H - 0.75, -4.6, W - 2, 0.12, 0.12, 2, "pipe"));
    b.push(box(0, f * H + H - 0.65, 0, 0.5, 0.3, D - 2, 2, "pipe"));
    if (detail === "high") b.push(box(-5, f * H + H - 0.6, 2.5, 3, 0.25, 0.25, 2, "pipe"));
  }

  // 3 · facade: panels with openings and screens on the front
  for (let f = 0; f < floors; f++) {
    const y = f * H;
    b.push(box(-W / 2 - 0.1, y, 0, 0.2, H - 0.25, D, 3));
    b.push(box(W / 2 + 0.1, y, 0, 0.2, H - 0.25, D, 3));
    b.push(box(0, y, -D / 2 - 0.1, W, H - 0.25, 0.2, 3));
    for (const x of [-5, 0, 5]) b.push(box(x, y + 0.9, D / 2 + 0.1, 2.6, 1.6, 0.12, 3, "glass"));
    b.push(box(-2.5, y, D / 2 + 0.1, 0.4, H - 0.25, 0.2, 3));
    b.push(box(2.5, y, D / 2 + 0.1, 0.4, H - 0.25, 0.2, 3));
  }

  // 4 · interiors: partitions per floor
  for (let f = 0; f < floors; f++) {
    const y = f * H;
    b.push(box(0, y, 1, 0.12, H - 0.4, 6, 4));
    b.push(box(-3.5, y, -1.5, 5.5, H - 0.4, 0.12, 4));
    b.push(box(3.5, y, -1.5, 5.5, H - 0.4, 0.12, 4));
    if (detail === "high") b.push(box(-4.5, y, 2.5, 1.8, 0.8, 0.9, 4));
  }
  return b;
}

/* Small, distinct models for each service detail page. */
export function buildServiceModel(kind: string): Box[] {
  const b: Box[] = [];
  switch (kind) {
    case "columns": {
      for (let x = -3; x <= 3; x += 2) for (let z = -3; z <= 3; z += 2) b.push(box(x, 0, z, 0.3, 5, 0.3, 0));
      for (let y = 1.6; y <= 5; y += 1.7) b.push(box(0, y, 0, 6.6, 0.2, 6.6, 1));
      break;
    }
    case "pipes": {
      for (const x of [-2, 0, 2]) b.push(box(x, 0, -2, 0.25, 6, 0.25, 0, "pipe"));
      for (let y = 1; y < 6; y += 1.5) b.push(box(0, y, -2, 5, 0.2, 0.2, 1, "pipe"));
      for (let y = 1.3; y < 6; y += 1.5) b.push(box(0, y, 0.5, 0.8, 0.45, 5, 2, "pipe"));
      b.push(box(2.5, 0, 2, 1.5, 1.4, 1.5, 0));
      break;
    }
    case "crane": {
      b.push(box(0, 0, 0, 0.6, 9, 0.6, 0));
      for (let y = 0.5; y < 9; y += 1) b.push(box(0, y, 0, 0.7, 0.05, 0.7, 1));
      b.push(box(2, 9, 0, 8, 0.4, 0.4, 2));
      b.push(box(-2, 8.6, 0, 1.4, 0.8, 0.8, 2));
      b.push(box(4.5, 6, 0, 0.04, 3, 0.04, 2));
      b.push(box(4.5, 5.6, 0, 0.8, 0.4, 0.8, 2));
      b.push(box(0, 0, 0, 3, 0.3, 3, 0));
      break;
    }
    case "stamp": {
      b.push(box(0, 0, 0, 6, 0.08, 4.2, 0));
      for (let i = 0; i < 4; i++) b.push(box(0.12 * i, 0.08 + i * 0.06, -0.08 * i, 5.6, 0.04, 3.8, 0));
      b.push(box(1.6, 0.4, 0.6, 1.6, 0.5, 1.6, 1));
      b.push(box(1.6, 0.9, 0.6, 1.1, 0.6, 1.1, 1));
      b.push(box(1.6, 1.5, 0.6, 0.35, 1.4, 0.35, 2));
      b.push(box(1.6, 2.9, 0.6, 0.8, 0.5, 0.8, 2));
      break;
    }
    case "room": {
      b.push(box(0, 0, 0, 8, 0.1, 6, 0));
      b.push(box(0, 0.1, -3, 8, 3, 0.15, 1));
      b.push(box(-4, 0.1, 0, 0.15, 3, 6, 1));
      b.push(box(1, 0.1, -2.95, 2.4, 1.6, 0.05, 2, "glass"));
      // a sofa and a low table
      b.push(box(-1, 0.1, -1.6, 3.4, 0.45, 1, 2));
      b.push(box(-1, 0.55, -2.05, 3.4, 0.5, 0.15, 2));
      b.push(box(-1, 0.1, 0.4, 1.6, 0.4, 0.8, 2));
      b.push(box(2.6, 0.1, 0.2, 0.9, 0.45, 0.9, 2));
      b.push(box(2.6, 0.55, -0.2, 0.9, 0.5, 0.12, 2));
      break;
    }
    default:
      return buildVilla("low").map((x) => ({ ...x, p: [x.p[0] * 0.35, x.p[1] * 0.35, x.p[2] * 0.35], s: [x.s[0] * 0.35, x.s[1] * 0.35, x.s[2] * 0.35] }));
  }
  return b;
}
