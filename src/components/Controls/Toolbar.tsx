import { useSwimlaneStore } from '../../store/swimlaneStore';
import { useState } from 'react';

export const Toolbar = () => {
  const {
    swimlanes,
    addSwimlane,
    addBlock,
    zoom,
    resetView,
    pan,
    clearAll,
    exportToJSON,
    importFromJSON,
    saveToLocalStorage,
  } = useSwimlaneStore();

  const [showAddBlock, setShowAddBlock] = useState(false);

  const handleAddSwimlane = () => {
    const name = prompt('Enter swimlane name:', `Swimlane ${swimlanes.length + 1}`);
    if (name) {
      addSwimlane(name);
    }
  };

  const handleLoadDemo = () => {
    if (swimlanes.length > 0 && !confirm('This will clear existing data. Continue?')) {
      return;
    }

    // Clear existing data by resetting
    if (swimlanes.length > 0) {
      swimlanes.forEach(s => {
        useSwimlaneStore.getState().deleteSwimlane(s.id);
      });
    }

    // Add demo swimlanes
    addSwimlane('Frontend');
    addSwimlane('Backend');
    addSwimlane('Database');

    // Wait for swimlanes to be added, then add blocks
    setTimeout(() => {
      const { swimlanes: currentSwimlanes } = useSwimlaneStore.getState();

      if (currentSwimlanes.length >= 3) {
        // Frontend blocks
        addBlock(currentSwimlanes[0].id, {
          name: 'UI Render',
          category: 'frontend',
          startTime: 0,
          duration: 500,
        });
        addBlock(currentSwimlanes[0].id, {
          name: 'API Call',
          category: 'api',
          startTime: 600,
          duration: 300,
        });

        // Backend blocks
        addBlock(currentSwimlanes[1].id, {
          name: 'Process Request',
          category: 'backend',
          startTime: 650,
          duration: 200,
        });
        addBlock(currentSwimlanes[1].id, {
          name: 'Database Query',
          category: 'database',
          startTime: 900,
          duration: 400,
        });

        // Database blocks
        addBlock(currentSwimlanes[2].id, {
          name: 'Execute Query',
          category: 'database',
          startTime: 950,
          duration: 300,
        });
      }
    }, 100);
  };

  const handleZoomIn = () => {
    zoom(1.2);
  };

  const handleZoomOut = () => {
    zoom(0.8);
  };

  const handleResetView = () => {
    resetView();
  };

  const handleClearAll = () => {
    if (swimlanes.length === 0) {
      alert('No data to clear');
      return;
    }

    if (confirm(`This will delete all ${swimlanes.length} swimlane(s) and ${useSwimlaneStore.getState().blocks.length} block(s). Are you sure?`)) {
      clearAll();
      // Also clear localStorage
      localStorage.removeItem('lane-moe-data');
    }
  };

  const handleExport = () => {
    if (swimlanes.length === 0) {
      alert('No data to export');
      return;
    }

    const json = exportToJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lane-moe-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const json = event.target?.result as string;
          if (importFromJSON(json)) {
            saveToLocalStorage();
            alert('Data imported successfully!');
          } else {
            alert('Failed to import data. Please check the file format.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleSave = () => {
    if (swimlanes.length === 0) {
      alert('No data to save');
      return;
    }
    saveToLocalStorage();
    alert('Data saved to browser!');
  };

  const handlePanLeft = () => {
    pan(-100, 0);
  };

  const handlePanRight = () => {
    pan(100, 0);
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
      {/* Left side - Add buttons */}
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-bold text-gray-800 mr-4">Lane Moe</h1>

        <button
          onClick={handleAddSwimlane}
          className="px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm font-medium"
        >
          + Add Swimlane
        </button>

        <button
          onClick={handleLoadDemo}
          className="px-3 py-1.5 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors text-sm font-medium"
        >
          Load Demo
        </button>

        <div className="relative">
          <button
            onClick={() => {
              if (swimlanes.length > 0) {
                setShowAddBlock(!showAddBlock);
              }
            }}
            disabled={swimlanes.length === 0}
            className="px-3 py-1.5 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-sm font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            + Add Block
          </button>

          {showAddBlock && swimlanes.length > 0 && (
            <div className="absolute top-full mt-2 left-0 bg-white border border-gray-200 rounded-md shadow-lg p-2 z-10 min-w-[200px]">
              <p className="text-xs text-gray-600 mb-2">Select swimlane:</p>
              {swimlanes.map((swimlane) => (
                <button
                  key={swimlane.id}
                  onClick={() => {
                    addBlock(swimlane.id, {
                      name: 'New Block',
                      startTime: 0,
                      duration: 1000,
                    });
                    setShowAddBlock(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm flex items-center gap-2"
                >
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: swimlane.color }}
                  />
                  {swimlane.name}
                </button>
              ))}
              <button
                onClick={() => setShowAddBlock(false)}
                className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm text-gray-500 mt-1"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right side - View controls */}
      <div className="flex items-center gap-2">
        <div className="flex items-center border border-gray-300 rounded-md">
          <button
            onClick={handlePanLeft}
            className="px-3 py-1.5 hover:bg-gray-100 transition-colors text-sm border-r border-gray-300"
            title="Pan left (A)"
          >
            ←
          </button>
          <button
            onClick={handlePanRight}
            className="px-3 py-1.5 hover:bg-gray-100 transition-colors text-sm"
            title="Pan right (D)"
          >
            →
          </button>
        </div>

        <div className="flex items-center border border-gray-300 rounded-md">
          <button
            onClick={handleZoomOut}
            className="px-3 py-1.5 hover:bg-gray-100 transition-colors text-sm border-r border-gray-300"
            title="Zoom out (S)"
          >
            −
          </button>
          <button
            onClick={handleZoomIn}
            className="px-3 py-1.5 hover:bg-gray-100 transition-colors text-sm"
            title="Zoom in (W)"
          >
            +
          </button>
        </div>

        <button
          onClick={handleResetView}
          className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium"
          title="Reset view"
        >
          Reset View
        </button>

        <button
          onClick={handleClearAll}
          className="px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm font-medium"
          title="Clear all data"
        >
          Clear All
        </button>

        <div className="flex items-center border border-gray-300 rounded-md">
          <button
            onClick={handleSave}
            className="px-3 py-1.5 hover:bg-gray-100 transition-colors text-sm border-r border-gray-300"
            title="Save to browser"
          >
            💾
          </button>
          <button
            onClick={handleExport}
            className="px-3 py-1.5 hover:bg-gray-100 transition-colors text-sm border-r border-gray-300"
            title="Export to file"
          >
            📤
          </button>
          <button
            onClick={handleImport}
            className="px-3 py-1.5 hover:bg-gray-100 transition-colors text-sm"
            title="Import from file"
          >
            📥
          </button>
        </div>
      </div>

      {/* Help hint */}
      <div className="text-xs text-gray-500">
        WS zoom • AD pan right/left • Scroll to pan up/down • Double-click to add block
      </div>
    </div>
  );
};
