import { useState, useEffect } from "react";
import initialData from "../data/store.json";

// Hook to pull data and provide a save function that hits our Vite plugin
export function useStore() {
  const [data, setData] = useState(initialData);

  // We rely on standard hot module reloading to see changes, but we'll also provide a manual save
  const save = async (newData) => {
    try {
      const res = await fetch("/api/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData, null, 2),
      });
      if (res.ok) {
        setData(newData);
        return true;
      }
    } catch (err) {
      console.error("Failed to save data:", err);
    }
    return false;
  };

  return { data, save };
}
