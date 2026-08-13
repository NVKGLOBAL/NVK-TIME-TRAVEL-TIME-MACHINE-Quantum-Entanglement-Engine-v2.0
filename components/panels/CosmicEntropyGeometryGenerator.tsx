import React, { useRef, useEffect, useMemo, useCallback } from 'react';

interface CosmicEntropyGeometryGeneratorProps {
  currentEntropy: number;
  currentPhase: string;
  chaliceStatus: string;
  width: number;
  height: number;
  isFractalModeEnabled: boolean;
  isActivating?: boolean;
  onClick?: () => void;
}

type RitualVisualState = 'dormant' | 'active' | 'cascade';
type AxiomKeySimple = 'I' | 'II' | 'III' | 'Ω';

const AXIOM_COLORS: Record<AxiomKeySimple, string> = {
  'I': 'hsla(180, 80%, 65%, 0.7)', // Cyan
  'II': 'hsla(40, 85%, 60%, 0.7)', // Amber
  'III': 'hsla(280, 75%, 70%, 0.7)',// Violet
  'Ω': 'hsla(60, 85%, 60%, 0.7)',   // Gold/Lime
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);

interface Point { x: number; y: number; }
interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  size: number; opacity: number;
  color: string; trail: Point[];
  life: number; maxLife: number;
  targetX?: number; // Optional: For particles moving towards a target
  targetY?: number; // Optional: For particles moving towards a target
  progress?: number; // Optional: Progress towards target (0-1)
  speed?: number;    // Optional: Speed of movement towards target
}

