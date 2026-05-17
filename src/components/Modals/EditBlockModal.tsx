import { useState, useEffect } from 'react';
import { useSwimlaneStore } from '../../store/swimlaneStore';
import { CATEGORY_COLORS, DEFAULT_CATEGORIES } from '../../utils/color';

interface EditBlockModalProps {
  blockId: string | null;
  onClose: () => void;
}

export const EditBlockModal = ({ blockId, onClose }: EditBlockModalProps) => {
  const { blocks, swimlanes, updateBlock, deleteBlock } = useSwimlaneStore();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    color: '',
    startTime: 0,
    duration: 0,
    description: '',
  });

  const block = blocks.find((b) => b.id === blockId);

  useEffect(() => {
    if (block) {
      setFormData({
        name: block.name,
        category: block.category,
        color: block.color,
        startTime: block.startTime,
        duration: block.duration,
        description: block.description || '',
      });
    }
  }, [block]);

  if (!block) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateBlock(block.id, {
      name: formData.name,
      category: formData.category,
      color: formData.color,
      startTime: formData.startTime,
      duration: formData.duration,
      description: formData.description,
    });
    onClose();
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this block?')) {
      deleteBlock(block.id);
      onClose();
    }
  };

  const handleCategoryChange = (category: string) => {
    setFormData({
      ...formData,
      category,
      color: CATEGORY_COLORS[category] || CATEGORY_COLORS.default,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Edit Block</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {DEFAULT_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={formData.color}
                onChange={(e) =>
                  setFormData({ ...formData, color: e.target.value })
                }
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={formData.color}
                onChange={(e) =>
                  setFormData({ ...formData, color: e.target.value })
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="#3b82f6"
              />
            </div>
          </div>

          {/* Start Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Time (ms)
            </label>
            <input
              type="number"
              value={formData.startTime}
              onChange={(e) =>
                setFormData({ ...formData, startTime: Number(e.target.value) })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              required
            />
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration (ms)
            </label>
            <input
              type="number"
              value={formData.duration}
              onChange={(e) =>
                setFormData({ ...formData, duration: Number(e.target.value) })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Optional description..."
            />
          </div>

          {/* Swimlane Info (read-only) */}
          <div className="text-sm text-gray-600">
            <span className="font-medium">Swimlane:</span>{' '}
            {
              swimlanes.find((s) => s.id === block.swimlaneId)?.name ||
              'Unknown'
            }
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              Delete
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
