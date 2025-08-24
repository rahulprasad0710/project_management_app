import { Outlet, createBrowserRouter } from "react-router-dom";

import AddBookingPage from "@/pages/companySettings/AddBookingPage";
import AppLayout from "@/layout/AppLayout";
import BookingDetailsPage from "@/pages/features/BookingDetailsPage";
import BookingInvoicePage from "@/pages/features/BookingInvoicePage";
import BookingPage from "@/pages/companySettings/BookingPage";
import Calendar from "@/pages/Calendar";
import CustomerListPage from "@/pages/CustomerListPage";
import Dashboard from "@/pages/Dashboard";
import EmailVerify from "@/pages/AuthPages/ EmailVerify";
import Employee from "@/pages/AdminSettings/Employee";
import FeatureLayout from "@/layout/FeatureLayout";
import HomePage from "@/pages/HomePage";
import LabelPage from "@/pages/settings/LabelPage";
import NotFound from "@/pages/NotFound";
import Permission from "@/pages/AdminSettings/Permission";
import ProjectPage from "@/pages/EventListPage";
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
                path: "calendar",
                element: <Calendar />,
            },
            {
                path: "customers",
                element: <CustomerListPage />,
            },
            {
                path: "events",
                element: <ProjectPage />,
            },
            {
                path: "features/:feature-slug",
                element: <FeatureLayout />,
                children: [
                    {
                        path: "add",
                        element: <AddBookingPage />,
                    },
                    {
                        path: "tasks",
                        element: <TaskPage />,
                    },

                    {
                        path: "details/:bookingId",
                        element: <BookingDetailsPage />,
                    },
                    {
                        path: "listings",
                        element: <BookingPage />,
                    },
                    {
                        path: "rooms",
                        element: <RoomPage routedFrom={undefined} />,
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

    {
        path: "*",
        element: <NotFound />,
    },
]);

export default router;
