export interface Swimlane {
  id: string;
  name: string;
  color: string;
  order: number;
  visible: boolean;
}

export interface Block {
  id: string;
  swimlaneId: string;
  name: string;
  startTime: number;    // milliseconds
  duration: number;     // milliseconds
  color: string;
  category: string;
  description?: string;
  metadata?: Record<string, any>;
}

export interface Viewport {
  startTime: number;    // Visible time range start (milliseconds)
  endTime: number;      // Visible time range end (milliseconds)
  pixelsPerMs: number;  // Zoom level (pixels per millisecond)
  offsetX: number;      // Pan offset X in pixels
  offsetY: number;      // Pan offset Y in pixels
}

export interface InteractionState {
  draggingBlock: Block | null;
  resizingBlock: Block | null;
  resizeHandle: 'start' | 'end' | null;
  dragStartTime: number;
  dragStartX: number;
  dragStartY: number;
  originalBlockStartTime: number;
  originalBlockDuration: number;
  originalSwimlaneId: string;
}

export type ResizeHandle = 'start' | 'end' | null;
