import AppLayout from "@/layout/AppLayout";
import Dashboard from "@/pages/Dashboard";
import EmailVerify from "@/pages/AuthPages/ EmailVerify";
import HomePage from "@/pages/HomePage";
import SignIn from "@/pages/AuthPages/SignIn";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />,
    },

    {
        path: "admin",
        element: <AppLayout />,
        children: [
            {
                path: "dashboard",
                element: <Dashboard />,
            },
        ],
    },

    {
        path: "/auth/login",
        element: <SignIn />,
    },

    {
        path: "/auth/verify-email/:id",
        element: <EmailVerify />,
    },
]);

export default router;
