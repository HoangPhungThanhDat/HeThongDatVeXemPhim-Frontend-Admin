
import {
  MdLogin, MdLogout, MdEdit, MdDeleteForever, MdAddCircle,
  MdSettingsSuggest, MdAdminPanelSettings, MdOutlineReceiptLong,
  MdOutlineFactCheck
} from "react-icons/md";
import { keyframes } from "@chakra-ui/react";

export const OR = "#ea580c";
export const ORL = "#fb923c";

export const ACTION_CFG = {
  "Đăng nhập":          { icon: MdLogin,               color: "#48BB78" },
  "Đăng xuất":          { icon: MdLogout,              color: "#94a3b8" },
  "Tạo dữ liệu":        { icon: MdAddCircle,           color: "#0284c7" },
  "Sửa dữ liệu":        { icon: MdEdit,                color: OR },
  "Xóa dữ liệu":        { icon: MdDeleteForever,       color: "#dc2626" },
  "Xuất báo cáo":       { icon: MdOutlineReceiptLong,  color: "#7c3aed" },
  "Phân quyền":         { icon: MdAdminPanelSettings,  color: "#9F7AEA" },
  "Cấu hình hệ thống":  { icon: MdSettingsSuggest,     color: "#0f172a" },
  "Xử lý hoàn tiền":    { icon: MdOutlineFactCheck,    color: "#FC8181" },
};

export const ACTION_TYPES = Object.keys(ACTION_CFG);

export const COL = { time: "142px", user: "190px", action: "140px", target: "1", ip: "116px", status: "118px", actions: "70px" };

export const fadeUp = keyframes`from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); }`;
export const scaleIn = keyframes`from { opacity: 0; transform: scale(0.97) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); }`;
export const pulseRing = keyframes`0% { box-shadow: 0 0 0 0 rgba(220,38,38,.35); } 100% { box-shadow: 0 0 0 9px rgba(220,38,38,0); }`;