import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useStoryCrafterStore = create(
  persist(
    (set, get) => ({
      /* ---------- Core navigation ---------- */
      currentView: "landing",
      selectedStory: null,
      selectedChapter: null,
      selectedCharacter: null,

      /* ---------- Data ---------- */
      stories: [],
      chapters: {},
      characters: {},
      worldMaps: {},
      chapterHistory: {},

      /* ---------- Navigation ---------- */
      setCurrentView: (view) => set({ currentView: view }),

      goToStoryDetail: (story) =>
        set({
          selectedStory: story,
          currentView: "story-detail"
        }),

      goToCharacterDetail: (character) =>
        set({
          selectedCharacter: character,
          currentView: "character-detail"
        }),

      goToChapterEditor: (chapter) =>
        set({
          selectedChapter: chapter,
          currentView: "chapter-editor"
        }),
      /* ---------- UI helpers ---------- */
      showConfirm: (title, message, onConfirm) => {
        if (window.alertManager?.showConfirm) {
          window.alertManager.showConfirm(title, message, onConfirm);
        } else {
          // absolute fallback — never breaks
          if (window.confirm(message)) {
            onConfirm?.();
          }
        }
      },

      /* ---------- Stories ---------- */
      addStory: () =>
        set((state) => ({
          stories: [
            ...state.stories,
            {
              id: `story-${Date.now()}`,
              title: "Untitled Story",
              status: "ongoing",
              description: "A new story begins...",
              genre: [],
              tags: [],
              createdAt: new Date().toISOString()
            }
          ]
        })),

      updateStory: (id, updates) =>
        set((state) => ({
          stories: state.stories.map((s) =>
            s.id === id ? { ...s, ...updates } : s
          ),
          selectedStory:
            state.selectedStory?.id === id
              ? { ...state.selectedStory, ...updates }
              : state.selectedStory
        })),

      deleteStory: (id) =>
        set((state) => {
          const chapters = { ...state.chapters };
          const characters = { ...state.characters };
          const worldMaps = { ...state.worldMaps };
          const chapterHistory = { ...state.chapterHistory };

          delete chapters[id];
          delete characters[id];
          delete worldMaps[id];
          delete chapterHistory[id];

          return {
            stories: state.stories.filter((s) => s.id !== id),
            chapters,
            characters,
            worldMaps,
            chapterHistory,
            currentView: "landing",
            selectedStory: null,
            selectedChapter: null
          };
        }),
      /* ---------- Characters ---------- */
      addCharacter: (storyId) =>
        set((state) => {
          const existing = state.characters[storyId] || [];
          const character = {
            id: `character-${Date.now()}`,
            storyId,
            name: `Character ${existing.length + 1}`,
            role: "Supporting",
            age: "",
            description: "",
            imageUrl: ""
          };

          return {
            characters: {
              ...state.characters,
              [storyId]: [...existing, character]
            }
          };
        }),

      updateCharacter: (storyId, characterId, updates) =>
        set((state) => ({
          characters: {
            ...state.characters,
            [storyId]: state.characters[storyId].map((c) =>
              c.id === characterId ? { ...c, ...updates } : c
            )
          },
          selectedCharacter:
            state.selectedCharacter?.id === characterId
              ? { ...state.selectedCharacter, ...updates }
              : state.selectedCharacter
        })),

      deleteCharacter: (storyId, characterId) =>
        set((state) => {
          const existing = state.characters[storyId] || [];
          return {
            characters: {
              ...state.characters,
              [storyId]: existing.filter((c) => c.id !== characterId)
            },
            selectedCharacter:
              state.selectedCharacter?.id === characterId
                ? null
                : state.selectedCharacter
          };
        }),


      /* ---------- Chapters ---------- */
      addChapter: (storyId) =>
        set((state) => {
          const existing = state.chapters[storyId] || [];
          const chapter = {
            id: `chapter-${Date.now()}`,
            storyId,
            title: `Chapter ${existing.length + 1}`,
            content: "",
            status: "writing",
            createdAt: new Date().toISOString()
          };

          return {
            chapters: {
              ...state.chapters,
              [storyId]: [...existing, chapter]
            }
          };
        }),

      updateChapter: (storyId, chapterId, updates) =>
        set((state) => ({
          chapters: {
            ...state.chapters,
            [storyId]: state.chapters[storyId].map((c) =>
              c.id === chapterId ? { ...c, ...updates } : c
            )
          },
          selectedChapter:
            state.selectedChapter?.id === chapterId
              ? { ...state.selectedChapter, ...updates }
              : state.selectedChapter
        })),

      deleteChapter: (storyId, chapterId) =>
        set((state) => {
          const existing = state.chapters[storyId] || [];
          return {
            chapters: {
              ...state.chapters,
              [storyId]: existing.filter((c) => c.id !== chapterId)
            },
            selectedChapter:
              state.selectedChapter?.id === chapterId
                ? null
                : state.selectedChapter
          };
        }),

      /* ---------- World Maps ---------- */
      addWorldMap: (storyId) => {
        const id = `worldmap-${Date.now()}`;
        set((state) => {
          const existing = state.worldMaps[storyId] || [];
          const map = {
            id,
            storyId,
            title: `Map ${existing.length + 1}`,
            imageUrl: ""
          };

          return {
            worldMaps: {
              ...state.worldMaps,
              [storyId]: [...existing, map]
            }
          };
        });
        return id;
      },

      updateWorldMap: (storyId, mapId, updates) =>
        set((state) => ({
          worldMaps: {
            ...state.worldMaps,
            [storyId]: state.worldMaps[storyId].map((m) =>
              m.id === mapId ? { ...m, ...updates } : m
            )
          }
        })),

      deleteWorldMap: (storyId, mapId) =>
        set((state) => {
          const existing = state.worldMaps[storyId] || [];
          return {
            worldMaps: {
              ...state.worldMaps,
              [storyId]: existing.filter((m) => m.id !== mapId)
            }
          };
        }),

      /* ---------- Chapter Versioning ---------- */
      saveChapterVersion: (storyId, chapterId, content) =>
        set((state) => {
          const versions =
            state.chapterHistory[storyId]?.[chapterId] || [];

          const newVersion = {
            timestamp: new Date().toISOString(),
            content
          };

          return {
            chapterHistory: {
              ...state.chapterHistory,
              [storyId]: {
                ...(state.chapterHistory[storyId] || {}),
                [chapterId]: [newVersion, ...versions].slice(0, 5)
              }
            },
            chapters: {
              ...state.chapters,
              [storyId]: state.chapters[storyId].map((c) =>
                c.id === chapterId ? { ...c, content } : c
              )
            }
          };
        }),

      getChapterHistory: (storyId, chapterId) =>
        get().chapterHistory?.[storyId]?.[chapterId] || []
    }),
    {
      name: "storycrafter-storage"
    }
  )
);

