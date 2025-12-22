import { useStoryCrafterStore } from "../../state/useStoryCrafterStore";
import Dropdown from "../ui/Dropdown";

export default function ChapterListItem({ chapter }) {
    const { selectedStory, actions } = useStoryCrafterStore(s => s.setCurrentView && s);

    const statusOptions = [
        { value: 'writing', label: 'Writing' },
        { value: 'completed', label: 'Completed' },
        { value: 'review', label: 'Review' }
    ];

    return (
        <div 
            className="bg-white border border-gray-100 rounded-xl transition-all hover:shadow-sm hover:border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between group gap-3"
            style={{ padding: 'clamp(1rem, 1.2vw, 1.5rem)' }}
        >
            <div
                className="flex-1 cursor-pointer"
                onClick={() => actions.goToChapterEditor(chapter)}
            >
                <h3 
                    className="font-medium text-gray-900 mb-1.5 group-hover:text-gray-600 transition-colors"
                    style={{ fontSize: 'clamp(1rem, 0.9vw + 0.4rem, 1.25rem)' }}
                >
                    {chapter.title}
                </h3>
                <p 
                    className="text-gray-400"
                    style={{ fontSize: 'clamp(0.75rem, 0.7vw + 0.2rem, 0.9rem)' }}
                >
                    {new Date(chapter.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                    })}
                </p>
            </div>
            <div 
                className="flex items-center w-full sm:w-auto"
                style={{ gap: 'clamp(0.5rem, 0.8vw, 0.75rem)' }}
            >
                <div onClick={e => e.stopPropagation()} className="flex-1 sm:flex-none min-w-[120px]">
                    <Dropdown
                        value={chapter.status}
                        onChange={(newStatus) =>
                            actions.updateChapter(selectedStory.id, chapter.id, {
                                status: newStatus
                            })
                        }
                        options={statusOptions}
                    />
                </div>
                <button
                    onClick={e => {
                        e.stopPropagation();
                        actions.showConfirm(
                            'Delete Chapter',
                            'Are you sure you want to delete this chapter?',
                            () => actions.deleteChapter(selectedStory.id, chapter.id)
                        );
                    }}
                    className="text-gray-400 hover:text-red-500 px-2"
                    style={{ fontSize: 'clamp(0.875rem, 0.8vw + 0.3rem, 1rem)' }}
                >
                    Delete
                </button>
            </div>
        </div>
    );
}
