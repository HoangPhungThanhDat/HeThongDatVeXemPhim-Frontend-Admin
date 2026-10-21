import { useState, useEffect, useCallback, useRef } from "react";

export function useServerPagination(apiFn, { limit = 10, extraParams = {} } = {}) {
  const [data, setData]             = useState([]);
  const [total, setTotal]           = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage]             = useState(1);
  const [loading, setLoading]       = useState(true);
  const [pageKey, setPageKey]       = useState(0);

  const abortRef        = useRef(null);
  const currentPage     = useRef(1);
  
  // ✅ Lưu trữ object extraParams trực tiếp
  const extraParamsRef  = useRef(extraParams); 
  const hasMounted      = useRef(false);

  // Stringify để so sánh xem params có thay đổi thật sự không
  const extraParamsString = JSON.stringify(extraParams);

  const fetchPage = useCallback(async (targetPage) => {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current        = new AbortController();
    currentPage.current     = targetPage;

    setLoading(true);
    try {
      // ✅ Gộp trực tiếp object extraParams hiện tại vào request
      const res = await apiFn({
        page:  targetPage,
        limit,
        ...extraParamsRef.current, 
        signal: abortRef.current.signal,
      });

      // Xử lý response linh hoạt
      let items = [];
      let totalCount = 0;
      let totalPagesCount = 1;
      
      if (res?.data?.data) {
        if (Array.isArray(res.data.data)) {
          items = res.data.data;
          totalCount = res.data.total || items.length;
          totalPagesCount = res.data.totalPages || Math.ceil(totalCount / limit) || 1;
        } else if (res.data.data.items) {
          items = res.data.data.items;
          totalCount = res.data.data.total || items.length;
          totalPagesCount = res.data.data.totalPages || Math.ceil(totalCount / limit) || 1;
        } else {
          items = [res.data.data];
          totalCount = 1;
          totalPagesCount = 1;
        }
      } else if (res?.data) {
        if (Array.isArray(res.data)) {
          items = res.data;
          totalCount = res.total || items.length;
          totalPagesCount = res.totalPages || Math.ceil(totalCount / limit) || 1;
        } else if (res.data.items) {
          items = res.data.items;
          totalCount = res.data.total || items.length;
          totalPagesCount = res.data.totalPages || Math.ceil(totalCount / limit) || 1;
        } else {
          items = [res.data];
          totalCount = 1;
          totalPagesCount = 1;
        }
      } else if (Array.isArray(res)) {
        items = res;
        totalCount = res.length;
        totalPagesCount = Math.ceil(totalCount / limit) || 1;
      } else {
        items = [];
        totalCount = 0;
        totalPagesCount = 1;
      }
      
      setData(items);
      setTotal(totalCount);
      setTotalPages(totalPagesCount);
    } catch (err) {
      if (err.name !== "CanceledError" && err.name !== "AbortError") {
        console.error("Lỗi fetch:", err);
      }
    } finally {
      setLoading(false);
    }
  }, [apiFn, limit]);

  // Load lần đầu
  useEffect(() => {
    if (hasMounted.current) return;
    hasMounted.current = true;
    
    extraParamsRef.current = extraParams;
    fetchPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Khi extraParams thay đổi
  useEffect(() => {
    if (!hasMounted.current) return;
    
    // So sánh trực tiếp bằng string
    if (JSON.stringify(extraParamsRef.current) === extraParamsString) return;

    // Cập nhật ref và gọi lại API
    extraParamsRef.current = extraParams;
    setPage(1);
    setPageKey((k) => k + 1);
    fetchPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [extraParamsString]);

  const goToPage = useCallback((p) => {
    setPage(p);
    setPageKey((k) => k + 1);
    fetchPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [fetchPage]);

  const reload = useCallback(() => {
    fetchPage(currentPage.current);
  }, [fetchPage]);

  const prependData = useCallback((newItem) => {
    setData(prev => {
      const exists = prev.some(item => {
        const id1 = item?.id || item?.MovieId || item?.Id || item?.BannerId || item?.NewsId;
        const id2 = newItem?.id || newItem?.MovieId || newItem?.Id || newItem?.BannerId || newItem?.NewsId;
        return String(id1) === String(id2);
      });
      
      if (exists) return prev;
      return [newItem, ...prev];
    });
    
    setTotal(prev => prev + 1);
    setTotalPages(prev => Math.ceil((prev * limit + 1) / limit));
  }, [limit]);

  const updateData = useCallback((id, updatedItem) => {
    setData(prev => 
      prev.map(item => {
        const itemId = item?.id || item?.MovieId || item?.Id || item?.BannerId || item?.NewsId;
        if (String(itemId) === String(id)) {
          return { ...item, ...updatedItem };
        }
        return item;
      })
    );
  }, []);

  const removeData = useCallback((id) => {
    setData(prev => prev.filter(item => {
      const itemId = item?.id || item?.MovieId || item?.Id || item?.BannerId || item?.NewsId;
      return String(itemId) !== String(id);
    }));
    
    setTotal(prev => Math.max(0, prev - 1));
    setTotalPages(prev => Math.ceil((prev * limit - 1) / limit));
  }, [limit]);

  const moveToTop = useCallback((id) => {
    setData(prev => {
      const index = prev.findIndex(item => {
        const itemId = item?.id || item?.MovieId || item?.Id || item?.BannerId || item?.NewsId;
        return String(itemId) === String(id);
      });
      
      if (index <= 0) return prev;
      const item = prev[index];
      return [item, ...prev.slice(0, index), ...prev.slice(index + 1)];
    });
  }, []);

  const setDataDirect = useCallback((newData) => setData(newData), []);
  const refreshData = useCallback(() => fetchPage(currentPage.current), [fetchPage]);

  return { 
    data, total, totalPages, page, loading, pageKey, goToPage, reload,
    prependData, updateData, removeData, moveToTop, setData: setDataDirect, refreshData,
  };
}