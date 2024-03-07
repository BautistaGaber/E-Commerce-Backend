import { ticketDao } from "../dao";

class TicketController{
    static createTicket = async (req, res) => {
        try {
            const ticket = req.body;
            const newTicket = await ticketDao.createTicket(ticket);
            return res.json(newTicket);
        } catch (err) {
            req.logger.error(err.message);
            return res.status(404).send({ status: "error", message: err.message });
        }
    }
}

export {TicketController}