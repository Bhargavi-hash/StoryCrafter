// views/LandingView.jsx
import { useStoryCrafterStore } from "../state/useStoryCrafterStore";
import Dropdown from "../components/ui/Dropdown";


function Section({ title, stories, onStoryClick, updateStory }) {
  const statusOptions = [
    { value: 'ongoing', label: 'Ongoing' },
    { value: 'completed', label: 'Completed' },
    { value: 'onhold', label: 'On Hold' }
  ];

  return (
    
    <div className="mb-12 lg:mb-16">

      <h2 className="text-sm lg:text-base uppercase tracking-wider font-medium text-gray-400 mb-4 lg:mb-6">
        {title}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
        {stories.map(story => (
          <div
            key={story.id}
            onClick={() => onStoryClick(story)}
            className="bg-white border border-gray-200 rounded-xl overflow-hidden cursor-pointer transition-all hover:shadow-sm hover:border-gray-300 min-w-[280px]"
          >
            {story.coverImage && (
              <img
                src={story.coverImage}
                alt={story.title}
                className="w-full h-48 lg:h-64 object-cover bg-gray-50"
              />
            )}
            
            <div className="p-4 lg:p-6">
              <h3 className="text-base lg:text-lg font-medium text-gray-900 mb-2 tracking-tight line-clamp-1">
                {story.title}
              </h3>

              <p className="text-sm lg:text-sm text-gray-500 mb-3 lg:mb-4 leading-relaxed line-clamp-2">
                {story.description}
              </p>

              <div className="flex items-center justify-between gap-2">
                <span className="text-xs lg:text-sm text-gray-400 font-light">
                  {new Date(story.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>

                <div onClick={e => e.stopPropagation()} className="min-w-[100px]">
                  <Dropdown
                    value={story.status}
                    onChange={(newStatus) => updateStory(story.id, { status: newStatus })}
                    options={statusOptions}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        {stories.length === 0 && (
          <div className="col-span-full text-center py-12 lg:py-16 text-gray-300 border border-dashed border-gray-200 rounded-xl">
            <p className="text-sm lg:text-base">No stories yet</p>
          </div>
        )}
      </div>
    </div>
  );
}


export default function LandingView() {
  const { stories, actions } = useStoryCrafterStore();

  const ongoing = stories.filter(s => s.status === "ongoing");
  const completed = stories.filter(s => s.status === "completed");
  const onHold = stories.filter(s => s.status === "onhold");

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-8 lg:py-16">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 lg:mb-16 pb-6 lg:pb-8 border-b border-gray-100 gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl xl:text-4xl font-light text-gray-900 mb-2 tracking-tight">
            StoryCrafter
          </h1>
          <p className="text-sm lg:text-base text-gray-500">
            Organize your stories, characters, and worlds
          </p>
        </div>
        <button
          onClick={actions.addStory}
          className="px-5 lg:px-6 py-2.5 lg:py-3 bg-gray-900 text-white rounded-xl text-sm lg:text-base font-medium hover:bg-gray-800 transition-colors whitespace-nowrap"
        >
          + New Story
        </button>
      </div>

      <Section
        title="Ongoing"
        stories={ongoing}
        onStoryClick={actions.goToStoryDetail}
        updateStory={actions.updateStory}
      />

      <Section
        title="Completed"
        stories={completed}
        onStoryClick={actions.goToStoryDetail}
        updateStory={actions.updateStory}
      />

      <Section
        title="On Hold"
        stories={onHold}
        onStoryClick={actions.goToStoryDetail}
        updateStory={actions.updateStory}
      />
    </div>
  );
}


