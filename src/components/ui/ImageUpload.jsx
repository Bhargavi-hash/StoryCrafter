import { useRef } from "react";

export default function ImageUpload({ currentImage, onImageChange, label = "Upload Image", aspectRatio = "portrait" }) {
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if it's an image
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onload = (event) => {
      onImageChange(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Portrait: 3:4 aspect ratio (height larger than width)
  const heightClass = aspectRatio === "portrait" ? "h-96" : "h-64";

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        {label}
      </label>

      {currentImage ? (
        <div className="mb-4 relative group">
          <img
            src={currentImage}
            alt="Preview"
            className={`w-full ${heightClass} object-cover rounded-xl bg-gray-50 border border-gray-200`}
          />
          {/* Edit pen icon */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute top-3 right-3 w-9 h-9 bg-white border border-gray-200 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50 shadow-sm"
            title="Edit image"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          {/* Remove button */}
          <button
            onClick={() => onImageChange('')}
            className="absolute bottom-3 right-3 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-600 hover:border-red-200"
          >
            Remove
          </button>
        </div>
      ) : (
        <div className="mb-4">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`w-full ${heightClass} border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 flex items-center justify-center cursor-pointer hover:border-gray-300 hover:bg-gray-100 transition-all`}
          >
            <div className="text-center">
              <svg className="mx-auto w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm text-gray-500 mb-1">Click to upload image</p>
              <p className="text-xs text-gray-400">Portrait orientation recommended</p>
            </div>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      <p className="text-xs text-gray-400">
        Supports JPG, PNG, GIF. Max 5MB. Portrait orientation works best.
      </p>
    </div>
  );
}
