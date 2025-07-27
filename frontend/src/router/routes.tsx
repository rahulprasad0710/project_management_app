import AppLayout from "@/layout/AppLayout";
import SignIn from "@/pages/AuthPages/SignIn";
import SignUp from "@/pages/AuthPages/SignUp";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
    {
        path: "/",
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
