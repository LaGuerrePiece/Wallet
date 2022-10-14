import express, { Router } from "express";
import fcmRoute from "./fcm.route";
import webhookRoute from "./webhook.route";

const router = express.Router();

type Route = {
  path: string;
  route: Router;
};

const defaultRoutes: Array<Route> = [
  { path: "/fcm", route: fcmRoute },
  { path: "/webhook", route: webhookRoute },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
