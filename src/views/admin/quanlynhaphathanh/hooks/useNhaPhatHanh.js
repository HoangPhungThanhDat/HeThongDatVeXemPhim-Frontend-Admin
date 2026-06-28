

import { useState, useEffect, useCallback, useMemo } from "react";
import { useToast } from "@chakra-ui/react";
import DistributorApi from "../../../../api/DistributorApi";
import MovieApi from "../../../../api/MovieApi";

export function useNhaPhatHanh() {
  const [distributors, setDistributors] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const [filterRegion, setFilterRegion] = useState("Tất cả");
  const toast = useToast();

  // Lấy dữ liệu
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [distributorRes, movieRes] = await Promise.all([
        DistributorApi.getAll(),
        MovieApi.getAll(),
      ]);

      const distributorsData = distributorRes.data.data || distributorRes.data || [];
      const moviesData = movieRes.data.data || movieRes.data || [];

      // Transform dữ liệu distributors
      const transformed = distributorsData.map((item) => ({
        ...item,
        id: item.DistributorId || item.id,
        name: item.Name || item.name || "",
        shortName: item.ShortName || item.shortName || "",
        type: item.Type || item.type || "International",
        country: item.Country || item.country || "",
        status: item.Status || item.status || "Active",
        contactPerson: item.ContactPerson || item.contactPerson || "",
        email: item.Email || item.email || "",
        phone: item.Phone || item.phone || "",
        website: item.Website || item.website || "",
        address: item.Address || item.address || "",
        description: item.Description || item.description || "",
        logoColor: item.LogoColor || item.logoColor || "#f97316",
        moviesCount: item.moviesCount || 0,
        createdAt: item.CreatedAt || item.createdAt || "",
        updatedAt: item.UpdatedAt || item.updatedAt || "",
        createdBy: item.CreatedBy || item.createdBy || "",
        updatedBy: item.UpdatedBy || item.updatedBy || "",
        movieId: item.MovieId || item.movieId || "",
      }));

      setDistributors(transformed);
      setMovies(moviesData);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách nhà phát hành",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filter
  const filtered = useMemo(() => {
    return distributors
      .filter((d) => {
        const q = search.toLowerCase();
        const matchSearch = (d.name || "").toLowerCase().includes(q) ||
          (d.country || "").toLowerCase().includes(q) ||
          (d.contactPerson || "").toLowerCase().includes(q) ||
          (d.email || "").toLowerCase().includes(q);
        const matchStatus = filterStatus === "Tất cả" || d.status === filterStatus;
        const matchRegion = filterRegion === "Tất cả" || d.type === filterRegion;
        return matchSearch && matchStatus && matchRegion;
      })
      .sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  }, [distributors, search, filterStatus, filterRegion]);

  // Stats
  const counts = useMemo(() => ({
    total: distributors.length,
    active: distributors.filter((d) => d.status === "Active").length,
    intl: distributors.filter((d) => d.type === "International").length,
    domestic: distributors.filter((d) => d.type === "Domestic").length,
  }), [distributors]);

  const totalMovies = useMemo(() => 
    distributors.reduce((s, d) => s + (d.moviesCount || 0), 0),
  [distributors]);

  // Toggle status
  const toggleStatus = useCallback(async (distributor) => {
    const id = distributor.DistributorId || distributor.id;
    const newStatus = distributor.status === "Active" ? "Inactive" : "Active";
    
    try {
      await DistributorApi.update(id, {
        Status: newStatus,
      });

      setDistributors((prev) =>
        prev.map((d) =>
          (d.DistributorId || d.id) === id ? { ...d, status: newStatus } : d
        )
      );
      
      toast({
        title: "Thành công",
        description: `Nhà phát hành đã ${newStatus === "Active" ? "kích hoạt" : "khóa"}`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || "Không thể cập nhật trạng thái",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [toast]);

  // Delete
  const deleteDistributor = useCallback(async (id) => {
    try {
      await DistributorApi.delete(id);
      setDistributors((prev) => prev.filter((d) => (d.DistributorId || d.id) !== id));
      toast({
        title: "Thành công",
        description: "Nhà phát hành đã được xóa",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      return true;
    } catch (error) {
      console.error("Lỗi khi xóa nhà phát hành:", error);
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || "Không thể xóa nhà phát hành",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
  }, [toast]);

  // Create
  const createDistributor = useCallback(async (formData) => {
    try {
      const response = await DistributorApi.create(formData);
      const newDistributor = response.data.data || response.data;
      
      setDistributors((prev) => [
        {
          ...newDistributor,
          id: newDistributor.DistributorId || newDistributor.id,
          name: newDistributor.Name || newDistributor.name,
          status: newDistributor.Status || newDistributor.status,
          moviesCount: 0,
        },
        ...prev
      ]);
      
      toast({
        title: "Thành công",
        description: "Thêm nhà phát hành mới thành công",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      return true;
    } catch (error) {
      console.error("Lỗi khi thêm nhà phát hành:", error);
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || "Không thể thêm nhà phát hành mới",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return false;
    }
  }, [toast]);

  // Update
  const updateDistributor = useCallback(async (id, formData) => {
    try {
      await DistributorApi.update(id, formData);
      
      setDistributors((prev) =>
        prev.map((d) =>
          (d.DistributorId || d.id) === id ? { ...d, ...formData } : d
        )
      );
      
      toast({
        title: "Thành công",
        description: "Cập nhật nhà phát hành thành công",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      return true;
    } catch (error) {
      console.error("Lỗi khi cập nhật nhà phát hành:", error);
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || "Không thể cập nhật nhà phát hành",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return false;
    }
  }, [toast]);

  return {
    distributors: filtered,
    allDistributors: distributors,
    movies,
    loading,
    search,
    setSearch,
    filterStatus,
    setFilterStatus,
    filterRegion,
    setFilterRegion,
    counts,
    totalMovies,
    fetchData,
    toggleStatus,
    deleteDistributor,
    createDistributor,
    updateDistributor,
  };
}