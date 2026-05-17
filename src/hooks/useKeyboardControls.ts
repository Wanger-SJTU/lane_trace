import { useEffect, useRef } from 'react';
import { useSwimlaneStore } from '../store/swimlaneStore';

interface KeyboardControlsOptions {
  enabled?: boolean;
  panSpeed?: number;
  zoomSpeed?: number;
}

export const useKeyboardControls = ({
  enabled = true,
  panSpeed = 10,
  zoomSpeed = 0.1,
}: KeyboardControlsOptions = {}) => {
  const keysPressed = useRef<Set<string>>(new Set());
  const animationFrameRef = useRef<number>();
  const pan = useSwimlaneStore((state) => state.pan);
  const zoom = useSwimlaneStore((state) => state.zoom);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if (e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement) {
        return;
      }

      keysPressed.current.add(e.key.toLowerCase());
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key.toLowerCase());
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    const updateLoop = () => {
      const keys = keysPressed.current;
      let deltaX = 0;
      let deltaY = 0;
      let zoomDelta = 0;

      // W/S for zoom (in/out)
      if (keys.has('w')) {
        zoomDelta = 1 + zoomSpeed; // zoom in
      }
      if (keys.has('s')) {
        zoomDelta = 1 - zoomSpeed; // zoom out
      }

      // A/D for horizontal panning (right/left)
      if (keys.has('a')) {
        deltaX += panSpeed;
      }
      if (keys.has('d')) {
        deltaX -= panSpeed;
      }

      // Arrow keys as alternatives
      if (keys.has('arrowup')) {
        zoomDelta = 1 + zoomSpeed; // zoom in
      }
      if (keys.has('arrowdown')) {
        zoomDelta = 1 - zoomSpeed; // zoom out
      }
      if (keys.has('arrowleft')) {
        deltaX -= panSpeed;  // 保持原样：左箭头向左
      }
      if (keys.has('arrowright')) {
        deltaX += panSpeed;  // 保持原样：右箭头向右
      }

      // Apply panning
      if (deltaX !== 0 || deltaY !== 0) {
        pan(deltaX, deltaY);
      }

      // Apply zooming
      if (zoomDelta !== 0) {
        zoom(zoomDelta);
      }

      animationFrameRef.current = requestAnimationFrame(updateLoop);
    };

    animationFrameRef.current = requestAnimationFrame(updateLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [enabled, panSpeed, zoomSpeed, pan, zoom]);

  return {
    isActive: keysPressed.current.size > 0,
  };
};
