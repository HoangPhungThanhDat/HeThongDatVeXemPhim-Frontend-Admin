import React from 'react';
import { Icon } from '@chakra-ui/react';
import {
  MdHome,
  MdPerson,
  MdLock,
  MdMovie,
  MdSupportAgent,
  MdSchedule,
  MdConfirmationNumber,
  MdBarChart,
  MdWeb,
  MdLocalMovies,
  MdEventSeat,
  MdPayment,
  MdPeople,
  MdTheaters,
  MdSettings,
  MdImage,
  MdMenu,
  MdCampaign,
  MdArticle,
  MdCardGiftcard,
  MdCategory,
  MdPeopleAlt,
  MdStar,
  MdBusiness,
  MdRateReview,
  MdLink,
  MdCalendarMonth,
  MdRepeat,
  MdLocalActivity,
  MdShoppingCart,
  MdHistory,
  MdMoneyOff,
  MdGroup,
  MdWorkspacePremium,
  MdFavorite,
  MdNotifications,
  MdStore,
  MdMeetingRoom,
  MdChair,
  MdHeadsetMic,
  MdAccountCircle,
  MdTune,
} from 'react-icons/md';
import { MdAdminPanelSettings } from "react-icons/md";
// Admin Imports
import MainDashboard from 'views/admin/default';
import Profile from 'views/admin/profile';
import Hotrokhachhang from 'views/admin/hotrokhachhang';
import Quanlyphim from 'views/admin/quanlyphim';
import Quanlybanner from 'views/admin/quanlybanner';
import Quanlykhuyenmai from 'views/admin/quanlykhuyenmai';
import Quanlytintuc from 'views/admin/quanlytintuc';
import Quanlytheloai from 'views/admin/quanlytheloai';
import Quanlydienvien from 'views/admin/quanlydienvien';
import Quanlynhaphathanh from 'views/admin/quanlynhaphathanh';
import Quanlydanhgia from 'views/admin/quanlydanhgia';
import Quanlylichchieudinhky from 'views/admin/quanlylichchieudinhky';
import Quanlydonhang from 'views/admin/quanlydonhang';
import Quanlydatve from 'views/admin/quanlydatve';
import Quanlycombo from 'views/admin/quanlycombo';
import Quanlythanhtoan from 'views/admin/quanlythanhtoan';
import Quanlynguoidung from 'views/admin/quanlynguoidung';
import Quanlyhoivien from 'views/admin/quanlyhoivien';
import Quanlydanhsachyeuthich from 'views/admin/quanlydanhsachyeuthich';
import Quanlyrapchieu from 'views/admin/quanlyrapchieu';
import Quanlyphongchieu from 'views/admin/quanlyphongchieu';
import Quanlyghe from 'views/admin/quanlyghe';
import Quanlyvoucher from 'views/admin/quanlyvoucher';
import Quanlyphanquyen from 'views/admin/quanlyphanquyen';

import Quanlysuatchieu from 'views/admin/quanlysuatchieu';
import Quanlyve from 'views/admin/quanlyve';
import Thongke from 'views/admin/thongke';
import Thongkecombo from 'views/admin/thongkecombo';


// Auth Imports
import SignInCentered from 'views/auth/signIn';

