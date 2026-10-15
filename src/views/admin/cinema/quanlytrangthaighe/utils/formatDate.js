// src/utils/formatDate.js

export const formatDateTime = (dateStr) => {
    if (!dateStr) return 'Invalid Date';
    
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {
            // Thử parse với cách khác
            const parsed = Date.parse(dateStr);
            if (isNaN(parsed)) {
                return dateStr;
            }
            return new Date(parsed).toLocaleString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
        return date.toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (e) {
        return dateStr;
    }
};

export const getMovieTitle = (st) => {
    return st.movie_title || st.Movie?.Title || st.movie?.title || 'Unknown';
};