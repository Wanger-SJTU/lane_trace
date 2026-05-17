import { Block, Swimlane, Viewport } from '../types/swimlane';

const SWIMLANE_HEIGHT = 60;
const SWIMLANE_LABEL_WIDTH = 150;
const TIME_SCALE_HEIGHT = 40;
const BLOCK_CORNER_RADIUS = 4;
const BLOCK_PADDING = 4;

export interface DrawOptions {
  ctx: CanvasRenderingContext2D;
  viewport: Viewport;
  swimlanes: Swimlane[];
  blocks: Block[];
  canvasWidth: number;
  canvasHeight: number;
  hoveredBlock?: Block | null;
  selectedBlockId?: string | null;
  timeToPixel: (time: number) => number;
  getSwimlaneY: (order: number) => number;
}

// Clear canvas
export const clearCanvas = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  ctx.clearRect(0, 0, width, height);
};

// Draw background
export const drawBackground = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, width, height);
};

// Draw grid lines
export const drawGridLines = (options: DrawOptions) => {
  const { ctx, viewport, canvasWidth, timeToPixel } = options;

  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1;

  // Calculate grid spacing based on zoom level
  let gridSize: number;

  if (viewport.pixelsPerMs > 1) {
    gridSize = 1;
  } else if (viewport.pixelsPerMs > 0.1) {
    gridSize = 10;
  } else if (viewport.pixelsPerMs > 0.01) {
    gridSize = 100;
  } else if (viewport.pixelsPerMs > 0.001) {
    gridSize = 1000;
  } else {
    gridSize = 10000;
  }

  // Draw vertical time grid lines
  ctx.beginPath();
  const startGridTime = Math.ceil(viewport.startTime / gridSize) * gridSize;
  const endGridTime = viewport.endTime;

  for (let time = startGridTime; time <= endGridTime; time += gridSize) {
    const x = timeToPixel(time);
    if (x >= SWIMLANE_LABEL_WIDTH && x <= canvasWidth) {
      ctx.moveTo(x, TIME_SCALE_HEIGHT);
      ctx.lineTo(x, options.canvasHeight);
    }
  }
  ctx.stroke();
};

// Draw swimlane backgrounds
export const drawSwimlaneBackgrounds = (options: DrawOptions) => {
  const { ctx, swimlanes, canvasWidth, getSwimlaneY } = options;

  swimlanes.forEach((swimlane, index) => {
    const y = getSwimlaneY(swimlane.order);

    // Alternate background colors
    ctx.fillStyle = index % 2 === 0 ? '#ffffff' : '#f1f5f9';
    ctx.fillRect(SWIMLANE_LABEL_WIDTH, y, canvasWidth - SWIMLANE_LABEL_WIDTH, SWIMLANE_HEIGHT);

    // Draw swimlane border
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.strokeRect(SWIMLANE_LABEL_WIDTH, y, canvasWidth - SWIMLANE_LABEL_WIDTH, SWIMLANE_HEIGHT);
  });
};

// Draw swimlane labels
export const drawSwimlaneLabels = (options: DrawOptions) => {
  const { ctx, swimlanes, getSwimlaneY } = options;

  // Draw label background
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(0, TIME_SCALE_HEIGHT, SWIMLANE_LABEL_WIDTH, options.canvasHeight - TIME_SCALE_HEIGHT);

  // Draw labels
  ctx.font = '14px sans-serif';
  ctx.textBaseline = 'middle';

  swimlanes.forEach((swimlane) => {
    const y = getSwimlaneY(swimlane.order) + SWIMLANE_HEIGHT / 2;

    // Draw color indicator
    ctx.fillStyle = swimlane.color;
    ctx.fillRect(10, y - 8, 16, 16);

    // Draw name
    ctx.fillStyle = '#1e293b';
    ctx.textAlign = 'left';
    ctx.fillText(swimlane.name, 35, y);
  });

  // Draw right border
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(SWIMLANE_LABEL_WIDTH, TIME_SCALE_HEIGHT);
  ctx.lineTo(SWIMLANE_LABEL_WIDTH, options.canvasHeight);
  ctx.stroke();
};

