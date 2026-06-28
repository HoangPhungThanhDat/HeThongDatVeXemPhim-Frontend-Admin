// src/views/admin/quanlylichchieudinhky/components/ScheduleList.jsx

import React from "react";
import { ScheduleCard } from "./ScheduleCard";

export const ScheduleList = ({ 
  schedules, 
  onView, 
  onEdit, 
  onClone, 
  onToggle, 
  onDelete,
  getMovieTitle,
  getRoomName 
}) => {
  if (schedules.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "56px 0", color: "#9ca3af" }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🗓</div>
        <div style={{ fontSize: 14, fontWeight: 700 }}>Không tìm thấy lịch chiếu nào</div>
        <div style={{ fontSize: 12, marginTop: 6 }}>Thử thay đổi bộ lọc hoặc tạo lịch mới</div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {schedules.map((s, i) => (
        <ScheduleCard
          key={s.ScheduleId || i}
          sch={s}
          index={i}
          onView={onView}
          onEdit={onEdit}
          onClone={onClone}
          onToggle={onToggle}
          onDelete={onDelete}
          getMovieTitle={getMovieTitle}
          getRoomName={getRoomName}
        />
      ))}
    </div>
  );
};