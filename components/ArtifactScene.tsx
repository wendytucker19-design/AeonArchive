'use client';

import { Canvas } from '@react-three/fiber';
import { ContactShadows, Environment, Lightformer, OrbitControls } from '@react-three/drei';
import { useEffect, useMemo, useState } from 'react';
import * as THREE from 'three';
import type { ArtifactKind } from '@/data/collection';
import DetailedArmillary from './DetailedArmillary';

type Materials = {
  brass: THREE.MeshStandardMaterial;
  gold: THREE.MeshStandardMaterial;
  wood: THREE.MeshStandardMaterial;
  dark: THREE.MeshStandardMaterial;
  silver: THREE.MeshStandardMaterial;
  glass: THREE.MeshPhysicalMaterial;
};

function DialFace({ astrolabe = false }: { astrolabe?: boolean }) {
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const context = canvas.getContext('2d');
    if (!context) return;

    context.fillStyle = astrolabe ? '#b9ad88' : '#e9debf';
    context.fillRect(0, 0, 1024, 1024);
    context.strokeStyle = '#5c4a2a';
    context.fillStyle = '#3b3528';
    context.translate(512, 512);

    for (const radius of astrolabe ? [470, 450, 390, 350, 280, 190] : [470, 445, 400]) {
      context.beginPath();
      context.lineWidth = radius === 470 ? 7 : 2;
      context.arc(0, 0, radius, 0, Math.PI * 2);
      context.stroke();
    }

    for (let index = 0; index < 120; index++) {
      const angle = index / 120 * Math.PI * 2;
      const major = index % 10 === 0;
      context.beginPath();
      context.lineWidth = major ? 5 : 2;
      context.moveTo(Math.sin(angle) * 440, -Math.cos(angle) * 440);
      context.lineTo(Math.sin(angle) * (major ? 410 : 425), -Math.cos(angle) * (major ? 410 : 425));
      context.stroke();
    }

    const roman = ['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];
    context.font = astrolabe ? '36px Georgia' : '52px Georgia';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    for (let index = 0; index < 12; index++) {
      const angle = index / 12 * Math.PI * 2;
      context.fillText(astrolabe ? String(index * 30) : roman[index], Math.sin(angle) * 350, -Math.cos(angle) * 350);
    }

    if (astrolabe) {
      for (let index = 0; index < 7; index++) {
        context.beginPath();
        context.ellipse(0, index * 23 - 70, 290, 70 + index * 22, index * .18, 0, Math.PI * 2);
        context.stroke();
      }
    } else {
      context.lineCap = 'round';
      context.lineWidth = 12;
      context.beginPath();
      context.moveTo(-65, 120);
      context.lineTo(130, -240);
      context.stroke();
      context.lineWidth = 18;
      context.beginPath();
      context.moveTo(-45, -70);
      context.lineTo(170, 220);
      context.stroke();
      context.beginPath();
      context.arc(0, 0, 24, 0, Math.PI * 2);
      context.fill();
    }

    const map = new THREE.CanvasTexture(canvas);
    map.colorSpace = THREE.SRGBColorSpace;
    setTexture(map);
    return () => map.dispose();
  }, [astrolabe]);

  return <mesh><circleGeometry args={[astrolabe ? .8 : .5, 96]} /><meshStandardMaterial map={texture} color="#e2d5b4" metalness={astrolabe ? .6 : .1} roughness={.4} /></mesh>;
}

function Chronometer({ materials }: { materials: Materials }) {
  return <group rotation={[0, -.2, 0]} position={[0, -.05, 0]}>
    <mesh material={materials.wood} position={[0, -.63, 0]} castShadow><boxGeometry args={[1.72, .15, 1.2]} /></mesh>
    {[-1, 1].map((side) => <mesh key={side} material={materials.wood} position={[side * .8, -.32, 0]} castShadow><boxGeometry args={[.12, .55, 1.2]} /></mesh>)}
    <mesh material={materials.wood} position={[0, -.32, .55]}><boxGeometry args={[1.6, .55, .1]} /></mesh>
    <group position={[0, .45, -.57]} rotation={[-.14, 0, 0]}>
      <mesh material={materials.wood} castShadow><boxGeometry args={[1.72, 1.5, .12]} /></mesh>
      <mesh material={materials.dark} position={[0, 0, .065]}><boxGeometry args={[1.48, 1.24, .015]} /></mesh>
      <mesh material={materials.brass} position={[0, .55, .08]}><boxGeometry args={[.37, .12, .025]} /></mesh>
    </group>
    <group position={[0, -.1, .12]} rotation={[-.55, 0, 0]}>
      <mesh material={materials.brass}><torusGeometry args={[.64, .026, 12, 96]} /></mesh>
      <mesh material={materials.gold} rotation={[.25, .1, 0]}><torusGeometry args={[.58, .018, 12, 96]} /></mesh>
      <mesh material={materials.brass} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[.54, .54, .16, 64]} /></mesh>
      <group position={[0, 0, .085]}><DialFace /></group>
    </group>
    {[-1, 1].map((side) => <mesh key={side} material={materials.gold} position={[side * .8, -.35, .61]}><boxGeometry args={[.1, .35, .025]} /></mesh>)}
    <mesh material={materials.gold} position={[0, -.4, .61]}><boxGeometry args={[.16, .13, .035]} /></mesh>
  </group>;
}

