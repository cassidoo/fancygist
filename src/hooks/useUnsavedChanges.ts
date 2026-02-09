import { useState, useCallback } from 'react';

export function useUnsavedChanges() {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const markDirty = useCallback(() => {
    setHasUnsavedChanges(true);
  }, []);

  const markClean = useCallback(() => {
    setHasUnsavedChanges(false);
  }, []);

  // Warn user before leaving page with unsaved changes
  const setupBeforeUnload = useCallback(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  return { hasUnsavedChanges, markDirty, markClean, setupBeforeUnload };
}
