"use client";

import { useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { buildBlock } from "./geometry";
import { useLayerGeometries } from "./BoxSet";
import { sceneStore, separation, activeLayer } from "./store";
import { useVisibleFrameloop } from "./useVisibleFrameloop";

const GAP = 5.2; // metres between exploded layers

/**
 * A G+4 residential block in axonometric: Foundation, Frame, MEP, Facade and Interiors
 * separate vertically as you scroll; the active layer fills in, and leader labels follow
 * each layer on screen. Re-stacks into a complete building at the end.
 */
function Block({ labels, lowDetail }: { labels: RefObject<(HTMLElement | null)[]>; lowDetail: boolean }) {
  const boxes = useMemo(() => buildBlock(lowDetail ? "low" : "high"), [lowDetail]);
  const layers = useLayerGeometries(boxes);
  const groups = useRef<(THREE.Group | null)[]>([]);
  const { camera, size } = useThree();

  // Per-layer materials so the active layer can fill in on its own.
  const mats = useMemo(
    () =>
      layers.map(() => ({
        line: new THREE.LineBasicMaterial({ color: "#2f7f8a", transparent: true }),
        solid: new THREE.MeshStandardMaterial({ color: "#fbf9f5", roughness: 0.95, transparent: true, opacity: 0.15, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1, depthWrite: false }),
        accent: new THREE.MeshStandardMaterial({ color: "#2f7f8a", roughness: 0.7, transparent: true, opacity: 0.2, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1, depthWrite: false }),
      })),
    [layers]
  );

  // Anchor for each leader label: the front-right top corner of the layer.
  const anchors = useMemo(
    () =>
      layers.map((l) => {
        l.edges.computeBoundingBox();
        const bb = l.edges.boundingBox!;
        return new THREE.Vector3(bb.max.x, (bb.min.y + bb.max.y) / 2, bb.max.z);
      }),
    [layers]
  );
  const v = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    const p = sceneStore.exploded;
    const e = separation(p);
    const active = activeLayer(p);
    const exploding = e > 0.5;

    layers.forEach((l, i) => {
      const g = groups.current[i];
      if (!g) return;
      g.position.y = l.layer * GAP * e;
      const on = exploding && i === active;
      const m = mats[i];
      m.solid.opacity += ((on ? 0.92 : e > 0.05 ? 0.12 : 0.55) - m.solid.opacity) * 0.12;
      m.accent.opacity += ((on ? 0.85 : 0.2) - m.accent.opacity) * 0.12;
      m.line.opacity += ((exploding && !on ? 0.45 : 1) - m.line.opacity) * 0.12;

      const label = labels.current?.[i];
      if (label) {
        v.copy(anchors[i]).add(new THREE.Vector3(0, g.position.y, 0)).project(camera);
        const x = (v.x * 0.5 + 0.5) * size.width;
        const y = (-v.y * 0.5 + 0.5) * size.height;
        label.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
        label.style.opacity = String(Math.min(1, e * 2));
        label.dataset.active = on ? "true" : "false";
      }
    });

    // Fit the building to the frame: stacked height ~17 m, exploded ~38 m.
    const ortho = camera as THREE.OrthographicCamera;
    const span = 26 + e * 22;
    const target = Math.min(size.width / 30, size.height / span);
    ortho.zoom += (target - ortho.zoom) * 0.1;
    ortho.position.set(34, 26 + e * 10, 34);
    ortho.lookAt(0, 6 + e * 9, 0);
    ortho.updateProjectionMatrix();
  });

  return (
    <group rotation={[0, 0, 0]}>
      {layers.map((l, i) => (
        <group key={l.layer} ref={(el) => void (groups.current[i] = el)}>
          {Object.entries(l.solids).map(([kind, g]) => (
            <mesh key={kind} geometry={g} material={kind === "pipe" || kind === "glass" ? mats[i].accent : mats[i].solid} />
          ))}
          <lineSegments geometry={l.edges} material={mats[i].line} />
        </group>
      ))}
    </group>
  );
}

export default function ExplodedScene({ label, labels }: { label: string; labels: RefObject<(HTMLElement | null)[]> }) {
  const wrap = useRef<HTMLDivElement>(null);
  const loop = useVisibleFrameloop(wrap);
  const lowDetail = typeof window !== "undefined" && window.innerWidth < 900;
  return (
    <div ref={wrap} className="absolute inset-0" role="img" aria-label={label}>
      <Canvas orthographic frameloop={loop} dpr={[1, 2]} gl={{ antialias: true, alpha: true }} camera={{ zoom: 20, near: -200, far: 400, position: [34, 26, 34] }}>
        <ambientLight intensity={0.9} color="#fff6ea" />
        <directionalLight position={[-20, 30, 20]} intensity={1.4} color="#ffe2bd" />
        <Block labels={labels} lowDetail={lowDetail} />
      </Canvas>
    </div>
  );
}
