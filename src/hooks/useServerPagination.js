// // hooks/useServerPagination.js
// import { useState, useEffect, useCallback, useRef } from "react";

// /**
//  * @param {Function} apiFn      - Hàm gọi API, nhận { page, limit, ...params }
//  * @param {Object}   options
//  * @param {number}   options.limit       - Số dòng mỗi trang
//  * @param {Object}   options.extraParams - Wrap bằng useMemo() ở component cha
//  */
// export function useServerPagination(apiFn, { limit = 10, extraParams = {} } = {}) {
//   const [data, setData]             = useState([]);
//   const [total, setTotal]           = useState(0);
//   const [totalPages, setTotalPages] = useState(1);
//   const [page, setPage]             = useState(1);
//   const [loading, setLoading]       = useState(true);
//   const [pageKey, setPageKey]       = useState(0);

//   const abortRef        = useRef(null);
//   const currentPage     = useRef(1);
//   const extraParamsRef  = useRef("");

//   // ✅ Serialize 1 lần — so sánh string thay vì object reference
//   const extraParamsString = JSON.stringify(extraParams);

//   const fetchPage = useCallback(async (targetPage) => {
//     if (abortRef.current) abortRef.current.abort();
//     abortRef.current        = new AbortController();
//     currentPage.current     = targetPage;

//     setLoading(true);
//     try {
//       const res = await apiFn({
//         page:  targetPage,
//         limit,
//         ...JSON.parse(extraParamsRef.current || "{}"),
//         signal: abortRef.current.signal,
//       });

//       const d = res.data;
//       setData(d.data           ?? []);
//       setTotal(d.total         ?? 0);
//       setTotalPages(d.totalPages ?? 1);
//     } catch (err) {
//       if (err.name !== "CanceledError" && err.name !== "AbortError") {
//         console.error("Lỗi fetch:", err);
//       }
//     } finally {
//       setLoading(false);
//     }
//   }, [apiFn, limit]); // ✅ Không có extraParams trong deps — tránh re-create hàm

//   // Load lần đầu
//   useEffect(() => {
//     extraParamsRef.current = extraParamsString;
//     fetchPage(1);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // Khi extraParams thay đổi THẬT SỰ (so sánh JSON string, không phải object ref)
//   useEffect(() => {
//     if (extraParamsRef.current === extraParamsString) return; // Không đổi → bỏ qua
//     extraParamsRef.current = extraParamsString;
//     setPage(1);
//     setPageKey((k) => k + 1);
//     fetchPage(1);
//   }, [extraParamsString, fetchPage]);

//   const goToPage = useCallback((p) => {
//     setPage(p);
//     setPageKey((k) => k + 1);
//     fetchPage(p);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   }, [fetchPage]);

//   const reload = useCallback(() => {
//     fetchPage(currentPage.current);
//   }, [fetchPage]);

//   return { data, total, totalPages, page, loading, pageKey, goToPage, reload };
// }

















import { useState, useEffect, useCallback, useRef } from "react";

/**
 * @param {Function} apiFn      - Hàm gọi API, nhận { page, limit, ...params }
 * @param {Object}   options
 * @param {number}   options.limit       - Số dòng mỗi trang
 * @param {Object}   options.extraParams - Wrap bằng useMemo() ở component cha
 */
export function useServerPagination(apiFn, { limit = 10, extraParams = {} } = {}) {
  const [data, setData]             = useState([]);
  const [total, setTotal]           = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage]             = useState(1);
  const [loading, setLoading]       = useState(true);
  const [pageKey, setPageKey]       = useState(0);

  const abortRef        = useRef(null);
  const currentPage     = useRef(1);
  const extraParamsRef  = useRef("");

  // Serialize 1 lần — so sánh string thay vì object reference
  const extraParamsString = JSON.stringify(extraParams);

  const fetchPage = useCallback(async (targetPage) => {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current        = new AbortController();
    currentPage.current     = targetPage;

    setLoading(true);
    try {
      const res = await apiFn({
        page:  targetPage,
        limit,
        ...JSON.parse(extraParamsRef.current || "{}"),
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
    extraParamsRef.current = extraParamsString;
    fetchPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Khi extraParams thay đổi THẬT SỰ
  useEffect(() => {
    if (extraParamsRef.current === extraParamsString) return;
    extraParamsRef.current = extraParamsString;
    setPage(1);
    setPageKey((k) => k + 1);
    fetchPage(1);
  }, [extraParamsString, fetchPage]);

  const goToPage = useCallback((p) => {
    setPage(p);
    setPageKey((k) => k + 1);
    fetchPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [fetchPage]);

  const reload = useCallback(() => {
    fetchPage(currentPage.current);
  }, [fetchPage]);

  // ✅ THÊM: Hàm thêm item vào đầu danh sách
  const prependData = useCallback((newItem) => {
    setData(prev => {
      // Kiểm tra trùng lặp
      const exists = prev.some(item => {
        const id1 = item?.id || item?.MovieId || item?.Id || item?.BannerId || item?.NewsId;
        const id2 = newItem?.id || newItem?.MovieId || newItem?.Id || newItem?.BannerId || newItem?.NewsId;
        return String(id1) === String(id2);
      });
      
      if (exists) {
        console.log("⚠️ Item already exists in list");
        return prev;
      }
      
      // Thêm vào đầu
      console.log(" Adding new item to top of list");
      return [newItem, ...prev];
    });
    
    // Cập nhật total
    setTotal(prev => prev + 1);
    setTotalPages(prev => Math.ceil((prev * limit + 1) / limit));
  }, [limit]);

  // THÊM: Hàm cập nhật một item
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

  // THÊM: Hàm xóa một item
  const removeData = useCallback((id) => {
    setData(prev => prev.filter(item => {
      const itemId = item?.id || item?.MovieId || item?.Id || item?.BannerId || item?.NewsId;
      return String(itemId) !== String(id);
    }));
    
    // Cập nhật total
    setTotal(prev => Math.max(0, prev - 1));
    setTotalPages(prev => Math.ceil((prev * limit - 1) / limit));
  }, [limit]);

  // THÊM: Hàm đưa item lên đầu
  const moveToTop = useCallback((id) => {
    setData(prev => {
      const index = prev.findIndex(item => {
        const itemId = item?.id || item?.MovieId || item?.Id || item?.BannerId || item?.NewsId;
        return String(itemId) === String(id);
      });
      
      if (index <= 0) return prev;
      
      const item = prev[index];
      const newData = [item, ...prev.slice(0, index), ...prev.slice(index + 1)];
      return newData;
    });
  }, []);

  // THÊM: Hàm set data trực tiếp
  const setDataDirect = useCallback((newData) => {
    setData(newData);
  }, []);

  // THÊM: Hàm làm mới dữ liệu
  const refreshData = useCallback(() => {
    fetchPage(currentPage.current);
  }, [fetchPage]);

  return { 
    data, 
    total, 
    totalPages, 
    page, 
    loading, 
    pageKey, 
    goToPage, 
    reload,
    // Các hàm mới
    prependData,    // Thêm vào đầu
    updateData,     // Cập nhật
    removeData,     // Xóa
    moveToTop,      // Đưa lên đầu
    setData: setDataDirect, // Set data trực tiếp
    refreshData,    // Làm mới
  };
}