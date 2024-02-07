import messageModel from "../dao/fileSystem/mongodb/models/message.model.js";

class MessageController {
  static getMessage = async (req, res) => {
    try {
      const message = await messageModel.find();
      res.render("chat", { message });
    } catch {
      res.status(404).json({
        error: "No hay mensajes",
      });
    }
  };

  static addMessage = async (req, res) => {
    try {
      const newMessage = await messageModel.create(req.body);
      res.status(200).json(newMessage);
    } catch {
      res.status(404).json({
        error: "No se pudo enviar el mensaje",
      });
    }
  };
}

export { MessageController };
