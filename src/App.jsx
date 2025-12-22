import { useStoryCrafterStore } from "./state/useStoryCrafterStore";

import LandingView from "./views/LandingView";
import StoryDetailView from "./views/StoryDetailView";
import CharactersView from "./views/CharactersView";
import CharacterDetailView from "./views/CharacterDetailView";
import WorldView from "./views/WorldView";
import ChapterEditorView from "./views/ChapterEditorView";

export default function App() {
  const { currentView } = useStoryCrafterStore();

  switch (currentView) {
    case "landing":
      return <LandingView />;
    case "story-detail":
      return <StoryDetailView />;
    case "characters":
      return <CharactersView />;
    case "character-detail":
      return <CharacterDetailView />;
    case "world":
      return <WorldView />;
    case "chapter-editor":
      return <ChapterEditorView />;
    default:
      return <LandingView />;
  }
}


