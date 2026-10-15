import React from 'react';
import { Icon } from '@chakra-ui/react';
import {
  MdHome, MdLock, MdMovie, MdSupportAgent, MdSchedule,
  MdConfirmationNumber, MdBarChart, MdCampaign, MdLocalMovies, MdEventSeat,
  MdPayment, MdPeople, MdTheaters, MdSettings, MdImage,
  MdArticle, MdCardGiftcard, MdCategory, MdPeopleAlt, MdBusiness,
  MdRateReview, MdLocalActivity, MdHistory, MdMoneyOff, MdGroup, MdWorkspacePremium,
  MdFavorite, MdNotifications, MdStore, MdMeetingRoom, MdChair,
  MdAccountCircle, MdTune, MdAnalytics, MdFastfood, MdReceipt,
  MdCalendarToday, MdDateRange, MdPlaylistAddCheck,
  MdNewReleases, MdAdminPanelSettings, MdAdd,
} from 'react-icons/md';

// ─── AUTH ────────────────────────────────────────────────────────
import SignInCentered from 'views/auth/signIn';

// ─── HOME ────────────────────────────────────────────────────────
import MainDashboard from 'views/admin/home';

// ─── CATALOG ─────────────────────────────────────────────────────
import Quanlyphim from 'views/admin/catalog/quanlyphim';
import Quanlytheloai from 'views/admin/catalog/quanlytheloai';
import Quanlydienvien from 'views/admin/catalog/quanlydienvien';
import Quanlynhaphathanh from 'views/admin/catalog/quanlynhaphathanh';

// ─── CINEMA ──────────────────────────────────────────────────────
import Quanlyrapchieu from 'views/admin/cinema/quanlyrapchieu';
import Quanlyphongchieu from 'views/admin/cinema/quanlyphongchieu';
import Quanlyghe from 'views/admin/cinema/quanlyghe';
import Quanlytrangthaighe from 'views/admin/cinema/quanlytrangthaighe';
import Quanlysuatchieu from 'views/admin/cinema/quanlysuatchieu';
import Quanlylichchieudinhky from 'views/admin/cinema/quanlylichchieudinhky';

// ─── BOOKING ─────────────────────────────────────────────────────
import Quanlyve from 'views/admin/booking/quanlyve';
import Quanlydonhang from 'views/admin/booking/quanlydonhang';
import Quanlydatve from 'views/admin/booking/quanlydatve';
import Quanlythanhtoan from 'views/admin/booking/quanlythanhtoan';
import TaoVeMoi from 'views/admin/booking/quanlyve/components/TaoVeMoi';

// ─── MARKETING ───────────────────────────────────────────────────
import Quanlybanner from 'views/admin/marketing/quanlybanner';
import Quanlykhuyenmai from 'views/admin/marketing/quanlykhuyenmai';
import Quanlytintuc from 'views/admin/marketing/quanlytintuc';
import Quanlyvoucher from 'views/admin/marketing/quanlyvoucher';
import Quanlycombo from 'views/admin/marketing/quanlycombo';
import Quanlythongbao from 'views/admin/marketing/quanlythongbao';

// ─── USER ────────────────────────────────────────────────────────
import Quanlynguoidung from 'views/admin/user/quanlynguoidung';
import Quanlyphanquyen from 'views/admin/user/quanlyphanquyen';
import Quanlyhoivien from 'views/admin/user/quanlyhoivien';
import Quanlydanhgia from 'views/admin/user/quanlydanhgia';
import Quanlydanhsachyeuthich from 'views/admin/user/quanlydanhsachyeuthich';
import Hotrokhachhang from 'views/admin/user/hotrokhachhang';

// ─── REPORT ──────────────────────────────────────────────────────
import Thongke from 'views/admin/report/thongke';
import Thongkecombo from 'views/admin/report/thongkecombo';
import LogHeThong from 'views/admin/report/nhatkyhethong';

// ─── SYSTEM ──────────────────────────────────────────────────────
import Profile from 'views/admin/system/profile';

// Helper cho icon gọn hơn
const icon = (IconComponent) => (
  <Icon as={IconComponent} width="20px" height="20px" color="inherit" />
);

