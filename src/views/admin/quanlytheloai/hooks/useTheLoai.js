

import { useState, useEffect, useCallback, useMemo } from "react";
import { useToast } from "@chakra-ui/react";
import GenreApi from "../../../../api/GenreApi";

export function useTheLoai() {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const toast = useToast();

  const fetchGenres = useCallback(async () => {
    setLoading(true);
    try {
      const response = await GenreApi.getAll();
      const data = response.data.data || response.data || [];
      
      const transformed = data.map((item) => ({
        ...item,
        id: item.GenreId || item.id,
        name: item.Name || item.name || "",
        slug: item.Slug || item.slug || "",
        color: item.Color || item.color || "#f97316",
        icon: item.Icon || item.icon || "FaTag",
        description: item.Description || item.description || "",
        status: item.Status || item.status || "Active",
        featured: item.featured || false,
        movieCount: item.movieCount || 0,
        createdAt: item.CreatedAt || item.createdAt || "",
        updatedAt: item.UpdatedAt || item.updatedAt || "",
        createdBy: item.CreatedBy || item.createdBy || "",
        updatedBy: item.UpdatedBy || item.updatedBy || "",
      }));
      setGenres(transformed);
    } catch (error) {
      console.error("Lỗi khi tải danh sách thể loại:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách thể loại",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchGenres();
  }, [fetchGenres]);

  // Stats
  const counts = useMemo(() => ({
    total: genres.length,
    active: genres.filter((g) => g.status === "Active").length,
    featured: genres.filter((g) => g.featured && g.status === "Active").length,
    movies: genres.reduce((s, g) => s + (g.movieCount || 0), 0),
  }), [genres]);

  // Toggle status
  const toggleStatus = useCallback(async (id) => {
    const genre = genres.find((g) => (g.GenreId || g.id) === id);
    if (!genre) return;

    const newStatus = genre.status === "Active" ? "Inactive" : "Active";
    try {
      await GenreApi.update(id, {
        Status: newStatus,
      });

      setGenres((prev) =>
        prev.map((g) =>
          (g.GenreId || g.id) === id ? { ...g, status: newStatus } : g
        )
      );
      
      toast({
        title: "Thành công",
        description: `Thể loại đã ${newStatus === "Active" ? "hiển thị" : "ẩn"}`,
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
  }, [genres, toast]);

  // Delete
  const deleteGenre = useCallback(async (id) => {
    try {
      await GenreApi.delete(id);
      setGenres((prev) => prev.filter((g) => (g.GenreId || g.id) !== id));
      toast({
        title: "Thành công",
        description: "Thể loại đã được xóa",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Lỗi khi xóa thể loại:", error);
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || "Không thể xóa thể loại",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [toast]);

  // Create
  const createGenre = useCallback(async (formData) => {
    try {
      const response = await GenreApi.create(formData);
      const newGenre = response.data.data || response.data;
      
      setGenres((prev) => [
        {
          ...newGenre,
          id: newGenre.GenreId || newGenre.id,
          name: newGenre.Name || newGenre.name,
          status: newGenre.Status || newGenre.status,
          movieCount: 0,
        },
        ...prev
      ]);
      
      toast({
        title: "Thành công",
        description: "Thêm thể loại mới thành công",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      return true;
    } catch (error) {
      console.error("Lỗi khi thêm thể loại:", error);
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || "Không thể thêm thể loại mới",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return false;
    }
  }, [toast]);

  // Update
  const updateGenre = useCallback(async (id, formData) => {
    try {
      await GenreApi.update(id, formData);
      
      setGenres((prev) =>
        prev.map((g) =>
          (g.GenreId || g.id) === id ? { ...g, ...formData } : g
        )
      );
      
      toast({
        title: "Thành công",
        description: "Cập nhật thể loại thành công",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      return true;
    } catch (error) {
      console.error("Lỗi khi cập nhật thể loại:", error);
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || "Không thể cập nhật thể loại",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return false;
    }
  }, [toast]);

  return {
    genres,
    loading,
    search,
    setSearch,
    filterStatus,
    setFilterStatus,
    counts,
    fetchGenres,
    toggleStatus,
    deleteGenre,
    createGenre,
    updateGenre,
  };
}