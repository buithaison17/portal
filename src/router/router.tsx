import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import CourseDetail from "../pages/CourseDetail";
import Login from "../pages/Login";
import Register from "../pages/Register";

export const router = createBrowserRouter([
    {
        path: "",
        element: <Home></Home>,
    },
    {
        path: "/home",
        element: <Home></Home>,
    },
    {
        path: "/login",
        element: <Login></Login>,
    },
    {
        path: "/register",
        element: <Register></Register>,
    },
    {
        path: "/courses/:id",
        element: <CourseDetail></CourseDetail>,
    },
]);