// Draw time scale
export const drawTimeScale = (options: DrawOptions) => {
  const { ctx, viewport, canvasWidth, timeToPixel } = options;

  // Draw time scale background
  ctx.fillStyle = '#f1f5f9';
  ctx.fillRect(0, 0, canvasWidth, TIME_SCALE_HEIGHT);

  // Draw bottom border
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, TIME_SCALE_HEIGHT);
  ctx.lineTo(canvasWidth, TIME_SCALE_HEIGHT);
  ctx.stroke();

  // Calculate label spacing
  let labelInterval: number;
  let formatFn: (time: number) => string;

  if (viewport.pixelsPerMs > 1) {
    labelInterval = 10;
    formatFn = (t) => `${t}ms`;
  } else if (viewport.pixelsPerMs > 0.01) {
    labelInterval = 100;
    formatFn = (t) => `${(t / 1000).toFixed(1)}s`;
  } else if (viewport.pixelsPerMs > 0.001) {
    labelInterval = 1000;
    formatFn = (t) => `${(t / 1000).toFixed(0)}s`;
  } else {
    labelInterval = 10000;
    formatFn = (t) => `${(t / 1000).toFixed(0)}s`;
  }

  // Draw time labels
  ctx.font = '12px sans-serif';
  ctx.textBaseline = 'top';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#475569';

  const startLabelTime = Math.ceil(viewport.startTime / labelInterval) * labelInterval;
  const endLabelTime = viewport.endTime;

  for (let time = startLabelTime; time <= endLabelTime; time += labelInterval) {
    const x = timeToPixel(time);
    if (x >= SWIMLANE_LABEL_WIDTH && x <= canvasWidth) {
      ctx.fillText(formatFn(time), x, 8);

      // Draw tick mark
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, TIME_SCALE_HEIGHT - 5);
      ctx.lineTo(x, TIME_SCALE_HEIGHT);
      ctx.stroke();
    }
  }
};

// Draw a single block
export const drawBlock = (
  ctx: CanvasRenderingContext2D,
  block: Block,
  x: number,
  y: number,
  width: number,
  height: number,
  isHovered: boolean = false,
  isSelected: boolean = false
) => {
  // Draw block background
  ctx.fillStyle = block.color;

  // Draw rounded rectangle
  const radius = BLOCK_CORNER_RADIUS;
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fill();

  // Draw border
  ctx.strokeStyle = isSelected ? '#000000' : (isHovered ? '#475569' : 'transparent');
  ctx.lineWidth = isSelected ? 2 : 1;
  ctx.stroke();

  // Draw text
  if (width > 20) {
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px sans-serif';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';

    const textX = x + BLOCK_PADDING;
    const textY = y + height / 2;

    // Clip text to block width
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.clip();

    // Draw block name
    ctx.fillText(block.name, textX, textY);

    // Draw duration if space allows
    if (width > 100) {
      ctx.font = '10px sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      const durationText = `${block.duration}ms`;
      ctx.fillText(durationText, textX, textY + 14);
    }

    ctx.restore();
  }
};

// Draw all blocks
export const drawBlocks = (options: DrawOptions) => {
  const { ctx, blocks, swimlanes, timeToPixel, getSwimlaneY, hoveredBlock, selectedBlockId } = options;

  blocks.forEach((block) => {
    const swimlane = swimlanes.find((s) => s.id === block.swimlaneId);
    if (!swimlane) return;

    const x = timeToPixel(block.startTime);
    const y = getSwimlaneY(swimlane.order);
    const width = block.duration * options.viewport.pixelsPerMs;
    const height = SWIMLANE_HEIGHT - 8; // 4px padding on each side

    const isHovered = hoveredBlock?.id === block.id;
    const isSelected = selectedBlockId === block.id;

    // Only draw if visible
    if (x + width > SWIMLANE_LABEL_WIDTH && x < options.canvasWidth) {
      drawBlock(ctx, block, x, y + 4, width, height, isHovered, isSelected);
    }
  });
};

// Main render function
export const renderCanvas = (options: DrawOptions) => {
  const { ctx, canvasWidth, canvasHeight } = options;

  // Clear and draw background
  clearCanvas(ctx, canvasWidth, canvasHeight);
  drawBackground(ctx, canvasWidth, canvasHeight);

  // Draw components in order
  drawSwimlaneBackgrounds(options);
  drawGridLines(options);
  drawBlocks(options);
  drawSwimlaneLabels(options);
  drawTimeScale(options);
};

export {
  SWIMLANE_HEIGHT,
  SWIMLANE_LABEL_WIDTH,
  TIME_SCALE_HEIGHT,
  BLOCK_CORNER_RADIUS,
  BLOCK_PADDING,
};
