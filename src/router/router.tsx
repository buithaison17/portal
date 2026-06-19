import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import CourseDetail from "../pages/CourseDetail";

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
        path: "/courses/:id",
        element: <CourseDetail></CourseDetail>,
    },
]);
