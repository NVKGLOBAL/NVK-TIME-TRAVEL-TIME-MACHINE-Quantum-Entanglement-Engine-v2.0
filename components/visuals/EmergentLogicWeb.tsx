
import React, { useRef, useEffect, useMemo, useState, useCallback } from 'react';
import type { GlyphMutationNode, Axiom, RewovenGlyph, LogicGraphNode, LogicGraphEdge } from '../../types';
import { AgentName } from '../../types'; // Added for potential logging
import { AXIOM_DATA } from '../../constants';


interface EmergentLogicWebProps {
  glyphNodesData: GlyphMutationNode[];
  axiomsData: Axiom[];
  rewovenGlyphsData: RewovenGlyph[];
  width: number;
  height: number;
  activeNodeId?: string | null;
}

const NODE_REPULSION_STRENGTH = 0.5;
const EDGE_SPRING_STRENGTH = 0.01;
const DRAG_COEFFICIENT = 0.1; // Friction
const MAX_VELOCITY = 2;
const NODE_BASE_SIZE = 8;
const AXIOM_BASE_SIZE = 12;

const layerColors: Record<Axiom['layer'], string> = {
  'I': '#06b6d4',   // cyan-500
  'II': '#f59e0b',  // amber-500
  'III': '#8b5cf6', // violet-500
  'IV': '#ec4899',  // pink-500
  'V': '#d946ef',   // fuchsia-500
  'Ω': '#84cc16',   // lime-500
};


