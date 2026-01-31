import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../pages/home";
import Login from "../pages/login";
import Register from "../pages/register";
import Home2 from "../pages/home2";

import Profile from "../pages/profile";

import User from "../pages/User/index";
import PrivateRoute from "./PrivateRoute";
import UserShow from "../pages/User/show";
import UserEdit from "../pages/User/edit";
import Role from "../pages/Role/index";
import RoleShow from "../pages/Role/show";
import RoleEdit from "../pages/Role/edit";
import Membership from "../pages/Membership/index";
import MembershipShow from "../pages/Membership/show";
import MembershipEdit from "../pages/Membership/edit";
import Wishlist from "../pages/Wishlist/index";
import WishlistShow from "../pages/Wishlist/show";
import WishlistEdit from "../pages/Wishlist/edit";
import Banner from "../pages/Banner/index";
import BannerShow from "../pages/Banner/show";
import BannerEdit from "../pages/Banner/edit";

import Genre from "../pages/Genres/index";
import GenreShow from "../pages/Genres/show";
import GenreEdit from "../pages/Genres/edit";

import MovieCast from "../pages/MovieCast/index";
import MovieCastEdit from "../pages/MovieCast/edit";
import MovieCastShow from "../pages/MovieCast/show";

import Promotion from "../pages/Promotions/index";
import PromotionShow from "../pages/Promotions/show";
import PromotionEdit from "../pages/Promotions/edit";

import Movie from "../pages/Movie/index";
import MovieShow from "../pages/Movie/show";
import MovieEdit from "../pages/Movie/edit";

import Review from "../pages/Review/index";
import ReviewShow from "../pages/Review/show";
import ReviewEdit from "../pages/Review/edit";

import Distributor from "../pages/Distributor/index";
import DistributorShow from "../pages/Distributor/show";
import DistributorEdit from "../pages/Distributor/edit";

import Showtime from "../pages/Showtime/index";
import ShowtimeEdit from "../pages/Showtime/edit";
import ShowtimeShow from "../pages/Showtime/show";

import MovieGenres from "../pages/MovieGenres/index";
import MovieGenresShow from "../pages/MovieGenres/show";
import MovieGenresEdit from "../pages/MovieGenres/edit";

import Ticket from "../pages/Ticket/index";
import TicketEdit from "../pages/Ticket/edit";
import TicketShow from "../pages/Ticket/show";

import Schedule from "../pages/Schedule/index";
import ScheduleShow from "../pages/Schedule/show";
import ScheduleEdit from "../pages/Schedule/edit";

import Order from "../pages/Order/index";
import OrderEdit from "../pages/Order/edit";
import OrderShow from "../pages/Order/show";

import OrderDetail from "../pages/OrderDetail/index";
import OrderDetailEdit from "../pages/OrderDetail/edit";
import OrderDetailShow from "../pages/OrderDetail/show";

import ShowtimeSeat from "../pages/ShowtimeSeats/index";
import ShowtimeSeatShow from "../pages/ShowtimeSeats/show";
import ShowtimeSeatEdit from "../pages/ShowtimeSeats/edit";

import Cinemas from "../pages/Cinemas/index";
import CinemasShow from "../pages/Cinemas/show";
import CinemasEdit from "../pages/Cinemas/edit";

import Room from "../pages/Room/index";
import RoomShow from "../pages/Room/show";
import RoomEdit from "../pages/Room/edit";

import Notification from "../pages/Notifications/index";
import NotificationShow from "../pages/Notifications/show";
import NotificationEdit from "../pages/Notifications/edit";

import Staff from "../pages/Staff/index";
import StaffShow from "../pages/Staff/show";
import StaffEdit from "../pages/Staff/edit";

import FoodAndDrink from "../pages/FoodAndDrink/index";
import FoodAndDrinkShow from "../pages/FoodAndDrink/show";
import FoodAndDrinkEdit from "../pages/FoodAndDrink/edit";

import Booking from "../pages/Booking/index";
import BookingShow from "../pages/Booking/show";

import New from "../pages/New/index";
import NewShow from "../pages/New/show";
import NewEdit from "../pages/New/edit";

