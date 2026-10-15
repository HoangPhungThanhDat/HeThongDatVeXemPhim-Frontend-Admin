import { useState, useEffect, useCallback, useMemo } from 'react';
import { useToast } from '@chakra-ui/react';
import MovieApi from 'api/catalog/MovieApi';
import GenreApi from 'api/catalog/GenreApi';
import MovieCastApi from 'api/catalog/MovieCastApi'; // ✅ THÊM IMPORT
import { useServerPagination } from 'hooks/useServerPagination';

const PAGE_SIZE = 10;

export function usePhim() {
  const [genres, setGenres] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('Tất cả');
  const [filterGenre, setFilterGenre] = useState('Tất cả');
  const [stats, setStats] = useState({
    total: 0,
    playing: 0,
    upcoming: 0,
    ended: 0,
  });
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const toast = useToast();

  // Lấy danh sách genres
  const fetchGenres = useCallback(async () => {
    try {
      const response = await GenreApi.getAll();
      const data = response.data.data || response.data || [];
      setGenres(data);
    } catch (error) {
      console.error('Lỗi khi tải thể loại:', error);
    }
  }, []);

  // Lấy thống kê
  const fetchStats = useCallback(async () => {
    try {
      const response = await MovieApi.getAll();
      const data = response.data.data || response.data || [];

      const processedData = data.map((movie) => ({
        ...movie,
        genre: movie.genre || null,
        genreName:
          movie.genre?.Name || movie.GenreName || movie.genreName || '',
        genreId: movie.genre?.GenreId || movie.GenreId || movie.genreId || '',
      }));

      setStats({
        total: processedData.length,
        playing: processedData.filter(
          (m) => m.Status === 'NowShowing' || m.status === 'NowShowing',
        ).length,
        upcoming: processedData.filter(
          (m) => m.Status === 'ComingSoon' || m.status === 'ComingSoon',
        ).length,
        ended: processedData.filter(
          (m) => m.Status === 'Ended' || m.status === 'Ended',
        ).length,
      });
    } catch (error) {
      console.error('Lỗi khi tải thống kê:', error);
    }
  }, []);

  // Tạo params gửi lên server
  const extraParams = useMemo(() => {
    const params = {};
    if (search) params.search = search;
    if (filterStatus && filterStatus !== 'Tất cả') params.status = filterStatus;
    if (filterGenre && filterGenre !== 'Tất cả') params.genre = filterGenre;
    return params;
  }, [search, filterStatus, filterGenre]);

  // Sử dụng useServerPagination
  const {
    data: movies,
    total,
    totalPages,
    page,
    loading,
    goToPage,
    reload,
    prependData,
  } = useServerPagination(MovieApi.getPaged, { limit: PAGE_SIZE, extraParams });

  // ✅ Định nghĩa reloadAll TRƯỚC khi sử dụng trong các hàm khác
  const reloadAll = useCallback(() => {
    reload();
    fetchStats();
  }, [reload, fetchStats]);

  // ✅ Hàm lưu cast members vào MovieCast
  const saveCastMembers = useCallback(async (movieId, castMembers) => {
    if (!castMembers || castMembers.length === 0) return [];

    const results = [];
    const userId = localStorage.getItem('UserId') || '';

    for (const member of castMembers) {
      try {
        const data = {
          MovieId: movieId,
          Name: member.name.trim(),
          Role: member.role,
          Status: 'Active',
          CreatedBy: userId,
        };
        const response = await MovieCastApi.create(data);
        results.push(response.data.data || response.data);
      } catch (error) {
        console.error(`Lỗi khi thêm cast member "${member.name}":`, error);
      }
    }

    return results;
  }, []);

  // ✅ Gọi API tự động cập nhật trạng thái
  const autoUpdateStatus = useCallback(async () => {
    try {
      setIsUpdatingStatus(true);
      const response = await MovieApi.autoUpdateStatus();
      const data = response.data.data || response.data;

      if (data && data.updated_count > 0) {
        toast({
          title: 'Cập nhật trạng thái thành công',
          description: `Đã cập nhật ${data.updated_count} phim`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        reloadAll();
      }

      return data;
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái tự động:', error);
      return null;
    } finally {
      setIsUpdatingStatus(false);
    }
  }, [toast, reloadAll]);

  // ✅ Gọi API tự động cập nhật trạng thái (có toast thông báo)
  const autoUpdateStatusWithToast = useCallback(async () => {
    try {
      setIsUpdatingStatus(true);
      const response = await MovieApi.autoUpdateStatus();
      const data = response.data.data || response.data;

      if (data && data.updated_count > 0) {
        toast({
          title: 'Cập nhật trạng thái thành công',
          description: `Đã cập nhật ${data.updated_count} phim`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        reloadAll();
      } else if (data && data.updated_count === 0) {
        toast({
          title: 'Thông báo',
          description: 'Không có phim nào cần cập nhật trạng thái',
          status: 'info',
          duration: 2000,
          isClosable: true,
        });
      }

      return data;
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái tự động:', error);
      toast({
        title: 'Lỗi',
        description:
          error.response?.data?.message || 'Không thể cập nhật trạng thái phim',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return null;
    } finally {
      setIsUpdatingStatus(false);
    }
  }, [toast, reloadAll]);

  // ✅ Cập nhật trạng thái cho 1 phim
  const updateSingleStatus = useCallback(
    async (movieId) => {
      try {
        setIsUpdatingStatus(true);
        const response = await MovieApi.updateSingleStatus(movieId);
        const data = response.data.data || response.data;

        if (data && data.changed) {
          toast({
            title: 'Cập nhật trạng thái thành công',
            description: `Phim đã chuyển từ "${data.old_status}" sang "${data.new_status}"`,
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
          reloadAll();
        } else if (data && !data.changed) {
          toast({
            title: 'Thông báo',
            description: 'Trạng thái phim không thay đổi',
            status: 'info',
            duration: 2000,
            isClosable: true,
          });
        }

        return data;
      } catch (error) {
        console.error('Lỗi khi cập nhật trạng thái phim:', error);
        toast({
          title: 'Lỗi',
          description:
            error.response?.data?.message ||
            'Không thể cập nhật trạng thái phim',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return null;
      } finally {
        setIsUpdatingStatus(false);
      }
    },
    [toast, reloadAll],
  );

  // Xử lý movies khi có dữ liệu mới
  const processedMovies = useMemo(() => {
    if (!movies || movies.length === 0) return [];

    return movies.map((movie) => ({
      ...movie,
      genre: movie.genre || null,
      genreName: movie.genre?.Name || movie.GenreName || movie.genreName || '',
      genreId: movie.genre?.GenreId || movie.GenreId || movie.genreId || '',
      MovieId: movie.MovieId || movie.id,
      Title: movie.Title || movie.title,
      Status: movie.Status || movie.status,
      PosterUrl: movie.PosterUrl || movie.posterUrl,
      Duration: movie.Duration || movie.duration,
      ReleaseDate: movie.ReleaseDate || movie.releaseDate,
      Rated: movie.Rated || movie.rated,
      Language: movie.Language || movie.language,
      Description: movie.Description || movie.description,
      TrailerUrl: movie.TrailerUrl || movie.trailerUrl,
      CreatedAt: movie.CreatedAt || movie.createdAt,
      UpdatedAt: movie.UpdatedAt || movie.updatedAt,
      CreatedBy: movie.CreatedBy || movie.createdBy,
      UpdatedBy: movie.UpdatedBy || movie.updatedBy,
      // ✅ THÊM: Lấy danh sách cast members
      castMembers: movie.castMembers || movie.CastMembers || [],
    }));
  }, [movies]);

  // ✅ Lấy dữ liệu khi component mount
  useEffect(() => {
    const initData = async () => {
      await autoUpdateStatus();
      await fetchGenres();
      await fetchStats();
    };
    initData();
  }, []);

  const counts = useMemo(
    () => ({
      total: stats.total,
      playing: stats.playing,
      upcoming: stats.upcoming,
      ended: stats.ended,
    }),
    [stats],
  );

  // Toggle hide
  const toggleHide = useCallback(
    async (movie) => {
      const id = movie.MovieId || movie.id;
      const currentStatus = movie.Status || movie.status || 'NowShowing';
      const newStatus = currentStatus === 'NowShowing' ? 'Ended' : 'NowShowing';

      try {
        const formData = new FormData();
        formData.append('_method', 'PUT');

        const movieData = await MovieApi.getById(id);
        const fullMovie = movieData.data.data || movieData.data;

        formData.append(
          'UserId',
          fullMovie.UserId || localStorage.getItem('UserId') || '',
        );
        formData.append(
          'Title',
          fullMovie.Title || movie.Title || movie.title || '',
        );
        formData.append(
          'GenreId',
          fullMovie.GenreId || movie.GenreId || movie.genreId || '',
        );
        formData.append(
          'Duration',
          fullMovie.Duration || movie.Duration || movie.duration || '',
        );
        formData.append(
          'ReleaseDate',
          fullMovie.ReleaseDate || movie.ReleaseDate || movie.releaseDate || '',
        );
        formData.append('Status', newStatus);
        formData.append(
          'Rated',
          fullMovie.Rated || movie.Rated || movie.rated || 'P',
        );
        formData.append(
          'Format',
          fullMovie.Format || movie.Format || movie.format || '2D',
        );
        formData.append(
          'Language',
          fullMovie.Language || movie.Language || movie.language || 'Vietsub',
        );

        await MovieApi.update(id, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        reloadAll();

        toast({
          title: 'Thành công',
          description: `Phim đã ${newStatus === 'NowShowing' ? 'hiển thị' : 'ẩn'}`,
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      } catch (error) {
        console.error('Lỗi khi cập nhật trạng thái:', error);
        toast({
          title: 'Lỗi',
          description:
            error.response?.data?.message || 'Không thể cập nhật trạng thái',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    },
    [reloadAll, toast],
  );

  // ✅ DELETE - Xóa cả cast members liên quan
  const deleteMovie = useCallback(
    async (id) => {
      try {
        // 1. Lấy danh sách cast members để xóa
        const movieResponse = await MovieApi.getById(id);
        const movieData = movieResponse.data.data || movieResponse.data;
        const castMembers =
          movieData.castMembers || movieData.CastMembers || [];

        // 2. Xóa tất cả cast members của phim
        for (const cast of castMembers) {
          const castId = cast.CastId || cast.castId || cast.id;
          if (castId) {
            try {
              await MovieCastApi.delete(castId);
            } catch (error) {
              console.error(`Lỗi khi xóa cast ${castId}:`, error);
            }
          }
        }

        // 3. Xóa phim
        await MovieApi.delete(id);
        reloadAll();

        toast({
          title: 'Thành công',
          description: `Đã xóa phim và ${castMembers.length} diễn viên/đạo diễn liên quan`,
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      } catch (error) {
        console.error('Lỗi khi xóa phim:', error);
        toast({
          title: 'Lỗi',
          description: error.response?.data?.message || 'Không thể xóa phim',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    },
    [reloadAll, toast],
  );

  // ✅ CREATE - Thêm phim với cast members
  const createMovie = useCallback(
    async (formData) => {
      console.log('🚀 [createMovie] formData:', formData);

      try {
        const data = new FormData();
        const userId = localStorage.getItem('UserId') || '';

        if (!userId) {
          toast({
            title: 'Lỗi',
            description: 'Vui lòng đăng nhập để thêm phim',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          return false;
        }

        data.append('UserId', userId);
        data.append('Title', formData.Title || '');
        data.append('GenreId', formData.GenreId || '');
        data.append('Duration', formData.Duration || '');
        data.append('ReleaseDate', formData.ReleaseDate || '');
        data.append('Status', formData.Status || 'NowShowing');
        data.append('Rated', formData.Rated || 'P');
        data.append('Format', formData.Format || '2D');
        data.append('Director', formData.Director || '');
        // ✅ Cast sẽ được lưu qua MovieCast riêng
        data.append('Cast', '');
        data.append('Country', formData.Country || '');
        data.append('Distributor', formData.Distributor || '');
        data.append('TrailerUrl', formData.TrailerUrl || '');
        data.append('Description', formData.Description || '');

        let languageValue = formData.Language || '';
        if (Array.isArray(languageValue)) {
          languageValue = languageValue.join(',');
        }
        if (!languageValue) {
          languageValue = 'Vietsub';
        }
        data.append('Language', languageValue);

        if (formData.PosterFile instanceof File) {
          data.append('PosterUrl', formData.PosterFile);
        }

        // ✅ Lấy castMembers từ formData
        const castMembers = formData.CastMembers || [];
        console.log('📦 [createMovie] castMembers:', castMembers);

        const response = await MovieApi.create(data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        const newMovie = response.data.data || response.data;
        const movieId = newMovie.MovieId || newMovie.id;
        console.log('✅ [createMovie] Movie created with ID:', movieId);

        // ✅ Lưu cast members
        if (movieId && castMembers.length > 0) {
          console.log('💾 [createMovie] Saving cast members...');
          await saveCastMembers(movieId, castMembers);
          console.log('✅ [createMovie] Cast members saved');
        }

        const updatedMovieResponse = await MovieApi.getById(movieId);
        const fullMovie =
          updatedMovieResponse.data.data || updatedMovieResponse.data;

        const movieItem = {
          ...fullMovie,
          id: fullMovie.MovieId || fullMovie.id,
          MovieId: fullMovie.MovieId || fullMovie.id,
          title: fullMovie.Title || fullMovie.title || '',
          Title: fullMovie.Title || fullMovie.title || '',
          status: fullMovie.Status || fullMovie.status || 'NowShowing',
          Status: fullMovie.Status || fullMovie.status || 'NowShowing',
          genre: fullMovie.genre || null,
          genreName:
            fullMovie.genre?.Name ||
            fullMovie.GenreName ||
            fullMovie.genreName ||
            '',
          genreId:
            fullMovie.genre?.GenreId ||
            fullMovie.GenreId ||
            fullMovie.genreId ||
            '',
          GenreId:
            fullMovie.genre?.GenreId ||
            fullMovie.GenreId ||
            fullMovie.genreId ||
            '',
          duration: fullMovie.Duration || fullMovie.duration || '',
          Duration: fullMovie.Duration || fullMovie.duration || '',
          releaseDate: fullMovie.ReleaseDate || fullMovie.releaseDate || '',
          ReleaseDate: fullMovie.ReleaseDate || fullMovie.releaseDate || '',
          posterUrl: fullMovie.PosterUrl || fullMovie.posterUrl || '',
          PosterUrl: fullMovie.PosterUrl || fullMovie.posterUrl || '',
          description: fullMovie.Description || fullMovie.description || '',
          Description: fullMovie.Description || fullMovie.description || '',
          language: fullMovie.Language || fullMovie.language || '',
          Language: fullMovie.Language || fullMovie.language || '',
          rated: fullMovie.Rated || fullMovie.rated || 'P',
          Rated: fullMovie.Rated || fullMovie.rated || 'P',
          format: fullMovie.Format || fullMovie.format || '2D',
          Format: fullMovie.Format || fullMovie.format || '2D',
          director: fullMovie.Director || fullMovie.director || '',
          Director: fullMovie.Director || fullMovie.director || '',
          cast: fullMovie.Cast || fullMovie.cast || '',
          Cast: fullMovie.Cast || fullMovie.cast || '',
          country: fullMovie.Country || fullMovie.country || '',
          Country: fullMovie.Country || fullMovie.country || '',
          distributor: fullMovie.Distributor || fullMovie.distributor || '',
          Distributor: fullMovie.Distributor || fullMovie.distributor || '',
          trailerUrl: fullMovie.TrailerUrl || fullMovie.trailerUrl || '',
          TrailerUrl: fullMovie.TrailerUrl || fullMovie.trailerUrl || '',
          createdAt: new Date().toISOString(),
          CreatedAt: new Date().toISOString(),
          createdBy: userId,
          CreatedBy: userId,
          castMembers: fullMovie.castMembers || castMembers,
        };

        prependData(movieItem);
        await fetchStats();

        toast({
          title: 'Thành công 🎉',
          description: `Đã tạo phim "${movieItem.title}" thành công với ${castMembers.length} diễn viên/đạo diễn`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        return true;
      } catch (error) {
        console.error('❌ Lỗi khi thêm phim:', error);
        toast({
          title: 'Lỗi',
          description:
            error.response?.data?.message || 'Không thể thêm phim mới',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return false;
      }
    },
    [prependData, fetchStats, toast, saveCastMembers],
  );

  // ✅ UPDATE - Cập nhật phim với cast members
  const updateMovie = useCallback(
    async (id, formData) => {
      console.log('🔄 [updateMovie] id:', id);
      console.log('🔄 [updateMovie] formData:', formData);

      try {
        const data = new FormData();
        data.append('_method', 'PUT');

        const userId = localStorage.getItem('UserId') || '';

        data.append('UserId', userId || '');
        data.append('Title', formData.Title || '');
        data.append('GenreId', formData.GenreId || '');
        data.append('Duration', formData.Duration || '');
        data.append('ReleaseDate', formData.ReleaseDate || '');
        data.append('Status', formData.Status || 'NowShowing');
        data.append('Rated', formData.Rated || 'P');
        data.append('Format', formData.Format || '2D');
        data.append('Director', formData.Director || '');
        data.append('Cast', '');
        data.append('Country', formData.Country || '');
        data.append('Distributor', formData.Distributor || '');
        data.append('TrailerUrl', formData.TrailerUrl || '');
        data.append('Description', formData.Description || '');

        let languageValue = formData.Language || '';
        if (Array.isArray(languageValue)) {
          languageValue = languageValue.join(',');
        }
        if (!languageValue) {
          languageValue = 'Vietsub';
        }
        data.append('Language', languageValue);

        if (formData.PosterFile instanceof File) {
          data.append('PosterUrl', formData.PosterFile);
        }

        // ✅ Lấy cast members từ form
        const castMembers = formData.CastMembers || [];
        console.log('📦 [updateMovie] castMembers:', castMembers);

        // ✅ 1. Cập nhật phim
        await MovieApi.update(id, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        console.log('✅ [updateMovie] Movie updated');

        // ✅ 2. Xóa tất cả cast cũ
        const currentMovieResponse = await MovieApi.getById(id);
        const currentMovie =
          currentMovieResponse.data.data || currentMovieResponse.data;
        const currentCast =
          currentMovie.castMembers || currentMovie.CastMembers || [];

        for (const cast of currentCast) {
          const castId = cast.CastId || cast.castId || cast.id;
          if (castId) {
            try {
              await MovieCastApi.delete(castId);
            } catch (error) {
              console.error(`Lỗi khi xóa cast ${castId}:`, error);
            }
          }
        }
        console.log('✅ [updateMovie] Old cast deleted');

        // ✅ 3. Thêm cast mới
        if (castMembers.length > 0) {
          for (const member of castMembers) {
            try {
              const castData = {
                MovieId: id,
                Name: member.name.trim(),
                Role: member.role,
                Status: 'Active',
                CreatedBy: userId,
              };
              await MovieCastApi.create(castData);
            } catch (error) {
              console.error(
                `Lỗi khi thêm cast member "${member.name}":`,
                error,
              );
            }
          }
          console.log('✅ [updateMovie] New cast added');
        }

        await reloadAll();

        toast({
          title: 'Thành công',
          description: `Cập nhật phim thành công với ${castMembers.length} diễn viên/đạo diễn`,
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
        return true;
      } catch (error) {
        console.error('❌ Lỗi khi cập nhật phim:', error);
        toast({
          title: 'Lỗi',
          description:
            error.response?.data?.message || 'Không thể cập nhật phim',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return false;
      }
    },
    [reloadAll, toast],
  );

  return {
    movies: processedMovies,
    genres,
    loading,
    total,
    totalPages,
    page,
    goToPage,
    search,
    setSearch,
    filterStatus,
    setFilterStatus,
    filterGenre,
    setFilterGenre,
    counts,
    fetchGenres,
    toggleHide,
    deleteMovie,
    createMovie,
    updateMovie,
    reload: reloadAll,
    autoUpdateStatus: autoUpdateStatusWithToast,
    updateSingleStatus,
    isUpdatingStatus,
  };
}
