import { Router } from "express";
import { subscribe } from "../controllers/subscribe.controller.js";

const router = Router();



router.route("/subscribe").post(subscribe);


export default router;