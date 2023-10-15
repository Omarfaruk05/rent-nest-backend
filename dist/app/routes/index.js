"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_route_1 = require("../modules/user/user.route");
const auth_route_1 = require("../modules/auth/auth.route");
const house_route_1 = require("../modules/house/house.route");
const booking_route_1 = require("../modules/booking/booking.route");
const review_route_1 = require("../modules/review/review.route");
const feedback_route_1 = require("../modules/feedback/feedback.route");
const blog_route_1 = require("../modules/blog/blog.route");
const blog_route_2 = require("../modules/faq/blog.route");
const houseVisit_route_1 = require("../modules/houseVisit/houseVisit.route");
const addToCart_route_1 = require("../modules/addToCart/addToCart.route");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/users",
        route: user_route_1.UserRoutes,
    },
    {
        path: "/auth",
        route: auth_route_1.AuthRoutes,
    },
    {
        path: "/houses",
        route: house_route_1.HouseRoutes,
    },
    {
        path: "/bookings",
        route: booking_route_1.BookingRoutes,
    },
    {
        path: "/reviews",
        route: review_route_1.ReviewRoutes,
    },
    {
        path: "/feedbacks",
        route: feedback_route_1.FeedbackRoutes,
    },
    {
        path: "/blogs",
        route: blog_route_1.BlogRoutes,
    },
    {
        path: "/faqs",
        route: blog_route_2.FaqRoutes,
    },
    {
        path: "/house-visits",
        route: houseVisit_route_1.HouseVisitRoutes,
    },
    {
        path: "/carts",
        route: addToCart_route_1.AddToCartRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
