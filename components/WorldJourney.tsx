'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import type { Artifact } from '@/data/collection';
import { collection } from '@/data/collection';
import SceneBoundary from './SceneBoundary';
import ProjectedGlobe from './ProjectedGlobe';
import useWebGLSupport from './useWebGLSupport';
import { Line } from '@react-three/drei';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

type Coordinate = [number, number];
type LandGeometry =
  | { type: 'Polygon'; coordinates: Coordinate[][] }
  | { type: 'MultiPolygon'; coordinates: Coordinate[][][] };

type Land = {
  features: { geometry: LandGeometry }[];
};

const stops = [
  {
    name: 'London',
    latitude: 51.51,
    longitude: -0.13,
    artifactId: 'chronometer',
    objectName: 'The Meridian Keeper',
    connection: 'LISTED OBJECT ORIGIN',
    title: 'Time, carried across oceans.',
    text: 'Explore the marine chronometer listed in the collection as originating in London.',
  },
  {
    name: 'Toulouse',
    latitude: 43.60,
    longitude: 1.44,
    artifactId: 'astrolabe',
    objectName: 'The Nocturne Dial',
    connection: 'MUSEUM REFERENCE',
    title: 'The sky, drawn in metal.',
    text: 'The collection references the Musée Paul Dupuy in Toulouse for this astrolabe. This stop identifies that museum reference.',
  },
  {
    name: 'Rochester',
    latitude: 43.16,
    longitude: -77.61,
    artifactId: 'camera',
    objectName: 'The Deco Eye',
    connection: 'LISTED OBJECT ORIGIN',
    title: 'A new way of looking.',
    text: 'Explore the folding Kodak camera listed in the collection with an origin of Rochester, New York.',
  },
];

function position(latitude: number, longitude: number, radius = 2.42) {
  const lat = THREE.MathUtils.degToRad(latitude);
  const lon = THREE.MathUtils.degToRad(longitude);

  return new THREE.Vector3(
    radius * Math.cos(lat) * Math.cos(lon),
    radius * Math.sin(lat),
    -radius * Math.cos(lat) * Math.sin(lon),
  );
}

