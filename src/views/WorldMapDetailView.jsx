import { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import ImageUpload from "../components/ui/ImageUpload";
import { useStoryCrafterStore } from "../state/useStoryCrafterStore";

export default function WorldMapDetailView({
  map,
  onSave,
  onCancel,
  onDelete
}) {
  const { showConfirm  } = useStoryCrafterStore();
  const [draft, setDraft] = useState({
    title: map.title || "",
    imageUrl: map.imageUrl || "",
    description: map.description || ""
  });

  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 p-4 md:p-8 lg:p-12 overflow-auto">
        <div className="max-w-3xl mx-auto">
          <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 lg:mb-10 gap-3">
            <button
              onClick={onCancel}
              className="text-xs lg:text-sm text-gray-500 hover:text-gray-900"
            >
              ← Back to World Maps
            </button>

            <div className="flex gap-2 lg:gap-3">
              <button
                onClick={() => showConfirm(
                  'Delete Map',
                  'Are you sure you want to delete this map?',
                  onDelete
                )}
                className="px-3 lg:px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm lg:text-base hover:bg-red-50"
              >
                Delete
              </button>

              <button
                onClick={() => onSave(draft)}
                className="px-5 lg:px-6 py-2 bg-gray-900 text-white rounded-lg text-sm lg:text-base hover:bg-gray-800"
              >
                Save
              </button>
            </div>
          </header>

          <input
            type="text"
            value={draft.title}
            onChange={e =>
              setDraft(d => ({ ...d, title: e.target.value }))
            }
            placeholder="Map title"
            className="w-full text-2xl lg:text-3xl font-light border-b border-gray-200 pb-2 lg:pb-3 mb-6 lg:mb-8 focus:outline-none focus:border-gray-400"
          />

          <div className="mb-6 lg:mb-8">
            <ImageUpload
              currentImage={draft.imageUrl}
              onImageChange={(imageData) =>
                setDraft(d => ({ ...d, imageUrl: imageData }))
              }
              label="Map Image"
              aspectRatio="portrait"
            />
          </div>

          <div>
            <label className="block text-sm lg:text-base font-medium text-gray-700 mb-2 lg:mb-3">
              Description
            </label>
            <textarea
              value={draft.description}
              onChange={e =>
                setDraft(d => ({ ...d, description: e.target.value }))
              }
              placeholder="Describe this place… history, myths, dangers…"
              rows={8}
              className="w-full border border-gray-200 rounded-lg px-3 lg:px-4 py-2.5 lg:py-3 text-sm lg:text-base leading-relaxed focus:outline-none focus:border-gray-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
