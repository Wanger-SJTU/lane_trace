import { create } from 'zustand';
import { Swimlane, Block, Viewport, InteractionState } from '../types/swimlane';

interface SwimlaneStore {
  // State
  swimlanes: Swimlane[];
  blocks: Block[];
  viewport: Viewport;
  interaction: InteractionState;
  selectedBlockId: string | null;
  categories: string[];

  // Swimlane actions
  addSwimlane: (name: string, color?: string) => void;
  updateSwimlane: (id: string, updates: Partial<Swimlane>) => void;
  deleteSwimlane: (id: string) => void;
  clearAll: () => void;

  // Block actions
  addBlock: (swimlaneId: string, props: Partial<Block>) => void;
  updateBlock: (id: string, updates: Partial<Block>) => void;
  deleteBlock: (id: string) => void;
  setSelectedBlock: (id: string | null) => void;

  // Viewport actions
  setViewport: (viewport: Partial<Viewport>) => void;
  pan: (deltaX: number, deltaY: number) => void;
  zoom: (scaleFactor: number, centerPoint?: { x: number; y: number }) => void;
  resetView: () => void;

  // Interaction actions
  startDragBlock: (block: Block, startX: number, startY: number) => void;
  startResizeBlock: (block: Block, handle: 'start' | 'end', startX: number, startY: number) => void;
  updateInteraction: (currentX: number, currentY: number, targetSwimlaneId?: string) => void;
  endInteraction: () => void;

  // Category actions
  addCategory: (category: string) => void;

  // Persistence actions
  exportToJSON: () => string;
  importFromJSON: (json: string) => boolean;
  saveToLocalStorage: () => void;
  loadFromLocalStorage: () => void;
  importFromJSONv2: (data: any) => boolean;
}

const SWIMLANE_LABEL_WIDTH = 150;
const DEFAULT_DURATION = 1000; // 1 second

