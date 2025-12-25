import React, { useEffect, useState } from "react";
import bannergau2 from "../vendors/images/bannergau21.png";

const Loader = () => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setProgress((old) => {
          if (old >= 100) {
            clearInterval(interval);
            setLoading(false); // khi progress đủ 100% thì tắt loader
            return 100;
          }
          return old + 5; // tăng 5% mỗi 100ms
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [loading]);

  if (loading) {
    return (
      <div className="pre-loader">
        <div className="pre-loader-box">
          <div className="loader-logo">
            <img
              src={bannergau2}
              alt="logo"
              style={{
                width: "300px",
                height: "auto",
                display: "block",
                marginBottom: "-60px",
                marginLeft: "-10px",
              }}
            />
          </div>

          {/* Thanh progress */}
          <div className="loader-progress" id="progress_div">
            <div
              className="bar"
              id="bar1"
              style={{
                width: `${progress}%`,
                transition: "width 0.1s linear",
              }}
            ></div>
          </div>

          {/* Hiện phần trăm */}
          <div className="percent" id="percent1">
            {progress}%
          </div>

          <div className="loading-text">Loading...</div>
        </div>
      </div>
    );
  }

  return null; // Loader ẩn đi khi xong
};

export default Loader;
