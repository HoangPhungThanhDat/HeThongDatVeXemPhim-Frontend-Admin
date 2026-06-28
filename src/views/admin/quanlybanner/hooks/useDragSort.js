// views/admin/quanlybanner/hooks/useDragSort.js

import { useRef, useCallback } from "react";

export function useDragSort(items, setItems) {
  const dragId = useRef(null);
  const dragOverId = useRef(null);

  const onDragStart = useCallback((id) => { 
    dragId.current = id; 
  }, []);

  const onDragOver = useCallback((e, id) => { 
    e.preventDefault(); 
    dragOverId.current = id; 
  }, []);

  const onDrop = useCallback(() => {
    if (dragId.current === null || dragOverId.current === null || dragId.current === dragOverId.current) {
      return;
    }
    setItems((prev) => {
      const sorted = [...prev].sort((a, b) => a.order - b.order);
      const fromIdx = sorted.findIndex((b) => b.id === dragId.current);
      const toIdx = sorted.findIndex((b) => b.id === dragOverId.current);
      if (fromIdx === -1 || toIdx === -1) return prev;
      const reordered = [...sorted];
      const [moved] = reordered.splice(fromIdx, 1);
      reordered.splice(toIdx, 0, moved);
      return reordered.map((item, i) => ({ ...item, order: i + 1 }));
    });
    dragId.current = null; 
    dragOverId.current = null;
  }, [setItems]);

  const onDragEnd = useCallback(() => { 
    dragId.current = null; 
    dragOverId.current = null; 
  }, []);

  return { onDragStart, onDragOver, onDrop, onDragEnd };
}