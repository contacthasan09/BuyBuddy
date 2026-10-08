import { Router } from "express";
import steadfastWebhook from "./steadfast.webhook";

const router = Router();

router.use("/steadfast", steadfastWebhook);

export default router;