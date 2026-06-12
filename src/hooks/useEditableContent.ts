import { useState, useCallback, useEffect } from 'react';
import { useAdmin } from '@/contexts/AdminContext';

export function useEditableContent(initialValue: string, key: string): [string, () => void] {
  const { isAuthenticated, editContent } = useAdmin();

  const [value, setValue] = useState(() => {
    if (isAuthenticated) {
      const saved = sessionStorage.getItem(`edit_${key}`);
      return saved ?? initialValue;
    }
    return initialValue;
  });

  // Update value when language changes (if no admin edit saved)
  useEffect(() => {
    if (!isAuthenticated) {
      setValue(initialValue);
    } else {
      const saved = sessionStorage.getItem(`edit_${key}`);
      if (!saved) {
        setValue(initialValue);
      }
    }
  }, [initialValue, key, isAuthenticated]);

  const startEditing = useCallback(() => {
    const newValue = window.prompt('Edit content:', value);
    if (newValue !== null && newValue !== value) {
      setValue(newValue);
      sessionStorage.setItem(`edit_${key}`, newValue);
      if (editContent) editContent(key, newValue);
    }
  }, [value, key, editContent]);

  return [value, startEditing];
}
