import { Router as ExpressRouter } from "express";
import roomRoute from "./room.route";
import roomTypeRoute from "./roomType.route";

export type Route = {
    path: string;
    routes: ExpressRouter;
};

const router: ExpressRouter = ExpressRouter();

const routes = [
    {
        path: "/rooms",
        route: roomRoute,
    },
    {
        path: "/room-types",
        route: roomTypeRoute,
    },
];

routes.forEach((route) => {
    router.use(route.path, route.route);
});

export default router;
