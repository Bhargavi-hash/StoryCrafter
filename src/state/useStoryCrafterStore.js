// state/useStoryCrafterStore.js
import { useLocalStorageState } from "./useLocalStorageState";

export function useStoryCrafterStore() {
  const [currentView, setCurrentView] = useLocalStorageState("sc:view", "landing");
  const [selectedStory, setSelectedStory] = useLocalStorageState("sc:story", null);
  const [selectedChapter, setSelectedChapter] = useLocalStorageState("sc:chapter", null);
  const [selectedCharacter, setSelectedCharacter] = useLocalStorageState("sc:character", null);

  const [stories, setStories] = useLocalStorageState("sc:storycrafter.stories", []);
  const [chapters, setChapters] = useLocalStorageState("sc:chapters", {});
  const [characters, setCharacters] = useLocalStorageState("sc:characters", {});
  const [worldMaps, setWorldMaps] = useLocalStorageState("sc:world", {});
  const [chapterHistory, setChapterHistory] = useLocalStorageState("sc:chapterHistory", {});

  // Navigation helpers
  const goToStoryDetail = (story) => {
    setSelectedStory(story);
    setCurrentView('story-detail');
  };

  const goToCharacterDetail = (character) => {
    setSelectedCharacter(character);
    setCurrentView('character-detail');
  };

  const goToChapterEditor = (chapter) => {
    setSelectedChapter(chapter);
    setCurrentView('chapter-editor');
  };

  // Alert helper (uses global window.alertManager)
  const showConfirm = (title, message, onConfirm) => {
    if (window.alertManager && window.alertManager.showConfirm) {
      window.alertManager.showConfirm(title, message, onConfirm);
    } else {
      // Fallback to browser confirm if manager not ready
      if (confirm(message)) {
        onConfirm();
      }
    }
  };

  // Story operations
  const addStory = () => {
    // Default placeholder image (simple gradient pattern)
    const defaultCoverImage = 'data:image/svg+xml;base64,' + btoa(`
      <svg width="400" height="600" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:rgb(243,244,246);stop-opacity:1" />
            <stop offset="100%" style="stop-color:rgb(229,231,235);stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="400" height="600" fill="url(#grad1)"/>
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="18" fill="#9ca3af" text-anchor="middle" dominant-baseline="middle">Story Cover</text>
      </svg>
    `);
    
    const newStory = {
      id: `story-${Date.now()}`,
      title: 'Untitled Story',
      status: 'ongoing',
      description: 'A new story begins...',
      coverImage: defaultCoverImage,
      genre: [],
      tags: [],
      createdAt: new Date().toISOString()
    };
    setStories(prev => [...(prev || []), newStory]);
  };

  const updateStory = (id, updates) => {
    setStories(prev => (prev || []).map(s => s.id === id ? { ...s, ...updates } : s));
    // Keep selectedStory in sync
    if (selectedStory?.id === id) {
      setSelectedStory({ ...selectedStory, ...updates });
    }
  };

  const deleteStory = (id) => {
    setStories(prev => (prev || []).filter(s => s.id !== id));
    // Clean up chapters and related data
    const chaptersCopy = { ...(chapters || {}) };
    delete chaptersCopy[id];
    setChapters(chaptersCopy);
    
    const charactersCopy = { ...(characters || {}) };
    delete charactersCopy[id];
    setCharacters(charactersCopy);
    
    const worldMapsCopy = { ...(worldMaps || {}) };
    delete worldMapsCopy[id];
    setWorldMaps(worldMapsCopy);
    
    const historyCopy = { ...(chapterHistory || {}) };
    delete historyCopy[id];
    setChapterHistory(historyCopy);
    
    setCurrentView('landing');
  };

  // Chapter operations
  const addChapter = (storyId) => {
    const storyChapters = chapters[storyId] || [];
    const newChapter = {
      id: `chapter-${Date.now()}`,
      storyId,
      title: `Chapter ${storyChapters.length + 1}`,
      content: '',
      status: 'writing',
      createdAt: new Date().toISOString()
    };
    setChapters(prev => ({
      ...(prev || {}),
      [storyId]: [...(prev?.[storyId] || []), newChapter]
    }));
  };

  const updateChapter = (storyId, chapterId, updates) => {
    setChapters(prev => ({
      ...(prev || {}),
      [storyId]: (prev?.[storyId] || []).map(c => 
        c.id === chapterId ? { ...c, ...updates } : c
      )
    }));
    // Keep selectedChapter in sync
    if (selectedChapter?.id === chapterId) {
      setSelectedChapter({ ...selectedChapter, ...updates });
    }
  };

  const deleteChapter = (storyId, chapterId) => {
    setChapters(prev => ({
      ...(prev || {}),
      [storyId]: (prev?.[storyId] || []).filter(c => c.id !== chapterId)
    }));
    
    // Clean up chapter history
    if (chapterHistory[storyId]) {
      const historyCopy = { ...chapterHistory };
      if (historyCopy[storyId]) {
        delete historyCopy[storyId][chapterId];
        setChapterHistory(historyCopy);
      }
    }
  };

  // Chapter version history operations
  const saveChapterVersion = (storyId, chapterId, content) => {
    const timestamp = new Date().toISOString();
    const version = { timestamp, content };

    setChapterHistory(prev => {
      const current = prev || {};
      const storyHistory = current[storyId] || {};
      const chapterVersions = storyHistory[chapterId] || [];
      
      // Add new version and keep only last 5
      const updatedVersions = [version, ...chapterVersions].slice(0, 5);
      
      return {
        ...current,
        [storyId]: {
          ...storyHistory,
          [chapterId]: updatedVersions
        }
      };
    });

    // Also update the main chapter content
    updateChapter(storyId, chapterId, { content });
  };

  const getChapterHistory = (storyId, chapterId) => {
    return chapterHistory?.[storyId]?.[chapterId] || [];
  };

  // Character operations
  const addCharacter = (storyId) => {
    const newCharacter = {
      id: `char-${Date.now()}`,
      storyId,
      name: 'New Character',
      role: 'Supporting',
      age: '',
      gender: '',
      personality: '',
      imageUrl: '',
      createdAt: new Date().toISOString()
    };
    setCharacters(prev => ({
      ...(prev || {}),
      [storyId]: [...(prev?.[storyId] || []), newCharacter]
    }));
    // Stay on characters view - user can click to edit
  };

  const updateCharacter = (storyId, charId, updates) => {
    setCharacters(prev => ({
      ...(prev || {}),
      [storyId]: (prev?.[storyId] || []).map(c => 
        c.id === charId ? { ...c, ...updates } : c
      )
    }));
    // Keep selectedCharacter in sync
    if (selectedCharacter?.id === charId) {
      setSelectedCharacter({ ...selectedCharacter, ...updates });
    }
  };

  const deleteCharacter = (storyId, charId) => {
    setCharacters(prev => ({
      ...(prev || {}),
      [storyId]: (prev?.[storyId] || []).filter(c => c.id !== charId)
    }));
    setSelectedCharacter(null);
    setCurrentView('characters');
  };

  // World map operations
  const addWorldMap = (storyId) => {
    const newMap = {
      id: `map-${Date.now()}`,
      storyId,
      title: 'New Map',
      description: '',
      imageUrl: '',
      createdAt: new Date().toISOString()
    };
    setWorldMaps(prev => ({
      ...(prev || {}),
      [storyId]: [...(prev?.[storyId] || []), newMap]
    }));
    return newMap.id;
  };

  const updateWorldMap = (storyId, mapId, updates) => {
    setWorldMaps(prev => ({
      ...(prev || {}),
      [storyId]: (prev?.[storyId] || []).map(m => 
        m.id === mapId ? { ...m, ...updates } : m
      )
    }));
  };

  const deleteWorldMap = (storyId, mapId) => {
    setWorldMaps(prev => ({
      ...(prev || {}),
      [storyId]: (prev?.[storyId] || []).filter(m => m.id !== mapId)
    }));
  };

  return {
    currentView,
    selectedStory,
    selectedChapter,
    selectedCharacter,
    stories,
    chapters,
    characters,
    worldMaps,

    actions: {
      // Navigation
      goToStoryDetail,
      goToCharacterDetail,
      goToChapterEditor,
      setCurrentView,
      
      // Story operations
      addStory,
      updateStory,
      deleteStory,
      
      // Chapter operations
      addChapter,
      updateChapter,
      deleteChapter,
      saveChapterVersion,
      getChapterHistory,
      
      // Character operations
      addCharacter,
      updateCharacter,
      deleteCharacter,
      
      // World map operations
      addWorldMap,
      updateWorldMap,
      deleteWorldMap,
      
      // Alert operations
      showConfirm,
      
      // Direct setters
      setSelectedStory,
      setSelectedChapter,
      setSelectedCharacter,
      setStories,
      setChapters,
      setCharacters,
      setWorldMaps
    }
  };
}