export const useSwimlaneStore = create<SwimlaneStore>((set, get) => ({
  // Initial state
  swimlanes: [],
  blocks: [],
  viewport: {
    startTime: 0,
    endTime: 10000,
    pixelsPerMs: 0.1,
    offsetX: SWIMLANE_LABEL_WIDTH,
    offsetY: 40,
  },
  interaction: {
    draggingBlock: null,
    resizingBlock: null,
    resizeHandle: null,
    dragStartTime: 0,
    dragStartX: 0,
    dragStartY: 0,
    originalBlockStartTime: 0,
    originalBlockDuration: 0,
    originalSwimlaneId: '',
  },
  selectedBlockId: null,
  categories: ['default', 'database', 'api', 'frontend', 'backend', 'cache'],

  // Swimlane actions
  addSwimlane: (name, color) => {
    const colors = [
      '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b',
      '#10b981', '#06b6d4', '#6366f1', '#f97316'
    ];

    const newSwimlane: Swimlane = {
      id: `swimlane-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      color: color || colors[get().swimlanes.length % colors.length],
      order: get().swimlanes.length,
      visible: true,
    };

    set((state) => ({
      swimlanes: [...state.swimlanes, newSwimlane],
      viewport: {
        ...state.viewport,
        endTime: Math.max(state.viewport.endTime, DEFAULT_DURATION),
      },
    }));
  },

  updateSwimlane: (id, updates) => {
    set((state) => ({
      swimlanes: state.swimlanes.map((s) =>
        s.id === id ? { ...s, ...updates } : s
      ),
    }));
  },

  deleteSwimlane: (id) => {
    set((state) => ({
      swimlanes: state.swimlanes.filter((s) => s.id !== id),
      blocks: state.blocks.filter((b) => b.swimlaneId !== id),
    }));
  },

  clearAll: () => {
    set({
      swimlanes: [],
      blocks: [],
      selectedBlockId: null,
    });
  },

  // Block actions
  addBlock: (swimlaneId, props) => {
    const { viewport } = get();
    const categoryColors: Record<string, string> = {
      default: '#3b82f6',
      database: '#10b981',
      api: '#8b5cf6',
      frontend: '#f59e0b',
      backend: '#ec4899',
      cache: '#06b6d4',
    };

    const category = props.category || 'default';

    const newBlock: Block = {
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      swimlaneId,
      name: props.name || 'New Block',
      startTime: props.startTime || viewport.startTime,
      duration: props.duration || DEFAULT_DURATION,
      color: props.color || categoryColors[category] || categoryColors.default,
      category,
      description: props.description,
      metadata: props.metadata,
    };

    set((state) => ({
      blocks: [...state.blocks, newBlock],
    }));
  },

  updateBlock: (id, updates) => {
    set((state) => ({
      blocks: state.blocks.map((b) =>
        b.id === id ? { ...b, ...updates } : b
      ),
    }));
  },

  deleteBlock: (id) => {
    set((state) => ({
      blocks: state.blocks.filter((b) => b.id !== id),
      selectedBlockId: state.selectedBlockId === id ? null : state.selectedBlockId,
    }));
  },

  setSelectedBlock: (id) => {
    set({ selectedBlockId: id });
  },

  // Viewport actions
  setViewport: (viewport) => {
    set((state) => ({
      viewport: { ...state.viewport, ...viewport },
    }));
  },

  pan: (deltaX, deltaY) => {
    set((state) => {
      const { viewport } = state;
      const deltaTime = -deltaX / viewport.pixelsPerMs;

      return {
        viewport: {
          ...viewport,
          startTime: Math.max(0, viewport.startTime + deltaTime),
          endTime: Math.max(0, viewport.endTime + deltaTime),
          offsetX: Math.max(SWIMLANE_LABEL_WIDTH, viewport.offsetX + deltaX),
          offsetY: viewport.offsetY + deltaY,
        },
      };
    });
  },

  zoom: (scaleFactor, centerPoint) => {
    set((state) => {
      const { viewport } = state;
      const newPixelsPerMs = Math.max(0.001, Math.min(10, viewport.pixelsPerMs * scaleFactor));

      // If center point is provided, zoom towards that point
      if (centerPoint) {
        const timeAtCenter = (centerPoint.x - viewport.offsetX) / viewport.pixelsPerMs + viewport.startTime;
        const newOffsetX = centerPoint.x - timeAtCenter * newPixelsPerMs;

        return {
          viewport: {
            ...viewport,
            pixelsPerMs: newPixelsPerMs,
            offsetX: newOffsetX,
          },
        };
      }

      // Otherwise, zoom center of viewport
      const centerTime = (viewport.startTime + viewport.endTime) / 2;
      const viewportWidth = (viewport.endTime - viewport.startTime) / scaleFactor;
      const newStartTime = centerTime - viewportWidth / 2;
      const newEndTime = centerTime + viewportWidth / 2;

      return {
        viewport: {
          ...viewport,
          startTime: Math.max(0, newStartTime),
          endTime: newEndTime,
          pixelsPerMs: newPixelsPerMs,
        },
      };
    });
  },

  resetView: () => {
    set((state) => {
      const minTime = Math.min(...state.blocks.map(b => b.startTime), 0);
      const maxTime = Math.max(...state.blocks.map(b => b.startTime + b.duration), 10000);

      return {
        viewport: {
          startTime: minTime,
          endTime: maxTime + 1000,
          pixelsPerMs: 0.1,
          offsetX: SWIMLANE_LABEL_WIDTH,
          offsetY: 40,
        },
      };
    });
  },

  // Interaction actions
  startDragBlock: (block, startX, startY) => {
    set((state) => ({
      interaction: {
        ...state.interaction,
        draggingBlock: block,
        dragStartX: startX,
        dragStartY: startY,
        originalBlockStartTime: block.startTime,
        originalBlockDuration: block.duration,
        originalSwimlaneId: block.swimlaneId,
      },
    }));
  },

  startResizeBlock: (block, handle, startX, startY) => {
    set((state) => ({
      interaction: {
        ...state.interaction,
        resizingBlock: block,
        resizeHandle: handle,
        dragStartX: startX,
        dragStartY: startY,
        originalBlockStartTime: block.startTime,
        originalBlockDuration: block.duration,
        originalSwimlaneId: block.swimlaneId,
      },
    }));
  },

  updateInteraction: (currentX, _currentY, targetSwimlaneId) => {
    const { interaction, viewport } = get();
    const deltaTime = (currentX - interaction.dragStartX) / viewport.pixelsPerMs;

    if (interaction.draggingBlock) {
      const newStartTime = Math.max(0, interaction.originalBlockStartTime + deltaTime);
      const swimlaneId = targetSwimlaneId || interaction.originalSwimlaneId;

      set((state) => ({
        blocks: state.blocks.map((b) =>
          b.id === interaction.draggingBlock?.id
            ? { ...b, startTime: newStartTime, swimlaneId }
            : b
        ),
      }));
    }

    if (interaction.resizingBlock && interaction.resizeHandle) {
      const minDuration = 10; // 10ms minimum

      if (interaction.resizeHandle === 'end') {
        const newDuration = Math.max(
          minDuration,
          interaction.originalBlockDuration + deltaTime
        );

        set((state) => ({
          blocks: state.blocks.map((b) =>
            b.id === interaction.resizingBlock?.id
              ? { ...b, duration: newDuration }
              : b
          ),
        }));
      } else if (interaction.resizeHandle === 'start') {
        const newStartTime = Math.max(0, interaction.originalBlockStartTime + deltaTime);
        const newDuration = Math.max(
          minDuration,
          interaction.originalBlockDuration - (newStartTime - interaction.originalBlockStartTime)
        );

        set((state) => ({
          blocks: state.blocks.map((b) =>
            b.id === interaction.resizingBlock?.id
              ? { ...b, startTime: newStartTime, duration: newDuration }
              : b
          ),
        }));
      }
    }
  },

  endInteraction: () => {
    set((state) => ({
      interaction: {
        ...state.interaction,
        draggingBlock: null,
        resizingBlock: null,
        resizeHandle: null,
      },
    }));
  },

  // Category actions
  addCategory: (category) => {
    set((state) => ({
      categories: [...state.categories, category],
    }));
  },

  // Persistence actions
  exportToJSON: () => {
    const { swimlanes, blocks } = get();

    // Group blocks by swimlane and convert to new format
    const swimlanesData = swimlanes.map((swimlane) => {
      const swimlaneBlocks = blocks
        .filter((block) => block.swimlaneId === swimlane.id)
        .map((block) => {
          const blockData: any = {
            name: block.name,
            offset: block.startTime,
            size: block.duration,
          };

          // Only include color if different from swimlane
          if (block.color !== swimlane.color) {
            blockData.color = block.color;
          }

          // Only include category if different from default
          if (block.category !== 'default') {
            blockData.category = block.category;
          }

          // Only include description if present
          if (block.description) {
            blockData.description = block.description;
          }

          return blockData;
        });

      return {
        name: swimlane.name,
        color: swimlane.color,
        blocks: swimlaneBlocks,
      };
    });

    const data = {
      version: '2.0',
      timestamp: new Date().toISOString(),
      swimlanes: swimlanesData,
    };

    return JSON.stringify(data, null, 2);
  },

  importFromJSON: (json) => {
    try {
      const data = JSON.parse(json);

      // Handle version 2.0 format
      if (data.version === '2.0' && data.swimlanes) {
        return get().importFromJSONv2(data);
      }

      // Handle version 1.0 format (legacy)
      if (data.swimlanes && data.blocks) {
        set({
          swimlanes: data.swimlanes,
          blocks: data.blocks,
          selectedBlockId: null,
        });
        return true;
      }

      return false;
    } catch (error) {
      console.error('Failed to import JSON:', error);
      return false;
    }
  },

  importFromJSONv2: (data) => {
    try {
      const predefinedColors = [
        '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b',
        '#10b981', '#06b6d4', '#6366f1', '#f97316'
      ];

      // Shuffle colors for randomness
      const shuffledColors = [...predefinedColors].sort(() => Math.random() - 0.5);

      const newSwimlanes: Swimlane[] = [];
      const newBlocks: Block[] = [];

      data.swimlanes.forEach((swimlaneData: any, index: number) => {
        const swimlaneId = `swimlane-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // Use provided color or assign random from shuffled palette
        const swimlaneColor = swimlaneData.color || shuffledColors[index % shuffledColors.length];

        // Create swimlane
        newSwimlanes.push({
          id: swimlaneId,
          name: swimlaneData.name,
          color: swimlaneColor,
          order: index,
          visible: true,
        });

        // Create blocks for this swimlane
        if (swimlaneData.blocks && Array.isArray(swimlaneData.blocks)) {
          swimlaneData.blocks.forEach((blockData: any) => {
            newBlocks.push({
              id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              swimlaneId,
              name: blockData.name,
              startTime: blockData.offset || 0,
              duration: blockData.size || 1000,
              // Use block's color if specified, otherwise inherit from swimlane
              color: blockData.color || swimlaneColor,
              category: blockData.category || 'default',
              description: blockData.description,
            });
          });
        }
      });

      set({
        swimlanes: newSwimlanes,
        blocks: newBlocks,
        selectedBlockId: null,
      });

      return true;
    } catch (error) {
      console.error('Failed to import v2 JSON:', error);
      return false;
    }
  },

  saveToLocalStorage: () => {
    const json = get().exportToJSON();
    localStorage.setItem('lane-moe-data', json);
  },

  loadFromLocalStorage: () => {
    const json = localStorage.getItem('lane-moe-data');
    if (json) {
      get().importFromJSON(json);
    }
  },
}));