function createMapTexture(land: Land) {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const context = canvas.getContext('2d');

  if (!context) throw new Error('Map texture could not be created.');

  context.fillStyle = '#153442';
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.strokeStyle = '#294b56';
  context.lineWidth = 1;

  for (let x = 0; x <= canvas.width; x += canvas.width / 24) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, canvas.height);
    context.stroke();
  }

  for (let y = 0; y <= canvas.height; y += canvas.height / 12) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(canvas.width, y);
    context.stroke();
  }

  context.fillStyle = '#ddd0ad';
  context.strokeStyle = '#b59a6e';
  context.lineWidth = 1.3;

  for (const feature of land.features) {
    const geometry = feature.geometry;
    const polygons = geometry.type === 'Polygon'
      ? [geometry.coordinates]
      : geometry.coordinates;

    for (const polygon of polygons) {
      context.beginPath();

      for (const ring of polygon) {
        ring.forEach(([longitude, latitude], index) => {
          const x = ((longitude + 180) / 360) * canvas.width;
          const y = ((90 - latitude) / 180) * canvas.height;

          if (index === 0) context.moveTo(x, y);
          else context.lineTo(x, y);
        });

        context.closePath();
      }

      context.fill('evenodd');
      context.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function CityLabel({ name }: { name: string }) {
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 96;

    const context = canvas.getContext('2d');
    if (!context) return;

    context.fillStyle = '#fff8e9';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.strokeStyle = '#cbb88d';
    context.lineWidth = 4;
    context.strokeRect(2, 2, canvas.width - 4, canvas.height - 4);

    context.fillStyle = '#25333f';
    context.font = '500 36px Arial, sans-serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(name, canvas.width / 2, canvas.height / 2, 290);

    const labelTexture = new THREE.CanvasTexture(canvas);
    labelTexture.colorSpace = THREE.SRGBColorSpace;
    setTexture(labelTexture);

    return () => labelTexture.dispose();
  }, [name]);

  if (!texture) return null;

  return (
    <sprite position={[0, 0.16, 0]} scale={[0.8, 0.24, 1]}>
      <spriteMaterial
        map={texture}
        transparent
        depthTest
        depthWrite={false}
        toneMapped={false}
      />
    </sprite>
  );
}
function Globe({
  land,
  progress,
  reduced,
}: {
  land: Land;
  progress: { current: number };
  reduced: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const texture = useMemo(() => createMapTexture(land), [land]);

  useEffect(() => () => texture.dispose(), [texture]);

  const routes = useMemo(() => (
    stops.slice(0, -1).map((stop, index) => {
      const start = position(stop.latitude, stop.longitude, 1);
      const next = stops[index + 1];
      const end = position(next.latitude, next.longitude, 1);

      return Array.from({ length: 81 }, (_, step) => {
        const t = step / 80;
        const point = start.clone().lerp(end, t).normalize();
        return point.multiplyScalar(2.46 + Math.sin(t * Math.PI) * 0.42);
      });
    })
  ), []);

  useFrame((state, delta) => {
    if (!group.current) return;

    const p = progress.current;
    const segment = p < 0.5 ? 0 : 1;
    const local = segment === 0 ? p * 2 : (p - 0.5) * 2;

    const longitude = THREE.MathUtils.lerp(
      stops[segment].longitude, stops[segment + 1].longitude, local,
    );
    const latitude = THREE.MathUtils.lerp(
      stops[segment].latitude, stops[segment + 1].latitude, local,
    );
    const direction = position(latitude, longitude, 1);
    const target = new THREE.Quaternion().setFromUnitVectors(direction, new THREE.Vector3(0, 0, 1));
    group.current.quaternion.slerp(target, reduced ? 1 : 1 - Math.exp(-4 * delta));
    state.camera.position.z = 8 - Math.sin(p * Math.PI) * 0.3;
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <group ref={group} rotation={[0.25, -1.4, 0]}>
      <mesh>
        <sphereGeometry args={[2.4, 96, 64]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.75}
          metalness={0.15}
          emissive="#335968"
          emissiveIntensity={0.13}
        />
      </mesh>

      <mesh scale={1.025}>
        <sphereGeometry args={[2.4, 64, 48]} />
        <meshBasicMaterial
          color="#7ca9dd"
          transparent
          opacity={0.075}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {routes.map((points, index) => (
        <Line
          key={index}
          points={points}
          color="#f8d99c"
          lineWidth={1.6}
          transparent
          opacity={0.85}
        />
      ))}

      {stops.map((stop) => (
        <group
          key={stop.name}
          position={position(stop.latitude, stop.longitude, 2.46)}
        >
          <mesh>
            <sphereGeometry args={[0.035, 16, 16]} />
            <meshBasicMaterial color="#fff0c6" />
          </mesh>
          <CityLabel name={stop.name} />
        </group>
      ))}
    </group>
  );
}

export default function WorldJourney({ onOpen }: { onOpen: (artifact: Artifact) => void }) {
  const webgl = useWebGLSupport();
  const section = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const [active, setActive] = useState(0);
  const [land, setLand] = useState<Land | null>(null);
  const [error, setError] = useState('');
  const [reduced, setReduced] = useState(false);
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!section.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting);
      if (entry.isIntersecting) setNear(true);
    }, { rootMargin: '200px' });
    observer.observe(section.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!near) return;
    const controller = new AbortController();

    fetch('/maps/land.geojson', { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('Map data could not be loaded.');
        return response.json();
      })
      .then(setLand)
      .catch((reason: Error) => {
        if (reason.name !== 'AbortError') setError(reason.message);
      });

    return () => controller.abort();
  }, [near]);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => setReduced(media.matches);

    let frame = 0;

    const update = () => {
      frame = 0;
      if (!section.current) return;

      const rect = section.current.getBoundingClientRect();
      if (media.matches) return;
      const sticky = section.current.querySelector<HTMLElement>('.world-sticky');
      const distance = Math.max(1, rect.height - (sticky?.offsetHeight ?? window.innerHeight));
      const p = THREE.MathUtils.clamp(-rect.top / distance, 0, 1);

      progress.current = p;
      setActive(Math.min(2, Math.round(p * 2)));
      section.current.style.setProperty('--journey-progress', String(p));
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    updateMotion();
    update();

    media.addEventListener('change', updateMotion);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      cancelAnimationFrame(frame);
      media.removeEventListener('change', updateMotion);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const stop = stops[active];

  return (
    <section
      className="world-journey"
      id="world"
      ref={section}
      aria-labelledby="world-title"
    >
      <div className="world-sticky">
        <div className="world-heading">
  <span className="eyebrow">An atlas of curiosity</span>
  <h2 id="world-title">Not old.<br /><em>Still<br />becoming.</em></h2>
  <p>AEON Archive treats history as something alive. Follow the globe to discover the places connected to our collection.</p>

</div>

        <span className="world-caption">PAST / PRESENT / POSSIBLE</span>
        <div className="world-canvas">
          {land && webgl === false ? <ProjectedGlobe land={land} progress={progress} stops={stops} visible={visible} /> : land && webgl === true ? (
            <SceneBoundary fallback={<ProjectedGlobe land={land} progress={progress} stops={stops} visible={visible} />}><Canvas
              frameloop={visible ? 'always' : 'never'}
              camera={{ position: [0, 0, 8], fov: 42 }}
              dpr={[1, 1.5]}
              gl={{ alpha: true, antialias: true }}
              fallback={<p className="world-status">3D globe requires WebGL.</p>}
            >
              <ambientLight intensity={1.3} />
              <directionalLight position={[-4, 5, 6]} intensity={3} color="#fff0d0" />
              <directionalLight position={[4, -1, -3]} intensity={2} color="#adc7ff" />
              <Globe land={land} progress={progress} reduced={reduced} />
            </Canvas></SceneBoundary>
          ) : (
            <p className="world-status">{error || 'Preparing the atlas...'}</p>
          )}
        </div>

        <div className="world-story">
          <span className="world-stop">{stop.name}</span>
          <h3>{stop.title}</h3>
          <p>{stop.text}</p>
          <div className="world-related-object">
            <span>{stop.connection}</span>
            <button
              type="button"
              onClick={() => {
                const artifact = collection.find((item) => item.id === stop.artifactId);
                if (artifact) onOpen(artifact);
              }}
            >
              <span>{stop.objectName}</span>
              <span aria-hidden="true">&#8599;</span>
            </button>
          </div>
          <div className="world-stops" aria-label="Journey destinations">
            {stops.map((destination, index) => (
              <button
                key={destination.name}
                className={index === active ? 'is-active' : ''}
                aria-pressed={index === active}
                onClick={() => {
                  if (!section.current) return;
                  const top = section.current.getBoundingClientRect().top + window.scrollY;
                  const sticky = section.current.querySelector<HTMLElement>('.world-sticky');
                  const distance = Math.max(0, section.current.offsetHeight - (sticky?.offsetHeight ?? window.innerHeight));
                  progress.current = index / 2;
                  setActive(index);

                  window.scrollTo({
                    top: top + distance * index / 2,
                    behavior: reduced ? 'auto' : 'smooth',
                  });
                }}
              >
                {destination.name}
              </button>
            ))}
          </div>
        </div>

        <div className="world-bottom">
          <span>COLLECTION ORIGINS & MUSEUM REFERENCES</span>
          <a
            href="https://www.naturalearthdata.com/"
            target="_blank"
            rel="noreferrer"
          >
            MAP DATA / NATURAL EARTH
          </a>
        </div>
        <div className="world-progress" aria-hidden="true" />
      </div>
    </section>
  );
}



