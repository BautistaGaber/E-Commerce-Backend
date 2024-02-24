import { ticketDao } from "../dao";

class TicketController{
    static createTicket = async (req, res) => {
        try {
            const ticket = req.body;
            const newTicket = await ticketDao.createTicket(ticket);
            return res.json(newTicket);
        } catch (err) {
            return res.status(404).send({ status: "error", message: error.message });
        }
    }
}

export {TicketController}