function Astrolabe({ materials }: { materials: Materials }) {
  return <group rotation={[0, -.15, .05]}>
    <mesh material={materials.silver} rotation={[Math.PI / 2, 0, 0]} castShadow><cylinderGeometry args={[.88, .88, .075, 96]} /></mesh>
    <group position={[0, 0, .045]}><DialFace astrolabe /></group>
    <mesh material={materials.gold} position={[0, 0, .055]}><torusGeometry args={[.85, .013, 10, 96]} /></mesh>
    <mesh material={materials.brass} position={[0, 0, .065]} rotation={[0, 0, .55]}><boxGeometry args={[.035, 1.58, .035]} /></mesh>
    <mesh material={materials.silver} position={[0, 0, .09]} rotation={[0, 0, -.5]}><boxGeometry args={[.05, 1.65, .04]} /></mesh>
    <mesh material={materials.gold} position={[0, 0, .12]}><sphereGeometry args={[.055, 20, 20]} /></mesh>
    <mesh material={materials.gold} position={[0, 1.08, 0]}><torusGeometry args={[.14, .025, 12, 40]} /></mesh>
    <mesh material={materials.brass} position={[0, .9, 0]}><boxGeometry args={[.12, .18, .08]} /></mesh>
  </group>;
}

function Bottle({ materials }: { materials: Materials }) {
  const profile = useMemo(() => [
    [0, -1], [.27, -1], [.32, -.94], [.21, -.86], [.18, -.7], [.36, -.56],
    [.56, -.25], [.59, .15], [.5, .45], [.27, .65], [.16, .75], [.16, .9], [.22, .95], [0, .95],
  ].map(([x, y]) => new THREE.Vector2(x, y)), []);
  return <group>
    <mesh material={materials.glass} castShadow><latheGeometry args={[profile, 96]} /></mesh>
    <mesh material={materials.brass} position={[0, .96, 0]}><cylinderGeometry args={[.22, .22, .06, 48]} /></mesh>
    <mesh material={materials.glass} position={[0, 1.1, 0]} scale={[1, 1.25, 1]}><sphereGeometry args={[.16, 32, 32]} /></mesh>
    {[-.93, -.56, .45, .7].map((height, index) => <mesh key={height} material={materials.gold} position={[0, height, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[[.3, .36, .5, .19][index], .008, 8, 80]} /></mesh>)}
    {Array.from({ length: 12 }, (_, index) => {
      const angle = index / 12 * Math.PI * 2;
      return <mesh key={index} material={materials.gold} position={[Math.sin(angle) * .58, .02, Math.cos(angle) * .58]} scale={[1, 2.4, 1]}><sphereGeometry args={[.012, 8, 10]} /></mesh>;
    })}
  </group>;
}

function Camera({ materials }: { materials: Materials }) {
  return <group rotation={[0, -.22, 0]}>
    <mesh material={materials.dark} castShadow><boxGeometry args={[1.5, 1, .46]} /></mesh>
    <mesh material={materials.silver} position={[0, .49, 0]}><boxGeometry args={[1.52, .05, .48]} /></mesh>
    <mesh material={materials.silver} position={[0, -.49, 0]}><boxGeometry args={[1.52, .05, .48]} /></mesh>
    {[0, 1, 2, 3].map((step) => <mesh key={step} material={step % 2 === 0 ? materials.dark : materials.silver} position={[.07, -.05, .24 + step * .07]}><boxGeometry args={[.83 - step * .1, .73 - step * .09, .045]} /></mesh>)}
    <mesh material={materials.brass} position={[.07, -.05, .55]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[.29, .29, .2, 64]} /></mesh>
    <mesh material={materials.dark} position={[.07, -.05, .66]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[.225, .225, .03, 64]} /></mesh>
    <mesh position={[.07, -.05, .68]}><circleGeometry args={[.17, 48]} /><meshPhysicalMaterial color="#173642" metalness={.7} roughness={.08} clearcoat={1} /></mesh>
    <mesh material={materials.silver} position={[-.48, .59, 0]}><boxGeometry args={[.28, .16, .28]} /></mesh>
    <mesh material={materials.dark} position={[-.48, .59, .15]}><boxGeometry args={[.17, .09, .02]} /></mesh>
    <mesh material={materials.brass} position={[.48, .56, 0]}><cylinderGeometry args={[.11, .11, .11, 24]} /></mesh>
  </group>;
}

function Automaton({ materials }: { materials: Materials }) {
  return <group rotation={[0, -.3, 0]}>
    <mesh material={materials.wood} position={[0, -.85, 0]}><boxGeometry args={[1.6, .2, .65]} /></mesh>
    <mesh material={materials.gold} position={[0, -.73, 0]}><boxGeometry args={[1.45, .05, .55]} /></mesh>
    <mesh material={materials.brass} position={[.1, -.1, 0]} scale={[1.7, .8, .7]}><sphereGeometry args={[.35, 32, 24]} /></mesh>
    {[-.4, .45].map((x) => [-.17, .17].map((z) => <mesh key={`${x}-${z}`} material={materials.gold} position={[x, -.46, z]} rotation={[0, 0, x * .35]}><cylinderGeometry args={[.025, .018, .52, 12]} /></mesh>))}
    <mesh material={materials.brass} position={[.5, .2, 0]} rotation={[0, 0, -.45]}><cylinderGeometry args={[.1, .13, .5, 20]} /></mesh>
    <mesh material={materials.gold} position={[.65, .43, 0]} scale={[1.5, .75, .7]}><sphereGeometry args={[.15, 24, 20]} /></mesh>
    {[-.1, .1].map((z) => <group key={z} position={[.57, .53, z]}>
      <mesh material={materials.brass} rotation={[0, 0, -.3]}><cylinderGeometry args={[.012, .02, .4, 10]} /></mesh>
      <mesh material={materials.brass} position={[-.06, .08, 0]} rotation={[0, 0, .7]}><cylinderGeometry args={[.01, .014, .2, 10]} /></mesh>
    </group>)}
    <mesh material={materials.silver} position={[-.12, .27, 0]} scale={[.7, 1.5, .75]}><sphereGeometry args={[.18, 24, 20]} /></mesh>
    <mesh material={materials.gold} position={[-.12, .64, 0]}><sphereGeometry args={[.115, 24, 20]} /></mesh>
    <mesh material={materials.silver} position={[-.12, .08, 0]}><coneGeometry args={[.27, .4, 32]} /></mesh>
  </group>;
}

function StudyObject({ kind }: { kind: ArtifactKind }) {
  const materials = useMemo<Materials>(() => ({
    brass: new THREE.MeshStandardMaterial({ color: '#a67d43', metalness: .88, roughness: .32 }),
    gold: new THREE.MeshStandardMaterial({ color: '#d7bc7c', metalness: .9, roughness: .23 }),
    wood: new THREE.MeshStandardMaterial({ color: '#59351f', metalness: .05, roughness: .4 }),
    dark: new THREE.MeshStandardMaterial({ color: '#242725', metalness: .25, roughness: .5 }),
    silver: new THREE.MeshStandardMaterial({ color: '#c3bca5', metalness: .85, roughness: .29 }),
    glass: new THREE.MeshPhysicalMaterial({ color: '#1233a3', metalness: .1, roughness: .12, clearcoat: 1, clearcoatRoughness: .1 }),
  }), []);
  useEffect(() => () => Object.values(materials).forEach((material) => material.dispose()), [materials]);

  let object;
  switch (kind) {
    case 'armillary': object = <DetailedArmillary reduced compact />; break;
    case 'bottle': object = <Bottle materials={materials} />; break;
    case 'chronometer': object = <Chronometer materials={materials} />; break;
    case 'astrolabe': object = <Astrolabe materials={materials} />; break;
    case 'camera': object = <Camera materials={materials} />; break;
    default: object = <Automaton materials={materials} />;
  }
  return <group>{object}</group>;
}

export function ArtifactStudy({ kind, autoRotate = true }: { kind: ArtifactKind; autoRotate?: boolean }) {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0, .18, 4.8], fov: 36 }} gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }} fallback={<p className="scene-error">3D viewing requires WebGL. Select a photograph to continue exploring.</p>}>
    <ambientLight intensity={.8} color="#fff4df" />
    <spotLight position={[-3, 5, 5]} intensity={160} angle={.6} penumbra={1} color="#ffe2ae" castShadow />
    <Environment resolution={128} frames={1} environmentIntensity={.9}>
      <Lightformer form="rect" intensity={3} color="#fff8e9" position={[-4, 4, 5]} target={[0, 0, 0]} scale={[4, 6, 1]} />
      <Lightformer form="rect" intensity={2} color="#c2d3fa" position={[4, 1, 3]} target={[0, 0, 0]} scale={[2, 5, 1]} />
      <Lightformer form="rect" intensity={2} color="#fff8e9" position={[0, 5, -3]} target={[0, 0, 0]} scale={[5, 2, 1]} />
    </Environment>
    <StudyObject kind={kind} />
    <ContactShadows position={[0, -1.2, 0]} opacity={.2} scale={5} blur={3} far={2} resolution={128} />
    <OrbitControls makeDefault enablePan={false} minDistance={2.8} maxDistance={7} autoRotate={autoRotate && !reduced} autoRotateSpeed={.45} />
  </Canvas>;
}
