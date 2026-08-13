import React, { useRef, useEffect } from 'react';

interface DynamicTemporalBackgroundProps {
    watchFaceName: string;
}

const DynamicTemporalBackground: React.FC<DynamicTemporalBackgroundProps> = ({ watchFaceName }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        let animationFrameId: number;

        const render = (timestamp: number) => {
            const w = canvas.width;
            const h = canvas.height;
            const centerX = w / 2;
            const centerY = h / 2;

            ctx.clearRect(0, 0, w, h);

            // Default dark background
            ctx.fillStyle = '#050505';
            ctx.fillRect(0, 0, w, h);

            if (watchFaceName.includes('Quantum Singularity')) {
                // Dark purple/black hole background
                const grad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(w, h) * 0.8);
                grad.addColorStop(0, '#000');
                grad.addColorStop(0.3, '#0a001a');
                grad.addColorStop(0.7, '#1a0033');
                grad.addColorStop(1, '#000');
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, w, h);

                // Distant stars
                for (let i = 0; i < 100; i++) {
                    const x = (Math.sin(i * 123.45) * 0.5 + 0.5) * w;
                    const y = (Math.cos(i * 543.21) * 0.5 + 0.5) * h;
                    const size = Math.random() * 2;
                    const opacity = 0.2 + Math.sin(timestamp * 0.001 + i) * 0.2;
                    ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
                    ctx.beginPath();
                    ctx.arc(x, y, size, 0, Math.PI * 2);
                    ctx.fill();
                }
            } else if (watchFaceName.includes('Nebula Drift')) {
                // Drifting nebula clouds
                for (let i = 0; i < 5; i++) {
                    const x = centerX + Math.sin(timestamp * 0.0001 + i) * w * 0.3;
                    const y = centerY + Math.cos(timestamp * 0.00015 + i) * h * 0.3;
                    const grad = ctx.createRadialGradient(x, y, 0, x, y, Math.max(w, h) * 0.5);
                    const hue = (timestamp * 0.01 + i * 72) % 360;
                    grad.addColorStop(0, `hsla(${hue}, 80%, 20%, 0.15)`);
                    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
                    ctx.fillStyle = grad;
                    ctx.fillRect(0, 0, w, h);
                }
            } else if (watchFaceName.includes('Cyber Grid')) {
                // Retro grid background
                ctx.fillStyle = '#050010';
                ctx.fillRect(0, 0, w, h);

                ctx.strokeStyle = 'rgba(255, 0, 255, 0.1)';
                ctx.lineWidth = 1;
                const gridOffset = (timestamp * 0.05) % 50;
                
                // Horizontal lines
                for (let y = gridOffset; y < h; y += 50) {
                    ctx.beginPath();
                    ctx.moveTo(0, y);
                    ctx.lineTo(w, y);
                    ctx.stroke();
                }
                // Vertical lines
                for (let x = (timestamp * 0.02) % 50; x < w; x += 50) {
                    ctx.beginPath();
                    ctx.moveTo(x, 0);
                    ctx.lineTo(x, h);
                    ctx.stroke();
                }
            } else if (watchFaceName.includes('Clockwork')) {
                // Sepia/Bronze gears background
                ctx.fillStyle = '#1a130a';
                ctx.fillRect(0, 0, w, h);
                
                ctx.globalAlpha = 0.05;
                ctx.strokeStyle = '#ffd700';
                for (let i = 0; i < 10; i++) {
                    const x = (Math.sin(i * 99) * 0.5 + 0.5) * w;
                    const y = (Math.cos(i * 88) * 0.5 + 0.5) * h;
                    const r = 100 + Math.random() * 200;
                    ctx.beginPath();
                    ctx.arc(x, y, r, 0, Math.PI * 2);
                    ctx.stroke();
                    // Spokes
                    for (let j = 0; j < 8; j++) {
                        const angle = (j / 8) * Math.PI * 2 + timestamp * 0.0005 * (i % 2 === 0 ? 1 : -1);
                        ctx.beginPath();
                        ctx.moveTo(x, y);
                        ctx.lineTo(x + Math.cos(angle) * r, y + Math.sin(angle) * r);
                        ctx.stroke();
                    }
                }
                ctx.globalAlpha = 1;
            } else if (watchFaceName.includes('Aether Flow')) {
                // Flowing energy background
                ctx.fillStyle = '#000510';
                ctx.fillRect(0, 0, w, h);
                
                for (let i = 0; i < 8; i++) {
                    const angle = (i / 8) * Math.PI * 2 + timestamp * 0.0001;
                    const hue = (timestamp * 0.02 + i * 45) % 360;
                    ctx.strokeStyle = `hsla(${hue}, 100%, 50%, 0.05)`;
                    ctx.lineWidth = 20;
                    ctx.beginPath();
                    ctx.moveTo(centerX, centerY);
                    const cp1x = centerX + Math.cos(angle + 0.5) * w * 0.5;
                    const cp1y = centerY + Math.sin(angle + 0.5) * h * 0.5;
                    const cp2x = centerX + Math.cos(angle - 0.5) * w * 0.8;
                    const cp2y = centerY + Math.sin(angle - 0.5) * h * 0.8;
                    const endX = centerX + Math.cos(angle) * w;
                    const endY = centerY + Math.sin(angle) * h;
                    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);
                    ctx.stroke();
                }
            } else if (watchFaceName.includes('Binary')) {
                // Falling binary background
                ctx.fillStyle = '#000500';
                ctx.fillRect(0, 0, w, h);
                ctx.font = '10px monospace';
                ctx.fillStyle = 'rgba(0, 255, 0, 0.1)';
                for (let i = 0; i < 30; i++) {
                    const x = (i / 30) * w;
                    const y = (timestamp * (0.05 + Math.random() * 0.1) + i * 200) % h;
                    ctx.fillText(Math.random() > 0.5 ? '1' : '0', x, y);
                }
            } else if (watchFaceName.includes('Word Clock')) {
                // Floating letters background
                ctx.fillStyle = '#050505';
                ctx.fillRect(0, 0, w, h);
                ctx.font = '12px serif';
                ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
                const letters = 'TIMECHRONOSQUANTUMPASTFUTURE';
                for (let i = 0; i < 40; i++) {
                    const x = (Math.sin(i * 77) * 0.5 + 0.5) * w;
                    const y = (Math.cos(i * 66) * 0.5 + 0.5) * h;
                    ctx.fillText(letters[i % letters.length], x, y);
                }
            } else if (watchFaceName.includes('Orbital')) {
                // Orbital paths background
                ctx.fillStyle = '#000';
                ctx.fillRect(0, 0, w, h);
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
                for (let i = 1; i <= 5; i++) {
                    ctx.beginPath();
                    ctx.arc(centerX, centerY, i * 100, 0, Math.PI * 2);
                    ctx.stroke();
                }
            } else if (watchFaceName.includes('Fractal')) {
                // Fractal-like recursive squares background
                ctx.fillStyle = '#050010';
                ctx.fillRect(0, 0, w, h);
                ctx.strokeStyle = 'rgba(100, 0, 255, 0.1)';
                const drawRecursive = (x: number, y: number, size: number, depth: number) => {
                    if (depth > 3) return;
                    ctx.strokeRect(x - size / 2, y - size / 2, size, size);
                    const newSize = size * 0.5;
                    drawRecursive(x - newSize, y - newSize, newSize, depth + 1);
                    drawRecursive(x + newSize, y + newSize, newSize, depth + 1);
                }
                drawRecursive(centerX, centerY, 300 + Math.sin(timestamp * 0.001) * 50, 0);
            } else if (watchFaceName.includes('Spiral')) {
                // Spiral background
                ctx.fillStyle = '#050505';
                ctx.fillRect(0, 0, w, h);
                ctx.strokeStyle = 'rgba(0, 255, 255, 0.05)';
                ctx.beginPath();
                for (let i = 0; i < 500; i++) {
                    const angle = 0.1 * i + timestamp * 0.001;
                    const r = 2 * i;
                    const x = centerX + Math.cos(angle) * r;
                    const y = centerY + Math.sin(angle) * r;
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();
            } else if (watchFaceName.includes('Digital')) {
                // Digital/Matrix background
                ctx.fillStyle = '#000';
                ctx.fillRect(0, 0, w, h);
                ctx.fillStyle = 'rgba(0, 255, 255, 0.02)';
                for (let i = 0; i < 50; i++) {
                    const x = (i / 50) * w;
                    ctx.fillRect(x, 0, 1, h);
                }
                for (let i = 0; i < 30; i++) {
                    const y = (i / 30) * h;
                    ctx.fillRect(0, y, w, 1);
                }
            } else if (watchFaceName.includes('Classic')) {
                // Classic/Blueprint background
                ctx.fillStyle = '#001a33';
                ctx.fillRect(0, 0, w, h);
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
                ctx.lineWidth = 1;
                for (let i = 0; i < w; i += 50) {
                    ctx.beginPath();
                    ctx.moveTo(i, 0);
                    ctx.lineTo(i, h);
                    ctx.stroke();
                }
                for (let i = 0; i < h; i += 50) {
                    ctx.beginPath();
                    ctx.moveTo(0, i);
                    ctx.lineTo(w, i);
                    ctx.stroke();
                }
            } else if (watchFaceName.includes('Flower of Life') || watchFaceName.includes('Sacred') || watchFaceName.includes('Seed') || watchFaceName.includes('Vesica') || watchFaceName.includes('Metatron')) {
                // Sacred geometry background - subtle pulsing lattice
                ctx.fillStyle = '#000510';
                ctx.fillRect(0, 0, w, h);
                
                ctx.strokeStyle = 'rgba(0, 255, 255, 0.03)';
                ctx.lineWidth = 1;
                const r = 100;
                const pulse = 1 + Math.sin(timestamp * 0.001) * 0.05;
                for (let x = -r; x < w + r; x += r * 1.5) {
                    for (let y = -r; y < h + r; y += r * 0.866) {
                        ctx.beginPath();
                        ctx.arc(x + (y % (r * 1.732) === 0 ? 0 : r * 0.75), y, r * pulse, 0, Math.PI * 2);
                        ctx.stroke();
                    }
                }
            } else if (watchFaceName.includes('Binary Stream')) {
                // Matrix-like binary rain
                ctx.fillStyle = '#000800';
                ctx.fillRect(0, 0, w, h);
                ctx.font = '12px monospace';
                ctx.fillStyle = 'rgba(0, 255, 100, 0.15)';
                for (let i = 0; i < 40; i++) {
                    const x = (i / 40) * w;
                    const speed = 2 + Math.sin(i) * 1;
                    const y = (timestamp * speed * 0.05 + i * 100) % h;
                    ctx.fillText(Math.random() > 0.5 ? '1' : '0', x, y);
                }
            } else if (watchFaceName.includes('Celestial Pulse')) {
                // Pulsing celestial rings
                ctx.fillStyle = '#050010';
                ctx.fillRect(0, 0, w, h);
                ctx.strokeStyle = 'rgba(100, 200, 255, 0.1)';
                for (let i = 0; i < 5; i++) {
                    const r = (timestamp * 0.1 + i * 200) % (Math.max(w, h) * 0.8);
                    ctx.beginPath();
                    ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
                    ctx.stroke();
                }
            } else if (watchFaceName.includes('Deep Void')) {
                // Swirling void particles
                ctx.fillStyle = '#000';
                ctx.fillRect(0, 0, w, h);
                for (let i = 0; i < 100; i++) {
                    const angle = timestamp * 0.0005 + i * 0.1;
                    const r = 100 + i * 5;
                    const x = centerX + Math.cos(angle) * r;
                    const y = centerY + Math.sin(angle) * r;
                    ctx.fillStyle = `rgba(50, 50, 100, ${0.1 + Math.sin(timestamp * 0.001 + i) * 0.1})`;
                    ctx.beginPath();
                    ctx.arc(x, y, 2, 0, Math.PI * 2);
                    ctx.fill();
                }
            } else if (watchFaceName.includes('Fractal Pulse')) {
                // Expanding fractal squares
                ctx.fillStyle = '#0a001a';
                ctx.fillRect(0, 0, w, h);
                ctx.strokeStyle = 'rgba(200, 100, 255, 0.1)';
                for (let i = 0; i < 6; i++) {
                    const size = (timestamp * 0.15 + i * 150) % 900;
                    ctx.strokeRect(centerX - size / 2, centerY - size / 2, size, size);
                    ctx.save();
                    ctx.translate(centerX, centerY);
                    ctx.rotate(timestamp * 0.0002 + i);
                    ctx.strokeRect(-size / 4, -size / 4, size / 2, size / 2);
                    ctx.restore();
                }
            } else if (watchFaceName.includes('Glimmer Grid')) {
                // Shimmering grid
                ctx.fillStyle = '#000505';
                ctx.fillRect(0, 0, w, h);
                ctx.strokeStyle = 'rgba(0, 255, 200, 0.05)';
                for (let x = 0; x < w; x += 40) {
                    for (let y = 0; y < h; y += 40) {
                        const opacity = 0.02 + Math.sin(timestamp * 0.002 + (x + y) * 0.01) * 0.03;
                        ctx.fillStyle = `rgba(0, 255, 200, ${opacity})`;
                        ctx.fillRect(x, y, 38, 38);
                    }
                }
            } else if (watchFaceName.includes('Glitch Core')) {
                // Glitching horizontal bars
                ctx.fillStyle = '#050505';
                ctx.fillRect(0, 0, w, h);
                for (let i = 0; i < 10; i++) {
                    if (Math.random() > 0.9) {
                        ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255, 0, 0, 0.1)' : 'rgba(0, 255, 255, 0.1)';
                        ctx.fillRect(0, Math.random() * h, w, Math.random() * 50);
                    }
                }
            } else if (watchFaceName.includes('Luminous Grid')) {
                // Glowing grid intersections
                ctx.fillStyle = '#000';
                ctx.fillRect(0, 0, w, h);
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
                for (let x = 0; x < w; x += 60) {
                    for (let y = 0; y < h; y += 60) {
                        const pulse = Math.sin(timestamp * 0.001 + (x + y) * 0.005) * 0.5 + 0.5;
                        ctx.fillStyle = `rgba(255, 255, 255, ${pulse * 0.1})`;
                        ctx.beginPath();
                        ctx.arc(x, y, 2, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
            } else if (watchFaceName.includes('Neon Pulse')) {
                // Neon scanning lines
                ctx.fillStyle = '#050005';
                ctx.fillRect(0, 0, w, h);
                const scanY = (timestamp * 0.2) % h;
                const grad = ctx.createLinearGradient(0, scanY - 50, 0, scanY + 50);
                grad.addColorStop(0, 'rgba(255, 0, 255, 0)');
                grad.addColorStop(0.5, 'rgba(255, 0, 255, 0.2)');
                grad.addColorStop(1, 'rgba(255, 0, 255, 0)');
                ctx.fillStyle = grad;
                ctx.fillRect(0, scanY - 50, w, 100);
            } else if (watchFaceName.includes('Plasma Web')) {
                // Plasma-like organic connections
                ctx.fillStyle = '#000';
                ctx.fillRect(0, 0, w, h);
                ctx.strokeStyle = 'rgba(100, 100, 255, 0.1)';
                for (let i = 0; i < 20; i++) {
                    const x1 = centerX + Math.sin(timestamp * 0.0002 + i) * w * 0.4;
                    const y1 = centerY + Math.cos(timestamp * 0.0003 + i) * h * 0.4;
                    const x2 = centerX + Math.sin(timestamp * 0.0004 + i * 2) * w * 0.4;
                    const y2 = centerY + Math.cos(timestamp * 0.0001 + i * 2) * h * 0.4;
                    ctx.beginPath();
                    ctx.moveTo(x1, y1);
                    ctx.lineTo(x2, y2);
                    ctx.stroke();
                }
            } else if (watchFaceName.includes('Solar Flare')) {
                // Radiant solar energy
                const grad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(w, h) * 0.7);
                grad.addColorStop(0, '#331100');
                grad.addColorStop(0.5, '#1a0800');
                grad.addColorStop(1, '#000');
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, w, h);
                for (let i = 0; i < 36; i++) {
                    const angle = (i / 36) * Math.PI * 2 + timestamp * 0.0002;
                    const len = Math.max(w, h) * (0.4 + Math.sin(timestamp * 0.002 + i) * 0.1);
                    ctx.strokeStyle = 'rgba(255, 100, 0, 0.05)';
                    ctx.beginPath();
                    ctx.moveTo(centerX, centerY);
                    ctx.lineTo(centerX + Math.cos(angle) * len, centerY + Math.sin(angle) * len);
                    ctx.stroke();
                }
            } else if (watchFaceName.includes('Spectral Loom')) {
                // Woven spectral lines
                ctx.fillStyle = '#050505';
                ctx.fillRect(0, 0, w, h);
                for (let i = 0; i < 12; i++) {
                    const hue = (timestamp * 0.01 + i * 30) % 360;
                    ctx.strokeStyle = `hsla(${hue}, 70%, 50%, 0.05)`;
                    ctx.beginPath();
                    ctx.moveTo(0, (i / 12) * h + Math.sin(timestamp * 0.001 + i) * 50);
                    ctx.lineTo(w, (1 - i / 12) * h + Math.cos(timestamp * 0.001 + i) * 50);
                    ctx.stroke();
                }
            } else if (watchFaceName.includes('Void Prism')) {
                // Refracting void shards
                ctx.fillStyle = '#000';
                ctx.fillRect(0, 0, w, h);
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
                for (let i = 0; i < 8; i++) {
                    const angle = timestamp * 0.0003 + i * Math.PI / 4;
                    ctx.beginPath();
                    ctx.moveTo(centerX, centerY);
                    ctx.lineTo(centerX + Math.cos(angle) * w, centerY + Math.sin(angle) * h);
                    ctx.stroke();
                }
            } else if (watchFaceName.includes('Chrono Anchor')) {
                // Deep sea / Anchor background
                ctx.fillStyle = '#000510';
                ctx.fillRect(0, 0, w, h);
                ctx.strokeStyle = 'rgba(0, 100, 255, 0.1)';
                for (let i = 0; i < 10; i++) {
                    const y = (timestamp * 0.02 + i * 100) % h;
                    ctx.beginPath();
                    ctx.moveTo(0, y);
                    ctx.lineTo(w, y);
                    ctx.stroke();
                }
            } else if (watchFaceName.includes('Paradox Engine')) {
                // Red glowing gears background
                ctx.fillStyle = '#100000';
                ctx.fillRect(0, 0, w, h);
                ctx.strokeStyle = 'rgba(255, 0, 0, 0.05)';
                for (let i = 0; i < 5; i++) {
                    const r = 100 + i * 100;
                    const angle = timestamp * 0.0002 * (i % 2 === 0 ? 1 : -1);
                    ctx.beginPath();
                    ctx.arc(centerX, centerY, r, angle, angle + Math.PI);
                    ctx.stroke();
                }
            } else if (watchFaceName.includes('Timeline Integrity')) {
                // Green data streams
                ctx.fillStyle = '#000500';
                ctx.fillRect(0, 0, w, h);
                ctx.strokeStyle = 'rgba(0, 255, 0, 0.05)';
                for (let i = 0; i < 20; i++) {
                    const x = (i / 20) * w;
                    ctx.beginPath();
                    ctx.moveTo(x, 0);
                    ctx.lineTo(x, h);
                    ctx.stroke();
                }
            } else if (watchFaceName.includes('Quantum Entanglement')) {
                // Blue entangled lines
                ctx.fillStyle = '#000010';
                ctx.fillRect(0, 0, w, h);
                ctx.strokeStyle = 'rgba(0, 100, 255, 0.1)';
                for (let i = 0; i < 10; i++) {
                    const x1 = Math.sin(timestamp * 0.0001 + i) * w;
                    const y1 = Math.cos(timestamp * 0.0002 + i) * h;
                    const x2 = w - x1;
                    const y2 = h - y1;
                    ctx.beginPath();
                    ctx.moveTo(x1, y1);
                    ctx.lineTo(x2, y2);
                    ctx.stroke();
                }
            } else if (watchFaceName.includes('Void Navigator')) {
                // Starfield background
                ctx.fillStyle = '#000';
                ctx.fillRect(0, 0, w, h);
                for (let i = 0; i < 200; i++) {
                    const x = (Math.sin(i * 123) * 0.5 + 0.5) * w;
                    const y = (Math.cos(i * 456) * 0.5 + 0.5) * h;
                    const opacity = 0.1 + Math.sin(timestamp * 0.001 + i) * 0.1;
                    ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
                    ctx.beginPath();
                    ctx.arc(x, y, 1, 0, Math.PI * 2);
                    ctx.fill();
                }
            } else if (watchFaceName.includes('Axiom Scribe')) {
                // Golden glyphs background
                ctx.fillStyle = '#050500';
                ctx.fillRect(0, 0, w, h);
                ctx.font = '10px serif';
                ctx.fillStyle = 'rgba(255, 215, 0, 0.05)';
                for (let i = 0; i < 50; i++) {
                    const x = (Math.sin(i * 77) * 0.5 + 0.5) * w;
                    const y = (Math.cos(i * 66) * 0.5 + 0.5) * h;
                    ctx.fillText('ΑΒΓΔ', x, y);
                }
            } else if (watchFaceName.includes('Echo Scribe')) {
                // Fading white rings
                ctx.fillStyle = '#050505';
                ctx.fillRect(0, 0, w, h);
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
                for (let i = 0; i < 5; i++) {
                    const r = (timestamp * 0.05 + i * 100) % (Math.max(w, h) * 0.5);
                    ctx.beginPath();
                    ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
                    ctx.stroke();
                }
            } else if (watchFaceName.includes('Nexus Portal')) {
                // Purple swirl background
                ctx.fillStyle = '#050005';
                ctx.fillRect(0, 0, w, h);
                ctx.strokeStyle = 'rgba(150, 0, 255, 0.1)';
                for (let i = 0; i < 12; i++) {
                    const angle = (i / 12) * Math.PI * 2 + timestamp * 0.0001;
                    ctx.beginPath();
                    ctx.moveTo(centerX, centerY);
                    ctx.lineTo(centerX + Math.cos(angle) * w, centerY + Math.sin(angle) * h);
                    ctx.stroke();
                }
            } else if (watchFaceName.includes('Spiral Thread')) {
                // Magenta spiral background
                ctx.fillStyle = '#050005';
                ctx.fillRect(0, 0, w, h);
                ctx.strokeStyle = 'rgba(255, 0, 255, 0.05)';
                ctx.beginPath();
                for (let i = 0; i < 300; i++) {
                    const angle = 0.1 * i + timestamp * 0.0005;
                    const r = 3 * i;
                    const x = centerX + Math.cos(angle) * r;
                    const y = centerY + Math.sin(angle) * r;
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();
            } else if (watchFaceName.includes('Temporal Engine')) {
                // Yellow mechanical background
                ctx.fillStyle = '#050500';
                ctx.fillRect(0, 0, w, h);
                ctx.strokeStyle = 'rgba(255, 255, 0, 0.05)';
                for (let i = 0; i < 8; i++) {
                    const x = (i / 8) * w;
                    ctx.beginPath();
                    ctx.moveTo(x, 0);
                    ctx.lineTo(x, h);
                    ctx.stroke();
                }
            } else if (watchFaceName.includes('Singularity Core')) {
                // Cyan core background
                ctx.fillStyle = '#000505';
                ctx.fillRect(0, 0, w, h);
                const grad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(w, h) * 0.5);
                grad.addColorStop(0, 'rgba(0, 255, 255, 0.1)');
                grad.addColorStop(1, 'transparent');
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, w, h);
            } else if (watchFaceName.includes('Event Horizon')) {
                // Orange horizon background
                ctx.fillStyle = '#050200';
                ctx.fillRect(0, 0, w, h);
                const grad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(w, h) * 0.5);
                grad.addColorStop(0, 'rgba(255, 100, 0, 0.1)');
                grad.addColorStop(1, 'transparent');
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, w, h);
            } else if (watchFaceName.includes('Wormhole Stabilizer')) {
                // Blue stabilizer background
                ctx.fillStyle = '#000005';
                ctx.fillRect(0, 0, w, h);
                ctx.strokeStyle = 'rgba(0, 100, 255, 0.1)';
                for (let i = 0; i < 4; i++) {
                    const r = 100 + i * 150;
                    ctx.beginPath();
                    ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
                    ctx.stroke();
                }
            } else if (watchFaceName.includes('Causality Loop')) {
                // Magenta loop background
                ctx.fillStyle = '#050005';
                ctx.fillRect(0, 0, w, h);
                ctx.strokeStyle = 'rgba(255, 0, 255, 0.1)';
                ctx.beginPath();
                for (let i = 0; i < 100; i++) {
                    const t = (i / 100) * Math.PI * 2 + timestamp * 0.0005;
                    const x = centerX + Math.sin(t) * w * 0.4;
                    const y = centerY + Math.sin(2 * t) * h * 0.2;
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();
            } else if (watchFaceName.includes('Entropy Mirror')) {
                // Gray mirror background
                ctx.fillStyle = '#050505';
                ctx.fillRect(0, 0, w, h);
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
                ctx.beginPath();
                ctx.moveTo(0, centerY);
                ctx.lineTo(w, centerY);
                ctx.stroke();
            } else if (watchFaceName.includes('Reality Fragment')) {
                // White shard background
                ctx.fillStyle = '#000';
                ctx.fillRect(0, 0, w, h);
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
                for (let i = 0; i < 10; i++) {
                    const x = Math.random() * w;
                    const y = Math.random() * h;
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(x + 50, y + 50);
                    ctx.stroke();
                }
            } else if (watchFaceName.includes('Dimensional Rift')) {
                // Red rift background
                ctx.fillStyle = '#050000';
                ctx.fillRect(0, 0, w, h);
                ctx.strokeStyle = 'rgba(255, 0, 0, 0.1)';
                ctx.beginPath();
                ctx.moveTo(0, centerY);
                for (let x = 0; x < w; x += 20) {
                    ctx.lineTo(x, centerY + Math.sin(x * 0.01 + timestamp * 0.01) * 20);
                }
                ctx.stroke();
            } else if (watchFaceName.includes('Aetheric Compass')) {
                // Teal compass background
                ctx.fillStyle = '#000505';
                ctx.fillRect(0, 0, w, h);
                ctx.strokeStyle = 'rgba(0, 255, 255, 0.05)';
                ctx.beginPath();
                ctx.arc(centerX, centerY, 200, 0, Math.PI * 2);
                ctx.stroke();
            } else if (watchFaceName.includes('Celestial Clockwork')) {
                // Blue clockwork background
                ctx.fillStyle = '#000005';
                ctx.fillRect(0, 0, w, h);
                ctx.strokeStyle = 'rgba(0, 100, 255, 0.05)';
                for (let i = 0; i < 6; i++) {
                    const r = 50 + i * 80;
                    ctx.beginPath();
                    ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
                    ctx.stroke();
                }
            } else if (watchFaceName.includes('Quantum Flux')) {
                // Cyan flux background
                ctx.fillStyle = '#000';
                ctx.fillRect(0, 0, w, h);
                for (let i = 0; i < 50; i++) {
                    const x = Math.random() * w;
                    const y = Math.random() * h;
                    ctx.fillStyle = 'rgba(0, 255, 255, 0.05)';
                    ctx.beginPath();
                    ctx.arc(x, y, 1, 0, Math.PI * 2);
                    ctx.fill();
                }
            } else if (watchFaceName.includes('Temporal Prism')) {
                // Rainbow prism background
                ctx.fillStyle = '#000';
                ctx.fillRect(0, 0, w, h);
                for (let i = 0; i < 7; i++) {
                    const hue = (i / 7) * 360;
                    ctx.strokeStyle = `hsla(${hue}, 100%, 50%, 0.05)`;
                    ctx.beginPath();
                    ctx.moveTo(centerX, centerY);
                    ctx.lineTo(centerX + Math.cos(i) * w, centerY + Math.sin(i) * h);
                    ctx.stroke();
                }
            } else if (watchFaceName.includes('Void Pulse')) {
                // White pulse background
                ctx.fillStyle = '#000';
                ctx.fillRect(0, 0, w, h);
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
                for (let i = 0; i < 3; i++) {
                    const r = (timestamp * 0.03 + i * 150) % (Math.max(w, h) * 0.6);
                    ctx.beginPath();
                    ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
                    ctx.stroke();
                }
            } else if (watchFaceName.includes('Starlight Navigator')) {
                // Starry navigator background
                ctx.fillStyle = '#000';
                ctx.fillRect(0, 0, w, h);
                for (let i = 0; i < 100; i++) {
                    const x = Math.random() * w;
                    const y = Math.random() * h;
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
                    ctx.beginPath();
                    ctx.arc(x, y, 1, 0, Math.PI * 2);
                    ctx.fill();
                }
            } else if (watchFaceName.includes('Nexus Point')) {
                // Magenta nexus background
                ctx.fillStyle = '#050005';
                ctx.fillRect(0, 0, w, h);
                ctx.strokeStyle = 'rgba(255, 0, 255, 0.05)';
                for (let i = 0; i < 8; i++) {
                    const angle = (i / 8) * Math.PI * 2;
                    ctx.beginPath();
                    ctx.moveTo(centerX, centerY);
                    ctx.lineTo(centerX + Math.cos(angle) * w, centerY + Math.sin(angle) * h);
                    ctx.stroke();
                }
            } else if (watchFaceName.includes('Chrono Sphere')) {
                // Teal sphere background
                ctx.fillStyle = '#000505';
                ctx.fillRect(0, 0, w, h);
                const grad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(w, h) * 0.5);
                grad.addColorStop(0, 'rgba(0, 255, 255, 0.1)');
                grad.addColorStop(1, 'transparent');
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, w, h);
            } else if (watchFaceName.includes('Explorer')) {
                // Matrix-like scanning background
                ctx.fillStyle = '#000805';
                ctx.fillRect(0, 0, w, h);
                
                ctx.fillStyle = 'rgba(0, 255, 100, 0.05)';
                const scanLineY = (timestamp * 0.05) % h;
                ctx.fillRect(0, scanLineY, w, 2);
                
                for (let i = 0; i < 20; i++) {
                    const x = (i / 20) * w;
                    const y = (timestamp * (0.1 + Math.random() * 0.2) + i * 100) % h;
                    ctx.fillText(Math.random() > 0.5 ? '1' : '0', x, y);
                }
            } else {
                // Default Trisophian-like background
                ctx.fillStyle = '#0a0f1a';
                ctx.fillRect(0, 0, w, h);
                
                for (let i = 0; i < 50; i++) {
                    const x = (Math.sin(i * 123.45) * 0.5 + 0.5) * w;
                    const y = (Math.cos(i * 543.21) * 0.5 + 0.5) * h;
                    const size = Math.random() * 2 + 1;
                    const opacity = 0.1 + Math.sin(timestamp * 0.001 + i) * 0.1;
                    ctx.fillStyle = `rgba(100, 200, 255, ${opacity})`;
                    ctx.beginPath();
                    ctx.arc(x, y, size, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            animationFrameId = requestAnimationFrame(render);
        };

        render(0);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, [watchFaceName]);

    return <canvas ref={canvasRef} className="fixed inset-0 z-[-1] pointer-events-none" />;
};

export default DynamicTemporalBackground;
