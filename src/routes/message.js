import { Router } from "express";
import messageModel from "../dao/fileSystem/mongodb/models/message.model.js";

const router = Router();

router.get("/chat", async (req, res) => {
  try {
    const message = await messageModel.find();
    res.render("chat", { message });
  } catch {
    res.status(404).json({
      error: "No hay mensajes",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const newMessage = await messageModel.create(req.body);
    res.status(200).json(newMessage);
  } catch {
    res.status(404).json({
      error: "No se pudo enviar el mensaje",
    });
  }
});

export { router as messageRouter };
