import { useEffect, useState } from 'react';
import { useSwimlaneStore } from '../store/swimlaneStore';
import { Toolbar } from './Controls/Toolbar';
import { SwimlaneCanvas } from './Canvas/SwimlaneCanvas';
import { EditBlockModal } from './Modals/EditBlockModal';
import { useKeyboardControls } from '../hooks/useKeyboardControls';

function App() {
  const { selectedBlockId, setSelectedBlock, loadFromLocalStorage, saveToLocalStorage, blocks } = useSwimlaneStore();

  // Load data from localStorage on startup
  useEffect(() => {
    loadFromLocalStorage();
  }, [loadFromLocalStorage]);

  // Auto-save to localStorage whenever data changes
  useEffect(() => {
    if (blocks.length > 0) {
      saveToLocalStorage();
    }
  }, [blocks, saveToLocalStorage]);
  const [modalOpen, setModalOpen] = useState(false);

  // Enable keyboard controls
  useKeyboardControls({ enabled: true });

  // Open modal when block is selected
  useEffect(() => {
    if (selectedBlockId) {
      setModalOpen(true);
    }
  }, [selectedBlockId]);

  // Handle modal close
  const handleModalClose = () => {
    setModalOpen(false);
    // Don't clear selectedBlockId immediately to allow re-opening modal
    setTimeout(() => setSelectedBlock(null), 100);
  };

  // Handle keyboard delete
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' && selectedBlockId && !modalOpen) {
        if (confirm('Delete selected block?')) {
          useSwimlaneStore.getState().deleteBlock(selectedBlockId);
          setSelectedBlock(null);
        }
      }

      // Close modal on Escape
      if (e.key === 'Escape' && modalOpen) {
        handleModalClose();
      }

      // Quick save with Ctrl+S
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveToLocalStorage();
        // Show save notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50';
        notification.textContent = '💾 Saved!';
        document.body.appendChild(notification);
        setTimeout(() => document.body.removeChild(notification), 2000);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedBlockId, modalOpen, saveToLocalStorage]);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Toolbar */}
      <Toolbar />

      {/* Canvas */}
      <SwimlaneCanvas />

      {/* Edit Modal */}
      {modalOpen && selectedBlockId && (
        <EditBlockModal
          blockId={selectedBlockId}
          onClose={handleModalClose}
        />
      )}

      {/* Keyboard shortcuts hint (bottom right) */}
      <div className="fixed bottom-4 right-4 bg-white bg-opacity-90 px-3 py-2 rounded-lg shadow-md text-xs text-gray-600">
        <div className="font-semibold mb-1">Shortcuts:</div>
        <div>W/S - Zoom in/out</div>
        <div>A/D - Pan right/left</div>
        <div>Scroll - Pan up/down</div>
        <div>Ctrl+S - Save</div>
        <div>Del - Delete block</div>
      </div>
    </div>
  );
}

export default App;
