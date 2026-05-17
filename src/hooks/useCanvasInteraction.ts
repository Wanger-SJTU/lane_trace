import { useRef, useCallback, useEffect } from 'react';
import { useSwimlaneStore } from '../store/swimlaneStore';
import { useTimeTransform } from './useTimeTransform';
import { Block } from '../types/swimlane';

interface CanvasInteractionOptions {
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

const RESIZE_HANDLE_SIZE = 8;

export const useCanvasInteraction = ({
  canvasRef,
}: CanvasInteractionOptions) => {
  const {
    blocks,
    swimlanes,
    interaction,
    startDragBlock,
    startResizeBlock,
    updateInteraction,
    endInteraction,
    pan,
    setSelectedBlock,
    addBlock,
  } = useSwimlaneStore();

  const { timeToPixel, pixelToTime, getSwimlaneOrderFromY, getSwimlaneY } =
    useTimeTransform();

  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  // Check if point is in a block
  const getBlockAtPoint = useCallback((x: number, y: number): Block | null => {
    const time = pixelToTime(x);

    // Find which swimlane we're in
    const swimlaneOrder = getSwimlaneOrderFromY(y);
    const swimlane = swimlanes.find((s) => s.order === swimlaneOrder);

    if (!swimlane) return null;

    // Find block in this swimlane at this time
    return blocks.find(
      (block) =>
        block.swimlaneId === swimlane.id &&
        time >= block.startTime &&
        time <= block.startTime + block.duration
    ) || null;
  }, [blocks, swimlanes, pixelToTime, getSwimlaneOrderFromY]);

  // Check if point is on a resize handle
  const getResizeHandle = useCallback((
    x: number,
    y: number,
    block: Block
  ): 'start' | 'end' | null => {
    const blockStartX = timeToPixel(block.startTime);
    const blockEndX = timeToPixel(block.startTime + block.duration);
    const blockY = getSwimlaneY(
      swimlanes.find((s) => s.id === block.swimlaneId)?.order || 0
    );

    // Check if we're within the block's vertical range
    const SWIMLANE_HEIGHT = 60;
    if (y < blockY || y > blockY + SWIMLANE_HEIGHT) {
      return null;
    }

    // Check if we're near the start edge
    if (Math.abs(x - blockStartX) < RESIZE_HANDLE_SIZE) {
      return 'start';
    }

    // Check if we're near the end edge
    if (Math.abs(x - blockEndX) < RESIZE_HANDLE_SIZE) {
      return 'end';
    }

    return null;
  }, [timeToPixel, getSwimlaneY, swimlanes]);

  // Get target swimlane from Y coordinate
  const getTargetSwimlaneId = useCallback((y: number): string | undefined => {
    const swimlaneOrder = getSwimlaneOrderFromY(y);
    const swimlane = swimlanes.find((s) => s.order === swimlaneOrder);
    return swimlane?.id;
  }, [swimlanes, getSwimlaneOrderFromY]);

  // Handle mouse down
  const handleMouseDown = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    lastMousePosRef.current = { x, y };

    const block = getBlockAtPoint(x, y);

    if (block) {
      const resizeHandle = getResizeHandle(x, y, block);

      if (resizeHandle) {
        // Start resizing
        startResizeBlock(block, resizeHandle, x, y);
      } else {
        // Start dragging
        startDragBlock(block, x, y);
        setSelectedBlock(block.id);
      }
    } else {
      // Background click - could start panning or deselect
      setSelectedBlock(null);

      // Store for potential panning
      isDraggingRef.current = true;
    }
  }, [
    canvasRef,
    getBlockAtPoint,
    getResizeHandle,
    startResizeBlock,
    startDragBlock,
    setSelectedBlock,
  ]);

  // Handle mouse move
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Update cursor style
    const block = getBlockAtPoint(x, y);
    if (block) {
      const resizeHandle = getResizeHandle(x, y, block);
      if (resizeHandle) {
        canvas.style.cursor = resizeHandle === 'start' ? 'w-resize' : 'e-resize';
      } else {
        canvas.style.cursor = 'grab';
      }
    } else {
      canvas.style.cursor = isDraggingRef.current ? 'grabbing' : 'default';
    }

    // Handle interaction
    if (interaction.draggingBlock || interaction.resizingBlock) {
      const targetSwimlaneId = getTargetSwimlaneId(y);
      updateInteraction(x, y, targetSwimlaneId);
    } else if (isDraggingRef.current) {
      // Pan the canvas
      const deltaX = x - lastMousePosRef.current.x;
      const deltaY = y - lastMousePosRef.current.y;
      pan(deltaX, deltaY);
      lastMousePosRef.current = { x, y };
    }
  }, [
    canvasRef,
    getBlockAtPoint,
    getResizeHandle,
    interaction,
    getTargetSwimlaneId,
    updateInteraction,
    pan,
  ]);

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
    endInteraction();
  }, [endInteraction]);

  // Handle mouse wheel (vertical pan)
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Vertical panning
    const deltaY = e.deltaY;
    pan(0, deltaY);
  }, [canvasRef, pan]);

  // Handle double click (create new block)
  const handleDoubleClick = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const targetSwimlaneId = getTargetSwimlaneId(y);

    if (targetSwimlaneId) {
      const time = pixelToTime(x);
      addBlock(targetSwimlaneId, {
        name: 'New Block',
        startTime: time,
        duration: 1000,
      });
    }
  }, [canvasRef, getTargetSwimlaneId, pixelToTime, addBlock]);

  // Set up event listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseUp);
    canvas.addEventListener('wheel', handleWheel, { passive: false });
    canvas.addEventListener('dblclick', handleDoubleClick);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseUp);
      canvas.removeEventListener('wheel', handleWheel);
      canvas.removeEventListener('dblclick', handleDoubleClick);
    };
  }, [
    canvasRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleWheel,
    handleDoubleClick,
  ]);

  return {
    isDragging: isDraggingRef.current,
    isInteracting: !!(interaction.draggingBlock || interaction.resizingBlock),
  };
};
