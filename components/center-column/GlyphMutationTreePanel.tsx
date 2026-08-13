
import React from 'react';
import type { GlyphMutationNode as GlyphMutationNodeType } from '../../types';

interface PositionedNode extends GlyphMutationNodeType {
  x: number;
  y: number;
  depth: number;
}

type Props = {
  nodes: GlyphMutationNodeType[];
  title?: string;
};

const GlyphMutationTreePanel: React.FC<Props> = ({ nodes: initialNodes, title = "Glyph Mutation Tree" }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = React.useState({ width: 800, height: 400 }); // Adjusted default height

  React.useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        // Subtract padding (p-4 = 1rem = 16px on each side for width, 1rem top/bottom for height)
        // Title height (mb-4 = 1rem, text-xl ~24px) approx 24+16 = 40px
        const newWidth = containerRef.current.offsetWidth - 32; 
        const newHeight = Math.max(260, containerRef.current.offsetHeight - 32 - 40); // Min height for SVG, adjusted from 300
        
        setDimensions({
          width: newWidth > 0 ? newWidth : 300, // Ensure positive width
          height: newHeight > 0 ? newHeight: 260 // Ensure positive height
        });
      }
    };

    updateSize(); // Initial size
    window.addEventListener('resize', updateSize);
    const observer = new ResizeObserver(updateSize);
    if (containerRef.current) {
        observer.observe(containerRef.current);
    }
    return () => {
        window.removeEventListener('resize', updateSize);
        if (containerRef.current) {
            observer.unobserve(containerRef.current);
        }
    };
  }, []);


  const nodeRadius = 10;
  
  const { positionedNodes, links, svgHeight } = React.useMemo(() => {
    if (!initialNodes || initialNodes.length === 0 || dimensions.width <= 0 || dimensions.height <= 0) {
      return { positionedNodes: [], links: [], svgHeight: dimensions.height };
    }

    const nodesById: Record<string, GlyphMutationNodeType & { children: string[], depth: number }> = {};
    initialNodes.forEach(node => {
      nodesById[node.id] = { ...node, children: [], depth: -1 }; 
    });

    const roots: string[] = [];
    initialNodes.forEach(node => {
      if (node.parentId && nodesById[node.parentId]) {
        nodesById[node.parentId].children.push(node.id);
      } else {
        roots.push(node.id);
      }
    });

    const levels: Record<number, string[]> = {};
    let maxDepth = 0;

    function calculateDepths(nodeId: string, depth: number) {
      if (!nodesById[nodeId] || (nodesById[nodeId].depth !== -1 && nodesById[nodeId].depth <= depth)) return;

      nodesById[nodeId].depth = depth;
      if (!levels[depth]) levels[depth] = [];
      if (!levels[depth].includes(nodeId)) {
         levels[depth].push(nodeId);
      }
      maxDepth = Math.max(maxDepth, depth);
      nodesById[nodeId].children.forEach(childId => {
        if (nodesById[childId]) {
             calculateDepths(childId, depth + 1)
        }
      });
    }
    roots.forEach(rootId => calculateDepths(rootId, 0));
    
    const finalPositionedNodes: PositionedNode[] = [];
    const finalLinks: { source: PositionedNode, target: PositionedNode }[] = [];

    const effectivePadding = 60; // Increased for better edge clearance for labels
    const availableWidth = dimensions.width - 2 * effectivePadding;
    const availableHeight = dimensions.height - 2 * effectivePadding;
    
    const dynamicVerticalSpacing = (maxDepth > 0) ? (availableHeight / maxDepth) : availableHeight;

    Object.keys(levels).sort((a, b) => parseInt(a) - parseInt(b)).forEach(depthKey => {
      const depth = parseInt(depthKey);
      const nodesAtThisLevel = levels[depth];
      if (!nodesAtThisLevel) return;
      const countAtLevel = nodesAtThisLevel.length;
      
      nodesAtThisLevel.forEach((nodeId, index) => {
        const nodeData = nodesById[nodeId];
        if (!nodeData) return;

        const x = effectivePadding + (countAtLevel <= 1 ? availableWidth / 2 : (index * (availableWidth / (countAtLevel -1 || 1) )) );
        const y = effectivePadding + depth * dynamicVerticalSpacing;
        
        const pNode: PositionedNode = { ...nodeData, x, y, depth };
        finalPositionedNodes.push(pNode);

        if (nodeData.parentId) {
           const parentNode = finalPositionedNodes.find(n => n.id === nodeData.parentId); 
          if (parentNode) {
            finalLinks.push({ source: parentNode, target: pNode });
          }
        }
      });
    });
    
    const calculatedSvgHeight = (maxDepth * dynamicVerticalSpacing) + (2 * effectivePadding) + (nodeRadius * 2) + 20 + 30; // Added extra 30 for bottom text clearance

    return { positionedNodes: finalPositionedNodes, links: finalLinks, svgHeight: Math.max(dimensions.height, calculatedSvgHeight) };
  }, [initialNodes, dimensions.width, dimensions.height]);


  if (initialNodes.length === 0) {
    return (
      <div ref={containerRef} className="glyph-mutation-tree-panel bg-slate-900/90 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 shadow-lg text-slate-300 text-center min-h-[200px]">
        <h3 className="text-xl font-['Cinzel'] font-semibold mb-4 text-indigo-300">{title}</h3>
        <p>No glyph mutation data available.</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="glyph-mutation-tree-panel bg-slate-900/90 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 shadow-[0_0_30px_rgba(100,110,220,0.1)] min-h-[300px] h-[450px] overflow-hidden flex flex-col">
      <h3 className="text-xl font-['Cinzel'] font-semibold mb-4 text-center text-indigo-300">{title}</h3>
      <div className="flex-grow overflow-auto">
        <svg width={dimensions.width} height={svgHeight} aria-labelledby="tree-title" role="graphics-document">
          <title id="tree-title">{title} - Visualization of glyph evolution</title>
          <defs>
            <filter id="node-glow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComponentTransfer in="blur" result="boostedBlur">
                  <feFuncA type="linear" slope="1.5"/>
              </feComponentTransfer>
              <feMerge>
                <feMergeNode in="boostedBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <linearGradient id="mycelialThread" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsla(200, 80%, 60%, 0.6)" />
              <stop offset="50%" stopColor="hsla(220, 80%, 70%, 0.8)" />
              <stop offset="100%" stopColor="hsla(240, 80%, 60%, 0.6)" />
            </linearGradient>
          </defs>

          <g className="links">
            {links.map(link => (
              <path
                key={`link-${link.source.id}-${link.target.id}`}
                d={`M ${link.source.x} ${link.source.y} Q ${(link.source.x + link.target.x) / 2} ${(link.source.y + link.target.y) / 2 + (link.target.y - link.source.y)*0.2} ${link.target.x} ${link.target.y}`}
                stroke="url(#mycelialThread)"
                strokeWidth={1 + link.target.entropyLevel * 2.5}
                opacity={0.6}
                fill="none"
                className="transition-all duration-300 ease-in-out"
              />
            ))}
          </g>

          <g className="nodes">
            {positionedNodes.map(node => {
              const nodeColor = `hsla(${240 - node.entropyLevel * 240}, 80%, 65%, 1)`;
              const label = node.label || node.glyphId;
              const currentRadius = nodeRadius + node.entropyLevel * 4;
              const displayLabel = label.length > 15 ? label.substring(0, 13) + "..." : label;
              const numThorns = 6; // Number of thorns to display around the node

              return (
                <g 
                  key={node.id} 
                  transform={`translate(${node.x}, ${node.y})`} 
                  className="cursor-pointer group" 
                  role="treeitem" 
                  aria-label={`Glyph: ${label}, Entropy: ${node.entropyLevel.toFixed(2)}${node.hasSyntaxThorns ? ', Thorn-Grafted' : ''}`}
                  tabIndex={0}
                >
                  <title>{`Glyph: ${label}\nEntropy: ${node.entropyLevel.toFixed(2)}\nAgents: ${node.agentInfluences.join(', ')}\nTimestamp: ${new Date(node.timestamp).toLocaleString()}\nID: ${node.id}${node.hasSyntaxThorns ? '\nStatus: Thorn-Grafted' : ''}`}</title>
                  <circle
                    cx="0"
                    cy="0"
                    r={currentRadius}
                    fill={nodeColor}
                    stroke={node.hasSyntaxThorns ? 'rgba(255, 82, 82, 0.9)' : `hsla(${240 - node.entropyLevel * 240}, 80%, 85%, 0.7)`}
                    strokeWidth={node.hasSyntaxThorns ? 2 : 1.5}
                    filter="url(#node-glow)"
                    className="transition-all duration-300 ease-in-out group-hover:stroke-width-2.5"
                  />
                  {node.hasSyntaxThorns && [...Array(numThorns)].map((_, i) => {
                    const angle = (i / numThorns) * 2 * Math.PI;
                    const thornLength = currentRadius + 3;
                    const thornX = Math.cos(angle) * thornLength;
                    const thornY = Math.sin(angle) * thornLength;
                    return (
                       // Using Remixicon for thorns as text elements for better control
                      <text
                        key={`thorn-${i}`}
                        x={thornX}
                        y={thornY}
                        fontSize="8px"
                        fill="rgba(255, 100, 100, 0.9)"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="pointer-events-none"
                        transform={`rotate(${(angle * 180 / Math.PI) + 90} ${thornX} ${thornY})`} // Rotate icon to point outwards
                      >
                        <tspan className="ri-cactus-line"></tspan> 
                      </text>
                    );
                  })}
                  <circle 
                    cx="0"
                    cy="0"
                    r={currentRadius * 0.5}
                    fill="white"
                    opacity="0.1"
                    className="animate-pulse-fast pointer-events-none"
                  />
                  <text
                    x="0"
                    y={currentRadius + 14} 
                    textAnchor="middle"
                    fontSize="10px"
                    fill="rgba(230, 235, 245, 0.85)"
                    className="font-['Cinzel'] pointer-events-none select-none transition-opacity duration-300 group-hover:opacity-100 opacity-80"
                  >
                    {displayLabel}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
};

export default GlyphMutationTreePanel;
