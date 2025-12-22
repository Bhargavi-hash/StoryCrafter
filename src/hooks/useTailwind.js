// hooks/useTailwind.js
import { useState, useEffect } from "react";

export function useTailwind() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Check if already loaded
    if (document.getElementById("tailwind-script")) {
      setLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.id = "tailwind-script";
    script.src = "https://cdn.tailwindcss.com";
    
    script.onload = () => {
      // Give Tailwind a moment to process the DOM
      setTimeout(() => setLoaded(true), 100);
    };
    
    document.head.appendChild(script);
  }, []);

  return loaded;
}

