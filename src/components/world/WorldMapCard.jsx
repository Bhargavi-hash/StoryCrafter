export default function WorldMapCard({ map, onClick }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 transition-all"
    >
      {map.imageUrl ? (
        <img
          src={map.imageUrl}
          alt={map.title}
          className="h-40 lg:h-56 w-full object-cover bg-gray-50"
        />
      ) : (
        <div className="h-40 lg:h-56 bg-gray-50 flex items-center justify-center text-xs lg:text-sm text-gray-300">
          No Image
        </div>
      )}

      <div className="p-3 lg:p-4">
        <h3 className="text-sm lg:text-base font-medium text-gray-900 truncate">
          {map.title || "Untitled Map"}
        </h3>
      </div>
    </div>
  );
}


