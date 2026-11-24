import express from "express";
import proxy from "express-http-proxy";
import { getCurrentUser } from "./controllers/user.controller.js";
import protect from "./middleware/auth.middleware.js";
import { proxyWithHeader } from "./utils/proxyWithHeader.js";

const router = express.Router();

router.use("/api/auth", proxy(process.env.AUTH_SERVICE));
router.use("/api/chat", protect, proxyWithHeader(process.env.CHAT_SERVICE));
router.use("/api/agent", protect, proxyWithHeader(process.env.AGENT_SERVICE));
router.use("/api/billing", protect, proxyWithHeader(process.env.BILLING_SERVICE));
router.get("/api/me", protect, getCurrentUser);

export default router;