const EmergentLogicWeb: React.FC<EmergentLogicWebProps> = ({
  glyphNodesData,
  axiomsData,
  rewovenGlyphsData,
  width,
  height,
  activeNodeId,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [graphNodes, setGraphNodes] = useState<LogicGraphNode[]>([]);
  const [graphEdges, setGraphEdges] = useState<LogicGraphEdge[]>([]);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  
  // Process input data into graph nodes and edges
  useEffect(() => {
    const newNodes: LogicGraphNode[] = [];
    const newEdges: LogicGraphEdge[] = [];

    // Add Glyph Nodes
    glyphNodesData.forEach(gn => {
      newNodes.push({
        id: gn.id,
        type: 'glyph',
        label: gn.label || gn.glyphId,
        x: Math.random() * width,
        y: Math.random() * height,
        vx: 0, vy: 0,
        data: gn,
        color: `hsla(${240 - gn.entropyLevel * 180}, 70%, 60%, 1)`, // Blue (low E) to Red (high E)
        size: NODE_BASE_SIZE + gn.entropyLevel * 8,
        entropyLevel: gn.entropyLevel,
      });
      if (gn.parentId) {
        newEdges.push({
          id: `edge-mut-${gn.id}-${gn.parentId}`,
          sourceId: gn.parentId,
          targetId: gn.id,
          type: 'mutation',
          color: 'rgba(100, 116, 139, 0.5)', // slate-500
          strength: 0.8,
        });
      }
    });

    // Add Axiom Nodes
    axiomsData.forEach(ax => {
      newNodes.push({
        id: ax.id,
        type: 'axiom',
        label: ax.title,
        x: Math.random() * width,
        y: Math.random() * height,
        vx: 0, vy: 0,
        data: ax,
        color: layerColors[ax.layer] || '#a855f7', // purple-500 fallback
        size: AXIOM_BASE_SIZE + (ax.layer === 'Ω' ? 4 : 0),
        layer: ax.layer,
      });
    });
    
    // Add Edges for Rewoven Glyphs
    rewovenGlyphsData.forEach(rg => {
        newEdges.push({
            id: `edge-bind-${rg.baseGlyphId}-${rg.boundAxiomKey}`,
            sourceId: rg.boundAxiomKey, // Axiom is source
            targetId: rg.baseGlyphId,   // Glyph is target
            type: 'axiomBinding',
            color: 'rgba(34, 197, 94, 0.7)', // emerald-500
            strength: 1.0,
        });
    });

    setGraphNodes(newNodes);
    setGraphEdges(newEdges);

  }, [glyphNodesData, axiomsData, rewovenGlyphsData, width, height]);


  // Simple physics simulation
  const updateNodePositions = useCallback(() => {
    setGraphNodes(prevNodes => {
      const tempNodes = prevNodes.map(n => ({ ...n })); // Create mutable copies

      for (let i = 0; i < tempNodes.length; i++) {
        const nodeA = tempNodes[i];
        
        // Repulsion from other nodes
        for (let j = i + 1; j < tempNodes.length; j++) {
          const nodeB = tempNodes[j];
          const dx = nodeA.x - nodeB.x;
          const dy = nodeA.y - nodeB.y;
          const distanceSquared = dx * dx + dy * dy;
          const distance = Math.sqrt(distanceSquared) || 1; // avoid division by zero
          const force = NODE_REPULSION_STRENGTH / distanceSquared;
          
          const minDistance = (nodeA.size + nodeB.size) * 1.5;
          if (distance < minDistance) { // Stronger repulsion if too close
            const overlapForce = (minDistance - distance) * 0.05;
            nodeA.vx += (dx / distance) * (force + overlapForce);
            nodeA.vy += (dy / distance) * (force + overlapForce);
            nodeB.vx -= (dx / distance) * (force + overlapForce);
            nodeB.vy -= (dy / distance) * (force + overlapForce);
          } else {
            nodeA.vx += (dx / distance) * force;
            nodeA.vy += (dy / distance) * force;
            nodeB.vx -= (dx / distance) * force;
            nodeB.vy -= (dy / distance) * force;
          }
        }
      }

      // Attraction along edges
      graphEdges.forEach(edge => {
        const sourceNode = tempNodes.find(n => n.id === edge.sourceId);
        const targetNode = tempNodes.find(n => n.id === edge.targetId);
        if (sourceNode && targetNode) {
          const dx = targetNode.x - sourceNode.x;
          const dy = targetNode.y - sourceNode.y;
          const distance = Math.sqrt(dx * dx + dy * dy) || 1;
          
          const idealDistance = 100; // Ideal spring length
          const displacement = distance - idealDistance;
          const force = displacement * EDGE_SPRING_STRENGTH * (edge.strength || 0.5);

          sourceNode.vx += (dx / distance) * force;
          sourceNode.vy += (dy / distance) * force;
          targetNode.vx -= (dx / distance) * force;
          targetNode.vy -= (dy / distance) * force;
        }
      });

      // Update positions and apply drag/bounds
      return tempNodes.map(node => {
        node.vx *= (1 - DRAG_COEFFICIENT);
        node.vy *= (1 - DRAG_COEFFICIENT);

        // Clamp velocity
        const speed = Math.sqrt(node.vx * node.vx + node.vy * node.vy);
        if (speed > MAX_VELOCITY) {
            node.vx = (node.vx / speed) * MAX_VELOCITY;
            node.vy = (node.vy / speed) * MAX_VELOCITY;
        }

        node.x += node.vx;
        node.y += node.vy;

        // Keep nodes within canvas bounds (with padding)
        const padding = node.size * 2;
        node.x = Math.max(padding, Math.min(width - padding, node.x));
        node.y = Math.max(padding, Math.min(height - padding, node.y));
        
        return node;
      });
    });
  }, [graphEdges, width, height]);


  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || width === 0 || height === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = width;
    canvas.height = height;

    const draw = () => {
      updateNodePositions();
      ctx.clearRect(0, 0, width, height);

      // Draw edges
      graphEdges.forEach(edge => {
        const sourceNode = graphNodes.find(n => n.id === edge.sourceId);
        const targetNode = graphNodes.find(n => n.id === edge.targetId);
        if (sourceNode && targetNode) {
          ctx.beginPath();
          ctx.moveTo(sourceNode.x, sourceNode.y);
          ctx.lineTo(targetNode.x, targetNode.y);
          ctx.strokeStyle = edge.color || 'rgba(150, 150, 150, 0.3)';
          ctx.lineWidth = (edge.strength || 0.5) * 1.5;
          ctx.stroke();
        }
      });

      // Draw nodes
      graphNodes.forEach(node => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();

        if (node.id === hoveredNodeId || node.id === activeNodeId) {
          ctx.strokeStyle = '#bef264'; // lime-300 for highlight
          ctx.lineWidth = 2;
          ctx.stroke();
          // Draw label for hovered/active node
          ctx.fillStyle = 'rgba(240, 240, 255, 0.9)';
          ctx.font = '10px Cinzel, serif';
          ctx.textAlign = 'center';
          ctx.fillText(node.label, node.x, node.y - node.size - 4);
        }
      });
      animationFrameIdRef.current = requestAnimationFrame(draw);
    };

    animationFrameIdRef.current = requestAnimationFrame(draw);
    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [graphNodes, graphEdges, width, height, hoveredNodeId, activeNodeId, updateNodePositions]);

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    let foundNode: string | null = null;
    for (const node of graphNodes) {
      const dx = node.x - x;
      const dy = node.y - y;
      if (dx * dx + dy * dy < node.size * node.size) {
        foundNode = node.id;
        break;
      }
    }
    setHoveredNodeId(foundNode);
  };

  return (
    <div className="bg-slate-900/70 border border-slate-700/50 rounded-lg shadow-lg overflow-hidden" style={{width: '100%', height: `${height}px`}}>
        <canvas 
            ref={canvasRef} 
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoveredNodeId(null)}
            aria-label="Emergent Logic Web Visualization"
            role="img"
        />
    </div>
  );
};

export default EmergentLogicWeb;
