import { Outlet, createBrowserRouter } from "react-router-dom";

import AppLayout from "@/layout/AppLayout";
import Dashboard from "@/pages/Dashboard";
import EmailVerify from "@/pages/AuthPages/ EmailVerify";
import FeatureLayout from "@/layout/FeatureLayout";
import HomePage from "@/pages/HomePage";
import Permission from "@/pages/RolesAndPermission/Permission";
import Roles from "@/pages/RolesAndPermission/RolePage";
import SignIn from "@/pages/AuthPages/SignIn";
import TaskPage from "@/pages/features/TaskPage";
import TaskStatusPage from "@/pages/settings/TaskStatusPage";

const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />,
    },

    {
        path: ":internal-company-slug",
        element: <AppLayout />,
        children: [
            {
                path: "dashboard",
                element: <Dashboard />,
            },
            {
                path: "features/:feature-slug",
                element: <FeatureLayout />,
                children: [
                    {
                        path: "tasks",
                        element: <TaskPage />,
                    },
                    {
                        path: "listings",
                        element: <Roles />,
                    },
                ],
            },
            {
                path: "settings",
                element: <Outlet />,
                children: [
                    {
                        path: "task-status",
                        element: <TaskStatusPage />,
                    },
                    {
                        path: "roles",
                        element: <Roles />,
                    },
                ],
            },
            {
                path: "auth-settings",
                element: <Outlet />,
                children: [
                    {
                        path: "permissions",
                        element: <Permission />,
                    },
                    {
                        path: "roles",
                        element: <Roles />,
                    },
                ],
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
