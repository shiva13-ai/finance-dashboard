import { useState } from 'react';

export function useLocalData(key, initialVal) {
  const [val, setVal] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialVal;
    } catch (err) {
      console.warn("local storage error:", err);
      return initialVal;
    }
  });

  const setValue = (newVal) => {
    try {
      const valueToStore = newVal instanceof Function ? newVal(val) : newVal;
      setVal(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (e) {
      console.error(e);
    }
  };

  return [val, setValue];
}