const CosmicEntropyGeometryGenerator: React.FC<CosmicEntropyGeometryGeneratorProps> = ({
  currentEntropy,
  currentPhase,
  chaliceStatus,
  width,
  height,
  isFractalModeEnabled,
  isActivating = false,
  onClick,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const particleFieldRef = useRef<Particle[]>([]);
  const weaveParticlesRef = useRef<Particle[]>([]);
  const activationProgress = useRef(0);

  const ritualVisualState = useMemo((): RitualVisualState => {
    const isActivePhase = currentPhase.includes("Weaving") || currentPhase.includes("Resonance") || currentPhase.includes("Ritual");
    const isActiveChalice = chaliceStatus.includes("Active") || chaliceStatus.includes("Weaving") || chaliceStatus.includes("Primed") || chaliceStatus.includes("Stabilized");

    if (currentEntropy > 0.75 && (isActivePhase || isActiveChalice)) return 'cascade';
    if (isActivePhase || isActiveChalice) return 'active';
    return 'dormant';
  }, [currentEntropy, currentPhase, chaliceStatus]);

  const axiomActivityLevels = useRef<Record<AxiomKeySimple, number>>({ 'I': 0.5, 'II': 0.5, 'III': 0.5, 'Ω': 0.5 });

  // Initialize background starfield particles
    useEffect(() => {
        if (width > 0 && height > 0) {
        const numParticles = 150 + Math.floor(currentEntropy * 200);
        particleFieldRef.current = Array.from({ length: numParticles }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.05 * (1 + currentEntropy * 3),
            vy: (Math.random() - 0.5) * 0.05 * (1 + currentEntropy * 3),
            size: Math.random() * 1.2 + 0.1,
            opacity: Math.random() * 0.4 + 0.1,
            color: `hsla(200, 70%, ${70 + Math.random() * 20}%, ${0.2 + Math.random() * 0.3})`,
            trail: [], // For starlight conductor effect, not used by background particles
            life: 100, maxLife: 100 // Not strictly needed for persistent background particles
        }));
        }
    }, [width, height, currentEntropy]);

  useEffect(() => {
    if (isActivating) {
      activationProgress.current = 0;
      // Activation particle burst
      for (let i = 0; i < 50; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 3;
        weaveParticlesRef.current.push({
          x: width / 2, y: height / 2,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 2 + 1, opacity: 1,
          color: `hsla(${180 + Math.random() * 60}, 90%, 70%, 1)`,
          trail: [], life: 80, maxLife: 80,
        });
      }
    }
  }, [isActivating, width, height]);


  const drawFractalBranch = useCallback((
    rctx: CanvasRenderingContext2D,
    x: number, y: number,
    angle: number, length: number,
    depth: number, maxDepth: number,
    entropy: number,
    baseHue: number,
    axiomActivities: Record<AxiomKeySimple, number>,
    frameCount: number
  ) => {
    if (depth > maxDepth || length < 0.5) return;

    const t = clamp(entropy, 0, 1);
    const pulseFactor = 0.9 + 0.1 * Math.sin(frameCount * 0.03 + depth * 0.6);
    const currentLength = length * pulseFactor;

    // Introduce a twist for DNA Helix effect
    const twistAngle = angle + depth * 0.1 * lerp(0.1, 0.5, t) * Math.sin(frameCount * 0.01 + depth * 0.2);
    const endX = x + Math.cos(twistAngle) * currentLength;
    const endY = y + Math.sin(twistAngle) * currentLength;
    
    let mainColorInfluence: AxiomKeySimple = 'I';
    let maxActivity = 0;
    for (const key in axiomActivities) {
        if(axiomActivities[key as AxiomKeySimple] > maxActivity) {
            maxActivity = axiomActivities[key as AxiomKeySimple];
            mainColorInfluence = key as AxiomKeySimple;
        }
    }
    const axiomColorBase = AXIOM_COLORS[mainColorInfluence];
    const [hueStr, satStr, lightStr] = axiomColorBase.match(/\d+/g)!.map(Number);
    const branchHue = (hueStr + (Math.random() - 0.5) * 30 * t + depth * 10) % 360;
    const branchSaturation = clamp(satStr - t * 20, 40, 90);
    const branchLightness = clamp(lightStr - depth * 5 - t * 15, 30, 70);
    
    const lineWidth = Math.max(0.2, (1 - depth / maxDepth) * (2.5 + t * 2.5)) * pulseFactor;
    const alpha = Math.max(0.05, (1 - depth / maxDepth) * (0.7 - t * 0.3)) * (0.8 + 0.2 * pulseFactor);

    rctx.beginPath();
    rctx.moveTo(x, y);
    // Create a slightly curved branch for organic feel
    const cpX = x + Math.cos(twistAngle + Math.PI / 12) * currentLength * 0.5;
    const cpY = y + Math.sin(twistAngle + Math.PI / 12) * currentLength * 0.5;
    rctx.quadraticCurveTo(cpX, cpY, endX, endY);
    
    rctx.strokeStyle = `hsla(${branchHue}, ${branchSaturation}%, ${branchLightness}%, ${alpha})`;
    rctx.lineWidth = lineWidth;
    rctx.stroke();

    // Oracle Whisper Field particles at branch tips
    if (depth > 1 && Math.random() < 0.1 + t * 0.2) {
        const particleColor = `hsla(${(branchHue + 30 + Math.random()*60)%360}, ${clamp(branchSaturation+20, 60,100)}%, ${clamp(branchLightness+20, 70,90)}%, ${0.5 + Math.random()*0.4})`;
        weaveParticlesRef.current.push({
            x: endX, y: endY,
            vx: (Math.random() - 0.5) * 0.2, vy: (Math.random() - 0.5) * 0.2,
            size: Math.random() * 1.5 + 0.5, opacity: 1, color: particleColor,
            trail: [], life: 50 + Math.random() * 50, maxLife: 50 + Math.random()*50
        });
    }

    const numBranches = depth === 0 ? 2 + Math.floor(t * 3) : 1 + Math.floor(t * 1.5);
    const angleSpread = Math.PI / (2.5 + depth) * (1 + t * 1.2);

    for (let i = 0; i < numBranches; i++) {
      if (entropy > 0.8 && Math.random() < entropy * 0.4 && depth > 0) continue;

      const newAngle = angle + (i - (numBranches - 1) / 2) * angleSpread * (1 + (Math.random() - 0.5) * t * 0.6);
      const newLength = currentLength * (0.6 + (Math.random() * 0.1) - t * 0.25);
      
      drawFractalBranch(rctx, endX, endY, newAngle, newLength, depth + 1, maxDepth, entropy, baseHue, axiomActivities, frameCount);
    }
  }, []);


  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || width === 0 || height === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;
    
    let frameCount = 0;

    const drawNebulaLayer = (rctx: CanvasRenderingContext2D, color1: string, color2: string, radiusFactor: number, alpha: number, noiseSeed: number) => {
      const gradient = rctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.min(width, height) * radiusFactor);
      gradient.addColorStop(0, color1);
      gradient.addColorStop(1, color2);
      rctx.fillStyle = gradient;
      rctx.globalAlpha = alpha * (0.6 + 0.4 * (1-currentEntropy)); // More defined nebula at low entropy
      rctx.fillRect(0, 0, width, height);

      const noiseStrength = lerp(0.01, 0.05, currentEntropy) * alpha;
      const numNoisePatches = 20 + Math.floor(currentEntropy * 30);
      for (let i = 0; i < numNoisePatches; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const size = (Math.random() * 40 + 20) * (1 + currentEntropy * 1.5);
        const noiseAlpha = (Math.random() * 0.3 + 0.05) * noiseStrength;
        const hue = (frameCount * 0.05 + i * noiseSeed + axiomActivityLevels.current.I * 50) % 360; // Color influenced by an axiom
        rctx.fillStyle = `hsla(${hue}, 60%, 50%, ${noiseAlpha})`;
        rctx.beginPath();
        rctx.ellipse(x, y, size, size * (0.5 + Math.random()*0.5), Math.random()*Math.PI*2, 0, Math.PI * 2);
        rctx.fill();
      }
      rctx.globalAlpha = 1;
    };

    const drawStarfield = (rctx: CanvasRenderingContext2D) => {
      particleFieldRef.current.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -5 || p.x > width + 5) p.vx *= -1; // Bounce with margin
        if (p.y < -5 || p.y > height + 5) p.vy *= -1;
        
        const baseOpacity = p.opacity * (ritualVisualState === 'active' ? 1.3 : 0.9);
        const finalOpacity = clamp(baseOpacity + Math.sin(frameCount * 0.02 + p.x * 0.05 + p.y*0.05) * 0.15, 0.05, 0.7);

        rctx.fillStyle = p.color.replace(/,\s*\d(\.\d+)?\)/, `, ${finalOpacity})`);
        rctx.beginPath();
        rctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        rctx.fill();
      });
    };
    
    const drawGeometricStructure = (rctx: CanvasRenderingContext2D, currentAxiomActivity: Record<AxiomKeySimple, number>, sidesToDraw: number, initialRotationForFrame: number) => {
        const centerX = width / 2;
        const centerY = height / 2;
        const t = clamp(currentEntropy,0,1);

        const numRings = 3 + Math.floor((1-t)*3); // More rings at low entropy (3-5)
        const baseRingRadius = Math.min(width, height) * 0.1;
        const ringSpacing = Math.min(width, height) * (0.08 + t * 0.04); // Rings closer or further based on entropy

        const allRingVertices: Point[][] = [];

        // Phase Resonance Rings
        for (let r = 0; r < numRings; r++) {
            const ringRadius = baseRingRadius + r * ringSpacing * (1 + (Math.sin(frameCount*0.01 + r*0.5) * 0.05 * t)); // Pulsing radius
            const rotation = initialRotationForFrame + r * 0.1 * (1 + t * 1.1) * (r%2 === 0 ? 1: -1); // Rings rotate slightly differently
            const alpha = lerp(0.7, 0.3, t) * (1 - r/(numRings+1));
            const lineWidth = lerp(2.5, 0.5, t) * (1 - r/(numRings+2));
            
            const activeColorKeys = Object.keys(currentAxiomActivity).filter(k => currentAxiomActivity[k as AxiomKeySimple] > 0.3) as AxiomKeySimple[];
            const ringColorKey = activeColorKeys.length > 0 ? activeColorKeys[r % activeColorKeys.length] : 'I';
            const ringColor = AXIOM_COLORS[ringColorKey].replace(/,\s*\d(\.\d+)?\)/, `, ${alpha})`);

            const ringVertices: Point[] = [];
            rctx.beginPath();
            for (let i = 0; i <= sidesToDraw; i++) {
                const angle = (i / sidesToDraw) * Math.PI * 2 + rotation;
                const x = centerX + Math.cos(angle) * ringRadius * (1 + (Math.sin(frameCount*0.02 + i*0.8 + r) * 0.03 * t)); // Vertex pulse
                const y = centerY + Math.sin(angle) * ringRadius * (1 + (Math.cos(frameCount*0.02 + i*0.8 + r) * 0.03 * t));
                ringVertices.push({x, y});
                if (i === 0) rctx.moveTo(x,y);
                else rctx.lineTo(x,y);
            }
            rctx.strokeStyle = ringColor;
            rctx.lineWidth = lineWidth;
            rctx.stroke();
            allRingVertices.push(ringVertices);

             // Hypercube Echo hint for 4-sides
            if (sidesToDraw === 4 && r < numRings -1 && t < 0.6) {
                const innerRing = allRingVertices[r];
                const outerRing = allRingVertices[r+1];
                if(outerRing) {
                    rctx.beginPath();
                    for(let v=0; v < sidesToDraw; v++) {
                        rctx.moveTo(innerRing[v].x, innerRing[v].y);
                        rctx.lineTo(outerRing[v].x, outerRing[v].y);
                    }
                    rctx.strokeStyle = ringColor.replace(/,\s*\d(\.\d+)?\)/, `, ${alpha*0.3})`);
                    rctx.lineWidth = lineWidth * 0.5;
                    rctx.stroke();
                }
            }
        }
        
        // Aetheric Weave & Starlight Conductor
        const numWeaveConnections = lerp(10, 50, 1-t) + (ritualVisualState === 'active' ? 20: 0);
        if (allRingVertices.flat().length > 1) {
            for (let i = 0; i < numWeaveConnections; i++) {
                const p1 = allRingVertices.flat()[Math.floor(Math.random() * allRingVertices.flat().length)];
                const p2 = allRingVertices.flat()[Math.floor(Math.random() * allRingVertices.flat().length)];
                if (p1 === p2) continue;

                const distSq = (p1.x-p2.x)**2 + (p1.y-p2.y)**2;
                if (distSq > (ringSpacing*2.5)**2 ) continue; // Connect only somewhat close points

                const weaveAlpha = lerp(0.4, 0.1, t) * (ritualVisualState === 'active' ? 1.5 : 1);
                const weaveColorKey = Object.keys(AXIOM_COLORS)[i%4] as AxiomKeySimple;
                const weaveColor = AXIOM_COLORS[weaveColorKey].replace(/,\s*\d(\.\d+)?\)/, `, ${weaveAlpha})`);
                
                rctx.beginPath();
                rctx.moveTo(p1.x, p1.y);
                const cp1x = lerp(p1.x, p2.x, 0.3) + (Math.random()-0.5)*20*t;
                const cp1y = lerp(p1.y, p2.y, 0.3) + (Math.random()-0.5)*20*t;
                const cp2x = lerp(p1.x, p2.x, 0.7) + (Math.random()-0.5)*20*t;
                const cp2y = lerp(p1.y, p2.y, 0.7) + (Math.random()-0.5)*20*t;
                rctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
                rctx.strokeStyle = weaveColor;
                rctx.lineWidth = lerp(1, 0.2, t);
                rctx.stroke();

                // Starlight Conductor particles
                if (Math.random() < 0.1 * (1-t) * (ritualVisualState === 'active' ? 3:1) ) {
                     weaveParticlesRef.current.push({
                        x: p1.x, y: p1.y, targetX: p2.x, targetY: p2.y,
                        vx: 0, vy: 0, // Will be calculated
                        size: Math.random() * 1 + 0.5, opacity: 1, 
                        color: weaveColor.replace(/,\s*\d(\.\d+)?\)/, `, ${0.8 + Math.random()*0.2})`),
                        trail: [], life: 60 + Math.random()*40, maxLife: 60 + Math.random()*40,
                        progress: 0, speed: 0.01 + Math.random()*0.015
                    });
                }
            }
        }

        // Null Shell / Shielded Chaos boundary
        let boundaryRadius = Math.min(width,height)/2 * 0.95;
        let boundaryColor = 'hsla(200, 70%, 80%, 0.1)';
        let boundaryLineWidth = 2;
        if(t < 0.2) { // Null Shell
            boundaryColor = `hsla(200, 80%, 90%, ${lerp(0.5, 0.2, t/0.2)})`;
            boundaryLineWidth = lerp(3,1,t/0.2);
        } else if (t > 0.8) { // Shielded Chaos
            boundaryColor = `hsla(0, 70%, 70%, ${lerp(0.1, 0.6, (t-0.8)/0.2)})`;
            boundaryLineWidth = lerp(1,4,(t-0.8)/0.2);
            boundaryRadius *= (1 + Math.sin(frameCount*0.1)*0.02*t); // Agitated boundary
        }
        rctx.beginPath();
        rctx.arc(centerX, centerY, boundaryRadius, 0, Math.PI*2);
        rctx.strokeStyle = boundaryColor;
        rctx.lineWidth = boundaryLineWidth;
        if(t > 0.8) rctx.setLineDash([5 + t*10, 3+t*5]);
        rctx.stroke();
        rctx.setLineDash([]);
    };
    
    const updateAndDrawWeaveParticles = (rctx: CanvasRenderingContext2D) => {
        weaveParticlesRef.current = weaveParticlesRef.current.filter(p => p.life > 0);
        weaveParticlesRef.current.forEach(p => {
            p.life--;
            if(p.targetX !== undefined && p.targetY !== undefined && p.progress !== undefined && p.speed !== undefined) { // For particles moving along a path
                 p.progress = Math.min(1, p.progress + p.speed);
                 const prevX = p.x; const prevY = p.y;
                 p.x = lerp(p.x, p.targetX, p.progress); // Simplified lerp towards target
                 p.y = lerp(p.y, p.targetY, p.progress);
                 if (p.progress >= 1) p.life = 0; // Reached target
                 
                 p.trail.push({x: prevX, y: prevY});
                 if(p.trail.length > 5) p.trail.shift();

            } else { // For free-floating particles (e.g. Oracle Whisper Field)
                p.x += p.vx; p.y += p.vy;
                p.vx *= 0.98; p.vy *= 0.98; // Dampening
                p.opacity = (p.life / p.maxLife) * 0.8;
            }


            // Draw trail for starlight conductor particles
            if(p.targetX !== undefined) {
                rctx.beginPath();
                if(p.trail.length > 1) {
                    rctx.moveTo(p.trail[0].x, p.trail[0].y);
                    for(let i=1; i<p.trail.length; i++) {
                        rctx.lineTo(p.trail[i].x, p.trail[i].y);
                    }
                    rctx.strokeStyle = p.color.replace(/,\s*\d(\.\d+)?\)/, `, ${p.opacity*0.3})`);
                    rctx.lineWidth = p.size * 0.7;
                    rctx.stroke();
                }
            }

            // Draw particle
            rctx.beginPath();
            rctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            const particleOpacity = p.targetX !== undefined ? p.opacity : (p.life / p.maxLife) * 0.8;
            rctx.fillStyle = p.color.replace(/,\s*\d(\.\d+)?\)/, `, ${particleOpacity})`);
            rctx.fill();
        });
    }

    const drawActivationEffect = (rctx: CanvasRenderingContext2D, progress: number) => {
      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
      const easedProgress = easeOutCubic(progress);
    
      // Phase 1: Bright flash (first 30% of animation)
      if (easedProgress < 0.3) {
        const flashAlpha = Math.sin((easedProgress / 0.3) * Math.PI) * 0.9;
        rctx.fillStyle = `rgba(200, 220, 255, ${flashAlpha})`;
        rctx.fillRect(0, 0, width, height);
      }
    
      // Phase 2: Expanding ring (from 10% to 100%)
      if (easedProgress > 0.1) {
        const ringProgress = (easedProgress - 0.1) / 0.9;
        const radius = ringProgress * Math.max(width, height) * 0.7;
        const alpha = 1 - ringProgress;
        rctx.strokeStyle = `rgba(150, 200, 255, ${alpha})`;
        rctx.lineWidth = 3 + (1 - ringProgress) * 7;
        rctx.beginPath();
        rctx.arc(width / 2, height / 2, radius, 0, Math.PI * 2);
        rctx.stroke();
      }
    };
    
    const render = () => {
      frameCount++;

      if (isActivating && activationProgress.current < 1) {
        activationProgress.current += 0.025; // Controls speed of activation animation
      }
      const activationT = clamp(activationProgress.current, 0, 1);


      ctx.clearRect(0, 0, width, height);

      Object.keys(axiomActivityLevels.current).forEach((key, index) => {
        axiomActivityLevels.current[key as AxiomKeySimple] = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(frameCount * (0.005 + index*0.001) + index * Math.PI / 2.5));
      });
      
      const baseHue = lerp(240, 330, currentEntropy); 
      drawNebulaLayer(ctx, `hsla(${baseHue}, 70%, ${lerp(15,5,currentEntropy)}%, 0.8)`, `hsla(${(baseHue + 30) % 360}, 60%, ${lerp(10,3,currentEntropy)}%, 0.6)`, 0.75, 0.7 + currentEntropy * 0.3, frameCount * 0.0005);
      drawNebulaLayer(ctx, `hsla(${(baseHue + 60) % 360}, 50%, ${lerp(20,8,currentEntropy)}%, 0.6)`, `hsla(${(baseHue + 90) % 360}, 40%, ${lerp(15,5,currentEntropy)}%, 0.4)`, 1.3, 0.5 + currentEntropy * 0.2, frameCount * 0.0008 + 0.5);
      
      drawStarfield(ctx);

      if (isFractalModeEnabled) {
        const maxDepth = 2 + Math.floor(currentEntropy * 5); 
        const initialLength = Math.min(width, height) * (0.12 - currentEntropy * 0.07);
        const initialAngle = frameCount * 0.0015 * (1 + currentEntropy * 0.3); 
        
        const numRoots = 2 + Math.floor(currentEntropy * 2.5);
        for(let i=0; i < numRoots; i++) {
             drawFractalBranch(
                ctx, width/2 + (Math.random()-0.5)*width*0.1*currentEntropy, height/2 + (Math.random()-0.5)*height*0.1*currentEntropy,
                initialAngle + (i * Math.PI*2 / numRoots),
                initialLength, 0, maxDepth, currentEntropy, baseHue, axiomActivityLevels.current, frameCount
             );
        }
      } else {
        const minSides = ritualVisualState === 'cascade' ? 3 : 4;
        const maxSides = ritualVisualState === 'cascade' ? 7 : 10;
        const sidesToUse = Math.floor(lerp(maxSides, minSides, clamp(currentEntropy, 0, 1)));
        const effectiveSides = Math.max(3, sidesToUse); 
        const effectiveInitialRotation = frameCount * 0.0008 * (1 + currentEntropy * 1.2); 
        drawGeometricStructure(ctx, axiomActivityLevels.current, effectiveSides, effectiveInitialRotation);
      }
      updateAndDrawWeaveParticles(ctx);
      
      if (isActivating && activationT < 1) {
        drawActivationEffect(ctx, activationT);
      }


      animationFrameIdRef.current = requestAnimationFrame(render);
    };

    animationFrameIdRef.current = requestAnimationFrame(render);
    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      weaveParticlesRef.current = []; // Clear particles on unmount/re-render
    };
  }, [width, height, currentEntropy, ritualVisualState, isFractalModeEnabled, drawFractalBranch, isActivating]);


  return (
    <div className="cosmic-entropy-geometry-panel bg-slate-950/90 backdrop-blur-md border border-purple-600/50 rounded-xl shadow-2xl p-6 my-8 text-slate-100 cursor-pointer" onClick={onClick}>
      <h2 className="text-2xl font-['Cinzel'] font-bold mb-4 text-center text-purple-300 drop-shadow-[0_1px_1px_rgba(220,180,255,0.4)]">
        Cosmic Entropy Geometry
      </h2>
      <div className="relative mx-auto" style={{ width: `${width}px`, height: `${height}px` }}>
        <canvas
          ref={canvasRef}
          className="rounded-lg border border-slate-700/30"
          aria-label="Generative art visualizing cosmic entropy and geometry"
          role="img"
        />
      </div>
      <div className="mt-3 text-center text-xs text-slate-400 font-mono">
        Entropy: {currentEntropy.toFixed(3)}δ | Ritual State: {ritualVisualState.toUpperCase()} | Mode: {isFractalModeEnabled ? 'BIO-FRACTAL PULSE' : 'AETHERIC WEAVE'}
      </div>
    </div>
  );
};

export default CosmicEntropyGeometryGenerator;