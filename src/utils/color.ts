// Predefined color palette for categories
export const CATEGORY_COLORS: Record<string, string> = {
  default: '#3b82f6',      // blue
  database: '#10b981',     // green
  api: '#8b5cf6',          // purple
  frontend: '#f59e0b',     // amber
  backend: '#ec4899',      // pink
  cache: '#06b6d4',        // cyan
  network: '#f97316',      // orange
  auth: '#ef4444',         // red
  logging: '#84cc16',      // lime
  queue: '#6366f1',        // indigo
};

// Swimlane colors
export const SWIMLANE_COLORS = [
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#f59e0b', // amber
  '#10b981', // green
  '#06b6d4', // cyan
  '#f97316', // orange
  '#6366f1', // indigo
  '#ef4444', // red
  '#84cc16', // lime
];

// Default categories
export const DEFAULT_CATEGORIES = [
  'default',
  'database',
  'api',
  'frontend',
  'backend',
  'cache',
  'network',
  'auth',
  'logging',
  'queue',
];

/**
 * Get color for a category
 */
export const getCategoryColor = (category: string): string => {
  return CATEGORY_COLORS[category] || CATEGORY_COLORS.default;
};

/**
 * Get a random swimlane color
 */
export const getSwimlaneColor = (index: number): string => {
  return SWIMLANE_COLORS[index % SWIMLANE_COLORS.length];
};

/**
 * Generate a random color (hex format)
 */
export const generateRandomColor = (): string => {
  const colors = [
    '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b',
    '#10b981', '#06b6d4', '#6366f1', '#f97316',
    '#ef4444', '#84cc16', '#14b8a6', '#a855f7'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

/**
 * Check if a color is light (for text contrast)
 */
export const isLightColor = (color: string): boolean => {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128;
};

/**
 * Get contrasting text color (black or white) for a given background
 */
export const getContrastColor = (backgroundColor: string): string => {
  return isLightColor(backgroundColor) ? '#000000' : '#ffffff';
};

/**
 * Lighten a color by a percentage
 */
export const lightenColor = (color: string, percent: number): string => {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  const newR = Math.min(255, Math.floor(r + (255 - r) * percent));
  const newG = Math.min(255, Math.floor(g + (255 - g) * percent));
  const newB = Math.min(255, Math.floor(b + (255 - b) * percent));

  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
};

/**
 * Darken a color by a percentage
 */
export const darkenColor = (color: string, percent: number): string => {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  const newR = Math.max(0, Math.floor(r * (1 - percent)));
  const newG = Math.max(0, Math.floor(g * (1 - percent)));
  const newB = Math.max(0, Math.floor(b * (1 - percent)));

  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
};
