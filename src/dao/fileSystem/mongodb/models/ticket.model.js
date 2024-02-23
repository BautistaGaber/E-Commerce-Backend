import mongoose from 'mongoose'

const collection = 'Ticket'

const ticketSchema = new mongoose.Schema({
  code: { type: String, required: true },
  purchase_datetime: { type: String, required: true },
  amount: { type: Number, required: true },
  purchaser: { type: String, required: true },
})

const ticketModel = mongoose.model(collection, ticketSchema)

export default ticketModel