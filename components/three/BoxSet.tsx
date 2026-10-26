"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import type { Box } from "./geometry";

export interface LayerGeometry {
  layer: number;
  edges: THREE.BufferGeometry;
  solids: Partial<Record<NonNullable<Box["kind"]>, THREE.BufferGeometry>>;
}

/**
 * Merges every box into one edges geometry and one solid geometry per (layer, kind),
 * so a whole building draws in a handful of draw calls.
 */
export function useLayerGeometries(boxes: Box[]): LayerGeometry[] {
  return useMemo(() => {
    const byLayer = new Map<number, { edges: THREE.BufferGeometry[]; solids: Map<string, THREE.BufferGeometry[]> }>();
    for (const b of boxes) {
      const g = new THREE.BoxGeometry(b.s[0], b.s[1], b.s[2]);
      g.translate(b.p[0], b.p[1], b.p[2]);
      const e = new THREE.EdgesGeometry(g, 20);
      const entry = byLayer.get(b.layer) ?? { edges: [] as THREE.BufferGeometry[], solids: new Map<string, THREE.BufferGeometry[]>() };
      entry.edges.push(e);
      const k = b.kind ?? "solid";
      entry.solids.set(k, [...(entry.solids.get(k) ?? []), g]);
      byLayer.set(b.layer, entry);
    }
    return [...byLayer.entries()]
      .sort(([a], [b]) => a - b)
      .map(([layer, v]) => ({
        layer,
        edges: mergeGeometries(v.edges)!,
        solids: Object.fromEntries([...v.solids.entries()].map(([k, list]) => [k, mergeGeometries(list)!])) as LayerGeometry["solids"],
      }));
  }, [boxes]);
}

/** Shared materials in the house palette. */
export function useMaterials(clipping: THREE.Plane[] = []) {
  return useMemo(() => {
    const line = new THREE.LineBasicMaterial({ color: "#2f7f8a", transparent: true, opacity: 1, clippingPlanes: clipping });
    const lineSoft = new THREE.LineBasicMaterial({ color: "#6fb0b8", transparent: true, opacity: 1, clippingPlanes: clipping });
    const solid = new THREE.MeshStandardMaterial({ color: "#efe8db", roughness: 0.92, metalness: 0, transparent: true, opacity: 0, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 });
    const screen = new THREE.MeshStandardMaterial({ color: "#d6c6ad", roughness: 0.95, transparent: true, opacity: 0, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 });
    const glass = new THREE.MeshStandardMaterial({ color: "#3a4540", roughness: 0.3, metalness: 0.1, transparent: true, opacity: 0, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 });
    const pipe = new THREE.MeshStandardMaterial({ color: "#2f7f8a", roughness: 0.6, transparent: true, opacity: 0, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 });
    return { line, lineSoft, solid, screen, glass, pipe };
  }, [clipping]);
}

export type Materials = ReturnType<typeof useMaterials>;

export function solidMaterialFor(kind: string, m: Materials) {
  if (kind === "glass") return m.glass;
  if (kind === "screen") return m.screen;
  if (kind === "pipe") return m.pipe;
  return m.solid;
}