const routes = [
  // ─── TỔNG QUAN ───────────────────────────────────────────────────
  {
    name: 'Tổng quan',
    layout: '/admin',
    path: '/default',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: <MainDashboard />,
  },
  // ─── THỐNG KÊ ────────────────────────────────────────────────────
  {
    name: 'Thống kê',
    layout: '/admin',
    path: '/thong-ke',
    icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
    component: <Thongke />,
  },
  {
    name: 'Thống kê combo',
    layout: '/admin',
    path: '/thong-ke-combo',
    icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
    component: <Thongkecombo />,
  },
  // ─── NỘI DUNG ────────────────────────────────────────────────────
  {
    name: 'Nội dung',
    icon: <Icon as={MdWeb} width="20px" height="20px" color="inherit" />,
    children: [
      {
        name: 'Banner',
        layout: '/admin',
        path: '/noi-dung/banner',
        icon: <Icon as={MdImage} width="20px" height="20px" color="inherit" />,
        component: <Quanlybanner />, // thay bằng component thật
      },
      {
        name: 'Menu điều hướng',
        layout: '/admin',
        path: '/noi-dung/menu',
        icon: <Icon as={MdMenu} width="20px" height="20px" color="inherit" />,
        component: <MainDashboard />,
      },
      {
        name: 'Khuyến mãi & Sự kiện',
        layout: '/admin',
        path: '/noi-dung/khuyen-mai',
        icon: <Icon as={MdCampaign} width="20px" height="20px" color="inherit" />,
        component: <Quanlykhuyenmai />,
      },
      {
        name: 'Tin tức điện ảnh',
        layout: '/admin',
        path: '/noi-dung/tin-tuc',
        icon: <Icon as={MdArticle} width="20px" height="20px" color="inherit" />,
        component: <Quanlytintuc />,
      },
      {
        name: 'Voucher',
        layout: '/admin',
        path: '/noi-dung/voucher',
        icon: <Icon as={MdCardGiftcard} width="20px" height="20px" color="inherit" />,
        component: <Quanlyvoucher />,
      },
    ],
  },

  // ─── QUẢN LÝ PHIM ────────────────────────────────────────────────
  {
    name: 'Quản lý phim',
    icon: <Icon as={MdLocalMovies} width="20px" height="20px" color="inherit" />,
    children: [
      {
        name: 'Phim',
        layout: '/admin',
        path: '/quan-ly-phim',
        icon: <Icon as={MdMovie} width="20px" height="20px" color="inherit" />,
        component: <Quanlyphim />,
      },

      {
        name: 'Thể loại phim',
        layout: '/admin',
        path: '/quan-ly-phim/the-loai',
        icon: <Icon as={MdCategory} width="20px" height="20px" color="inherit" />,
        component: <Quanlytheloai />,
      },
      {
        name: 'Diễn viên / Đạo diễn',
        layout: '/admin',
        path: '/quan-ly-phim/dien-vien',
        icon: <Icon as={MdPeopleAlt} width="20px" height="20px" color="inherit" />,
        component: <Quanlydienvien />,
      },
      {
        name: 'Nhà phát hành',
        layout: '/admin',
        path: '/quan-ly-phim/nha-phat-hanh',
        icon: <Icon as={MdBusiness} width="20px" height="20px" color="inherit" />,
        component: <Quanlynhaphathanh />,
      },
      {
        name: 'Đánh giá phim',
        layout: '/admin',
        path: '/quan-ly-phim/danh-gia',
        icon: <Icon as={MdRateReview} width="20px" height="20px" color="inherit" />,
        component: <Quanlydanhgia />,
      },
      {
        name: 'Phim - Thể loại',
        layout: '/admin',
        path: '/quan-ly-phim/phim-the-loai',
        icon: <Icon as={MdLink} width="20px" height="20px" color="inherit" />,
        component: <MainDashboard />,
      },
    ],
  },

  // ─── VẬN HÀNH ────────────────────────────────────────────────────
  {
    name: 'Lịch chiếu',
    icon: <Icon as={MdSchedule} width="20px" height="20px" color="inherit" />,
    children: [
      {
        name: 'Suất chiếu',
        layout: '/admin',
        path: '/lich-chieu/suat-chieu',
        icon: <Icon as={MdCalendarMonth} width="20px" height="20px" color="inherit" />,
        component: <Quanlysuatchieu />,
      },
      {
        name: 'Lịch chiếu định kỳ',
        layout: '/admin',
        path: '/lich-chieu/dinh-ky',
        icon: <Icon as={MdRepeat} width="20px" height="20px" color="inherit" />,
        component: <Quanlylichchieudinhky />,
      },
    ],
  },

  {
    name: 'Vé & Đơn hàng',
    icon: <Icon as={MdConfirmationNumber} width="20px" height="20px" color="inherit" />,
    children: [
      {
        name: 'Vé',
        layout: '/admin',
        path: '/ve-don-hang/ve',
        icon: <Icon as={MdLocalActivity} width="20px" height="20px" color="inherit" />,
        component: <Quanlyve />,
      },
      {
        name: 'Đơn hàng',
        layout: '/admin',
        path: '/ve-don-hang/don-hang',
        icon: <Icon as={MdShoppingCart} width="20px" height="20px" color="inherit" />,
        component: <Quanlydonhang />,
      },
      {
        name: 'Danh sách đặt vé',
        layout: '/admin',
        path: '/ve-don-hang/danh-sach-dat-ve',
        icon: <Icon as={MdHistory} width="20px" height="20px" color="inherit" />,
        component: <Quanlydatve />,
      },
    ],
  },

  {
    name: 'Thanh toán & Combo',
    icon: <Icon as={MdPayment} width="20px" height="20px" color="inherit" />,
    children: [
      {
        name: 'Combo bắp nước',
        layout: '/admin',
        path: '/thanh-toan/combo',
        icon: <Icon as={MdShoppingCart} width="20px" height="20px" color="inherit" />,
        component: <Quanlycombo />,
      },
      {
        name: 'Lịch sử thanh toán',
        layout: '/admin',
        path: '/thanh-toan/lich-su',
        icon: <Icon as={MdHistory} width="20px" height="20px" color="inherit" />,
        component: <Quanlythanhtoan />,
      },
      {
        name: 'Hoàn tiền',
        layout: '/admin',
        path: '/thanh-toan/hoan-tien',
        icon: <Icon as={MdMoneyOff} width="20px" height="20px" color="inherit" />,
        component: <MainDashboard />,
      },
    ],
  },

  // ─── NGƯỜI DÙNG ──────────────────────────────────────────────────
  {
    name: 'Người dùng',
    icon: <Icon as={MdPeople} width="20px" height="20px" color="inherit" />,
    children: [
      {
        name: 'Tài khoản',
        layout: '/admin',
        path: '/nguoi-dung/tai-khoan',
        icon: <Icon as={MdGroup} width="20px" height="20px" color="inherit" />,
        component: <Quanlynguoidung />,
      },
      {
        name: 'Phân quyền',
        layout: '/admin',
        path: '/nguoi-dung/phan-quyen',
        icon: (
          <Icon
            as={MdAdminPanelSettings}
            width="20px"
            height="20px"
            color="inherit"
          />
        ),
        component: <Quanlyphanquyen />,
      },
      {
        name: 'Hội viên',
        layout: '/admin',
        path: '/nguoi-dung/hoi-vien',
        icon: <Icon as={MdWorkspacePremium} width="20px" height="20px" color="inherit" />,
        component: <Quanlyhoivien />,
      },
      {
        name: 'Danh sách yêu thích',
        layout: '/admin',
        path: '/nguoi-dung/yeu-thich',
        icon: <Icon as={MdFavorite} width="20px" height="20px" color="inherit" />,
        component: <Quanlydanhsachyeuthich />,
      },
      {
        name: 'Thông báo',
        layout: '/admin',
        path: '/nguoi-dung/thong-bao',
        icon: <Icon as={MdNotifications} width="20px" height="20px" color="inherit" />,
        component: <MainDashboard />,
      },
    ],
  },

  // ─── RẠP CHIẾU ───────────────────────────────────────────────────
  {
    name: 'Rạp chiếu',
    icon: <Icon as={MdTheaters} width="20px" height="20px" color="inherit" />,
    children: [
      {
        name: 'Rạp chiếu',
        layout: '/admin',
        path: '/rap-chieu/rap',
        icon: <Icon as={MdStore} width="20px" height="20px" color="inherit" />,
        component: <Quanlyrapchieu />,
      },
      {
        name: 'Phòng chiếu',
        layout: '/admin',
        path: '/rap-chieu/phong',
        icon: <Icon as={MdMeetingRoom} width="20px" height="20px" color="inherit" />,
        component: <Quanlyphongchieu />,
      },
      {
        name: 'Ghế ngồi',
        layout: '/admin',
        path: '/rap-chieu/ghe',
        icon: <Icon as={MdChair} width="20px" height="20px" color="inherit" />,
        component: <Quanlyghe />,
      },
    ],
  },

  // ─── HỖ TRỢ ──────────────────────────────────────────────────────
  {
    name: 'Hỗ trợ khách hàng',
    layout: '/admin',
    path: '/ho-tro-khach-hang',
    icon: <Icon as={MdHeadsetMic} width="20px" height="20px" color="inherit" />,
    component: <Hotrokhachhang />,
  },

  

  // ─── HỆ THỐNG ────────────────────────────────────────────────────
  {
    name: 'Hệ thống',
    icon: <Icon as={MdSettings} width="20px" height="20px" color="inherit" />,
    children: [
      {
        name: 'Profile cá nhân',
        layout: '/admin',
        path: '/he-thong/profile',
        icon: <Icon as={MdAccountCircle} width="20px" height="20px" color="inherit" />,
        component: <Profile />,
      },
      {
        name: 'Cài đặt thông báo',
        layout: '/admin',
        path: '/he-thong/cai-dat',
        icon: <Icon as={MdTune} width="20px" height="20px" color="inherit" />,
        component: <MainDashboard />,
      },
    ],
  },

  // ─── AUTH (ẩn khỏi sidebar) ──────────────────────────────────────
  {
    name: 'Sign In',
    layout: '/auth',
    path: '/sign-in',
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: <SignInCentered />,
    hidden: true, // dùng để ẩn khỏi sidebar nếu Links.js hỗ trợ
  },
];

export default routes;