"use client";

import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage after hydration
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        const parsed = JSON.parse(item);
        // Handle Date objects for Trip createdAt
        if (Array.isArray(parsed)) {
          const restored = parsed.map((item: Record<string, unknown>) => {
            if (item.createdAt && typeof item.createdAt === "string") {
              return { ...item, createdAt: new Date(item.createdAt) };
            }
            return item;
          });
          setStoredValue(restored as T);
        } else {
          setStoredValue(parsed);
        }
      }
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
    }
    setIsHydrated(true);
  }, [key]);

  // Return a wrapped version of useState's setter function that persists to localStorage
  const setValue: React.Dispatch<React.SetStateAction<T>> = (value) => {
    try {
      // Allow value to be a function
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Only return stored value after hydration to prevent mismatch
  return [isHydrated ? storedValue : initialValue, setValue];
}

export default useLocalStorage;
