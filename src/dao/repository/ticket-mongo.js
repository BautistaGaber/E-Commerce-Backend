import ticketModel from "../fileSystem/mongodb/models/ticket.model.js";

class TicketMongo {
  constructor() {
    this.model = ticketModel;
  }

  async createTicket(ticket) {
    try {
      const result = await ticketModel.create(ticket);
      console.log("resultado de create ticket",result);
      return result;
    } catch (e) {
      throw new Error(e.message);
    }
  }
}

export { TicketMongo }
