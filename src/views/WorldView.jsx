import { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import { useStoryCrafterStore } from "../state/useStoryCrafterStore";
import WorldMapCard from "../components/world/WorldMapCard";
import WorldMapDetailView from "./WorldMapDetailView";

export default function WorldView() {
  const { worldMaps, selectedStory, actions } = useStoryCrafterStore();
  const [editingMapId, setEditingMapId] = useState(null);

  if (!selectedStory) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center text-gray-400 text-sm lg:text-base">
          Select a story to begin world-building
        </div>
      </div>
    );
  }

  const maps = worldMaps[selectedStory.id] || [];
  const editingMap = maps.find(m => m.id === editingMapId);

  // 👉 If editing, render detail page instead
  if (editingMap) {
    return (
      <WorldMapDetailView
        map={editingMap}
        onSave={(updates) => {
          actions.updateWorldMap(selectedStory.id, editingMap.id, updates);
          setEditingMapId(null);
        }}
        onCancel={() => setEditingMapId(null)}
        onDelete={() => {
          actions.deleteWorldMap(selectedStory.id, editingMap.id);
          setEditingMapId(null);
        }}
      />
    );
  }

  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 p-4 md:p-8 lg:p-12 overflow-auto">
        <div className="max-w-6xl mx-auto">
          <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 lg:mb-8 gap-3">
            <div>
              <h1 className="text-2xl lg:text-3xl font-light text-gray-900 tracking-tight">
                World Building
              </h1>
              <p className="text-sm lg:text-base text-gray-500">
                Maps and locations in your universe
              </p>
            </div>

            <button
              onClick={() => {
                const id = actions.addWorldMap(selectedStory.id);
                setEditingMapId(id);
              }}
              className="px-5 lg:px-6 py-2.5 lg:py-3 bg-gray-900 text-white rounded-xl text-sm lg:text-base font-medium hover:bg-gray-800 whitespace-nowrap"
            >
              + New Map
            </button>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {maps.map(map => (
              <WorldMapCard
                key={map.id}
                map={map}
                onClick={() => setEditingMapId(map.id)}
              />
            ))}

            {maps.length === 0 && (
              <div className="col-span-full text-center py-16 lg:py-24 text-gray-300 border border-dashed border-gray-200 rounded-xl text-sm lg:text-base">
                No maps yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


