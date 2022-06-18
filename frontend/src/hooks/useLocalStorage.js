import { useState, useEffect } from 'react';

const PREFIX = 'task-4';

function getSavedValue(key, initialValue) {
  const jsonValue = JSON.parse(localStorage.getItem(key));
  if (jsonValue != null) return jsonValue;

  if (typeof initialValue === 'function') {
    return initialValue();
  } else {
    return initialValue;
  }
}

export default function useLocalStorage(key, intialValue) {
  const prefixedKey = `${PREFIX}.${key}`;
  const [value, setValue] = useState(() => {
    return getSavedValue(prefixedKey, intialValue);
  });

  useEffect(() => {
    localStorage.setItem(prefixedKey, JSON.stringify(value));
  }, [prefixedKey, value]);

  return [value, setValue];
}
