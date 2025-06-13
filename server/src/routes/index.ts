import { Router as ExpressRouter } from "express";
import projectRoute from "./projects.route";
import sprintRoute from "./sprint.route";
import taskRoute from "./tasks.route";
import uploadRoute from "./uploads.route";
// import routes
import usersRoute from "./users.route";

export type Route = {
    path: string;
    routes: ExpressRouter;
};

const router: ExpressRouter = ExpressRouter();

const routes = [
    {
        path: "/users",
        route: usersRoute,
    },
    {
        path: "/projects",
        route: projectRoute,
    },
    {
        path: "/tasks",
        route: taskRoute,
    },
    {
        path: "/uploads",
        route: uploadRoute,
    },
    {
        path: "/sprints",
        route: sprintRoute,
    },
];

// apply middleware to all routes

routes.forEach((route) => {
    router.use(route.path, route.route);
});

export default router;
