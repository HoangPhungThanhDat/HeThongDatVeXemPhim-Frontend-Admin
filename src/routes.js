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
  MdCampaign,
  MdArticle,
  MdCardGiftcard,
  MdCategory,
  MdPeopleAlt,
  MdBusiness,
  MdRateReview,
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
  MdDashboard,
  MdAnalytics,
  MdMenuBook,
  MdTheaterComedy,
  MdVideocam,
  MdMovieCreation,
  MdPersonAdd,
  MdPersonRemove,
  MdCreditCard,
  MdReceipt,
  MdRestaurant,
  MdFastfood,
  MdMovieFilter,
  MdAudiotrack,
  MdCalendarToday,
  MdDateRange,
  MdEventAvailable,
  MdEventBusy,
  MdPlaylistAdd,
  MdPlaylistAddCheck,
  MdBookmark,
  MdBookmarkAdded,
  MdOutlineBookmark,
  MdStarRate,
  MdStarBorder,
  MdStarHalf,
  MdThumbUp,
  MdThumbDown,
  MdComment,
  MdMessage,
  MdChat,
  MdForum,
  MdContactSupport,
  MdHelp,
  MdInfo,
  MdReport,
  MdFlag,
  MdNewReleases,
  MdUpdate,
  MdSync,
  MdCloudUpload,
  MdCloudDownload,
  MdCloudDone,
  MdCloudOff,
  MdStorage,
  MdDatabase,
  MdDevices,
  MdDesktopMac,
  MdDesktopWindows,
  MdLaptop,
  MdTablet,
  MdPhone,
  MdSmartphone,
  MdWatch,
  MdHeadphones,
  MdSpeaker,
  MdVolumeUp,
  MdVolumeOff,
  MdAdd, // ✅ Thêm icon MdAdd
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
import Quanlytrangthaighe from 'views/admin/quanlytrangthaighe';
import Quanlythongbao from 'views/admin/quanlythongbao';
import LogHeThong from 'views/admin/LogHeThong';
import Quanlysuatchieu from 'views/admin/quanlysuatchieu';
import Quanlyve from 'views/admin/quanlyve';
import Thongke from 'views/admin/thongke';
import Thongkecombo from 'views/admin/thongkecombo';

// ✅ Import trang tạo vé mới
import TaoVeMoi from 'views/admin/quanlyve/components/TaoVeMoi';

// Auth Imports
import SignInCentered from 'views/auth/signIn';

const routes = [
  // ─── AUTH ROUTE ──────────────────────────────────────────────────
  {
    name: 'Sign In',
    layout: '/auth',
    path: '/sign-in',
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: <SignInCentered />,
    hidden: true,
  },
  {
    name: 'Login',
    layout: '/',
    path: '/login',
    component: <SignInCentered />,
    hidden: true,
  },

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
    icon: <Icon as={MdAnalytics} width="20px" height="20px" color="inherit" />,
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
        component: <Quanlybanner />,
      },
      {
        name: 'Khuyến mãi & Sự kiện',
        layout: '/admin',
        path: '/noi-dung/khuyen-mai',
        icon: <Icon as={MdNewReleases} width="20px" height="20px" color="inherit" />,
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
    icon: <Icon as={MdMovie} width="20px" height="20px" color="inherit" />,
    children: [
      {
        name: 'Phim',
        layout: '/admin',
        path: '/quan-ly-phim',
        icon: <Icon as={MdLocalMovies} width="20px" height="20px" color="inherit" />,
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
    ],
  },

  // ─── LỊCH CHIẾU ──────────────────────────────────────────────────
  {
    name: 'Lịch chiếu',
    icon: <Icon as={MdSchedule} width="20px" height="20px" color="inherit" />,
    children: [
      {
        name: 'Suất chiếu',
        layout: '/admin',
        path: '/lich-chieu/suat-chieu',
        icon: <Icon as={MdCalendarToday} width="20px" height="20px" color="inherit" />,
        component: <Quanlysuatchieu />,
      },
      {
        name: 'Lịch chiếu định kỳ',
        layout: '/admin',
        path: '/lich-chieu/dinh-ky',
        icon: <Icon as={MdDateRange} width="20px" height="20px" color="inherit" />,
        component: <Quanlylichchieudinhky />,
      },
    ],
  },

  // ─── VÉ & ĐƠN HÀNG ───────────────────────────────────────────────
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
      // ✅ Thêm route cho trang tạo vé mới (ẩn khỏi menu sidebar)
      {
        name: 'Tạo vé mới',
        layout: '/admin',
        path: '/ve-don-hang/ve/tao-moi',
        icon: <Icon as={MdAdd} width="20px" height="20px" color="inherit" />,
        component: <TaoVeMoi />,
        hidden: true, // ✅ Ẩn khỏi menu sidebar
      },
      {
        name: 'Đơn hàng',
        layout: '/admin',
        path: '/ve-don-hang/don-hang',
        icon: <Icon as={MdReceipt} width="20px" height="20px" color="inherit" />,
        component: <Quanlydonhang />,
      },
      {
        name: 'Danh sách đặt vé',
        layout: '/admin',
        path: '/ve-don-hang/danh-sach-dat-ve',
        icon: <Icon as={MdPlaylistAddCheck} width="20px" height="20px" color="inherit" />,
        component: <Quanlydatve />,
      },
    ],
  },

  // ─── THANH TOÁN & COMBO ──────────────────────────────────────────
  {
    name: 'Thanh toán & Combo',
    icon: <Icon as={MdPayment} width="20px" height="20px" color="inherit" />,
    children: [
      {
        name: 'Combo bắp nước',
        layout: '/admin',
        path: '/thanh-toan/combo',
        icon: <Icon as={MdFastfood} width="20px" height="20px" color="inherit" />,
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
        icon: <Icon as={MdAdminPanelSettings} width="20px" height="20px" color="inherit" />,
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
        component: <Quanlythongbao />,
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
      {
        name: 'Trạng thái ghế',
        layout: '/admin',
        path: '/rap-chieu/ghe-trang-thai',
        icon: <Icon as={MdEventSeat} width="20px" height="20px" color="inherit" />,
        component: <Quanlytrangthaighe />,
      },
    ],
  },

  // ─── HỖ TRỢ ──────────────────────────────────────────────────────
  {
    name: 'Hỗ trợ khách hàng',
    layout: '/admin',
    path: '/ho-tro-khach-hang',
    icon: <Icon as={MdSupportAgent} width="20px" height="20px" color="inherit" />,
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
      {
        name: 'Nhật ký hệ thống',
        layout: '/admin',
        path: '/he-thong/nhat-ky',
        icon: <Icon as={MdHistory} width="20px" height="20px" color="inherit" />,
        component: <LogHeThong />,
      },
    ],
  },
];

export default routes;