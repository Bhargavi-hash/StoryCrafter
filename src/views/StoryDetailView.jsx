import React, { useState, useEffect } from "react";
import Sidebar from "../components/layout/Sidebar";
import ChapterListItem from "../components/chapter/ChapterListItem";
import ImageUpload from "../components/ui/ImageUpload";
import TagInput from "../components/ui/TagInput";
import DescriptionModal from "../components/ui/DescriptionModal";
import { useStoryCrafterStore } from "../state/useStoryCrafterStore";

export default function StoryDetailView() {
  const {
    chapters,
    selectedStory,
    updateStory,
    addChapter
  } = useStoryCrafterStore();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isDescModalOpen, setIsDescModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("writing");
  const [currentPage, setCurrentPage] = useState(1);

  const [titleDraft, setTitleDraft] = useState("");

  const [draftStoryId, setDraftStoryId] = useState(null);

  const CHAPTERS_PER_PAGE = 10;

  // ✅ Hooks ALWAYS run
  useEffect(() => {
    if (!selectedStory) return;

    // Only re-sync drafts when switching stories
    if (draftStoryId !== selectedStory.id) {
      setTitleDraft(selectedStory.title);
      setDraftStoryId(selectedStory.id);
    }
  }, [selectedStory]);

  // Reset to page 1 when changing tabs
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  // ✅ Guard AFTER hooks
  if (!selectedStory) return null;

  const storyChapters = chapters[selectedStory.id] || [];

  // Filter chapters based on active tab
  const filteredChapters = storyChapters.filter((ch) => {
    if (activeTab === "writing") return ch.status === "writing" || ch.status === "editing";
    if (activeTab === "completed") return ch.status === "completed";
    if (activeTab === "review") return ch.status === "review";
    return true;
  });

  // Reverse to show latest chapters first
  const reversedChapters = [...filteredChapters].reverse();

  // Pagination calculations
  const totalPages = Math.ceil(reversedChapters.length / CHAPTERS_PER_PAGE);
  const startIndex = (currentPage - 1) * CHAPTERS_PER_PAGE;
  const endIndex = startIndex + CHAPTERS_PER_PAGE;
  const paginatedChapters = reversedChapters.slice(startIndex, endIndex);

  const writingCount = storyChapters.filter(ch => ch.status === "writing" || ch.status === "editing").length;
  const completedCount = storyChapters.filter(ch => ch.status === "completed").length;
  const reviewCount = storyChapters.filter(ch => ch.status === "review").length;

  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 p-4 md:p-8 lg:p-12 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {/* ===== Story Header: Side by Side Layout ===== */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 mb-8 lg:mb-12 pb-8 lg:pb-12 border-b border-gray-100">
            {/* Left: Cover Image */}
            <div className="w-full lg:w-80 flex-shrink-0">
              <ImageUpload
                currentImage={selectedStory.coverImage}
                onImageChange={(imageData) =>
                  updateStory(selectedStory.id, { coverImage: imageData })
                }
                label="Story Cover"
                aspectRatio="portrait"
              />
            </div>

            {/* Right: Story Details */}
            <div className="flex-1 min-w-0">
              {/* ===== Title ===== */}
              {isEditingTitle ? (
                <input
                  value={titleDraft}
                  onChange={(e) => setTitleDraft(e.target.value)}
                  onBlur={() => {
                    updateStory(selectedStory.id, { title: titleDraft });
                    setIsEditingTitle(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === "Escape") {
                      updateStory(selectedStory.id, { title: titleDraft });
                      setIsEditingTitle(false);
                      e.target.blur();
                    }
                  }}
                  autoFocus
                  className="w-full border-b border-gray-200 bg-transparent focus:outline-none pb-2 font-light"
                  style={{
                    fontSize: 'clamp(1.875rem, 3vw + 1rem, 3.5rem)',
                    caretColor: '#1f2937',
                    fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif'
                  }}
                />
              ) : (
                <h1
                  onClick={() => setIsEditingTitle(true)}
                  className="font-light cursor-pointer hover:text-gray-600 transition-colors"
                  style={{
                    fontSize: 'clamp(1.875rem, 3vw + 1rem, 3.5rem)'
                  }}
                >
                  {selectedStory.title}
                </h1>
              )}

              {/* ===== Description ===== */}
              <div style={{ marginTop: 'clamp(1.25rem, 1.5vw, 2rem)' }}>
                <p
                  onClick={() => setIsDescModalOpen(true)}
                  className="w-full border-none outline-none bg-transparent font-medium tracking-tight leading-tight text-gray-600 placeholder-gray-300 cursor-pointer hover:text-gray-500 transition-colors line-clamp-2"
                  style={{
                    fontSize: 'clamp(1.125rem, 1.2vw + 0.5rem, 1.5rem)'
                  }}
                >
                  {selectedStory.description || "Add a description…"}
                  {selectedStory.description && (
                    <span className="ml-2 text-gray-400 hover:text-gray-600 font-medium">
                      read more...
                    </span>
                  )}
                </p>
                {!selectedStory.description && (
                  <button
                    onClick={() => setIsDescModalOpen(true)}
                    className="mt-2 text-gray-500 hover:text-gray-700 hover:underline transition-colors"
                    style={{
                      fontSize: 'clamp(0.775rem, 0.8vw + 0.3rem, 1.025rem)'
                    }}
                  >
                    Click to add description
                  </button>
                )}
              </div>

              {/* ===== Genre & Tags ===== */}
              <div className="mt-8 lg:mt-10 space-y-5 lg:space-y-6">
                <TagInput
                  label="Genre"
                  tags={selectedStory.genre || []}
                  onChange={(newGenre) =>
                    updateStory(selectedStory.id, { genre: newGenre })
                  }
                  placeholder="Add genre (e.g., Fantasy, Sci-Fi)..."
                />

                <TagInput
                  label="Tags"
                  tags={selectedStory.tags || []}
                  onChange={(newTags) =>
                    updateStory(selectedStory.id, { tags: newTags })
                  }
                  placeholder="Add tag..."
                />
              </div>
            </div>
          </div>

          {/* ===== Chapters Header ===== */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
            style={{ marginBottom: 'clamp(1rem, 1.5vw, 1.5rem)' }}>
            <h2 className="font-medium" style={{ fontSize: 'clamp(1.125rem, 1.2vw + 0.5rem, 1.5rem)' }}>Chapters</h2>
            <button
              onClick={() => addChapter(selectedStory.id)}
              className="bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors whitespace-nowrap"
              style={{
                padding: 'clamp(0.5rem, 0.8vw, 0.75rem) clamp(1rem, 1.2vw, 1.5rem)',
                fontSize: 'clamp(0.875rem, 0.8vw + 0.3rem, 1rem)'
              }}
            >
              + New Chapter
            </button>
          </div>

          {/* ===== Tabs ===== */}
          <div className="flex gap-1 border-b border-gray-200 overflow-x-auto"
            style={{ marginBottom: 'clamp(1rem, 1.5vw, 1.5rem)' }}>
            <button
              onClick={() => setActiveTab("writing")}
              className={`font-medium transition-colors relative whitespace-nowrap ${activeTab === "writing"
                ? "text-gray-900"
                : "text-gray-500 hover:text-gray-700"
                }`}
              style={{
                padding: 'clamp(0.5rem, 0.8vw, 0.75rem) clamp(0.75rem, 1vw, 1rem)',
                fontSize: 'clamp(0.875rem, 0.8vw + 0.3rem, 1rem)'
              }}
            >
              Writing {writingCount > 0 && <span className="text-gray-400">({writingCount})</span>}
              {activeTab === "writing" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab("completed")}
              className={`font-medium transition-colors relative whitespace-nowrap ${activeTab === "completed"
                ? "text-gray-900"
                : "text-gray-500 hover:text-gray-700"
                }`}
              style={{
                padding: 'clamp(0.5rem, 0.8vw, 0.75rem) clamp(0.75rem, 1vw, 1rem)',
                fontSize: 'clamp(0.875rem, 0.8vw + 0.3rem, 1rem)'
              }}
            >
              Completed {completedCount > 0 && <span className="text-gray-400">({completedCount})</span>}
              {activeTab === "completed" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab("review")}
              className={`font-medium transition-colors relative whitespace-nowrap ${activeTab === "review"
                ? "text-gray-900"
                : "text-gray-500 hover:text-gray-700"
                }`}
              style={{
                padding: 'clamp(0.5rem, 0.8vw, 0.75rem) clamp(0.75rem, 1vw, 1rem)',
                fontSize: 'clamp(0.875rem, 0.8vw + 0.3rem, 1rem)'
              }}
            >
              Review {reviewCount > 0 && <span className="text-gray-400">({reviewCount})</span>}
              {activeTab === "review" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>
              )}
            </button>
          </div>

          {/* ===== Chapter List ===== */}
          <div className="space-y-3">
            {paginatedChapters.length > 0 ? (
              paginatedChapters.map((ch) => (
                <ChapterListItem key={ch.id} chapter={ch} />
              ))
            ) : (
              <div className="text-center py-8 lg:py-12 text-gray-400 border border-dashed border-gray-200 rounded-lg">
                <p className="text-sm lg:text-base">No chapters in this category</p>
              </div>
            )}
          </div>

          {/* ===== Pagination ===== */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              {/* Previous Button */}
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === 1
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
              >
                ← Prev
              </button>

              {/* Page Numbers */}
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                  // Show first page, last page, current page, and pages around current
                  const showPage =
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    Math.abs(pageNum - currentPage) <= 1;

                  // Show ellipsis
                  const showEllipsisBefore = pageNum === currentPage - 2 && currentPage > 3;
                  const showEllipsisAfter = pageNum === currentPage + 2 && currentPage < totalPages - 2;

                  if (showEllipsisBefore || showEllipsisAfter) {
                    return (
                      <span key={pageNum} className="px-3 py-2 text-gray-400 text-sm">
                        ...
                      </span>
                    );
                  }

                  if (!showPage) return null;

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === pageNum
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              {/* Next Button */}
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === totalPages
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Description Modal */}
      <DescriptionModal
        isOpen={isDescModalOpen}
        onClose={() => setIsDescModalOpen(false)}
        initialValue={selectedStory.description || ''}
        onSave={(newDescription) => {
          updateStory(selectedStory.id, { description: newDescription });
        }}
      />
    </div>
  );
}


