import { Router } from "express";
import { MessageController } from "../controller/message.controller.js";

const router = Router();

router.get("/chat", MessageController.getMessage);

router.post("/", MessageController.addMessage);

export { router as messageRouter };
