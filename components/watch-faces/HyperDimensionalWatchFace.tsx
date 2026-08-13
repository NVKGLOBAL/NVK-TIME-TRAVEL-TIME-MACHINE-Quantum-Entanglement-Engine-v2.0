import React, { useRef, useEffect } from 'react';
import { useDimensions } from '../../hooks/useDimensions';

export type GeometryType =
  | 'hypercube'
  | 'simplex'
  | 'orthoplex'
  | 'clifford_torus'
  | 'e8_root'
  | 'string_manifold'
  | 'calabi_yau'
  | 'quantum_lattice'
  | 'hyper_ring'
  | 'holographic_web';

export interface HyperDimensionalWatchFaceProps {
  time: Date;
  modeName: string;
  dimension: number; // 3 to 52
  geometryType?: GeometryType;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  subtitle?: string;
}

/**
 * Pre-generates vertex geometry and edge connection indexes for N-Dimensional shapes (3D to 52D).
 */
function generateNDGeometry(dimension: number, geometryType: GeometryType = 'hypercube') {
  const d = 3;
  const vertices: number[][] = [];
  const edges: [number, number][] = [];

  if (geometryType === 'hypercube' && d <= 5) {
    const count = 1 << d;
    for (let i = 0; i < count; i++) {
      const v: number[] = new Array(d);
      for (let bit = 0; bit < d; bit++) {
        v[bit] = (i >> bit) & 1 ? 1 : -1;
      }
      vertices.push(v);
    }
    for (let i = 0; i < count; i++) {
      for (let bit = 0; bit < d; bit++) {
        const j = i ^ (1 << bit);
        if (i < j) {
          edges.push([i, j]);
        }
      }
    }
  } else if (geometryType === 'simplex' || d === 5) {
    const numVertices = d + 1;
    for (let i = 0; i < numVertices; i++) {
      const v = new Array(d).fill(0);
      for (let k = 0; k < d; k++) {
        if (k === i) v[k] = 1.3;
        else if (i === d) v[k] = -0.6;
        else v[k] = -0.15;
      }
      vertices.push(v);
    }
    for (let i = 0; i < numVertices; i++) {
      for (let j = i + 1; j < numVertices; j++) {
        edges.push([i, j]);
      }
    }
  } else if (geometryType === 'orthoplex') {
    for (let k = 0; k < d; k++) {
      const v1 = new Array(d).fill(0);
      const v2 = new Array(d).fill(0);
      v1[k] = 1.4;
      v2[k] = -1.4;
      vertices.push(v1);
      vertices.push(v2);
    }
    const numV = vertices.length;
    for (let i = 0; i < numV; i++) {
      for (let j = i + 1; j < numV; j++) {
        if (Math.floor(i / 2) !== Math.floor(j / 2)) {
          edges.push([i, j]);
        }
      }
    }
  } else if (geometryType === 'clifford_torus' || geometryType === 'hyper_ring') {
    const numRings = Math.min(d, 8);
    const pointsPerRing = 14;
    for (let r = 0; r < numRings; r++) {
      const axisA = r % d;
      const axisB = (r + 1) % d;
      for (let p = 0; p < pointsPerRing; p++) {
        const angle = (p / pointsPerRing) * Math.PI * 2;
        const v = new Array(d).fill(0);
        v[axisA] = Math.cos(angle) * (1.2 - r * 0.08);
        v[axisB] = Math.sin(angle) * (1.2 - r * 0.08);
        if (d > 2) v[(r + 2) % d] = Math.sin(angle * 2) * 0.35;
        vertices.push(v);
      }
    }
    const totalV = vertices.length;
    for (let i = 0; i < totalV; i++) {
      const nextInRing = i % pointsPerRing === pointsPerRing - 1 ? i - (pointsPerRing - 1) : i + 1;
      edges.push([i, nextInRing]);
      if (i + pointsPerRing < totalV) {
        edges.push([i, i + pointsPerRing]);
      }
    }
  } else {
    const numNodes = Math.min(72, Math.max(24, d * 2));
    for (let i = 0; i < numNodes; i++) {
      const v = new Array(d).fill(0);
      const theta = (i / numNodes) * Math.PI * 2;
      const phi = ((i * 5) / numNodes) * Math.PI;
      for (let k = 0; k < d; k++) {
        const phase = theta * (k + 1) + phi + (k % 4) * 0.5;
        v[k] = Math.sin(phase) * Math.cos(phase * 0.5) * (1.1 + (k % 3) * 0.15);
      }
      vertices.push(v);
    }
    for (let i = 0; i < numNodes; i++) {
      for (let step = 1; step <= 2; step++) {
        const j = (i + step) % numNodes;
        edges.push([i, j]);
      }
      const opp = (i + Math.floor(numNodes / 2)) % numNodes;
      edges.push([i, opp]);
    }
  }

  return { vertices, edges };
}

