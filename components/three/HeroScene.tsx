"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { buildVilla } from "./geometry";
import { useLayerGeometries, useMaterials, solidMaterialFor } from "./BoxSet";
import { sceneStore } from "./store";
import { useVisibleFrameloop } from "./useVisibleFrameloop";

const TOP = 9.5; // highest point of the villa (m)
const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/**
 * The signature hero: a modern Arabic-contemporary villa drawn as teal edges on ink.
 * Lines draw in floor by floor (a clipping plane rises from the foundation), the model turns
 * slowly, the pointer tilts it up to 6°, and the scroll orbits the camera while paper and
 * stone materials fade in under low, warm afternoon light: the drawing becomes the building.
 */
function Villa({ lowDetail }: { lowDetail: boolean }) {
  const boxes = useMemo(() => buildVilla(lowDetail ? "low" : "high"), [lowDetail]);
  const layers = useLayerGeometries(boxes);
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, -1, 0), -0.01), []);
  const planes = useMemo(() => [plane], [plane]);
  const m = useMaterials(planes);
  const group = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const tilt = useRef({ x: 0, z: 0 });

  useFrame((state, dt) => {
    const p = sceneStore.hero;
    const draw = sceneStore.heroDraw;
    plane.constant = -0.6 + draw * (TOP + 1);

    // Drawing → building
    const solid = smooth(0.2, 0.75, p);
    m.solid.opacity = solid;
    m.screen.opacity = solid;
    m.glass.opacity = solid * 0.85;
    m.solid.depthWrite = m.screen.depthWrite = solid > 0.98;
    m.line.opacity = 1 - solid * 0.72;

    // Slow turn + pointer tilt (max 6° = 0.105 rad)
    if (group.current) {
      group.current.rotation.y += dt * 0.035;
      tilt.current.x += (sceneStore.pointer.y * 0.105 - tilt.current.x) * 0.05;
      tilt.current.z += (-sceneStore.pointer.x * 0.06 - tilt.current.z) * 0.05;
      group.current.rotation.x = tilt.current.x;
      group.current.rotation.z = tilt.current.z;
    }

    // Camera dolly around the villa
    const a = -0.75 + p * 1.25;
    const r = 50 - p * 3;
    camera.position.set(Math.sin(a) * r, 17 - p * 6, Math.cos(a) * r);
    camera.lookAt(0, 2.5, 0);
    state.invalidate();
  });

  return (
    <group ref={group} position={[0, -3, 0]}>
      {layers.map((l) => (
        <group key={l.layer}>
          {Object.entries(l.solids).map(([kind, g]) => (
            <mesh key={kind} geometry={g} material={solidMaterialFor(kind, m)} />
          ))}
          <lineSegments geometry={l.edges} material={m.line} />
        </group>
      ))}
    </group>
  );
}

export default function HeroScene({ label }: { label: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const loop = useVisibleFrameloop(wrap);
  const lowDetail = typeof window !== "undefined" && window.innerWidth < 900;

  return (
    <div ref={wrap} className="absolute inset-0" role="img" aria-label={label}>
      <Canvas
        frameloop={loop}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, localClippingEnabled: true, powerPreference: "high-performance" }}
        camera={{ fov: 30, near: 1, far: 200, position: [-30, 15, 30] }}
      >
        <ambientLight intensity={1.05} color="#f6ede0" />
        <directionalLight position={[-24, 10, 16]} intensity={2.1} color="#ffe2bf" />
        <directionalLight position={[20, 18, -10]} intensity={0.35} color="#9fc3c7" />
        <Villa lowDetail={lowDetail} />
      </Canvas>
    </div>
  );
}
