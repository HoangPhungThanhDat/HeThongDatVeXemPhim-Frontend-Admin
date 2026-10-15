// src/layouts/Loader.jsx
import React from "react";
import { useColorMode } from "@chakra-ui/react";

export default function Loader({
  message = "Đang tải dữ liệu...",
  variant = "page",
  statCount = 4,
  rowCount = 6,
  showTable = true,
}) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  return (
    <div
      className={`film-loader film-loader--${variant} ${isDark ? "is-dark" : "is-light"}`}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      {/* Particles nền */}
      <div className="film-loader__particles" aria-hidden="true">
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i} className={`particle particle--${i + 1}`} />
        ))}
      </div>

      {/* ── FILM REEL (2 cuộn phim quay) ── */}
      <div className="film-loader__reel" aria-hidden="true">
        <div className="reel reel--left">
          <div className="reel__spokes">
            <span /><span /><span /><span /><span /><span />
          </div>
          <div className="reel__hub" />
        </div>

        <div className="film-loader__strip">
          <div className="strip__perforations">
            {Array.from({ length: 20 }).map((_, i) => (
              <span key={i} />
            ))}
          </div>
          <div className="strip__perforations strip__perforations--bottom">
            {Array.from({ length: 20 }).map((_, i) => (
              <span key={i} />
            ))}
          </div>
        </div>

        <div className="reel reel--right">
          <div className="reel__spokes">
            <span /><span /><span /><span /><span /><span />
          </div>
          <div className="reel__hub" />
        </div>
      </div>

      {/* ── TEXT ── */}
      <div className="film-loader__text">
        <span className="film-loader__text-line">{message}</span>
        <div className="film-loader__dots">
          <span /><span /><span />
        </div>
      </div>

      {/* ── PROGRESS BAR ── */}
      <div className="film-loader__progress">
        <div className="film-loader__progress-bar" />
      </div>

      {/* ── SKELETON (đơn giản hơn) ── */}
      <div className="film-loader__skeleton">
        {/* Stats row */}
        <div className="film-loader__stats">
          {Array.from({ length: statCount }).map((_, i) => (
            <div
              key={i}
              className="stat-tile"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="stat-tile__icon" />
              <div className="stat-tile__content">
                <div className="stat-tile__line stat-tile__line--sm" />
                <div className="stat-tile__line stat-tile__line--lg" />
              </div>
            </div>
          ))}
        </div>

        {/* List rows */}
        {showTable && (
          <div className="film-loader__list">
            {Array.from({ length: rowCount }).map((_, i) => (
              <div
                key={i}
                className="list-row"
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <div className="list-row__avatar" />
                <div className="list-row__content">
                  <div className="list-row__line list-row__line--md" />
                  <div className="list-row__line list-row__line--sm" />
                </div>
                <div className="list-row__badge" />
                <div className="list-row__actions">
                  <div className="list-row__btn" />
                  <div className="list-row__btn list-row__btn--icon" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════
          STYLES
          ═══════════════════════════════════════════════════════════ */}
      <style>{`
        /* ═══════════════════════════════════════════════════════════
           THEME TOKENS
           ═══════════════════════════════════════════════════════════ */
        .film-loader {
          /* Light mode — cinema vàng cam */
          --accent:           #f59e0b;
          --accent-2:         #ea580c;
          --accent-glow:      rgba(245, 158, 11, 0.4);

          --bg:               #fefbf6;
          --bg-card:          #ffffff;
          --bg-skeleton:      #f3f4f6;
          --bg-skeleton-2:    #e5e7eb;

          --border:           #f1f5f9;
          --text:             #1f2937;
          --text-dim:         #6b7280;

          --shadow:           0 2px 8px rgba(0,0,0,0.04);

          /* Layout */
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 32px;
          padding: 40px 24px;
          position: relative;
          overflow: hidden;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: var(--bg);
          transition: background 0.4s ease;
        }

        .film-loader--section {
          min-height: 500px;
          padding: 40px 24px;
        }

        .film-loader--inline {
          min-height: auto;
          padding: 24px;
          gap: 20px;
        }

        /* Dark mode — cinema xanh dương */
        .film-loader.is-dark {
          --accent:           #4a9eff;
          --accent-2:         #6ab0ff;
          --accent-glow:      rgba(74, 158, 255, 0.5);

          --bg:               #0a1628;
          --bg-card:          #0f1f3a;
          --bg-skeleton:      #1a2a4a;
          --bg-skeleton-2:    #2a3a5a;

          --border:           #1a3a5c;
          --text:             #e8f4f8;
          --text-dim:         #88b4d8;

          --shadow:           0 2px 8px rgba(0,0,0,0.2);
        }

        /* ═══════════════════════════════════════════════════════════
           PARTICLES — bụi sáng bay lên như phòng chiếu phim
           ═══════════════════════════════════════════════════════════ */
        .film-loader__particles {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
          z-index: 0;
        }

        .particle {
          position: absolute;
          bottom: -10px;
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: var(--accent);
          opacity: 0;
          box-shadow: 0 0 8px var(--accent-glow);
          animation: particleFloat 6s ease-in infinite;
        }

        .particle--1  { left: 8%;  animation-delay: 0.0s; animation-duration: 5s;   }
        .particle--2  { left: 18%; animation-delay: 0.8s; animation-duration: 6.5s; }
        .particle--3  { left: 28%; animation-delay: 1.6s; animation-duration: 5.5s; }
        .particle--4  { left: 38%; animation-delay: 2.4s; animation-duration: 7s;   }
        .particle--5  { left: 48%; animation-delay: 3.2s; animation-duration: 5.2s; }
        .particle--6  { left: 58%; animation-delay: 0.4s; animation-duration: 6.8s; }
        .particle--7  { left: 68%; animation-delay: 1.2s; animation-duration: 5.8s; }
        .particle--8  { left: 78%; animation-delay: 2.0s; animation-duration: 6.2s; }
        .particle--9  { left: 88%; animation-delay: 2.8s; animation-duration: 5.4s; }
        .particle--10 { left: 15%; animation-delay: 3.6s; animation-duration: 7.2s; }
        .particle--11 { left: 45%; animation-delay: 4.2s; animation-duration: 6.0s; }
        .particle--12 { left: 75%; animation-delay: 4.8s; animation-duration: 5.6s; }

        @keyframes particleFloat {
          0%   { transform: translateY(0) scale(0.5); opacity: 0; }
          20%  { opacity: 1; }
          80%  { opacity: 0.6; }
          100% { transform: translateY(-100vh) scale(1.2); opacity: 0; }
        }

        /* ═══════════════════════════════════════════════════════════
           FILM REEL — 2 cuộn phim quay ngược chiều
           ═══════════════════════════════════════════════════════════ */
        .film-loader__reel {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          gap: 0;
          filter: drop-shadow(0 8px 24px var(--accent-glow));
        }

        .reel {
          position: relative;
          width: 68px;
          height: 68px;
          border-radius: 50%;
          background: var(--accent);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow:
            inset 0 0 0 6px var(--bg),
            inset 0 0 0 8px var(--accent-2),
            0 0 20px var(--accent-glow);
        }

        .reel--left  { animation: reelSpin 3.5s linear infinite; }
        .reel--right { animation: reelSpin 3.5s linear infinite reverse; }

        .reel__spokes {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .reel__spokes span {
          position: absolute;
          width: 4px;
          height: 22px;
          background: var(--bg);
          border-radius: 2px;
          top: 12px;
          left: 50%;
          margin-left: -2px;
          transform-origin: 2px 22px;
        }
        .reel__spokes span:nth-child(1) { transform: rotate(0deg);   }
        .reel__spokes span:nth-child(2) { transform: rotate(60deg);  }
        .reel__spokes span:nth-child(3) { transform: rotate(120deg); }
        .reel__spokes span:nth-child(4) { transform: rotate(180deg); }
        .reel__spokes span:nth-child(5) { transform: rotate(240deg); }
        .reel__spokes span:nth-child(6) { transform: rotate(300deg); }

        .reel__hub {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--bg);
          border: 3px solid var(--accent-2);
          z-index: 1;
        }

        @keyframes reelSpin {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* ═══════════════════════════════════════════════════════════
           FILM STRIP — dải phim nối giữa 2 cuộn
           ═══════════════════════════════════════════════════════════ */
        .film-loader__strip {
          position: relative;
          width: 140px;
          height: 44px;
          background: var(--accent-2);
          margin: 0 -8px;
          overflow: hidden;
          box-shadow: 0 0 15px var(--accent-glow);
        }

        .strip__perforations {
          position: absolute;
          left: 0;
          right: 0;
          top: 4px;
          display: flex;
          gap: 6px;
          padding: 0 6px;
          animation: stripMove 2s linear infinite;
        }

        .strip__perforations--bottom { top: auto; bottom: 4px; }

        .strip__perforations span {
          flex-shrink: 0;
          width: 6px;
          height: 6px;
          background: var(--bg);
          border-radius: 1px;
        }

        @keyframes stripMove {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-24px); }
        }

        /* ═══════════════════════════════════════════════════════════
           TEXT
           ═══════════════════════════════════════════════════════════ */
        .film-loader__text {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: baseline;
          gap: 6px;
          color: var(--text);
          font-size: 15px;
          font-weight: 600;
          letter-spacing: 0.3px;
        }

        .film-loader__dots {
          display: inline-flex;
          gap: 3px;
        }

        .film-loader__dots span {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--accent);
          animation: dotBounce 1.4s ease-in-out infinite;
        }
        .film-loader__dots span:nth-child(1) { animation-delay: 0s;    }
        .film-loader__dots span:nth-child(2) { animation-delay: 0.2s;  }
        .film-loader__dots span:nth-child(3) { animation-delay: 0.4s;  }

        @keyframes dotBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30%           { transform: translateY(-6px); opacity: 1; }
        }

        /* ═══════════════════════════════════════════════════════════
           PROGRESS BAR — thanh tiến trình chạy vô tận
           ═══════════════════════════════════════════════════════════ */
        .film-loader__progress {
          position: relative;
          z-index: 1;
          width: 240px;
          height: 4px;
          border-radius: 2px;
          background: var(--bg-skeleton);
          overflow: hidden;
        }

        .film-loader__progress-bar {
          position: absolute;
          top: 0;
          left: -40%;
          width: 40%;
          height: 100%;
          border-radius: 2px;
          background: linear-gradient(90deg, transparent, var(--accent), var(--accent-2), transparent);
          animation: progressRun 1.6s ease-in-out infinite;
        }

        @keyframes progressRun {
          0%   { left: -40%; }
          100% { left: 100%; }
        }

        /* ═══════════════════════════════════════════════════════════
           SKELETON — STATS
           ═══════════════════════════════════════════════════════════ */
        .film-loader__skeleton {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 900px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-top: 8px;
        }

        .film-loader__stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
        }

        .stat-tile {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 18px;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 14px;
          box-shadow: var(--shadow);
          opacity: 0;
          animation: tileFadeIn 0.5s ease forwards;
        }

        @keyframes tileFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0);   }
        }

        .stat-tile__icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, var(--bg-skeleton), var(--bg-skeleton-2));
          position: relative;
          overflow: hidden;
          flex-shrink: 0;
        }

        .stat-tile__icon::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, var(--accent-glow), transparent);
          transform: translateX(-100%);
          animation: shimmer 1.8s ease-in-out infinite;
        }

        .stat-tile__content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .stat-tile__line {
          border-radius: 4px;
          background: var(--bg-skeleton);
          position: relative;
          overflow: hidden;
        }

        .stat-tile__line::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, var(--accent-glow), transparent);
          transform: translateX(-100%);
          animation: shimmer 1.8s ease-in-out infinite;
        }

        .stat-tile__line--sm { width: 40%; height: 8px; }
        .stat-tile__line--lg { width: 75%; height: 12px; }

        /* ═══════════════════════════════════════════════════════════
           SKELETON — LIST ROWS
           ═══════════════════════════════════════════════════════════ */
        .film-loader__list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .list-row {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 18px;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 12px;
          box-shadow: var(--shadow);
          opacity: 0;
          animation: tileFadeIn 0.5s ease forwards;
        }

        .list-row__avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--bg-skeleton);
          position: relative;
          overflow: hidden;
          flex-shrink: 0;
        }

        .list-row__avatar::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, var(--accent-glow), transparent);
          transform: translateX(-100%);
          animation: shimmer 1.8s ease-in-out infinite;
        }

        .list-row__content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .list-row__line {
          height: 10px;
          border-radius: 4px;
          background: var(--bg-skeleton);
          position: relative;
          overflow: hidden;
        }

        .list-row__line::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, var(--accent-glow), transparent);
          transform: translateX(-100%);
          animation: shimmer 1.8s ease-in-out infinite;
        }

        .list-row__line--md { width: 55%; }
        .list-row__line--sm { width: 35%; }

        .list-row__badge {
          width: 72px;
          height: 24px;
          border-radius: 12px;
          background: var(--bg-skeleton);
          position: relative;
          overflow: hidden;
          flex-shrink: 0;
        }

        .list-row__badge::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, var(--accent-glow), transparent);
          transform: translateX(-100%);
          animation: shimmer 1.8s ease-in-out infinite;
        }

        .list-row__actions {
          display: flex;
          gap: 6px;
          flex-shrink: 0;
        }

        .list-row__btn {
          width: 56px;
          height: 30px;
          border-radius: 8px;
          background: var(--bg-skeleton);
          position: relative;
          overflow: hidden;
        }

        .list-row__btn--icon { width: 30px; }

        .list-row__btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, var(--accent-glow), transparent);
          transform: translateX(-100%);
          animation: shimmer 1.8s ease-in-out infinite;
        }

        @keyframes shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        /* ═══════════════════════════════════════════════════════════
           RESPONSIVE
           ═══════════════════════════════════════════════════════════ */
        @media (max-width: 768px) {
          .film-loader { gap: 24px; padding: 32px 16px; }

          .reel { width: 52px; height: 52px; }
          .reel__spokes span { height: 16px; top: 10px; transform-origin: 2px 16px; }
          .reel__hub { width: 14px; height: 14px; }

          .film-loader__strip { width: 100px; height: 36px; }

          .film-loader__stats { grid-template-columns: repeat(2, 1fr); }

          .list-row { padding: 12px 14px; gap: 10px; }
          .list-row__btn { width: 40px; }

          .film-loader__text { font-size: 14px; }
          .film-loader__progress { width: 180px; }
        }

        @media (max-width: 480px) {
          .film-loader { gap: 20px; padding: 24px 12px; }

          .reel { width: 44px; height: 44px; }
          .reel__spokes span { height: 14px; top: 8px; transform-origin: 2px 14px; }
          .reel__hub { width: 12px; height: 12px; }

          .film-loader__strip { width: 80px; height: 32px; }

          .film-loader__stats { grid-template-columns: 1fr 1fr; gap: 10px; }
          .stat-tile { padding: 12px 14px; }

          .list-row__badge { display: none; }
        }

        /* ═══════════════════════════════════════════════════════════
           ACCESSIBILITY
           ═══════════════════════════════════════════════════════════ */
        @media (prefers-reduced-motion: reduce) {
          .reel--left,
          .reel--right,
          .strip__perforations,
          .film-loader__progress-bar,
          .particle,
          .film-loader__dots span,
          .stat-tile__icon::after,
          .stat-tile__line::after,
          .list-row__avatar::after,
          .list-row__line::after,
          .list-row__badge::after,
          .list-row__btn::after {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}