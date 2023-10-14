import express from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { HouseRoutes } from "../modules/house/house.route";
import { BookingRoutes } from "../modules/booking/booking.route";
import { ReviewRoutes } from "../modules/review/review.route";
import { FeedbackRoutes } from "../modules/feedback/feedback.route";
import { BlogRoutes } from "../modules/blog/blog.route";
import { FaqRoutes } from "../modules/faq/blog.route";
import { HouseVisitRoutes } from "../modules/houseVisit/houseVisit.route";
import { AddToCartRoutes } from "../modules/addToCart/addToCart.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/houses",
    route: HouseRoutes,
  },
  {
    path: "/bookings",
    route: BookingRoutes,
  },
  {
    path: "/reviews",
    route: ReviewRoutes,
  },
  {
    path: "/feedbacks",
    route: FeedbackRoutes,
  },
  {
    path: "/blogs",
    route: BlogRoutes,
  },
  {
    path: "/faqs",
    route: FaqRoutes,
  },
  {
    path: "/house-visits",
    route: HouseVisitRoutes,
  },
  {
    path: "/carts",
    route: AddToCartRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
