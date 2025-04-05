import { Router as ExpressRouter } from "express";

export type Route = {
    path: string;
    routes: ExpressRouter;
};

const router: ExpressRouter = ExpressRouter();

// import routes
import usersRoute from "./users.route";
import projectRoute from "./projects.route";
import taskRoute from "./tasks.route";

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
];

// apply middleware to all routes

routes.forEach((route) => {
    router.use(route.path, route.route);
});

export default router;
