import React from 'react';
import { BaseEdge, EdgeLabelRenderer } from 'reactflow';

export default function SelfLoopEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  label
}) {
  // To draw a perfect loop that DOES NOT pierce the node, we will create a dedicated circular path
  // starting at the top of the node and looping upwards, irrespective of the exact handle clicked.

  // We approximate the top of the node by adjusting from the provided source coordinates. 
  // We will force the loop to be an arch above the node.
  const loopWidth = 40;
  const loopHeight = 50;

  // Since sourceX/sourceY might be from any handle, we'll just create a loop path strictly going "up and around".
  // A cubic bezier curve originating at the coordinate, bursting up and right, looping over to up and left, and returning.
  const path = `M ${sourceX} ${sourceY} C ${sourceX + loopWidth} ${sourceY - loopHeight}, ${sourceX - loopWidth} ${sourceY - loopHeight}, ${targetX} ${targetY}`;

  // Placing label approximately at the peak of the loop.
  const labelX = (sourceX + targetX) / 2;
  const labelY = Math.min(sourceY, targetY) - loopHeight + 10;

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
              borderRadius: '4px',
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
