

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
      dragId.current = null; 
      dragOverId.current = null;
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

  // ✅ THÊM: Hàm đưa item lên đầu
  const moveToTop = useCallback((id) => {
    setItems((prev) => {
      const item = prev.find(item => item.id === id);
      if (!item) return prev;
      
      const remaining = prev.filter(item => item.id !== id);
      const reordered = [item, ...remaining];
      
      return reordered.map((item, i) => ({ 
        ...item, 
        order: i + 1 
      }));
    });
  }, [setItems]);

  // ✅ THÊM: Hàm thêm item mới vào đầu
  const addToTop = useCallback((newItem) => {
    setItems((prev) => {
      // Kiểm tra trùng lặp
      const exists = prev.some(item => item.id === newItem.id);
      if (exists) {
        return prev.map(item => 
          item.id === newItem.id ? { ...newItem, order: item.order } : item
        );
      }
      
      // Thêm mới vào đầu và cập nhật order
      const reordered = [newItem, ...prev];
      return reordered.map((item, i) => ({ 
        ...item, 
        order: i + 1 
      }));
    });
  }, [setItems]);

  // ✅ THÊM: Hàm thêm nhiều item mới vào đầu
  const addMultipleToTop = useCallback((newItems) => {
    setItems((prev) => {
      // Lọc ra các item không trùng
      const existingIds = new Set(prev.map(item => item.id));
      const uniqueNewItems = newItems.filter(item => !existingIds.has(item.id));
      
      if (uniqueNewItems.length === 0) return prev;
      
      // Thêm các item mới vào đầu
      const reordered = [...uniqueNewItems, ...prev];
      return reordered.map((item, i) => ({ 
        ...item, 
        order: i + 1 
      }));
    });
  }, [setItems]);

  return { 
    onDragStart, 
    onDragOver, 
    onDrop, 
    onDragEnd,
    moveToTop,        // Đưa item lên đầu
    addToTop,         // Thêm item mới vào đầu
    addMultipleToTop, // Thêm nhiều item mới vào đầu
  };
}