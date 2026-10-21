// src/views/admin/quanlyphim/hooks/usePhim.js

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useToast } from '@chakra-ui/react';
import MovieApi from 'api/catalog/MovieApi';
import GenreApi from 'api/catalog/GenreApi';
import MovieCastApi from 'api/catalog/MovieCastApi';
import { useServerPagination } from 'hooks/useServerPagination';

const PAGE_SIZE = 10;

export function usePhim() {
  const [genres, setGenres] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('Tất cả');
  const [filterGenre, setFilterGenre] = useState('Tất cả');
  const [stats, setStats] = useState({ total: 0, playing: 0, upcoming: 0, ended: 0 });
  const toast = useToast();

  const hasFetched = useRef(false);

  const fetchGenres = useCallback(async () => {
    try {
      const response = await GenreApi.getAll();
      const data = response.data.data || response.data || [];
      setGenres(data);
    } catch (error) {
      console.error('Lỗi khi tải thể loại:', error);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const response = await MovieApi.getAll();
      const data = response.data.data || response.data || [];
      const processedData = data.map((movie) => ({
        ...movie,
        genre: movie.genre || null,
        genreName: movie.genre?.Name || movie.GenreName || movie.genreName || '',
        genreId: movie.genre?.GenreId || movie.GenreId || movie.genreId || '',
      }));

      setStats({
        total: processedData.length,
        playing: processedData.filter(m => m.Status === 'NowShowing' || m.status === 'NowShowing').length,
        upcoming: processedData.filter(m => m.Status === 'ComingSoon' || m.status === 'ComingSoon').length,
        ended: processedData.filter(m => m.Status === 'Ended' || m.status === 'Ended').length,
      });
    } catch (error) {
      console.error('Lỗi khi tải thống kê:', error);
    }
  }, []);

  // ✅ TẠO PARAMS GỬI LÊN SERVER
  const extraParams = useMemo(() => {
    const params = {};
    if (search && search.trim() !== '') params.search = search.trim();
    if (filterStatus && filterStatus !== 'Tất cả') params.status = filterStatus;
    if (filterGenre && filterGenre !== 'Tất cả') params.genre = String(filterGenre).trim();
    return params;
  }, [search, filterStatus, filterGenre]);

  const {
    data: movies, total, totalPages, page, loading, goToPage, reload, prependData, updateData,
  } = useServerPagination(MovieApi.getPaged, { limit: PAGE_SIZE, extraParams });

  const reloadAll = useCallback(() => {
    reload();
    fetchStats();
  }, [reload, fetchStats]);

  const saveCastMembers = useCallback(async (movieId, castMembers) => {
    if (!castMembers || castMembers.length === 0) return [];
    const results = [];
    const userId = localStorage.getItem('UserId') || '';

    for (const member of castMembers) {
      try {
        const data = { MovieId: movieId, Name: member.name.trim(), Role: member.role, Status: 'Active', CreatedBy: userId };
        const response = await MovieCastApi.create(data);
        results.push(response.data.data || response.data);
      } catch (error) {
        console.error(`Lỗi khi thêm cast member "${member.name}":`, error);
      }
    }
    return results;
  }, []);

  // ✅ HÀM CẬP NHẬT TRẠNG THÁI (OPTIMISTIC UI - MƯỢT MÀ)
  const updateMovieStatus = useCallback(async (movie, newStatus) => {
    const id = movie.MovieId || movie.id;
    const oldStatus = movie.Status || movie.status || 'Ended';

    updateData(id, { Status: newStatus, status: newStatus });
    
    setStats(prev => {
      const next = { ...prev };
      if (oldStatus === 'NowShowing') next.playing--;
      if (oldStatus === 'ComingSoon') next.upcoming--;
      if (oldStatus === 'Ended') next.ended--;
      if (newStatus === 'NowShowing') next.playing++;
      if (newStatus === 'ComingSoon') next.upcoming++;
      if (newStatus === 'Ended') next.ended++;
      return next;
    });

    try {
      const movieData = await MovieApi.getById(id);
      const fullMovie = movieData.data.data || movieData.data;

      const formData = new FormData();
      formData.append('_method', 'PUT');
      formData.append('UserId', fullMovie.UserId || localStorage.getItem('UserId') || '');
      formData.append('Title', fullMovie.Title || movie.Title || movie.title || '');
      formData.append('GenreId', fullMovie.GenreId || movie.GenreId || movie.genreId || '');
      formData.append('Duration', fullMovie.Duration || movie.Duration || movie.duration || '');
      formData.append('ReleaseDate', fullMovie.ReleaseDate || movie.ReleaseDate || movie.releaseDate || '');
      formData.append('Rated', fullMovie.Rated || movie.Rated || movie.rated || 'P');
      formData.append('Format', fullMovie.Format || movie.Format || movie.format || '2D');
      formData.append('Language', fullMovie.Language || movie.Language || movie.language || 'Vietsub');
      formData.append('Status', newStatus);

      await MovieApi.update(id, formData, { headers: { 'Content-Type': 'multipart/form-data' } });

      toast({ title: 'Thành công', description: `Đã chuyển trạng thái phim sang "${newStatus}"`, status: 'success', duration: 2000, isClosable: true });
      return true;
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
      updateData(id, { Status: oldStatus, status: oldStatus });
      setStats(prev => {
        const next = { ...prev };
        if (newStatus === 'NowShowing') next.playing--;
        if (newStatus === 'ComingSoon') next.upcoming--;
        if (newStatus === 'Ended') next.ended--;
        if (oldStatus === 'NowShowing') next.playing++;
        if (oldStatus === 'ComingSoon') next.upcoming++;
        if (oldStatus === 'Ended') next.ended++;
        return next;
      });
      toast({ title: 'Lỗi', description: error.response?.data?.message || 'Không thể cập nhật trạng thái phim', status: 'error', duration: 3000, isClosable: true });
      return false;
    }
  }, [updateData, toast]);

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
      castMembers: movie.castMembers || movie.CastMembers || [],
    }));
  }, [movies]);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    const initData = async () => {
      await fetchGenres();
      await fetchStats();
    };
    initData();
  }, []);

  const counts = useMemo(() => ({
    total: stats.total, playing: stats.playing, upcoming: stats.upcoming, ended: stats.ended,
  }), [stats]);

  const deleteMovie = useCallback(async (id) => {
    try {
      const movieResponse = await MovieApi.getById(id);
      const movieData = movieResponse.data.data || movieResponse.data;
      const castMembers = movieData.castMembers || movieData.CastMembers || [];

      for (const cast of castMembers) {
        const castId = cast.CastId || cast.castId || cast.id;
        if (castId) {
          try { await MovieCastApi.delete(castId); } catch (error) { console.error(`Lỗi khi xóa cast ${castId}:`, error); }
        }
      }

      await MovieApi.delete(id);
      reloadAll();
      toast({ title: 'Thành công', description: `Đã xóa phim và ${castMembers.length} diễn viên/đạo diễn liên quan`, status: 'success', duration: 2000, isClosable: true });
    } catch (error) {
      console.error('Lỗi khi xóa phim:', error);
      toast({ title: 'Lỗi', description: error.response?.data?.message || 'Không thể xóa phim', status: 'error', duration: 3000, isClosable: true });
    }
  }, [reloadAll, toast]);

  const createMovie = useCallback(async (formData) => {
    try {
      const data = new FormData();
      const userId = localStorage.getItem('UserId') || '';

      if (!userId) {
        toast({ title: 'Lỗi', description: 'Vui lòng đăng nhập để thêm phim', status: 'error', duration: 3000, isClosable: true });
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
      data.append('Cast', '');
      data.append('Country', formData.Country || '');
      data.append('Distributor', formData.Distributor || '');
      data.append('TrailerUrl', formData.TrailerUrl || '');
      data.append('Description', formData.Description || '');

      let languageValue = formData.Language || '';
      if (Array.isArray(languageValue)) languageValue = languageValue.join(',');
      if (!languageValue) languageValue = 'Vietsub';
      data.append('Language', languageValue);

      if (formData.PosterFile instanceof File) data.append('PosterUrl', formData.PosterFile);

      const castMembers = formData.CastMembers || [];
      const response = await MovieApi.create(data, { headers: { 'Content-Type': 'multipart/form-data' } });

      const newMovie = response.data.data || response.data;
      const movieId = newMovie.MovieId || newMovie.id;

      if (movieId && castMembers.length > 0) await saveCastMembers(movieId, castMembers);

      const updatedMovieResponse = await MovieApi.getById(movieId);
      const fullMovie = updatedMovieResponse.data.data || updatedMovieResponse.data;

      const movieItem = {
        ...fullMovie,
        id: fullMovie.MovieId || fullMovie.id,
        MovieId: fullMovie.MovieId || fullMovie.id,
        title: fullMovie.Title || fullMovie.title || '',
        Title: fullMovie.Title || fullMovie.title || '',
        status: fullMovie.Status || fullMovie.status || 'NowShowing',
        Status: fullMovie.Status || fullMovie.status || 'NowShowing',
        genre: fullMovie.genre || null,
        genreName: fullMovie.genre?.Name || fullMovie.GenreName || fullMovie.genreName || '',
        genreId: fullMovie.genre?.GenreId || fullMovie.GenreId || fullMovie.genreId || '',
        GenreId: fullMovie.genre?.GenreId || fullMovie.GenreId || fullMovie.genreId || '',
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

      toast({ title: 'Thành công 🎉', description: `Đã tạo phim "${movieItem.title}" thành công với ${castMembers.length} diễn viên/đạo diễn`, status: 'success', duration: 3000, isClosable: true });
      return true;
    } catch (error) {
      console.error('Lỗi khi thêm phim:', error);
      toast({ title: 'Lỗi', description: error.response?.data?.message || 'Không thể thêm phim mới', status: 'error', duration: 5000, isClosable: true });
      return false;
    }
  }, [prependData, fetchStats, toast, saveCastMembers]);

  const updateMovie = useCallback(async (id, formData) => {
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
      if (Array.isArray(languageValue)) languageValue = languageValue.join(',');
      if (!languageValue) languageValue = 'Vietsub';
      data.append('Language', languageValue);

      if (formData.PosterFile instanceof File) data.append('PosterUrl', formData.PosterFile);

      const castMembers = formData.CastMembers || [];
      await MovieApi.update(id, data, { headers: { 'Content-Type': 'multipart/form-data' } });

      const currentMovieResponse = await MovieApi.getById(id);
      const currentMovie = currentMovieResponse.data.data || currentMovieResponse.data;
      const currentCast = currentMovie.castMembers || currentMovie.CastMembers || [];

      for (const cast of currentCast) {
        const castId = cast.CastId || cast.castId || cast.id;
        if (castId) {
          try { await MovieCastApi.delete(castId); } catch (error) { console.error(`Lỗi khi xóa cast ${castId}:`, error); }
        }
      }

      if (castMembers.length > 0) {
        for (const member of castMembers) {
          try {
            const castData = { MovieId: id, Name: member.name.trim(), Role: member.role, Status: 'Active', CreatedBy: userId };
            await MovieCastApi.create(castData);
          } catch (error) {
            console.error(`Lỗi khi thêm cast member "${member.name}":`, error);
          }
        }
      }

      await reloadAll();
      toast({ title: 'Thành công', description: `Cập nhật phim thành công với ${castMembers.length} diễn viên/đạo diễn`, status: 'success', duration: 2000, isClosable: true });
      return true;
    } catch (error) {
      console.error('Lỗi khi cập nhật phim:', error);
      toast({ title: 'Lỗi', description: error.response?.data?.message || 'Không thể cập nhật phim', status: 'error', duration: 5000, isClosable: true });
      return false;
    }
  }, [reloadAll, toast]);

  return {
    movies: processedMovies, genres, loading, total, totalPages, page, goToPage,
    search, setSearch, filterStatus, setFilterStatus, filterGenre, setFilterGenre,
    counts, fetchGenres, deleteMovie, createMovie, updateMovie, updateMovieStatus, reload: reloadAll,
  };
}