import Seat from "../pages/Seat/index";
import SeatShow from "../pages/Seat/show";
import SeatEdit from "../pages/Seat/edit";
export default function AdminRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />

      <Route
        path="/home2"
        element={
          <PrivateRoute>
            <Home2 />
          </PrivateRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />

      <Route
        path="/user"
        element={
          <PrivateRoute>
            <User />
          </PrivateRoute>
        }
      />

      <Route
        path="/user/:UserId"
        element={
          <PrivateRoute>
            <UserShow />
          </PrivateRoute>
        }
      />
      <Route
        path="/user/edit/:UserId"
        element={
          <PrivateRoute>
            <UserEdit />
          </PrivateRoute>
        }
      />
      <Route
        path="/role"
        element={
          <PrivateRoute>
            <Role />
          </PrivateRoute>
        }
      />
      <Route
        path="/role/show/:RoleId"
        element={
          <PrivateRoute>
            <RoleShow />
          </PrivateRoute>
        }
      />
      <Route
        path="/role/edit/:RoleId"
        element={
          <PrivateRoute>
            <RoleEdit />
          </PrivateRoute>
        }
      />
      <Route
        path="/membership"
        element={
          <PrivateRoute>
            <Membership />
          </PrivateRoute>
        }
      />
      <Route
        path="/membership/show/:MembershipId"
        element={
          <PrivateRoute>
            <MembershipShow />
          </PrivateRoute>
        }
      />
      <Route
        path="/membership/edit/:MembershipId"
        element={
          <PrivateRoute>
            <MembershipEdit />
          </PrivateRoute>
        }
      />
      <Route
        path="/wishlist"
        element={
          <PrivateRoute>
            <Wishlist />
          </PrivateRoute>
        }
      />
      <Route
        path="/wishlist/show/:WishlistId"
        element={
          <PrivateRoute>
            <WishlistShow />
          </PrivateRoute>
        }
      />

      <Route
        path="/wishlist/edit/:WishlistId"
        element={
          <PrivateRoute>
            <WishlistEdit />
          </PrivateRoute>
        }
      />
      <Route
        path="/banner"
        element={
          <PrivateRoute>
            <Banner />
          </PrivateRoute>
        }
      />
      <Route
        path="/banner/show/:BannerId"
        element={
          <PrivateRoute>
            <BannerShow />
          </PrivateRoute>
        }
      />
      <Route
        path="/banner/edit/:BannerId"
        element={
          <PrivateRoute>
            <BannerEdit />
          </PrivateRoute>
        }
      />

      <Route
        path="/Genre"
        element={
          <PrivateRoute>
            <Genre />
          </PrivateRoute>
        }
      />

      <Route
        path="/Genre/show/:GenreId"
        element={
          <PrivateRoute>
            <GenreShow />
          </PrivateRoute>
        }
      />
      <Route
        path="/Genre/edit/:GenreId"
        element={
          <PrivateRoute>
            <GenreEdit />
          </PrivateRoute>
        }
      />

      <Route
        path="/MovieCast"
        element={
          <PrivateRoute>
            <MovieCast />
          </PrivateRoute>
        }
      />
      <Route
        path="/MovieCast/edit/:CastId"
        element={
          <PrivateRoute>
            <MovieCastEdit />
          </PrivateRoute>
        }
      />
      <Route
        path="/MovieCast/show/:CastId"
        element={
          <PrivateRoute>
            <MovieCastShow />
          </PrivateRoute>
        }
      />

      <Route
        path="/Promotion"
        element={
          <PrivateRoute>
            <Promotion />
          </PrivateRoute>
        }
      />
      <Route
        path="/Promotion/show/:PromotionId"
        element={
          <PrivateRoute>
            <PromotionShow />
          </PrivateRoute>
        }
      />
      <Route
        path="/Promotion/edit/:PromotionId"
        element={
          <PrivateRoute>
            <PromotionEdit />
          </PrivateRoute>
        }
      />

      <Route
        path="/movie"
        element={
          <PrivateRoute>
            <Movie />
          </PrivateRoute>
        }
      />
      <Route
        path="/movie/show/:MovieId"
        element={
          <PrivateRoute>
            <MovieShow />
          </PrivateRoute>
        }
      />
      <Route
        path="/movie/edit/:MovieId"
        element={
          <PrivateRoute>
            <MovieEdit />
          </PrivateRoute>
        }
      />

      <Route
        path="/Review"
        element={
          <PrivateRoute>
            <Review />
          </PrivateRoute>
        }
      />
      <Route
        path="/Review/show/:ReviewId"
        element={
          <PrivateRoute>
            <ReviewShow />
          </PrivateRoute>
        }
      />
      <Route
        path="/Review/edit/:ReviewId"
        element={
          <PrivateRoute>
            <ReviewEdit />
          </PrivateRoute>
        }
      />

      <Route
        path="/distributor"
        element={
          <PrivateRoute>
            <Distributor />
          </PrivateRoute>
        }
      />
      <Route
        path="/distributor/show/:DistributorId"
        element={
          <PrivateRoute>
            <DistributorShow />
          </PrivateRoute>
        }
      />
      <Route
        path="/distributor/edit/:DistributorId"
        element={
          <PrivateRoute>
            <DistributorEdit />
          </PrivateRoute>
        }
      />

      <Route
        path="/Showtime"
        element={
          <PrivateRoute>
            <Showtime />
          </PrivateRoute>
        }
      />
      <Route
        path="/Showtime/edit/:ShowtimeId"
        element={
          <PrivateRoute>
            <ShowtimeEdit />
          </PrivateRoute>
        }
      />
      <Route
        path="/Showtime/show/:ShowtimeId"
        element={
          <PrivateRoute>
            <ShowtimeShow />
          </PrivateRoute>
        }
      />

      <Route
        path="/moviegenres"
        element={
          <PrivateRoute>
            <MovieGenres />
          </PrivateRoute>
        }
      />
      <Route
        path="/moviegenres/show/:MovieGenreId"
        element={
          <PrivateRoute>
            <MovieGenresShow />
          </PrivateRoute>
        }
      />
      <Route
        path="/moviegenres/edit/:MovieGenreId"
        element={
          <PrivateRoute>
            <MovieGenresEdit />
          </PrivateRoute>
        }
      />

      <Route
        path="/Tickets"
        element={
          <PrivateRoute>
            <Ticket />
          </PrivateRoute>
        }
      />
      <Route
        path="/Ticket/edit/:TicketId"
        element={
          <PrivateRoute>
            <TicketEdit />
          </PrivateRoute>
        }
      />
      <Route
        path="/Ticket/show/:TicketId"
        element={
          <PrivateRoute>
            <TicketShow />
          </PrivateRoute>
        }
      />

      <Route
        path="/schedules"
        element={
          <PrivateRoute>
            <Schedule />
          </PrivateRoute>
        }
      />
      <Route
        path="/schedules/show/:ScheduleId"
        element={
          <PrivateRoute>
            <ScheduleShow />
          </PrivateRoute>
        }
      />
      <Route
        path="/schedules/edit/:ScheduleId"
        element={
          <PrivateRoute>
            <ScheduleEdit />
          </PrivateRoute>
        }
      />

      <Route
        path="/orders"
        element={
          <PrivateRoute>
            <Order />
          </PrivateRoute>
        }
      />

      <Route
        path="/orders/edit/:OrderId"
        element={
          <PrivateRoute>
            <OrderEdit />
          </PrivateRoute>
        }
      />

      <Route
        path="/orders/show/:OrderId"
        element={
          <PrivateRoute>
            <OrderShow />
          </PrivateRoute>
        }
      />

      <Route
        path="/showtimeseats"
        element={
          <PrivateRoute>
            <ShowtimeSeat />
          </PrivateRoute>
        }
      />
      <Route
        path="/showtimeseats/show/:ShowtimeSeatId"
        element={
          <PrivateRoute>
            <ShowtimeSeatShow />
          </PrivateRoute>
        }
      />
      <Route
        path="/showtimeseats/edit/:ShowtimeSeatId"
        element={
          <PrivateRoute>
            <ShowtimeSeatEdit />
          </PrivateRoute>
        }
      />

      <Route
        path="/cinemas"
        element={
          <PrivateRoute>
            <Cinemas />
          </PrivateRoute>
        }
      />
      <Route
        path="/cinemas/show/:CinemaId"
        element={
          <PrivateRoute>
            <CinemasShow />
          </PrivateRoute>
        }
      />
      <Route
        path="/cinemas/edit/:CinemaId"
        element={
          <PrivateRoute>
            <CinemasEdit />
          </PrivateRoute>
        }
      />

      <Route
        path="/orderdetails"
        element={
          <PrivateRoute>
            <OrderDetail />
          </PrivateRoute>
        }
      />
      <Route
        path="/orderdetails/edit/:OrderDetailId"
        element={
          <PrivateRoute>
            <OrderDetailEdit />
          </PrivateRoute>
        }
      />
      <Route
        path="/orderdetails/show/:OrderDetailId"
        element={
          <PrivateRoute>
            <OrderDetailShow />
          </PrivateRoute>
        }
      />

      <Route
        path="/rooms"
        element={
          <PrivateRoute>
            <Room />
          </PrivateRoute>
        }
      />
      <Route
        path="/rooms/show/:RoomId"
        element={
          <PrivateRoute>
            <RoomShow />
          </PrivateRoute>
        }
      />
      <Route
        path="/rooms/edit/:RoomId"
        element={
          <PrivateRoute>
            <RoomEdit />
          </PrivateRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <PrivateRoute>
            <Notification />
          </PrivateRoute>
        }
      />
      <Route
        path="/notifications/show/:NotificationId"
        element={
          <PrivateRoute>
            <NotificationShow />
          </PrivateRoute>
        }
      />
      <Route
        path="/notifications/edit/:NotificationId"
        element={
          <PrivateRoute>
            <NotificationEdit />
          </PrivateRoute>
        }
      />

      <Route
        path="/staffs"
        element={
          <PrivateRoute>
            <Staff />
          </PrivateRoute>
        }
      />
      <Route
        path="/staffs/show/:StaffId"
        element={
          <PrivateRoute>
            <StaffShow />
          </PrivateRoute>
        }
      />
      <Route
        path="/staffs/edit/:StaffId"
        element={
          <PrivateRoute>
            <StaffEdit />
          </PrivateRoute>
        }
      />

      <Route
        path="/foodanddrink"
        element={
          <PrivateRoute>
            <FoodAndDrink />
          </PrivateRoute>
        }
      />
      <Route
        path="/foodanddrink/show/:ItemId"
        element={
          <PrivateRoute>
            <FoodAndDrinkShow />
          </PrivateRoute>
        }
      />
      <Route
        path="/foodanddrink/edit/:ItemId"
        element={
          <PrivateRoute>
            <FoodAndDrinkEdit />
          </PrivateRoute>
        }
      />

      <Route
        path="/bookings"
        element={
          <PrivateRoute>
            <Booking />
          </PrivateRoute>
        }
      />
      <Route
        path="/bookings/show/:OrderId"
        element={
          <PrivateRoute>
            <BookingShow />
          </PrivateRoute>
        }
      />

      <Route
        path="/news"
        element={
          <PrivateRoute>
            <New />
          </PrivateRoute>
        }
      />
      <Route
        path="/news/show/:NewsId"
        element={
          <PrivateRoute>
            <NewShow />
          </PrivateRoute>
        }
      />
      <Route
        path="/news/edit/:NewsId"
        element={
          <PrivateRoute>
            <NewEdit />
          </PrivateRoute>
        }
      />

      <Route
        path="/seats"
        element={
          <PrivateRoute>
            <Seat />
          </PrivateRoute>
        }
      />
      <Route
        path="/seats/show/:SeatId"
        element={
          <PrivateRoute>
            <SeatShow />
          </PrivateRoute>
        }
      />
      <Route
        path="/seats/edit/:roomId"
        element={
          <PrivateRoute>
            <SeatEdit />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
