import { useMemo } from 'react';
import { useSwimlaneStore } from '../store/swimlaneStore';

const SWIMLANE_LABEL_WIDTH = 150;
const SWIMLANE_HEIGHT = 60;
const TIME_SCALE_HEIGHT = 40;

export const useTimeTransform = () => {
  const { viewport } = useSwimlaneStore();

  // Convert time (milliseconds) to X pixel coordinate
  const timeToPixel = useMemo(() => {
    return (time: number): number => {
      return (time - viewport.startTime) * viewport.pixelsPerMs + viewport.offsetX;
    };
  }, [viewport.startTime, viewport.pixelsPerMs, viewport.offsetX]);

  // Convert X pixel coordinate to time (milliseconds)
  const pixelToTime = useMemo(() => {
    return (pixel: number): number => {
      return (pixel - viewport.offsetX) / viewport.pixelsPerMs + viewport.startTime;
    };
  }, [viewport.offsetX, viewport.pixelsPerMs, viewport.startTime]);

  // Get Y pixel coordinate for a swimlane
  const getSwimlaneY = useMemo(() => {
    return (swimlaneOrder: number): number => {
      return viewport.offsetY + swimlaneOrder * SWIMLANE_HEIGHT;
    };
  }, [viewport.offsetY]);

  // Get swimlane order from Y pixel coordinate
  const getSwimlaneOrderFromY = useMemo(() => {
    return (y: number): number => {
      return Math.floor((y - viewport.offsetY) / SWIMLANE_HEIGHT);
    };
  }, [viewport.offsetY]);

  // Format time for display
  const formatTime = useMemo(() => {
    return (time: number): string => {
      const seconds = Math.floor(time / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const milliseconds = time % 1000;

      if (hours > 0) {
        return `${hours}:${(minutes % 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
      } else if (minutes > 0) {
        return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
      } else {
        return `${seconds}.${milliseconds.toString().padStart(3, '0')}s`;
      }
    };
  }, []);

  // Format duration for display
  const formatDuration = useMemo(() => {
    return (duration: number): string => {
      if (duration < 1000) {
        return `${duration.toFixed(0)}ms`;
      } else if (duration < 60000) {
        return `${(duration / 1000).toFixed(2)}s`;
      } else {
        const minutes = Math.floor(duration / 60000);
        const seconds = ((duration % 60000) / 1000).toFixed(0);
        return `${minutes}m ${seconds}s`;
      }
    };
  }, []);

  // Snap time to grid
  const snapToGrid = useMemo(() => {
    return (time: number, gridSize: number = 100): number => {
      return Math.round(time / gridSize) * gridSize;
    };
  }, []);

  // Get appropriate grid size based on zoom level
  const getGridSize = useMemo(() => {
    return (): number => {
      const pixelsPerMs = viewport.pixelsPerMs;

      if (pixelsPerMs > 1) {
        return 1; // 1ms grid
      } else if (pixelsPerMs > 0.1) {
        return 10; // 10ms grid
      } else if (pixelsPerMs > 0.01) {
        return 100; // 100ms grid
      } else if (pixelsPerMs > 0.001) {
        return 1000; // 1 second grid
      } else {
        return 10000; // 10 second grid
      }
    };
  }, [viewport.pixelsPerMs]);

  // Get visible time range
  const getVisibleTimeRange = useMemo(() => {
    return () => {
      return {
        start: viewport.startTime,
        end: viewport.endTime,
      };
    };
  }, [viewport.startTime, viewport.endTime]);

  return {
    timeToPixel,
    pixelToTime,
    getSwimlaneY,
    getSwimlaneOrderFromY,
    formatTime,
    formatDuration,
    snapToGrid,
    getGridSize,
    getVisibleTimeRange,
    constants: {
      SWIMLANE_LABEL_WIDTH,
      SWIMLANE_HEIGHT,
      TIME_SCALE_HEIGHT,
    },
  };
};
