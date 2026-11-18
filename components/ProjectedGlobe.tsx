'use client';

import { useEffect, useRef } from 'react';

type Coordinate = [number, number];
type Land = {
  features: { geometry:
    | { type: 'Polygon'; coordinates: Coordinate[][] }
    | { type: 'MultiPolygon'; coordinates: Coordinate[][][] }
  }[];
};
type Stop = { name: string; latitude: number; longitude: number };
type Point = { x: number; y: number; z: number };
const radians = Math.PI / 180;

function project(longitude: number, latitude: number, centerLongitude: number, centerLatitude: number): Point {
  const lat = latitude * radians;
  const delta = (longitude - centerLongitude) * radians;
  const center = centerLatitude * radians;
  return {
    x: Math.cos(lat) * Math.sin(delta),
    y: Math.cos(center) * Math.sin(lat) - Math.sin(center) * Math.cos(lat) * Math.cos(delta),
    z: Math.sin(center) * Math.sin(lat) + Math.cos(center) * Math.cos(lat) * Math.cos(delta),
  };
}

function clipToHorizon(points: Point[]) {
  const clipped: Point[] = [];
  for (let index = 0; index < points.length; index++) {
    const previous = points[(index + points.length - 1) % points.length];
    const current = points[index];
    if ((previous.z >= 0) !== (current.z >= 0)) {
      const t = previous.z / (previous.z - current.z);
      clipped.push({ x: previous.x + (current.x - previous.x) * t, y: previous.y + (current.y - previous.y) * t, z: 0 });
    }
    if (current.z >= 0) clipped.push(current);
  }
  return clipped;
}

export default function ProjectedGlobe({ land, progress, stops, visible }: {
  land: Land;
  progress: { current: number };
  stops: Stop[];
  visible: boolean;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const element = canvas.current;
    const context = element?.getContext('2d');
    if (!element || !context || !visible) return;
    let frame = 0;
    let lastProgress = -1;
    let lastWidth = 0;
    let lastHeight = 0;

    const render = () => {
      frame = requestAnimationFrame(render);
      const width = element.clientWidth;
      const height = element.clientHeight;
      const p = Math.min(1, Math.max(0, progress.current));
      if (p === lastProgress && width === lastWidth && height === lastHeight) return;
      lastProgress = p;
      lastWidth = width;
      lastHeight = height;
      const density = Math.min(window.devicePixelRatio || 1, 2);
      element.width = width * density;
      element.height = height * density;
      context.setTransform(density, 0, 0, density, 0, 0);
      context.clearRect(0, 0, width, height);

      const segment = Math.min(stops.length - 2, Math.floor(p * (stops.length - 1)));
      const t = p * (stops.length - 1) - segment;
      const a = stops[segment];
      const b = stops[segment + 1];
      const longitude = a.longitude + (b.longitude - a.longitude) * t;
      const latitude = a.latitude + (b.latitude - a.latitude) * t;
      const radius = Math.min(width * .33, height * .35);
      const cx = width * .5;
      const cy = height * .5;
      const point = (lon: number, lat: number) => project(lon, lat, longitude, latitude);
      const plot = (q: Point) => [cx + q.x * radius, cy - q.y * radius] as const;

      context.save();
      context.shadowColor = '#34485330';
      context.shadowBlur = 45;
      context.shadowOffsetY = 25;
      context.beginPath();
      context.arc(cx, cy, radius, 0, Math.PI * 2);
      context.fillStyle = '#25434b';
      context.fill();
      context.restore();
      context.save();
      context.beginPath();
      context.arc(cx, cy, radius, 0, Math.PI * 2);
      context.clip();

      context.strokeStyle = '#54717670';
      context.lineWidth = .65;
      const grid = (coordinates: Coordinate[]) => {
        let drawing = false;
        context.beginPath();
        for (const [lon, lat] of coordinates) {
          const q = point(lon, lat);
          const [x, y] = plot(q);
          if (q.z < 0) { drawing = false; continue; }
          if (drawing) context.lineTo(x, y);
          else context.moveTo(x, y);
          drawing = true;
        }
        context.stroke();
      };
      for (let lat = -75; lat <= 75; lat += 15) {
        grid(Array.from({ length: 181 }, (_, index) => [index * 2 - 180, lat]));
      }
      for (let lon = -180; lon < 180; lon += 15) {
        grid(Array.from({ length: 91 }, (_, index) => [lon, index * 2 - 90]));
      }

      context.fillStyle = '#d5c29a';
      context.strokeStyle = '#a38d63';
      context.lineWidth = .65;
      for (const feature of land.features) {
        const polygons = feature.geometry.type === 'Polygon' ? [feature.geometry.coordinates] : feature.geometry.coordinates;
        for (const polygon of polygons) {
          context.beginPath();
          for (const ring of polygon) {
            const points = clipToHorizon(ring.map(([lon, lat]) => point(lon, lat)));
            points.forEach((q, index) => {
              const [x, y] = plot(q);
              if (index === 0) context.moveTo(x, y);
              else context.lineTo(x, y);
            });
            context.closePath();
          }
          context.fill('evenodd');
          context.stroke();
        }
      }
      const shade = context.createRadialGradient(cx - radius * .3, cy - radius * .35, radius * .1, cx, cy, radius);
      shade.addColorStop(0, '#fff5db12');
      shade.addColorStop(.7, '#14293300');
      shade.addColorStop(1, '#13263066');
      context.fillStyle = shade;
      context.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
      context.restore();

      context.strokeStyle = '#ab925d';
      context.lineWidth = 1;
      context.beginPath();
      context.ellipse(cx, cy, radius * 1.08, radius * .25, -.24, 0, Math.PI * 2);
      context.stroke();
      for (const stop of stops) {
        const q = point(stop.longitude, stop.latitude);
        if (q.z < .05) continue;
        const [x, y] = plot(q);
        context.fillStyle = '#fff1c7';
        context.beginPath();
        context.arc(x, y, 4, 0, Math.PI * 2);
        context.fill();
        context.font = '11px Arial, sans-serif';
        const labelWidth = context.measureText(stop.name).width + 18;
        context.fillStyle = '#faf2df';
        context.fillRect(x - labelWidth / 2, y - 29, labelWidth, 21);
        context.fillStyle = '#38464a';
        context.textAlign = 'center';
        context.fillText(stop.name, x, y - 15);
      }
    };
    render();
    return () => cancelAnimationFrame(frame);
  }, [land, progress, stops, visible]);

  return <canvas ref={canvas} className="projected-globe" role="img" aria-label="Rotating map of collection origins and museum references" />;
}
