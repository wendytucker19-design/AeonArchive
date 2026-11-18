'use client';

import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

type Motion = {
  progress: { current: number };
  drag: { current: { x: number; y: number } };
  reduced?: boolean;
};

function CalibratedRing({
  radius,
  brass,
  gold,
}: {
  radius: number;
  brass: THREE.MeshStandardMaterial;
  gold: THREE.MeshStandardMaterial;
}) {
  return (
    <group>
      <mesh material={brass}>
        <ringGeometry args={[radius - 0.045, radius + 0.045, 128]} />
      </mesh>

      <mesh material={gold}>
        <torusGeometry args={[radius + 0.045, 0.009, 8, 128]} />
      </mesh>

      <mesh material={gold}>
        <torusGeometry args={[radius - 0.045, 0.009, 8, 128]} />
      </mesh>

      {Array.from({ length: 72 }, (_, index) => {
        const angle = index * Math.PI * 2 / 72;
        const major = index % 6 === 0;
        const tickRadius = radius + (major ? 0.002 : 0.014);

        return (
          <mesh
            key={index}
            material={gold}
            position={[
              Math.sin(angle) * tickRadius,
              Math.cos(angle) * tickRadius,
              0.006,
            ]}
            rotation={[0, 0, -angle]}
          >
            <boxGeometry args={[
              major ? 0.012 : 0.006,
              major ? 0.065 : 0.035,
              0.009,
            ]} />
          </mesh>
        );
      })}
    </group>
  );
}

export default function DetailedArmillary({
  motion,
  reduced = false,
  compact = false,
}: {
  motion?: Motion;
  reduced?: boolean;
  compact?: boolean;
}) {
  const outer = useRef<THREE.Group>(null);
  const middle = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const globe = useRef<THREE.Group>(null);
  const drag = useRef({ x: 0, y: 0 });

  const materials = useMemo(() => ({
    brass: new THREE.MeshStandardMaterial({
      color: '#ad8045',
      metalness: 0.88,
      roughness: 0.32,
      side: THREE.DoubleSide,
    }),
    gold: new THREE.MeshStandardMaterial({
      color: '#e7cd91',
      metalness: 0.9,
      roughness: 0.23,
    }),
    globe: new THREE.MeshStandardMaterial({
      color: '#244d50',
      metalness: 0.5,
      roughness: 0.48,
    }),
    engraving: new THREE.MeshStandardMaterial({
      color: '#9da785',
      metalness: 0.65,
      roughness: 0.4,
    }),
  }), []);

  useEffect(() => () => {
    Object.values(materials).forEach((material) => material.dispose());
  }, [materials]);

  useFrame((state, delta) => {
    const still = reduced || motion?.reduced;
    const p = motion?.progress.current ?? 0;

    if (motion) {
      state.gl.domElement.dataset.scrollProgress = String(Math.round(p * 100));

      drag.current.x = THREE.MathUtils.damp(
        drag.current.x, motion.drag.current.x, 7, delta,
      );
      drag.current.y = THREE.MathUtils.damp(
        drag.current.y, motion.drag.current.y, 7, delta,
      );

      const aspect = state.size.width / Math.max(1, state.size.height);
      const distance = aspect < 1.25 ? 9.4 : 8.6;

      state.camera.position.z = THREE.MathUtils.damp(
        state.camera.position.z, distance - p * 0.65, 5, delta,
      );
      state.camera.position.y = THREE.MathUtils.damp(
        state.camera.position.y, 0.2 - p * 0.12, 5, delta,
      );
      state.camera.lookAt(0, -0.03 - p * 0.12, 0);

      if (outer.current) {
        outer.current.rotation.set(
          0.43 + drag.current.y,
          p * Math.PI * 1.18 + drag.current.x,
          -0.18,
        );
      }

      if (middle.current) {
        middle.current.rotation.set(
          Math.PI / 2 - p * 1.15 + drag.current.y * 0.65,
          0.12,
          0.47,
        );
      }

      if (inner.current) {
        inner.current.rotation.set(
          0.1,
          0.5 + p * 1.85 - drag.current.x * 0.8,
          Math.PI / 2 - 0.36 + p * 0.55,
        );
      }
    } else if (outer.current && !still) {
      outer.current.rotation.y += delta * 0.12;
    }

    if (globe.current && !still) {
      globe.current.rotation.y += delta * 0.045;
    }
  });

  return (
    <group
      position={compact ? [0, 0, 0] : [0, 0.52, 0]}
      scale={compact ? 0.64 : 1}
    >
      <group ref={globe}>
        <mesh material={materials.globe} castShadow>
          <sphereGeometry args={[0.53, 64, 48]} />
        </mesh>

        {Array.from({ length: 6 }, (_, index) => (
          <mesh
            key={`meridian-${index}`}
            material={materials.engraving}
            rotation={[0, index * Math.PI / 6, 0]}
          >
            <torusGeometry args={[0.534, 0.0035, 6, 96]} />
          </mesh>
        ))}

        {[-60, -30, 0, 30, 60].map((degrees) => {
          const angle = THREE.MathUtils.degToRad(degrees);

          return (
            <mesh
              key={`latitude-${degrees}`}
              material={materials.engraving}
              position={[0, Math.sin(angle) * 0.534, 0]}
              rotation={[Math.PI / 2, 0, 0]}
            >
              <torusGeometry args={[
                Math.cos(angle) * 0.534, 0.0035, 6, 96,
              ]} />
            </mesh>
          );
        })}
      </group>

      <group ref={outer} rotation={[0.43, 0.1, -0.18]}>
        <CalibratedRing
          radius={1.36}
          brass={materials.brass}
          gold={materials.gold}
        />
      </group>

      <group ref={middle} rotation={[Math.PI / 2, 0.12, 0.47]}>
        <CalibratedRing
          radius={1.07}
          brass={materials.brass}
          gold={materials.gold}
        />
      </group>

      <group ref={inner} rotation={[0.1, 0.5, Math.PI / 2 - 0.36]}>
        <CalibratedRing
          radius={0.79}
          brass={materials.brass}
          gold={materials.gold}
        />
      </group>

      <group rotation={[0, 0, 0.23]}>
        <mesh material={materials.brass}>
          <cylinderGeometry args={[0.018, 0.018, 3.4, 20]} />
        </mesh>

        {[-1, 1].map((side) => (
          <group key={side} position={[0, side * 1.56, 0]}>
            <mesh material={materials.brass}>
              <cylinderGeometry args={[0.065, 0.065, 0.14, 24]} />
            </mesh>
            <mesh material={materials.gold} position={[0, side * 0.11, 0]}>
              <sphereGeometry args={[0.065, 24, 20]} />
            </mesh>
          </group>
        ))}
      </group>

      <mesh material={materials.gold} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.57, 0.012, 10, 96]} />
      </mesh>
    </group>
  );
}
