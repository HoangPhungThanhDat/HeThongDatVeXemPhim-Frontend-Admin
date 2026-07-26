// src/layouts/Loader.jsx

import React from "react";
import { useColorMode } from "@chakra-ui/react";

// Màu sắc cho chế độ tối - tông xanh
const DARK_THEME = {
  bg: "#0a1628",
  cardBg: "#0f1f3a",
  border: "#1a3a5c",
  text: "#e8f4f8",
  textSecondary: "#88b4d8",
  labelColor: "#5a8ab5",
  inputBg: "#0a1f35",
  hoverBg: "#142d4f",
  accent: "#4a9eff",
  accentLight: "#6ab0ff",
  accentShadow: "rgba(74, 158, 255, 0.25)",
};

export default function Loader() {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  // Dark mode colors
  const accentColor = isDark ? DARK_THEME.accent : "#ea580c";
  const accentLight = isDark ? DARK_THEME.accentLight : "#fb923c";
  const accentLighter = isDark ? "#6ab0ff" : "#fbbf24";
  const bgPage = isDark ? DARK_THEME.bg : "#f8fafc";
  const bgCard = isDark ? DARK_THEME.cardBg : "white";
  const borderCard = isDark ? DARK_THEME.border : "#f1f5f9";
  const textColor = isDark ? DARK_THEME.textSecondary : "#64748b";
  const textDark = isDark ? DARK_THEME.text : "#0f172a";
  const skeletonBg = isDark ? "#1a2a4a" : "#e8edf3";
  const skeletonBg2 = isDark ? "#2a3a5a" : "#f1f5f9";
  const skeletonBgDark = isDark ? "#2d3748" : "#e8edf3";
  const skeletonBgDark2 = isDark ? "#4a5568" : "#f1f5f9";
  const statBg = isDark ? DARK_THEME.cardBg : "white";
  const statBorder = isDark ? DARK_THEME.border : "#f1f5f9";
  const tableBg = isDark ? DARK_THEME.cardBg : "white";
  const tableBorder = isDark ? DARK_THEME.border : "#f1f5f9";
  const tableHeaderBg = isDark ? DARK_THEME.inputBg : "#fafbfc";
  const tableHeaderBorder = isDark ? DARK_THEME.border : "#f1f5f9";
  const rowBorder = isDark ? DARK_THEME.border : "#f8fafc";

  return (
    <div className={`loader-container ${isDark ? "dark-mode" : "light-mode"}`}>
      <div className="loader-wrapper">
        {/* Loading Spinner */}
        <div className="loader-spinner-container">
          <div className="loader-spinner">
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-logo">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4v16M17 4v16M3 8h18M3 16h18" />
              </svg>
            </div>
          </div>
          <p className="loader-text">Đang tải dữ liệu...</p>
        </div>

        {/* Skeleton Loading */}
        <div className="skeleton-wrapper">
          {/* Header Skeleton */}
          <div className="skeleton-header">
            <div className="skeleton-avatar">
              <div className="avatar-shimmer"></div>
            </div>
            <div className="skeleton-header-content">
              <div className="skeleton-line skeleton-line-lg"></div>
              <div className="skeleton-line skeleton-line-sm"></div>
            </div>
          </div>

          {/* Stats Skeleton */}
          <div className="skeleton-stats">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="skeleton-stat-card">
                <div className="skeleton-stat-content">
                  <div className="skeleton-line skeleton-line-xs"></div>
                  <div className="skeleton-line skeleton-line-md"></div>
                  <div className="skeleton-line skeleton-line-xs"></div>
                </div>
                <div className="skeleton-stat-icon">
                  <div className="icon-shimmer"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Table Skeleton */}
          <div className="skeleton-table">
            <div className="skeleton-table-header">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="skeleton-line skeleton-line-sm"></div>
              ))}
            </div>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="skeleton-table-row">
                <div className="skeleton-cell skeleton-cell-sm">
                  <div className="skeleton-line skeleton-line-xs"></div>
                </div>
                <div className="skeleton-cell skeleton-cell-md">
                  <div className="skeleton-line skeleton-line-sm"></div>
                  <div className="skeleton-line skeleton-line-xs"></div>
                </div>
                <div className="skeleton-cell skeleton-cell-sm">
                  <div className="skeleton-line skeleton-line-sm"></div>
                </div>
                <div className="skeleton-cell skeleton-cell-md">
                  <div className="skeleton-line skeleton-line-sm"></div>
                </div>
                <div className="skeleton-cell skeleton-cell-sm">
                  <div className="skeleton-line skeleton-line-sm"></div>
                </div>
                <div className="skeleton-cell skeleton-cell-sm">
                  <div className="skeleton-btn"></div>
                  <div className="skeleton-btn skeleton-btn-secondary"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .loader-container {
          min-height: 100vh;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          position: relative;
          overflow: hidden;
          transition: background 0.3s ease;
        }

        .loader-container.light-mode {
          background: ${bgPage};
        }

        .loader-container.dark-mode {
          background: ${bgPage};
        }

        /* Background gradient orbs */
        .loader-container.light-mode::before {
          content: '';
          position: fixed;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(234, 88, 12, 0.06) 0%, transparent 70%);
          top: -200px;
          right: -200px;
          border-radius: 50%;
          pointer-events: none;
        }

        .loader-container.light-mode::after {
          content: '';
          position: fixed;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(251, 146, 60, 0.05) 0%, transparent 70%);
          bottom: -100px;
          left: -100px;
          border-radius: 50%;
          pointer-events: none;
        }

        .loader-container.dark-mode::before {
          content: '';
          position: fixed;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(74, 158, 255, 0.08) 0%, transparent 70%);
          top: -200px;
          right: -200px;
          border-radius: 50%;
          pointer-events: none;
        }

        .loader-container.dark-mode::after {
          content: '';
          position: fixed;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(106, 176, 255, 0.06) 0%, transparent 70%);
          bottom: -100px;
          left: -100px;
          border-radius: 50%;
          pointer-events: none;
        }

        .loader-wrapper {
          width: 100%;
          max-width: 1320px;
          margin: 0 auto;
          padding: 20px 24px;
          position: relative;
          z-index: 1;
        }

        /* ===== SPINNER ===== */
        .loader-spinner-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 30px 0 20px 0;
          animation: fadeInDown 0.6s ease;
        }

        .loader-spinner {
          position: relative;
          width: 64px;
          height: 64px;
          margin-bottom: 16px;
        }

        .spinner-ring {
          position: absolute;
          width: 64px;
          height: 64px;
          border-radius: 50%;
          border: 3px solid transparent;
          animation: spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
        }

        .loader-container.light-mode .spinner-ring:nth-child(1) {
          border-top-color: #ea580c;
          animation-delay: -0.45s;
        }

        .loader-container.light-mode .spinner-ring:nth-child(2) {
          border-right-color: #fb923c;
          animation-delay: -0.3s;
        }

        .loader-container.light-mode .spinner-ring:nth-child(3) {
          border-bottom-color: #fbbf24;
          animation-delay: -0.15s;
        }

        .loader-container.light-mode .spinner-ring:nth-child(4) {
          border-left-color: #ea580c;
          animation-delay: 0s;
        }

        .loader-container.dark-mode .spinner-ring:nth-child(1) {
          border-top-color: ${accentColor};
          animation-delay: -0.45s;
        }

        .loader-container.dark-mode .spinner-ring:nth-child(2) {
          border-right-color: ${accentLight};
          animation-delay: -0.3s;
        }

        .loader-container.dark-mode .spinner-ring:nth-child(3) {
          border-bottom-color: ${accentLighter};
          animation-delay: -0.15s;
        }

        .loader-container.dark-mode .spinner-ring:nth-child(4) {
          border-left-color: ${accentColor};
          animation-delay: 0s;
        }

        .spinner-logo {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 24px;
          height: 24px;
          animation: pulse 2s ease-in-out infinite;
        }

        .loader-container.light-mode .spinner-logo {
          color: #ea580c;
        }

        .loader-container.dark-mode .spinner-logo {
          color: ${accentColor};
        }

        .spinner-logo svg {
          width: 100%;
          height: 100%;
        }

        .loader-text {
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.5px;
          animation: pulse 1.5s ease-in-out infinite;
          transition: color 0.3s ease;
        }

        .loader-container.light-mode .loader-text {
          color: #64748b;
        }

        .loader-container.dark-mode .loader-text {
          color: ${textColor};
        }

        /* ===== SKELETON ===== */
        .skeleton-wrapper {
          animation: fadeIn 0.8s ease 0.2s both;
        }

        .skeleton-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 28px;
          padding: 8px 0;
        }

        .skeleton-avatar {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          position: relative;
          overflow: hidden;
          flex-shrink: 0;
          transition: background 0.3s ease;
        }

        .loader-container.light-mode .skeleton-avatar {
          background: linear-gradient(135deg, #e2e8f0, #f1f5f9);
        }

        .loader-container.dark-mode .skeleton-avatar {
          background: linear-gradient(135deg, #1a2a4a, #2a3a5a);
        }

        .avatar-shimmer,
        .icon-shimmer {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          transform: translateX(-100%);
          animation: shimmer 1.8s ease-in-out infinite;
        }

        .loader-container.light-mode .avatar-shimmer,
        .loader-container.light-mode .icon-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent);
        }

        .loader-container.dark-mode .avatar-shimmer,
        .loader-container.dark-mode .icon-shimmer {
          background: linear-gradient(90deg, transparent, rgba(74, 158, 255, 0.08), transparent);
        }

        .skeleton-header-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        /* ===== STATS ===== */
        .skeleton-stats {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 14px;
          margin-bottom: 28px;
        }

        .skeleton-stat-card {
          border-radius: 16px;
          padding: 20px 22px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease, background 0.3s ease, border-color 0.3s ease;
        }

        .loader-container.light-mode .skeleton-stat-card {
          background: ${statBg};
          border: 1px solid ${statBorder};
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
        }

        .loader-container.dark-mode .skeleton-stat-card {
          background: ${statBg};
          border: 1px solid ${statBorder};
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }

        .skeleton-stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 3px;
          transition: background 0.3s ease;
        }

        .loader-container.light-mode .skeleton-stat-card::before {
          background: linear-gradient(90deg, #ea580c, #fb923c, #fbbf24);
          opacity: 0.3;
        }

        .loader-container.dark-mode .skeleton-stat-card::before {
          background: linear-gradient(90deg, ${accentColor}, ${accentLight}, ${accentLighter});
          opacity: 0.4;
        }

        .skeleton-stat-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .skeleton-stat-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          position: relative;
          overflow: hidden;
          flex-shrink: 0;
          transition: background 0.3s ease;
        }

        .loader-container.light-mode .skeleton-stat-icon {
          background: #f1f5f9;
        }

        .loader-container.dark-mode .skeleton-stat-icon {
          background: #1a2a4a;
        }

        /* ===== TABLE ===== */
        .skeleton-table {
          border-radius: 16px;
          overflow: hidden;
          transition: background 0.3s ease, border-color 0.3s ease;
        }

        .loader-container.light-mode .skeleton-table {
          background: ${tableBg};
          border: 1px solid ${tableBorder};
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
        }

        .loader-container.dark-mode .skeleton-table {
          background: ${tableBg};
          border: 1px solid ${tableBorder};
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }

        .skeleton-table-header {
          display: grid;
          grid-template-columns: 45px 2.5fr 0.8fr 0.8fr 0.7fr 0.8fr 1.2fr;
          gap: 12px;
          padding: 16px 20px;
          border-bottom: 1px solid;
          transition: background 0.3s ease, border-color 0.3s ease;
        }

        .loader-container.light-mode .skeleton-table-header {
          background: ${tableHeaderBg};
          border-color: ${tableHeaderBorder};
        }

        .loader-container.dark-mode .skeleton-table-header {
          background: ${tableHeaderBg};
          border-color: ${tableHeaderBorder};
        }

        .skeleton-table-header .skeleton-line {
          height: 12px;
          width: 80%;
          border-radius: 4px;
        }

        .skeleton-table-row {
          display: grid;
          grid-template-columns: 45px 2.5fr 0.8fr 0.8fr 0.7fr 0.8fr 1.2fr;
          gap: 12px;
          padding: 14px 20px;
          border-bottom: 1px solid;
          align-items: center;
          transition: background 0.3s ease, border-color 0.3s ease;
        }

        .loader-container.light-mode .skeleton-table-row {
          border-color: ${rowBorder};
        }

        .loader-container.dark-mode .skeleton-table-row {
          border-color: ${rowBorder};
        }

        .skeleton-table-row:last-child {
          border-bottom: none;
        }

        .skeleton-cell {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .skeleton-cell-sm {
          align-items: flex-start;
          justify-content: center;
        }

        .skeleton-cell-md {
          gap: 6px;
        }

        /* ===== SKELETON LINES ===== */
        .skeleton-line {
          border-radius: 6px;
          height: 12px;
          position: relative;
          overflow: hidden;
          transition: background 0.3s ease;
        }

        .loader-container.light-mode .skeleton-line {
          background: linear-gradient(90deg, ${skeletonBg} 25%, ${skeletonBg2} 50%, ${skeletonBg} 75%);
          background-size: 200% 100%;
        }

        .loader-container.dark-mode .skeleton-line {
          background: linear-gradient(90deg, ${skeletonBgDark} 25%, ${skeletonBgDark2} 50%, ${skeletonBgDark} 75%);
          background-size: 200% 100%;
        }

        .skeleton-line-lg {
          height: 24px;
          width: 60%;
          border-radius: 8px;
        }

        .skeleton-line-md {
          height: 16px;
          width: 80%;
          border-radius: 6px;
        }

        .skeleton-line-sm {
          height: 14px;
          width: 90%;
          border-radius: 6px;
        }

        .skeleton-line-xs {
          height: 10px;
          width: 50%;
          border-radius: 4px;
        }

        /* ===== SKELETON BUTTONS ===== */
        .skeleton-btn {
          width: 70px;
          height: 32px;
          border-radius: 8px;
          transition: background 0.3s ease;
        }

        .loader-container.light-mode .skeleton-btn {
          background: linear-gradient(90deg, ${skeletonBg} 25%, ${skeletonBg2} 50%, ${skeletonBg} 75%);
          background-size: 200% 100%;
        }

        .loader-container.dark-mode .skeleton-btn {
          background: linear-gradient(90deg, ${skeletonBgDark} 25%, ${skeletonBgDark2} 50%, ${skeletonBgDark} 75%);
          background-size: 200% 100%;
        }

        .skeleton-btn-secondary {
          width: 32px;
          margin-left: 6px;
        }

        .skeleton-cell-sm .skeleton-btn:last-child {
          margin-left: 6px;
        }

        /* ===== ANIMATIONS ===== */
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .loader-container.light-mode .skeleton-line,
        .loader-container.light-mode .skeleton-btn {
          animation: skeletonShimmer 1.8s ease-in-out infinite;
        }

        .loader-container.dark-mode .skeleton-line,
        .loader-container.dark-mode .skeleton-btn {
          animation: skeletonShimmerDark 1.8s ease-in-out infinite;
        }

        @keyframes skeletonShimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        @keyframes skeletonShimmerDark {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 1200px) {
          .skeleton-table-header,
          .skeleton-table-row {
            grid-template-columns: 40px 2fr 0.7fr 0.7fr 0.6fr 0.7fr 1fr;
          }
        }

        @media (max-width: 992px) {
          .skeleton-stats {
            grid-template-columns: repeat(3, 1fr);
          }

          .skeleton-table-header {
            display: none;
          }

          .skeleton-table-row {
            grid-template-columns: 1fr;
            gap: 10px;
            padding: 16px 18px;
          }

          .loader-container.light-mode .skeleton-table-row {
            border-bottom: 2px solid #f1f5f9;
          }

          .loader-container.dark-mode .skeleton-table-row {
            border-bottom: 2px solid ${DARK_THEME.border};
          }

          .skeleton-cell {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }

          .skeleton-cell-sm {
            justify-content: flex-start;
          }

          .skeleton-line {
            width: 60% !important;
          }

          .skeleton-line-lg {
            width: 100% !important;
          }

          .skeleton-cell-sm .skeleton-line {
            width: 30% !important;
          }
        }

        @media (max-width: 768px) {
          .loader-wrapper {
            padding: 16px 16px;
          }

          .skeleton-stats {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }

          .skeleton-stat-card {
            padding: 16px 18px;
          }

          .skeleton-stat-icon {
            width: 36px;
            height: 36px;
          }

          .skeleton-table-row {
            padding: 14px 16px;
          }

          .loader-spinner-container {
            padding: 20px 0 16px 0;
          }

          .loader-spinner {
            width: 48px;
            height: 48px;
          }

          .spinner-ring {
            width: 48px;
            height: 48px;
            border-width: 2.5px;
          }

          .spinner-logo {
            width: 18px;
            height: 18px;
          }

          .loader-text {
            font-size: 13px;
          }
        }

        @media (max-width: 480px) {
          .skeleton-stats {
            grid-template-columns: 1fr 1fr;
            gap: 8px;
          }

          .skeleton-stat-card {
            padding: 12px 14px;
            border-radius: 12px;
          }

          .skeleton-stat-icon {
            width: 32px;
            height: 32px;
            border-radius: 10px;
          }

          .skeleton-line-lg {
            height: 20px;
          }

          .skeleton-header {
            gap: 12px;
          }

          .skeleton-avatar {
            width: 40px;
            height: 40px;
            border-radius: 12px;
          }

          .loader-wrapper {
            padding: 12px 10px;
          }
        }
      `}</style>
    </div>
  );
}