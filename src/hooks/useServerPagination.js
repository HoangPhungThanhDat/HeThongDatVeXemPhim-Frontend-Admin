// hooks/useServerPagination.js
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

  // ✅ Serialize 1 lần — so sánh string thay vì object reference
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

      const d = res.data;
      setData(d.data           ?? []);
      setTotal(d.total         ?? 0);
      setTotalPages(d.totalPages ?? 1);
    } catch (err) {
      if (err.name !== "CanceledError" && err.name !== "AbortError") {
        console.error("Lỗi fetch:", err);
      }
    } finally {
      setLoading(false);
    }
  }, [apiFn, limit]); // ✅ Không có extraParams trong deps — tránh re-create hàm

  // Load lần đầu
  useEffect(() => {
    extraParamsRef.current = extraParamsString;
    fetchPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Khi extraParams thay đổi THẬT SỰ (so sánh JSON string, không phải object ref)
  useEffect(() => {
    if (extraParamsRef.current === extraParamsString) return; // Không đổi → bỏ qua
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

  return { data, total, totalPages, page, loading, pageKey, goToPage, reload };
}