export default function StoryCard({ story, onClick }) {
  return (
    <div onClick={onClick} className="rounded-xl border p-6 hover:shadow-sm">
      <h3>{story.title}</h3>
      <p>{story.description}</p>
    </div>
  );
}

