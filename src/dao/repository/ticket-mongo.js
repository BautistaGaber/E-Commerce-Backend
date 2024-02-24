import ticketModel from "../fileSystem/mongodb/models/ticket.model.js";

class TicketMongo {
  constructor() {
    this.model = ticketModel;
  }

  async createTicket(ticket) {
    try {
      return await ticketModel.create(ticket);
    } catch (e) {
      throw new Error(e.message);
    }
  }
}

export { TicketMongo }
