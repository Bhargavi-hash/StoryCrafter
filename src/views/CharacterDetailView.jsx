import Sidebar from "../components/layout/Sidebar";
import ImageUpload from "../components/ui/ImageUpload";
import Dropdown from "../components/ui/Dropdown";
import { useStoryCrafterStore } from "../state/useStoryCrafterStore";


export default function CharacterDetailView() {
    const { selectedStory, selectedCharacter, actions } = useStoryCrafterStore();

    if (!selectedStory || !selectedCharacter) return null;

    const roleOptions = [
        { value: 'Main Lead', label: 'Main Lead' },
        { value: 'Supporting', label: 'Supporting' },
        { value: 'Antagonist', label: 'Antagonist' },
        { value: 'Minor', label: 'Minor' }
    ];

    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 p-4 md:p-8 lg:p-12 overflow-auto">
                <div className="max-w-3xl mx-auto">
                    {/* Back Button */}
                    <button
                        onClick={() => actions.setCurrentView('characters')}
                        className="text-sm lg:text-base text-gray-500 hover:text-gray-900 transition-colors mb-6 lg:mb-8"
                    >
                        ← Back to Characters
                    </button>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 lg:mb-12 gap-3">
                        <h1 className="text-2xl lg:text-3xl font-light text-gray-900 tracking-tight">
                            Character Details
                        </h1>
                        <button
                            onClick={() => actions.showConfirm(
                                'Delete Character',
                                'Are you sure you want to delete this character?',
                                () => actions.deleteCharacter(selectedStory.id, selectedCharacter.id)
                            )}
                            className="px-4 lg:px-5 py-2 lg:py-2.5 border border-red-200 text-red-600 rounded-lg text-sm lg:text-base font-medium hover:bg-red-50 transition-colors"
                        >
                            Delete
                        </button>
                    </div>

                    <div className="space-y-6 lg:space-y-8">
                        {/* Image */}
                        <ImageUpload
                            currentImage={selectedCharacter.imageUrl}
                            onImageChange={(imageData) =>
                                actions.updateCharacter(selectedStory.id, selectedCharacter.id, {
                                    imageUrl: imageData
                                })
                            }
                            label="Character Image"
                            aspectRatio="portrait"
                        />

                        {/* Name */}
                        <div>
                            <label className="block text-sm lg:text-base font-medium text-gray-700 mb-2 lg:mb-3">
                                Name
                            </label>
                            <input
                                type="text"
                                value={selectedCharacter.name}
                                onChange={e =>
                                    actions.updateCharacter(selectedStory.id, selectedCharacter.id, {
                                        name: e.target.value
                                    })
                                }
                                className="w-full border border-gray-200 rounded-lg px-3 lg:px-4 py-2.5 lg:py-3 text-sm lg:text-base focus:outline-none focus:border-gray-400"
                            />
                        </div>

                        {/* Role */}
                        <div>
                            <label className="block text-sm lg:text-base font-medium text-gray-700 mb-2 lg:mb-3">
                                Role
                            </label>
                            <Dropdown
                                value={selectedCharacter.role}
                                onChange={(newRole) =>
                                    actions.updateCharacter(selectedStory.id, selectedCharacter.id, {
                                        role: newRole
                                    })
                                }
                                options={roleOptions}
                            />
                        </div>

                        {/* Age */}
                        <div>
                            <label className="block text-sm lg:text-base font-medium text-gray-700 mb-2 lg:mb-3">
                                Age
                            </label>
                            <input
                                type="text"
                                value={selectedCharacter.age || ''}
                                onChange={e =>
                                    actions.updateCharacter(selectedStory.id, selectedCharacter.id, {
                                        age: e.target.value
                                    })
                                }
                                placeholder="e.g., 25"
                                className="w-full border border-gray-200 rounded-lg px-3 lg:px-4 py-2.5 lg:py-3 text-sm lg:text-base focus:outline-none focus:border-gray-400"
                            />
                        </div>

                        {/* Gender */}
                        <div>
                            <label className="block text-sm lg:text-base font-medium text-gray-700 mb-2 lg:mb-3">
                                Gender
                            </label>
                            <input
                                type="text"
                                value={selectedCharacter.gender || ''}
                                onChange={e =>
                                    actions.updateCharacter(selectedStory.id, selectedCharacter.id, {
                                        gender: e.target.value
                                    })
                                }
                                placeholder="e.g., Female, Male, Non-binary"
                                className="w-full border border-gray-200 rounded-lg px-3 lg:px-4 py-2.5 lg:py-3 text-sm lg:text-base focus:outline-none focus:border-gray-400"
                            />
                        </div>

                        {/* Personality */}
                        <div>
                            <label className="block text-sm lg:text-base font-medium text-gray-700 mb-2 lg:mb-3">
                                Personality
                            </label>
                            <textarea
                                value={selectedCharacter.personality || ''}
                                onChange={e =>
                                    actions.updateCharacter(selectedStory.id, selectedCharacter.id, {
                                        personality: e.target.value
                                    })
                                }
                                placeholder="Describe the character's personality, traits, and background..."
                                rows={6}
                                className="w-full border border-gray-200 rounded-lg px-3 lg:px-4 py-2.5 lg:py-3 text-sm lg:text-base focus:outline-none focus:border-gray-400 leading-relaxed"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
