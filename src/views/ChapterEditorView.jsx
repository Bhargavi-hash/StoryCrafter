import React, { useRef, useState, useEffect } from "react";
import Dropdown from "../components/ui/Dropdown";
import AlertModal from "../components/ui/AlertModal";
import { useStoryCrafterStore } from "../state/useStoryCrafterStore";


export default function ChapterEditorView() {
    const { selectedStory, selectedChapter, actions } = useStoryCrafterStore();
    const editorRef = useRef(null);
    const [showToolbar, setShowToolbar] = useState(false);
    const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 });
    const [showHistory, setShowHistory] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [localContent, setLocalContent] = useState("");
    const [alertModal, setAlertModal] = useState({ isOpen: false, title: '', message: '', type: 'alert', onConfirm: null });
    const [autosaveStatus, setAutosaveStatus] = useState('saved'); // 'saved', 'saving', 'pending'
    const [hasUnsavedVersion, setHasUnsavedVersion] = useState(false); // Track if version needs saving
    const autosaveTimerRef = useRef(null);
    const lastVersionContentRef = useRef(""); // Track content of last explicit version save

    // ✅ Hooks must run before any conditional returns
    useEffect(() => {
        // Set initial content if editor exists
        if (editorRef.current && selectedChapter?.content) {
            if (editorRef.current.innerHTML !== selectedChapter.content) {
                editorRef.current.innerHTML = selectedChapter.content;
                setLocalContent(selectedChapter.content);
                setHasUnsavedChanges(false);
                setHasUnsavedVersion(false);
                lastVersionContentRef.current = selectedChapter.content;
            }
        }
    }, [selectedChapter?.id]);

    // Keyboard shortcut for save (Ctrl/Cmd + S)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                if (hasUnsavedVersion) {
                    handleSave();
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [hasUnsavedVersion, localContent]);

    // Autosave after 2 seconds of inactivity
    useEffect(() => {
        if (hasUnsavedChanges && selectedChapter?.title?.trim()) {
            // Clear existing timer
            if (autosaveTimerRef.current) {
                clearTimeout(autosaveTimerRef.current);
            }

            // Show pending status
            setAutosaveStatus('pending');

            // Set new timer for autosave
            autosaveTimerRef.current = setTimeout(() => {
                setAutosaveStatus('saving');
                
                // Perform autosave - only update content, don't create version
                if (editorRef.current) {
                    const content = editorRef.current.innerHTML;
                    actions.updateChapter(selectedStory.id, selectedChapter.id, { content });
                    setHasUnsavedChanges(false);
                    // Don't clear hasUnsavedVersion - user can still create version snapshot
                    
                    // Show saved status briefly
                    setTimeout(() => {
                        setAutosaveStatus('saved');
                    }, 800);
                }
            }, 2000);
        }

        // Cleanup
        return () => {
            if (autosaveTimerRef.current) {
                clearTimeout(autosaveTimerRef.current);
            }
        };
    }, [hasUnsavedChanges, localContent, selectedChapter?.id, selectedChapter?.title]);

    // ✅ Guard after all hooks
    if (!selectedStory || !selectedChapter) return null;

    const statusOptions = [
        { value: 'writing', label: 'Writing' },
        { value: 'completed', label: 'Completed' },
        { value: 'review', label: 'Review' }
    ];

    // Get chapter history
    const chapterHistory = actions.getChapterHistory(selectedStory.id, selectedChapter.id) || [];

    // Calculate word count from HTML content
    const getWordCount = (html) => {
        // Strip HTML tags and get plain text
        const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
        if (!text) return 0;
        return text.split(' ').filter(word => word.length > 0).length;
    };

    const wordCount = getWordCount(localContent || selectedChapter.content || '');

    const handleInput = (e) => {
        const html = e.currentTarget.innerHTML;
        setLocalContent(html);
        setHasUnsavedChanges(html !== selectedChapter.content);
        setHasUnsavedVersion(html !== lastVersionContentRef.current);
    };

    const handleSave = () => {
        // Check if title is empty
        if (!selectedChapter.title || selectedChapter.title.trim() === '') {
            setAlertModal({
                isOpen: true,
                title: 'Chapter Title Required',
                message: 'Please add a chapter title before saving.',
                type: 'alert',
                onConfirm: null
            });
            return;
        }

        // Clear autosave timer if exists
        if (autosaveTimerRef.current) {
            clearTimeout(autosaveTimerRef.current);
            autosaveTimerRef.current = null;
        }

        if (editorRef.current) {
            const content = editorRef.current.innerHTML;
            actions.saveChapterVersion(selectedStory.id, selectedChapter.id, content);
            lastVersionContentRef.current = content;
            setHasUnsavedChanges(false);
            setHasUnsavedVersion(false);
            setAutosaveStatus('saved');
        }
    };

    const handleBackToStory = () => {
        // Check if title is empty
        if (!selectedChapter.title || selectedChapter.title.trim() === '') {
            setAlertModal({
                isOpen: true,
                title: 'Empty Chapter Title',
                message: 'Chapter title is empty. Are you sure you want to go back?',
                type: 'confirm',
                onConfirm: () => {
                    actions.setCurrentView('story-detail');
                }
            });
            return;
        }
        actions.setCurrentView('story-detail');
    };

    const handleRestore = (version) => {
        if (editorRef.current) {
            editorRef.current.innerHTML = version.content;
            setLocalContent(version.content);
            actions.updateChapter(selectedStory.id, selectedChapter.id, { content: version.content });
            lastVersionContentRef.current = version.content;
            setHasUnsavedChanges(false);
            setHasUnsavedVersion(false);
            setShowHistory(false);
        }
    };

    const handleSelection = () => {
        const selection = window.getSelection();
        const selectedText = selection.toString().trim();

        if (selectedText.length > 0) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();

            setToolbarPosition({
                x: rect.left + (rect.width / 2),
                y: rect.top - 50
            });
            setShowToolbar(true);
        } else {
            setShowToolbar(false);
        }
    };

    const applyFormat = (command) => {
        document.execCommand(command, false, null);
        editorRef.current?.focus();

        // Mark as changed
        setTimeout(() => {
            if (editorRef.current) {
                const html = editorRef.current.innerHTML;
                setLocalContent(html);
                setHasUnsavedChanges(html !== selectedChapter.content);
                setHasUnsavedVersion(html !== lastVersionContentRef.current);
            }
        }, 10);
    };

    return (
        <div className="h-screen flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 px-4 md:px-8 lg:px-12 py-4 lg:py-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 lg:mb-8 gap-3">
                    <button
                        onClick={handleBackToStory}
                        className="text-sm lg:text-base text-gray-500 hover:text-gray-900 transition-colors"
                    >
                        ← Back to {selectedStory.title}
                    </button>

                    <div className="flex items-center gap-2 lg:gap-3 flex-wrap">
                        {/* History Toggle */}
                        <button
                            onClick={() => setShowHistory(!showHistory)}
                            className={`px-3 lg:px-4 py-2 border rounded-lg text-xs lg:text-sm hover:bg-gray-50 transition-colors ${showHistory
                                ? 'border-gray-300 bg-gray-50 text-gray-900'
                                : 'border-gray-200 text-gray-700'
                                }`}
                            title="Version History"
                        >
                            <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            History
                        </button>

                        {/* Save Button */}
                        <button
                            onClick={handleSave}
                            disabled={!hasUnsavedVersion}
                            className={`px-4 lg:px-5 py-2 rounded-lg text-xs lg:text-sm font-medium transition-colors ${hasUnsavedVersion
                                ? 'bg-gray-900 text-white hover:bg-gray-800'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                }`}
                            title={hasUnsavedVersion ? 'Save version (Ctrl/Cmd+S)' : 'No new changes to version'}
                        >
                            {hasUnsavedVersion ? (
                                <>
                                    <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                    </svg>
                                    Save
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Saved
                                </>
                            )}
                        </button>

                        {/* Status Dropdown */}
                        <div className="w-full sm:w-auto min-w-[140px]">
                            <Dropdown
                                value={selectedChapter.status}
                                onChange={(newStatus) =>
                                    actions.updateChapter(selectedStory.id, selectedChapter.id, {
                                        status: newStatus
                                    })
                                }
                                options={statusOptions}
                            />
                        </div>
                    </div>
                </div>

                {/* Centered Chapter Title with Ribbon Underline */}
                <div className="flex flex-col items-center">
                    <input
                        type="text"
                        value={selectedChapter.title}
                        onChange={e =>
                            actions.updateChapter(selectedStory.id, selectedChapter.id, {
                                title: e.target.value
                            })
                        }
                        className="font-light text-center w-full border-none outline-none text-gray-900 placeholder-gray-300 tracking-tight"
                        style={{
                            fontSize: 'clamp(1.875rem, 3vw + 1rem, 3.5rem)',
                            caretColor: '#1f2937',
                            fontFamily: 'Georgia, Cambria, "Times New Roman", Times, serif'
                        }}
                        placeholder="Chapter Title"
                    />
                    
                    {/* Word Count */}
                    <div className="text-xs lg:text-sm text-gray-400 mt-2">
                        {wordCount.toLocaleString()} {wordCount === 1 ? 'word' : 'words'}
                    </div>

                    {/* Elegant Ribbon Underline */}
                    <div 
                        className="flex items-center justify-center w-full max-w-md"
                        style={{ marginTop: 'clamp(0.5rem, 0.75vw, 0.75rem)' }}
                    >
                        <svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 300 40"
  className="w-full"
  style={{ maxWidth: 'clamp(22rem, 32vw, 36rem)' }}
>
  {/* Left flourish */}
  <path
    d="M 20 20 
       C 60 8, 100 8, 140 20"
    stroke="#c7c9cc"
    strokeWidth="1"
    fill="none"
    strokeLinecap="round"
  />

  {/* Center ornament */}
  <circle
    cx="150"
    cy="20"
    r="2"
    fill="#9ca3af"
  />

  {/* Right flourish */}
  <path
    d="M 160 20 
       C 200 8, 240 8, 280 20"
    stroke="#c7c9cc"
    strokeWidth="1"
    fill="none"
    strokeLinecap="round"
  />
</svg>

                    </div>
                </div>
            </div>

            {/* Floating Toolbar */}
            {showToolbar && (
                <div
                    className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-sm flex gap-1 p-1"
                    style={{
                        left: `${toolbarPosition.x}px`,
                        top: `${toolbarPosition.y}px`,
                        transform: 'translateX(-50%)'
                    }}
                    onMouseDown={(e) => e.preventDefault()}
                >
                    <button
                        onClick={() => applyFormat('bold')}
                        className="px-2.5 lg:px-3 py-1.5 text-xs lg:text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded transition-colors"
                        title="Bold"
                    >
                        B
                    </button>
                    <button
                        onClick={() => applyFormat('italic')}
                        className="px-2.5 lg:px-3 py-1.5 text-xs lg:text-sm italic text-gray-700 hover:bg-gray-50 rounded transition-colors"
                        title="Italic"
                    >
                        I
                    </button>
                    <button
                        onClick={() => applyFormat('underline')}
                        className="px-2.5 lg:px-3 py-1.5 text-xs lg:text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors"
                        style={{ textDecoration: 'underline' }}
                        title="Underline"
                    >
                        U
                    </button>
                </div>
            )}

            <div className="flex-1 flex overflow-hidden">
                {/* Editor */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden bg-white">
                    <div className="w-full px-6 md:px-12 lg:px-16 py-8 lg:py-12 flex justify-center">
                        <div
                            ref={editorRef}
                            contentEditable
                            onInput={handleInput}
                            onMouseUp={handleSelection}
                            onKeyUp={handleSelection}
                            onBlur={() => setTimeout(() => setShowToolbar(false), 200)}
                            className="w-full max-w-4xl min-h-full focus:outline-none text-gray-800 leading-relaxed"
                            style={{
                                fontSize: 'clamp(24px, 1.5vw, 28px)',
                                fontFamily: 'Georgia, Cambria, "Times New Roman", Times, serif',
                                lineHeight: '1.85',
                                caretColor: '#1f2937',
                                wordWrap: 'break-word',
                                overflowWrap: 'break-word'
                            }}
                            data-placeholder="Start writing your chapter..."
                        />
                    </div>
                </div>

                {/* History Sidebar */}
                {showHistory && (
                    <div className="w-80 lg:w-96 bg-gray-50 border-l border-gray-200 overflow-auto">
                        <div className="p-4 lg:p-6">
                            <div className="flex items-center justify-between mb-4 lg:mb-6">
                                <h3 className="text-base lg:text-lg font-medium text-gray-900">
                                    Version History
                                </h3>
                                <button
                                    onClick={() => setShowHistory(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {chapterHistory.length > 0 ? (
                                <div className="space-y-3">
                                    {chapterHistory.map((version, index) => (
                                        <div
                                            key={version.timestamp}
                                            className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <p className="text-xs lg:text-sm font-medium text-gray-900">
                                                        Version {chapterHistory.length - index}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {new Date(version.timestamp).toLocaleString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </p>
                                                </div>
                                                {index === 0 && (
                                                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                                        Latest
                                                    </span>
                                                )}
                                            </div>

                                            <div
                                                className="text-xs lg:text-sm text-gray-600 mb-3 line-clamp-3 leading-relaxed"
                                                dangerouslySetInnerHTML={{ __html: version.content }}
                                            />

                                            {version.content !== selectedChapter.content && (
                                                <button
                                                    onClick={() => handleRestore(version)}
                                                    className="text-xs lg:text-sm text-gray-700 hover:text-gray-900 font-medium hover:underline transition-colors"
                                                >
                                                    Restore this version
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-gray-400">
                                    <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-sm">No saved versions yet</p>
                                    <p className="text-xs mt-2 text-gray-500">Click "Save" to create your first version</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Autosave Status Indicator */}
            {!showHistory && (
                <div className="fixed bottom-6 right-6 bg-white border border-gray-100 rounded-lg shadow-sm px-4 py-2 text-xs lg:text-sm text-gray-500 transition-opacity duration-300"
                     style={{ opacity: (autosaveStatus === 'saved' && !hasUnsavedChanges) ? 0.6 : 1 }}>
                    {autosaveStatus === 'pending' && (
                        <>
                            <span className="inline-block w-2 h-2 bg-amber-400 rounded-full mr-2"></span>
                            Typing...
                        </>
                    )}
                    {autosaveStatus === 'saving' && (
                        <>
                            <svg className="inline-block w-3 h-3 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Autosaving...
                        </>
                    )}
                    {autosaveStatus === 'saved' && !hasUnsavedChanges && (
                        <>
                            <svg className="inline-block w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Autosaved
                        </>
                    )}
                </div>
            )}

            <style>{`
                [contenteditable]:empty:before {
                    content: attr(data-placeholder);
                    color: #d1d5db;
                    pointer-events: none;
                }
                [contenteditable] {
                    cursor: text;
                }
            `}</style>

            {/* Alert Modal */}
            <AlertModal
                isOpen={alertModal.isOpen}
                onClose={() => setAlertModal({ ...alertModal, isOpen: false })}
                onConfirm={alertModal.onConfirm}
                title={alertModal.title}
                message={alertModal.message}
                type={alertModal.type}
            />
        </div>
    );
}




