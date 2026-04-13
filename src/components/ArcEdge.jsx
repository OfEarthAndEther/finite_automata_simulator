import React from 'react';
import { BaseEdge, EdgeLabelRenderer } from 'reactflow';

export default function ArcEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style = {},
  markerEnd,
  label
}) {
  const mx = (sourceX + targetX) / 2;
  const my = (sourceY + targetY) / 2;
  const dx = targetX - sourceX;
  const dy = targetY - sourceY;

  const dist = Math.sqrt(dx * dx + dy * dy);

  // Normalizing orthogonal vector
  const nx = -dy / (dist || 1);
  const ny = dx / (dist || 1);

  // Curvature intensity
  const curveSize = 45;

  // Bezier Control point extended outward
  const cx = mx + nx * curveSize;
  const cy = my + ny * curveSize;

  // Render SVG Quadratic Bezier
  const path = `M ${sourceX} ${sourceY} Q ${cx} ${cy} ${targetX} ${targetY}`;

  // Evaluate the bezier midpoint formula for text placement
  // B(t) = (1-t)^2 P0 + 2(1-t)t P1 + t^2 P2. For t=0.5 => 0.25 P0 + 0.5 P1 + 0.25 P2
  const labelX = sourceX * 0.25 + cx * 0.5 + targetX * 0.25;
  const labelY = sourceY * 0.25 + cy * 0.5 + targetY * 0.25;

  return (
    <>
      <BaseEdge path={path} markerEnd={markerEnd} style={style} />
      {label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
              background: 'white',
              padding: '2px 4px',
              borderRadius: '6px',
              fontSize: 12,
              fontWeight: 'bold',
              border: '1px solid #e2e8f0',
              zIndex: 1000
            }}
            className="nodrag nopan"
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
