import React from "react";

const Footer = () => {
  return (
    <footer>
      <div
        className="footer-wrap pd-20 mb-20 card-box responsive-footer"
        style={{ 
          textAlign: "center", 
          marginLeft: "138px",
          color: "black"
        }}
      >
        Gấu Phim - Nhóm Hoàng Đạt Thực Hiện.
      </div>

      <style jsx>{`
        /* Desktop - Default */
        .responsive-footer {
          transition: all 0.3s ease;
        }

        /* Tablet & Below (1024px) */
        @media (max-width: 1024px) {
          .responsive-footer {
            margin-left: 0 !important;
            margin-right: 0 !important;
          }
        }

        /* Mobile Landscape (768px) */
        @media (max-width: 768px) {
          .responsive-footer {
            margin-left: 0 !important;
            margin-right: 0 !important;
            padding: 16px 12px !important;
            font-size: 14px;
          }
        }

        /* Small Mobile (576px) */
        @media (max-width: 576px) {
          .responsive-footer {
            margin-left: 0 !important;
            margin-right: 0 !important;
            padding: 14px 10px !important;
            font-size: 13px;
            margin-bottom: 16px !important;
          }
        }

        /* Extra Small Mobile (400px) */
        @media (max-width: 400px) {
          .responsive-footer {
            margin-left: 0 !important;
            margin-right: 0 !important;
            padding: 12px 8px !important;
            font-size: 12px;
            margin-bottom: 12px !important;
          }
        }

        /* Landscape Orientation */
        @media (max-height: 500px) and (orientation: landscape) {
          .responsive-footer {
            margin-left: 0 !important;
            padding: 10px !important;
            font-size: 12px;
            margin-bottom: 10px !important;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;