const routes = [
  // ─── AUTH (ẩn) ─────────────────────────────────────────────────
  {
    name: 'Sign In',
    layout: '/auth',
    path: '/sign-in',
    icon: icon(MdLock),
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

  // ═══════════════════════════════════════════════════════════════
  // 🟦 SECTION: VẬN HÀNH — Quản lý phim, rạp, lịch chiếu, vé
  // ═══════════════════════════════════════════════════════════════
  { type: 'divider', label: 'VẬN HÀNH' },

  {
    name: 'Tổng quan',
    layout: '/admin',
    path: '/home',
    icon: icon(MdHome),
    component: <MainDashboard />,
  },

  {
    name: 'Quản lý phim',
    icon: icon(MdMovie),
    children: [
      {
        name: 'Phim',
        layout: '/admin',
        path: '/quan-ly-phim',
        icon: icon(MdLocalMovies),
        component: <Quanlyphim />,
      },
      {
        name: 'Thể loại',
        layout: '/admin',
        path: '/quan-ly-phim/the-loai',
        icon: icon(MdCategory),
        component: <Quanlytheloai />,
      },
      {
        name: 'Diễn viên / Đạo diễn',
        layout: '/admin',
        path: '/quan-ly-phim/dien-vien',
        icon: icon(MdPeopleAlt),
        component: <Quanlydienvien />,
      },
      {
        name: 'Nhà phát hành',
        layout: '/admin',
        path: '/quan-ly-phim/nha-phat-hanh',
        icon: icon(MdBusiness),
        component: <Quanlynhaphathanh />,
      },
    ],
  },

  {
    name: 'Rạp chiếu',
    icon: icon(MdTheaters),
    children: [
      {
        name: 'Rạp chiếu',
        layout: '/admin',
        path: '/rap-chieu/rap',
        icon: icon(MdStore),
        component: <Quanlyrapchieu />,
      },
      {
        name: 'Phòng chiếu',
        layout: '/admin',
        path: '/rap-chieu/phong',
        icon: icon(MdMeetingRoom),
        component: <Quanlyphongchieu />,
      },
      {
        name: 'Ghế ngồi',
        layout: '/admin',
        path: '/rap-chieu/ghe',
        icon: icon(MdChair),
        component: <Quanlyghe />,
      },
      {
        name: 'Trạng thái ghế',
        layout: '/admin',
        path: '/rap-chieu/ghe-trang-thai',
        icon: icon(MdEventSeat),
        component: <Quanlytrangthaighe />,
      },
    ],
  },

  {
    name: 'Lịch chiếu',
    icon: icon(MdSchedule),
    children: [
      {
        name: 'Suất chiếu',
        layout: '/admin',
        path: '/lich-chieu/suat-chieu',
        icon: icon(MdCalendarToday),
        component: <Quanlysuatchieu />,
      },
      {
        name: 'Lịch chiếu định kỳ',
        layout: '/admin',
        path: '/lich-chieu/dinh-ky',
        icon: icon(MdDateRange),
        component: <Quanlylichchieudinhky />,
      },
    ],
  },

  {
    name: 'Vé & Đơn hàng',
    icon: icon(MdConfirmationNumber),
    children: [
      {
        name: 'Vé',
        layout: '/admin',
        path: '/ve-don-hang/ve',
        icon: icon(MdLocalActivity),
        component: <Quanlyve />,
      },
      {
        name: 'Tạo vé mới',
        layout: '/admin',
        path: '/ve-don-hang/ve/tao-moi',
        icon: icon(MdAdd),
        component: <TaoVeMoi />,
        hidden: true,
      },
      {
        name: 'Đơn hàng',
        layout: '/admin',
        path: '/ve-don-hang/don-hang',
        icon: icon(MdReceipt),
        component: <Quanlydonhang />,
      },
      {
        name: 'Danh sách đặt vé',
        layout: '/admin',
        path: '/ve-don-hang/danh-sach-dat-ve',
        icon: icon(MdPlaylistAddCheck),
        component: <Quanlydatve />,
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // 🟨 SECTION: KINH DOANH — Marketing, người dùng, thanh toán
  // ═══════════════════════════════════════════════════════════════
  { type: 'divider', label: 'KINH DOANH' },

  {
    name: 'Marketing',
    icon: icon(MdCampaign),
    children: [
      {
        name: 'Banner',
        layout: '/admin',
        path: '/marketing/banner',
        icon: icon(MdImage),
        component: <Quanlybanner />,
      },
      {
        name: 'Khuyến mãi & Sự kiện',
        layout: '/admin',
        path: '/marketing/khuyen-mai',
        icon: icon(MdNewReleases),
        component: <Quanlykhuyenmai />,
      },
      {
        name: 'Voucher',
        layout: '/admin',
        path: '/marketing/voucher',
        icon: icon(MdCardGiftcard),
        component: <Quanlyvoucher />,
      },
      {
        name: 'Tin tức điện ảnh',
        layout: '/admin',
        path: '/marketing/tin-tuc',
        icon: icon(MdArticle),
        component: <Quanlytintuc />,
      },
    ],
  },

  {
    name: 'Thanh toán & Sản phẩm',
    icon: icon(MdPayment),
    children: [
      {
        name: 'Lịch sử thanh toán',
        layout: '/admin',
        path: '/thanh-toan/lich-su',
        icon: icon(MdHistory),
        component: <Quanlythanhtoan />,
      },
      {
        name: 'Combo bắp nước',
        layout: '/admin',
        path: '/thanh-toan/combo',
        icon: icon(MdFastfood),
        component: <Quanlycombo />,
      },
      {
        name: 'Hoàn tiền',
        layout: '/admin',
        path: '/thanh-toan/hoan-tien',
        icon: icon(MdMoneyOff),
        component: <MainDashboard />,
        hidden: true,
      },
    ],
  },

  {
    name: 'Người dùng & CSKH',
    icon: icon(MdPeople),
    children: [
      {
        name: 'Tài khoản',
        layout: '/admin',
        path: '/nguoi-dung/tai-khoan',
        icon: icon(MdGroup),
        component: <Quanlynguoidung />,
      },
      {
        name: 'Phân quyền',
        layout: '/admin',
        path: '/nguoi-dung/phan-quyen',
        icon: icon(MdAdminPanelSettings),
        component: <Quanlyphanquyen />,
      },
      {
        name: 'Hội viên',
        layout: '/admin',
        path: '/nguoi-dung/hoi-vien',
        icon: icon(MdWorkspacePremium),
        component: <Quanlyhoivien />,
      },
      {
        name: 'Đánh giá phim',
        layout: '/admin',
        path: '/nguoi-dung/danh-gia',
        icon: icon(MdRateReview),
        component: <Quanlydanhgia />,
      },
      {
        name: 'Danh sách yêu thích',
        layout: '/admin',
        path: '/nguoi-dung/yeu-thich',
        icon: icon(MdFavorite),
        component: <Quanlydanhsachyeuthich />,
      },
      {
        name: 'Thông báo',
        layout: '/admin',
        path: '/nguoi-dung/thong-bao',
        icon: icon(MdNotifications),
        component: <Quanlythongbao />,
      },
      {
        name: 'Hỗ trợ khách hàng',
        layout: '/admin',
        path: '/ho-tro-khach-hang',
        icon: icon(MdSupportAgent),
        component: <Hotrokhachhang />,
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // 🟥 SECTION: HỆ THỐNG — Báo cáo, cài đặt
  // ═══════════════════════════════════════════════════════════════
  { type: 'divider', label: 'HỆ THỐNG' },

  {
    name: 'Báo cáo & Thống kê',
    icon: icon(MdAnalytics),
    children: [
      {
        name: 'Thống kê doanh thu',
        layout: '/admin',
        path: '/bao-cao/thong-ke',
        icon: icon(MdAnalytics),
        component: <Thongke />,
      },
      {
        name: 'Thống kê combo',
        layout: '/admin',
        path: '/bao-cao/thong-ke-combo',
        icon: icon(MdBarChart),
        component: <Thongkecombo />,
      },
      {
        name: 'Nhật ký hoạt động',
        layout: '/admin',
        path: '/bao-cao/nhat-ky',
        icon: icon(MdHistory),
        component: <LogHeThong />,
      },
    ],
  },

  {
    name: 'Hệ thống',
    icon: icon(MdSettings),
    children: [
      {
        name: 'Profile cá nhân',
        layout: '/admin',
        path: '/he-thong/profile',
        icon: icon(MdAccountCircle),
        component: <Profile />,
      },
      {
        name: 'Cài đặt thông báo',
        layout: '/admin',
        path: '/he-thong/cai-dat',
        icon: icon(MdTune),
        component: <MainDashboard />,
        hidden: true,
      },
    ],
  },
];

export default routes;