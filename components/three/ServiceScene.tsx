"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { buildServiceModel } from "./geometry";
import { useLayerGeometries } from "./BoxSet";
import { useVisibleFrameloop } from "./useVisibleFrameloop";
import type { ModelKind } from "@/lib/content";

/** A small model unique to each service, drawn in teal lines that build up layer by layer and turn slowly. */
function Model({ kind }: { kind: ModelKind }) {
  const boxes = useMemo(() => buildServiceModel(kind), [kind]);
  const layers = useLayerGeometries(boxes);
  const group = useRef<THREE.Group>(null);
  const t0 = useRef<number | null>(null);
  const center = useMemo(() => {
    const bb = new THREE.Box3();
    layers.forEach((l) => {
      l.edges.computeBoundingBox();
      bb.union(l.edges.boundingBox!);
    });
    const c = bb.getCenter(new THREE.Vector3());
    const s = bb.getSize(new THREE.Vector3());
    return { c, scale: 7 / Math.max(s.x, s.y, s.z) };
  }, [layers]);

  const mats = useMemo(
    () =>
      layers.map(() => ({
        line: new THREE.LineBasicMaterial({ color: "#2f7f8a", transparent: true, opacity: 0 }),
        solid: new THREE.MeshStandardMaterial({ color: "#fbf9f5", roughness: 0.9, transparent: true, opacity: 0, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1, depthWrite: false }),
      })),
    [layers]
  );

  useFrame((state, dt) => {
    if (t0.current === null) t0.current = state.clock.elapsedTime;
    const t = state.clock.elapsedTime - t0.current;
    mats.forEach((m, i) => {
      const k = Math.min(1, Math.max(0, (t - i * 0.45) / 0.9));
      const e = 1 - Math.pow(1 - k, 3);
      m.line.opacity = e;
      m.solid.opacity = e * 0.55;
    });
    if (group.current) group.current.rotation.y += dt * 0.18;
  });

  return (
    <group ref={group} scale={center.scale}>
      <group position={[-center.c.x, -center.c.y, -center.c.z]}>
        {layers.map((l, i) => (
          <group key={l.layer}>
            {Object.values(l.solids).map((g, j) => (
              <mesh key={j} geometry={g} material={mats[i].solid} />
            ))}
            <lineSegments geometry={l.edges} material={mats[i].line} />
          </group>
        ))}
      </group>
    </group>
  );
}

export default function ServiceScene({ kind, label }: { kind: ModelKind; label: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const loop = useVisibleFrameloop(wrap);
  return (
    <div ref={wrap} className="absolute inset-0" role="img" aria-label={label}>
      <Canvas frameloop={loop} dpr={[1, 2]} gl={{ antialias: true, alpha: true }} camera={{ fov: 30, position: [12, 9, 14] }}>
        <ambientLight intensity={0.9} />
        <directionalLight position={[-8, 12, 6]} intensity={1.2} color="#ffe2bd" />
        <Model kind={kind} />
      </Canvas>
    </div>
  );
}
