import { useStoryCrafterStore } from "../../state/useStoryCrafterStore";

export default function Sidebar() {
    const { currentView, selectedStory, setCurrentView, showConfirm, deleteStory } = useStoryCrafterStore(s => s.setCurrentView && s);

    return (
        <div className="w-48 lg:w-56 bg-gray-50 border-r border-gray-100 p-4 lg:p-8">
            <button
                onClick={() => setCurrentView('landing')}
                className="mb-8 lg:mb-12 text-sm lg:text-base text-gray-500 hover:text-gray-900 transition-colors"
            >
                ← Back
            </button>

            <nav className="space-y-1.5">
                <button
                    onClick={() => setCurrentView('story-detail')}
                    className={`w-full text-left px-3 lg:px-4 py-2 lg:py-2.5 rounded-lg text-sm lg:text-base transition-colors ${
                        currentView === 'story-detail'
                            ? 'bg-gray-100 text-gray-900 font-medium'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                >
                    Chapters
                </button>
                <button
                    onClick={() => setCurrentView('characters')}
                    className={`w-full text-left px-3 lg:px-4 py-2 lg:py-2.5 rounded-lg text-sm lg:text-base transition-colors ${
                        currentView === 'characters' || currentView === 'character-detail'
                            ? 'bg-gray-100 text-gray-900 font-medium'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                >
                    Characters
                </button>
                <button
                    onClick={() => setCurrentView('world')}
                    className={`w-full text-left px-3 lg:px-4 py-2 lg:py-2.5 rounded-lg text-sm lg:text-base transition-colors ${
                        currentView === 'world'
                            ? 'bg-gray-100 text-gray-900 font-medium'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                >
                    World
                </button>
            </nav>

            {selectedStory && (
                <div className="mt-8 lg:mt-12 pt-6 lg:pt-8 border-t border-gray-200">
                    <button
                        onClick={() => showConfirm(
                            'Delete Story',
                            'Are you sure you want to delete this story? This action cannot be undone.',
                            () => deleteStory(selectedStory.id)
                        )}
                        className="text-sm lg:text-base text-red-500 hover:text-red-700 transition-colors"
                    >
                        Delete Story
                    </button>
                </div>
            )}
        </div>
    );
}
