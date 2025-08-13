import { Outlet, createBrowserRouter } from "react-router-dom";

import AppLayout from "@/layout/AppLayout";
import Dashboard from "@/pages/Dashboard";
import EmailVerify from "@/pages/AuthPages/ EmailVerify";
import Employee from "@/pages/AdminSettings/Employee";
import FeatureLayout from "@/layout/FeatureLayout";
import HomePage from "@/pages/HomePage";
import LabelPage from "@/pages/settings/LabelPage";
import Permission from "@/pages/AdminSettings/Permission";
import Roles from "@/pages/AdminSettings/RolePage";
import RoomPage from "@/pages/companySettings/RoomPage";
import RoomTypePage from "@/pages/companySettings/RoomTypePage";
import SignIn from "@/pages/AuthPages/SignIn";
import SprintPage from "@/pages/settings/SprintPage";
import TaskPage from "@/pages/features/TaskPage";
import TaskStatusPage from "@/pages/settings/TaskStatusPage";

const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />,
    },
    {
        path: "auth",
        element: <Outlet />,
        children: [
            {
                path: "login",
                element: <SignIn />,
            },

            {
                path: "verify-email/:id",
                element: <EmailVerify />,
            },
        ],
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
                    {
                        path: "rooms",
                        element: <RoomPage />,
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
                        path: "labels",
                        element: <LabelPage />,
                    },
                    {
                        path: "sprints",
                        element: <SprintPage />,
                    },
                ],
            },
            {
                path: "company-settings",
                element: <Outlet />,
                children: [
                    {
                        path: "rooms",
                        element: <RoomPage routedFrom={"COMPANY_SETTINGS"} />,
                    },
                    {
                        path: "room-types",
                        element: <RoomTypePage />,
                    },
                ],
            },
            {
                path: "admin-settings",
                element: <Outlet />,
                children: [
                    {
                        path: "employees",
                        element: <Employee />,
                    },
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
]);

export default router;