export const HyperDimensionalWatchFace: React.FC<HyperDimensionalWatchFaceProps> = ({
  time,
  modeName,
  dimension,
  geometryType = 'hypercube',
  primaryColor = '#00f3ff',
  secondaryColor = '#b000ff',
  accentColor = '#00ff88',
  subtitle,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { width, height } = useDimensions(containerRef);
  const timeRef = useRef(time);

  useEffect(() => {
    timeRef.current = time;
  }, [time]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || width === 0 || height === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const d = 3;
    const { vertices, edges } = generateNDGeometry(d, geometryType);

    let animationFrameId: number;

    const render = (timestamp: number) => {
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const baseRadius = Math.min(width, height) * 0.4;
      const curr = timeRef.current;
      const hours = String(curr.getHours()).padStart(2, '0');
      const minutes = String(curr.getMinutes()).padStart(2, '0');
      const seconds = String(curr.getSeconds()).padStart(2, '0');
      const ms = String(Math.floor(curr.getMilliseconds() / 10)).padStart(2, '0');
      const secVal = curr.getSeconds() + curr.getMilliseconds() / 1000;

      // -------------------------------------------------------------------
      // VISUAL RENDER ENGINE SELECTOR BASED ON DIMENSION & GEOMETRY
      // -------------------------------------------------------------------

      if (d === 3) {
        // 3D SPATIAL GIMBAL CHRONOMETER ENGINE
        const bgGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, baseRadius * 1.5);
        bgGrad.addColorStop(0, '#060d1a');
        bgGrad.addColorStop(0.6, '#02060d');
        bgGrad.addColorStop(1, '#000000');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        const t = timestamp * 0.0008;
        for (let ring = 0; ring < 3; ring++) {
          const ringRad = baseRadius * (0.75 + ring * 0.18);
          ctx.save();
          ctx.translate(centerX, centerY);
          ctx.rotate(t * (ring % 2 === 0 ? 1 : -1) + ring * (Math.PI / 3));
          ctx.beginPath();
          ctx.ellipse(0, 0, ringRad, ringRad * 0.45, ring * 0.5, 0, Math.PI * 2);
          ctx.strokeStyle = ring === 0 ? primaryColor : ring === 1 ? secondaryColor : accentColor;
          ctx.lineWidth = 1.5;
          ctx.shadowColor = ctx.strokeStyle;
          ctx.shadowBlur = 8;
          ctx.stroke();
          ctx.restore();
        }

        const cubeAngleX = t * 0.6;
        const cubeAngleY = t * 0.9;
        const cubeSize = baseRadius * 0.42;

        const rawCubeVerts = [
          [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
          [-1, -1, 1],  [1, -1, 1],  [1, 1, 1],  [-1, 1, 1],
        ];

        const projCube = rawCubeVerts.map(([vx, vy, vz]) => {
          let x = vx * Math.cos(cubeAngleY) - vz * Math.sin(cubeAngleY);
          let z = vx * Math.sin(cubeAngleY) + vz * Math.cos(cubeAngleY);
          let y = vy;

          const y1 = y * Math.cos(cubeAngleX) - z * Math.sin(cubeAngleX);
          z = y * Math.sin(cubeAngleX) + z * Math.cos(cubeAngleX);
          y = y1;

          const scale = 2.5 / (3.2 + z);
          return {
            x: centerX + x * cubeSize * scale,
            y: centerY + y * cubeSize * scale,
            z,
          };
        });

        const cubeEdges = [
          [0,1],[1,2],[2,3],[3,0],
          [4,5],[5,6],[6,7],[7,4],
          [0,4],[1,5],[2,6],[3,7]
        ];

        ctx.lineWidth = 2;
        cubeEdges.forEach(([i, j]) => {
          const p1 = projCube[i];
          const p2 = projCube[j];
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = primaryColor;
          ctx.stroke();
        });

        projCube.forEach((p) => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
          ctx.fillStyle = accentColor;
          ctx.shadowColor = accentColor;
          ctx.shadowBlur = 10;
          ctx.fill();
        });

        const hrAngle = ((curr.getHours() % 12) + curr.getMinutes() / 60) * (Math.PI / 6) - Math.PI / 2;
        const minAngle = (curr.getMinutes() + curr.getSeconds() / 60) * (Math.PI / 30) - Math.PI / 2;
        const secAngle = secVal * (Math.PI / 30) - Math.PI / 2;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX + Math.cos(hrAngle) * baseRadius * 0.4, centerY + Math.sin(hrAngle) * baseRadius * 0.4);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX + Math.cos(minAngle) * baseRadius * 0.65, centerY + Math.sin(minAngle) * baseRadius * 0.65);
        ctx.strokeStyle = primaryColor;
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX + Math.cos(secAngle) * baseRadius * 0.82, centerY + Math.sin(secAngle) * baseRadius * 0.82);
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(centerX, centerY + baseRadius * 0.62, baseRadius * 0.28, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 10, 25, 0.85)';
        ctx.strokeStyle = primaryColor;
        ctx.lineWidth = 1;
        ctx.fill();
        ctx.stroke();

        ctx.font = `bold ${baseRadius * 0.14}px Orbitron, monospace`;
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${hours}:${minutes}:${seconds}`, centerX, centerY + baseRadius * 0.62);

        ctx.font = `bold ${baseRadius * 0.07}px Orbitron, sans-serif`;
        ctx.fillStyle = secondaryColor;
        ctx.fillText('3D SPATIAL GIMBAL CUBE', centerX, centerY - baseRadius * 0.88);

      } else if (d === 4) {
        // 4D TESSERACT HYPER-ENGINE
        const bgGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, baseRadius * 1.5);
        bgGrad.addColorStop(0, '#15002b');
        bgGrad.addColorStop(0.6, '#080014');
        bgGrad.addColorStop(1, '#000000');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        const t = timestamp * 0.001;
        const proj4D: { x: number; y: number; z: number; w: number }[] = [];

        for (let i = 0; i < 16; i++) {
          let x = (i & 1) ? 1 : -1;
          let y = (i & 2) ? 1 : -1;
          let z = (i & 4) ? 1 : -1;
          let w = (i & 8) ? 1 : -1;

          const cosXW = Math.cos(t);
          const sinXW = Math.sin(t);
          const x1 = x * cosXW - w * sinXW;
          w = x * sinXW + w * cosXW;
          x = x1;

          const cosYZ = Math.cos(t * 0.7);
          const sinYZ = Math.sin(t * 0.7);
          const y1 = y * cosYZ - z * sinYZ;
          z = y * sinYZ + z * cosYZ;
          y = y1;

          const distance4D = 2.4;
          const factor4D = 1 / (distance4D - w * 0.5);
          x *= factor4D;
          y *= factor4D;
          z *= factor4D;

          const factor3D = 3.0 / (3.5 + z);
          proj4D.push({
            x: centerX + x * baseRadius * factor3D * 0.95,
            y: centerY + y * baseRadius * factor3D * 0.95,
            z,
            w,
          });
        }

        ctx.lineWidth = 1.8;
        for (let i = 0; i < 16; i++) {
          for (let bit = 0; bit < 4; bit++) {
            const j = i ^ (1 << bit);
            if (i < j) {
              const p1 = proj4D[i];
              const p2 = proj4D[j];
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = bit === 3 ? secondaryColor : primaryColor;
              ctx.shadowColor = ctx.strokeStyle;
              ctx.shadowBlur = 6;
              ctx.stroke();
            }
          }
        }

        proj4D.forEach((p, idx) => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 4.5, 0, Math.PI * 2);
          ctx.fillStyle = idx >= 8 ? accentColor : '#ffffff';
          ctx.fill();
        });

        const secArc = (secVal / 60) * Math.PI * 2 - Math.PI / 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, baseRadius * 1.08, -Math.PI / 2, secArc);
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 6;
        ctx.shadowColor = accentColor;
        ctx.shadowBlur = 12;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(centerX, centerY, baseRadius * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(10, 0, 25, 0.9)';
        ctx.strokeStyle = secondaryColor;
        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();

        ctx.font = `bold ${baseRadius * 0.16}px Orbitron, monospace`;
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${hours}:${minutes}`, centerX, centerY - baseRadius * 0.04);

        ctx.font = `bold ${baseRadius * 0.09}px Orbitron, monospace`;
        ctx.fillStyle = accentColor;
        ctx.fillText(`:${seconds}.${ms}`, centerX, centerY + baseRadius * 0.12);

        ctx.font = `bold ${baseRadius * 0.065}px Orbitron, sans-serif`;
        ctx.fillStyle = primaryColor;
        ctx.fillText('4D HYPERCUBE TESSERACT', centerX, centerY - baseRadius * 0.88);

      } else if (d === 5) {
        // 5D PENTERACT QUANTUM MATRIX
        const bgGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, baseRadius * 1.5);
        bgGrad.addColorStop(0, '#001a0f');
        bgGrad.addColorStop(0.7, '#000804');
        bgGrad.addColorStop(1, '#000000');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        const t = timestamp * 0.001;
        ctx.font = `${baseRadius * 0.05}px monospace`;
        ctx.fillStyle = 'rgba(0, 255, 136, 0.25)';
        for (let col = 0; col < 12; col++) {
          const colX = centerX + Math.cos((col / 12) * Math.PI * 2) * baseRadius * 0.95;
          const colY = centerY + Math.sin((col / 12) * Math.PI * 2) * baseRadius * 0.95;
          const charStr = String.fromCharCode(0x30a0 + ((col + Math.floor(t * 10)) % 60));
          ctx.fillText(charStr, colX, colY);
        }

        const proj5D: { x: number; y: number }[] = [];
        const numV5 = 6;
        for (let i = 0; i < numV5; i++) {
          const angle = (i / numV5) * Math.PI * 2 + t * 0.8;
          const rad = baseRadius * (0.55 + Math.sin(t * 2 + i) * 0.15);
          proj5D.push({
            x: centerX + Math.cos(angle) * rad,
            y: centerY + Math.sin(angle) * rad,
          });
        }

        for (let i = 0; i < numV5; i++) {
          for (let j = i + 1; j < numV5; j++) {
            ctx.beginPath();
            ctx.moveTo(proj5D[i].x, proj5D[i].y);
            ctx.lineTo(proj5D[j].x, proj5D[j].y);
            ctx.strokeStyle = (i + j) % 2 === 0 ? primaryColor : secondaryColor;
            ctx.lineWidth = 1.8;
            ctx.stroke();
          }
        }

        proj5D.forEach((p) => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
          ctx.fillStyle = accentColor;
          ctx.shadowColor = accentColor;
          ctx.shadowBlur = 12;
          ctx.fill();
        });

        ctx.beginPath();
        ctx.arc(centerX, centerY, baseRadius * 0.38, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 15, 10, 0.9)';
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();

        ctx.font = `bold ${baseRadius * 0.18}px Orbitron, monospace`;
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${hours}:${minutes}`, centerX, centerY - baseRadius * 0.03);

        ctx.font = `bold ${baseRadius * 0.09}px Orbitron, monospace`;
        ctx.fillStyle = primaryColor;
        ctx.fillText(`:${seconds}`, centerX, centerY + baseRadius * 0.13);

        ctx.font = `bold ${baseRadius * 0.065}px Orbitron, sans-serif`;
        ctx.fillStyle = accentColor;
        ctx.fillText('5D PENTERACT MATRIX', centerX, centerY - baseRadius * 0.88);

      } else if (d === 8) {
        // 8D E8 LIE GROUP MANDALA
        const bgGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, baseRadius * 1.5);
        bgGrad.addColorStop(0, '#22001a');
        bgGrad.addColorStop(0.6, '#0d000a');
        bgGrad.addColorStop(1, '#000000');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        const t = timestamp * 0.0006;
        const numRays = 24;
        for (let r = 0; r < numRays; r++) {
          const angle = (r / numRays) * Math.PI * 2 + t;
          const hue = (r * (360 / numRays) + t * 50) % 360;
          const x2 = centerX + Math.cos(angle) * baseRadius * 1.05;
          const y2 = centerY + Math.sin(angle) * baseRadius * 1.05;

          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(x2, y2);
          ctx.strokeStyle = `hsla(${hue}, 100%, 65%, 0.5)`;
          ctx.lineWidth = r % 2 === 0 ? 2 : 1;
          ctx.stroke();
        }

        for (let ring = 1; ring <= 4; ring++) {
          const ringRad = baseRadius * (ring * 0.22);
          const ringRot = t * (ring % 2 === 0 ? 1.5 : -1.5);
          const numNodes = ring * 8;

          for (let n = 0; n < numNodes; n++) {
            const angle = (n / numNodes) * Math.PI * 2 + ringRot;
            const nx = centerX + Math.cos(angle) * ringRad;
            const ny = centerY + Math.sin(angle) * ringRad;

            ctx.beginPath();
            ctx.arc(nx, ny, 3, 0, Math.PI * 2);
            ctx.fillStyle = ring % 2 === 0 ? primaryColor : secondaryColor;
            ctx.fill();
          }
        }

        ctx.beginPath();
        ctx.arc(centerX, centerY, baseRadius * 0.36, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(20, 0, 15, 0.9)';
        ctx.strokeStyle = primaryColor;
        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();

        ctx.font = `bold ${baseRadius * 0.17}px Orbitron, monospace`;
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${hours}:${minutes}`, centerX, centerY - baseRadius * 0.03);

        ctx.font = `bold ${baseRadius * 0.09}px Orbitron, monospace`;
        ctx.fillStyle = secondaryColor;
        ctx.fillText(`:${seconds}.${ms}`, centerX, centerY + baseRadius * 0.13);

        ctx.font = `bold ${baseRadius * 0.065}px Orbitron, sans-serif`;
        ctx.fillStyle = primaryColor;
        ctx.fillText('8D E8 LIE GROUP LATTICE', centerX, centerY - baseRadius * 0.88);

      } else if (d === 10 || d === 11) {
        // 10D / 11D CALABI-YAU & M-THEORY STRING WAVE
        const bgGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, baseRadius * 1.5);
        bgGrad.addColorStop(0, '#020b24');
        bgGrad.addColorStop(0.6, '#010412');
        bgGrad.addColorStop(1, '#000000');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        const t = timestamp * 0.0012;

        const numStrings = d === 10 ? 10 : 11;
        for (let s = 0; s < numStrings; s++) {
          ctx.beginPath();
          const baseAng = (s / numStrings) * Math.PI * 2;
          for (let r = 0.1; r <= 1.0; r += 0.05) {
            const wave = Math.sin(r * 12 + t * 3 + s) * baseRadius * 0.08;
            const px = centerX + Math.cos(baseAng + wave * 0.05) * baseRadius * r;
            const py = centerY + Math.sin(baseAng + wave * 0.05) * baseRadius * r;

            if (r === 0.1) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.strokeStyle = s % 2 === 0 ? primaryColor : secondaryColor;
          ctx.lineWidth = 1.8;
          ctx.shadowColor = ctx.strokeStyle;
          ctx.shadowBlur = 8;
          ctx.stroke();
        }

        for (let loop = 0; loop < 5; loop++) {
          ctx.beginPath();
          const loopRad = baseRadius * (0.3 + loop * 0.15);
          for (let a = 0; a <= Math.PI * 2; a += 0.1) {
            const rOffset = Math.sin(a * (d === 10 ? 6 : 7) + t * 2) * baseRadius * 0.06;
            const lx = centerX + Math.cos(a + t * 0.3) * (loopRad + rOffset);
            const ly = centerY + Math.sin(a + t * 0.3) * (loopRad + rOffset);
            if (a === 0) ctx.moveTo(lx, ly);
            else ctx.lineTo(lx, ly);
          }
          ctx.closePath();
          ctx.strokeStyle = `${accentColor}aa`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(centerX, centerY, baseRadius * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(2, 8, 25, 0.92)';
        ctx.strokeStyle = primaryColor;
        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();

        ctx.font = `bold ${baseRadius * 0.18}px Orbitron, monospace`;
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${hours}:${minutes}`, centerX, centerY - baseRadius * 0.03);

        ctx.font = `bold ${baseRadius * 0.09}px Orbitron, monospace`;
        ctx.fillStyle = accentColor;
        ctx.fillText(`:${seconds}`, centerX, centerY + baseRadius * 0.13);

        ctx.font = `bold ${baseRadius * 0.065}px Orbitron, sans-serif`;
        ctx.fillStyle = secondaryColor;
        ctx.fillText(d === 10 ? '10D CALABI-YAU STRING' : '11D M-THEORY MATRIX', centerX, centerY - baseRadius * 0.88);

      } else if (d >= 24 && d < 52) {
        // 24D LEECH LATTICE / 26D BOSONIC SPHERE PACKING
        const bgGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, baseRadius * 1.5);
        bgGrad.addColorStop(0, '#1c1500');
        bgGrad.addColorStop(0.6, '#0a0800');
        bgGrad.addColorStop(1, '#000000');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        const t = timestamp * 0.0007;

        const numNodes = d;
        for (let i = 0; i < numNodes; i++) {
          const angle = (i / numNodes) * Math.PI * 2 + t * (i % 2 === 0 ? 0.5 : -0.5);
          const dist = baseRadius * (0.4 + (i % 3) * 0.22);
          const nx = centerX + Math.cos(angle) * dist;
          const ny = centerY + Math.sin(angle) * dist;

          ctx.beginPath();
          ctx.arc(nx, ny, 5, 0, Math.PI * 2);
          ctx.fillStyle = primaryColor;
          ctx.shadowColor = primaryColor;
          ctx.shadowBlur = 8;
          ctx.fill();

          const nextIdx = (i + 1) % numNodes;
          const nextAngle = (nextIdx / numNodes) * Math.PI * 2 + t * (nextIdx % 2 === 0 ? 0.5 : -0.5);
          const nextDist = baseRadius * (0.4 + (nextIdx % 3) * 0.22);
          const nnx = centerX + Math.cos(nextAngle) * nextDist;
          const nny = centerY + Math.sin(nextAngle) * nextDist;

          ctx.beginPath();
          ctx.moveTo(nx, ny);
          ctx.lineTo(nnx, nny);
          ctx.strokeStyle = `${secondaryColor}88`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(centerX, centerY, baseRadius * 0.36, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(15, 10, 0, 0.92)';
        ctx.strokeStyle = primaryColor;
        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();

        ctx.font = `bold ${baseRadius * 0.17}px Orbitron, monospace`;
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${hours}:${minutes}`, centerX, centerY - baseRadius * 0.03);

        ctx.font = `bold ${baseRadius * 0.09}px Orbitron, monospace`;
        ctx.fillStyle = accentColor;
        ctx.fillText(`:${seconds}.${ms}`, centerX, centerY + baseRadius * 0.13);

        ctx.font = `bold ${baseRadius * 0.065}px Orbitron, sans-serif`;
        ctx.fillStyle = primaryColor;
        ctx.fillText(`${d}D LEECH SPHERE LATTICE`, centerX, centerY - baseRadius * 0.88);

      } else if (d === 52) {
        // 52D E8 LIE SUPER-SYMMETRY PINNACLE
        const bgGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, baseRadius * 1.6);
        bgGrad.addColorStop(0, '#2b001a');
        bgGrad.addColorStop(0.4, '#0d001a');
        bgGrad.addColorStop(0.8, '#030008');
        bgGrad.addColorStop(1, '#000000');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        const t = timestamp * 0.001;

        for (let ring = 0; ring < 2; ring++) {
          const ringRad = baseRadius * (0.85 + ring * 0.22);
          const dir = ring === 0 ? 1 : -1;
          const particlesInRing = 52;

          for (let p = 0; p < particlesInRing; p++) {
            const angle = (p / particlesInRing) * Math.PI * 2 + t * 2 * dir;
            const px = centerX + Math.cos(angle) * ringRad;
            const py = centerY + Math.sin(angle) * ringRad;

            const hue = (p * (360 / 52) + t * 100) % 360;
            ctx.beginPath();
            ctx.arc(px, py, p % 3 === 0 ? 4 : 2, 0, Math.PI * 2);
            ctx.fillStyle = `hsl(${hue}, 100%, 65%)`;
            ctx.shadowColor = ctx.fillStyle;
            ctx.shadowBlur = 8;
            ctx.fill();
          }
        }

        for (let b = 0; b < 52; b++) {
          const angle = (b / 52) * Math.PI * 2 + t * 0.4;
          const x2 = centerX + Math.cos(angle) * baseRadius * 1.12;
          const y2 = centerY + Math.sin(angle) * baseRadius * 1.12;

          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(x2, y2);
          ctx.strokeStyle = `hsla(${(b * 7 + t * 50) % 360}, 100%, 70%, 0.35)`;
          ctx.lineWidth = b % 4 === 0 ? 2 : 0.8;
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(centerX, centerY, baseRadius * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(10, 0, 20, 0.92)';
        ctx.strokeStyle = '#ff00ea';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#00f3ff';
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.stroke();

        ctx.font = `bold ${baseRadius * 0.19}px Orbitron, monospace`;
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${hours}:${minutes}`, centerX, centerY - baseRadius * 0.04);

        ctx.font = `bold ${baseRadius * 0.1}px Orbitron, monospace`;
        ctx.fillStyle = '#00ff88';
        ctx.fillText(`:${seconds}.${ms}`, centerX, centerY + baseRadius * 0.13);

        ctx.font = `bold ${baseRadius * 0.065}px Orbitron, sans-serif`;
        ctx.fillStyle = '#ffaa00';
        ctx.fillText('52D E8-LIE SUPER-SYMMETRY PINNACLE', centerX, centerY - baseRadius * 0.88);

      } else {
        // DYNAMIC HIGH-DIMENSIONAL FALLBACK RENDERER (6D - 51D)
        const bgGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, baseRadius * 1.5);
        bgGrad.addColorStop(0, '#040714');
        bgGrad.addColorStop(0.7, '#020308');
        bgGrad.addColorStop(1, '#000000');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        const t = timestamp * 0.0008;
        const projected2D: { x: number; y: number; z: number; scale: number }[] = [];

        for (let vIdx = 0; vIdx < vertices.length; vIdx++) {
          const v = [...vertices[vIdx]];

          for (let i = 0; i < Math.min(d - 1, 6); i++) {
            const j = (i + 1) % d;
            const angle = t * (0.5 + i * 0.15) + vIdx * 0.01;
            const cosA = Math.cos(angle);
            const sinA = Math.sin(angle);

            const xi = v[i];
            const xj = v[j];
            v[i] = xi * cosA - xj * sinA;
            v[j] = xi * sinA + xj * cosA;
          }

          let x = v[0] || 0;
          let y = v[1] || 0;
          let z = v[2] || 0;

          for (let k = 3; k < d; k++) {
            const w = 1 / (2.5 - (v[k] || 0) * 0.35);
            x *= w;
            y *= w;
            z *= w;
          }

          const fov = 3.0;
          const distance = 3.5;
          const factor = fov / (distance + z);
          const screenX = centerX + x * baseRadius * factor * 0.82;
          const screenY = centerY + y * baseRadius * factor * 0.82;

          projected2D.push({ x: screenX, y: screenY, z, scale: factor });
        }

        ctx.lineWidth = d > 20 ? 0.8 : 1.2;
        for (let eIdx = 0; eIdx < edges.length; eIdx++) {
          const [i, j] = edges[eIdx];
          const p1 = projected2D[i];
          const p2 = projected2D[j];

          if (!p1 || !p2) continue;

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);

          const edgeHue = (timestamp * 0.03 + eIdx * (360 / Math.max(1, edges.length))) % 360;
          const alpha = Math.min(0.8, Math.max(0.15, (p1.z + p2.z + 2) / 4));

          ctx.strokeStyle = `hsla(${edgeHue}, 90%, 65%, ${alpha})`;
          ctx.stroke();
        }

        projected2D.forEach((p, pIdx) => {
          const nodeSize = Math.max(1.5, Math.min(4.5, 2.5 * p.scale));
          ctx.beginPath();
          ctx.arc(p.x, p.y, nodeSize, 0, Math.PI * 2);
          ctx.fillStyle = pIdx % 2 === 0 ? primaryColor : secondaryColor;
          ctx.fill();
        });

        ctx.beginPath();
        ctx.arc(centerX, centerY, baseRadius * 0.38, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 5, 16, 0.88)';
        ctx.strokeStyle = primaryColor;
        ctx.lineWidth = 1.5;
        ctx.fill();
        ctx.stroke();

        ctx.font = `bold ${baseRadius * 0.18}px Orbitron, monospace`;
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${hours}:${minutes}`, centerX, centerY - baseRadius * 0.03);

        ctx.font = `bold ${baseRadius * 0.09}px Orbitron, monospace`;
        ctx.fillStyle = accentColor;
        ctx.fillText(`:${seconds}.${ms}`, centerX, centerY + baseRadius * 0.12);

        ctx.font = `bold ${baseRadius * 0.065}px Orbitron, sans-serif`;
        ctx.fillStyle = secondaryColor;
        const label = subtitle || `${d}D HYPER-DIMENSIONAL`;
        ctx.fillText(label, centerX, centerY - baseRadius * 0.88);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render(0);

    return () => cancelAnimationFrame(animationFrameId);
  }, [width, height, dimension, geometryType, primaryColor, secondaryColor, accentColor, modeName, subtitle]);

  return (
    <div ref={containerRef} className="w-full h-full bg-black rounded-full overflow-hidden relative">
      <canvas ref={canvasRef} />
    </div>
  );
};

export default HyperDimensionalWatchFace;
