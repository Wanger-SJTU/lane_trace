import { useEffect, useRef, useState } from 'react';
import { useSwimlaneStore } from '../../store/swimlaneStore';
import { useTimeTransform } from '../../hooks/useTimeTransform';
import { useCanvasInteraction } from '../../hooks/useCanvasInteraction';
import { renderCanvas } from '../../utils/CanvasRenderer';
import { Block } from '../../types/swimlane';

export const SwimlaneCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();
  const [hoveredBlock, setHoveredBlock] = useState<Block | null>(null);

  const { swimlanes, blocks, viewport, selectedBlockId } = useSwimlaneStore();
  const { timeToPixel, getSwimlaneY, pixelToTime, getSwimlaneOrderFromY } = useTimeTransform();

  // Set up canvas interactions
  useCanvasInteraction({
    canvasRef,
  });

  // Handle canvas resizing
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    resizeCanvas();

    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Handle mouse hover
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const time = pixelToTime(x);
      const swimlaneOrder = getSwimlaneOrderFromY(y);
      const swimlane = swimlanes.find((s) => s.order === swimlaneOrder);

      if (swimlane) {
        const block = blocks.find(
          (b) =>
            b.swimlaneId === swimlane.id &&
            time >= b.startTime &&
            time <= b.startTime + b.duration
        );
        setHoveredBlock(block || null);
      } else {
        setHoveredBlock(null);
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [swimlanes, blocks]);

  // Render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      renderCanvas({
        ctx,
        viewport,
        swimlanes,
        blocks,
        canvasWidth: canvas.width,
        canvasHeight: canvas.height,
        hoveredBlock,
        selectedBlockId,
        timeToPixel,
        getSwimlaneY,
      });

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [viewport, swimlanes, blocks, hoveredBlock, selectedBlockId, timeToPixel, getSwimlaneY]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative overflow-hidden"
      style={{ height: 'calc(100vh - 60px)' }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ cursor: 'default' }}
      />

      {/* Help text overlay */}
      {swimlanes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80">
          <div className="text-center text-gray-600">
            <p className="text-xl mb-2">No swimlanes yet</p>
            <p className="text-sm">Click "Add Swimlane" to get started</p>
          </div>
        </div>
      )}
    </div>
  );
};
