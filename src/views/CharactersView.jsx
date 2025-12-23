import Sidebar from "../components/layout/Sidebar";
import { useStoryCrafterStore } from "../state/useStoryCrafterStore";


export default function CharactersView() {
    const { characters, selectedStory, addCharacter, goToCharacterDetail } = useStoryCrafterStore();

    if (!selectedStory) return null;

    const list = characters[selectedStory.id] || [];

    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 p-4 md:p-8 lg:p-12 overflow-auto">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 lg:mb-8 gap-3">
                        <h1 className="text-2xl lg:text-3xl font-light text-gray-900 tracking-tight">
                            Characters
                        </h1>
                        <button
                            onClick={() => addCharacter(selectedStory.id)}
                            className="px-5 lg:px-6 py-2.5 lg:py-3 bg-gray-900 text-white rounded-xl text-sm lg:text-base font-medium hover:bg-gray-800 transition-colors whitespace-nowrap"
                        >
                            + New Character
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                        {list.map(c => (
                            <div
                                key={c.id}
                                onClick={() => goToCharacterDetail(c)}
                                className="bg-white border border-gray-200 rounded-xl overflow-hidden cursor-pointer transition-all hover:shadow-sm hover:border-gray-300"
                            >
                                {c.imageUrl ? (
                                    <img
                                        src={c.imageUrl}
                                        alt={c.name}
                                        className="w-full h-56 lg:h-72 object-cover bg-gray-100"
                                    />
                                ) : (
                                    <div className="w-full h-56 lg:h-72 bg-gray-50 flex items-center justify-center text-gray-300 text-sm lg:text-base">
                                        No Image
                                    </div>
                                )}
                                <div className="p-4 lg:p-6">
                                    <h3 className="text-sm lg:text-base font-medium text-gray-900 mb-1.5">
                                        {c.name}
                                    </h3>
                                    <p className="text-xs lg:text-sm text-gray-500">{c.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {list.length === 0 && (
                        <div className="text-center py-16 lg:py-24 text-gray-300 border border-dashed border-gray-200 rounded-xl">
                            <p className="mb-3 lg:mb-4 text-sm lg:text-base">No characters yet</p>
                            <button
                                onClick={() => addCharacter(selectedStory.id)}
                                className="text-sm lg:text-base text-gray-900 hover:underline"
                            >
                                Create your first character
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
