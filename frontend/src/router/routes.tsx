import AppLayout from "@/layout/AppLayout";
import HomePage from "@/pages/HomePage";
import SignIn from "@/pages/AuthPages/SignIn";
import SignUp from "@/pages/AuthPages/SignUp";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />,
    },

    {
        path: "admin",
        element: <AppLayout />,
    },

    {
        path: "/auth/login",
        element: <SignIn />,
    },

    {
        path: "/auth/signup",
        element: <SignUp />,
    },
]);

export default router;
