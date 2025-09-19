import mongoose, { Schema, Document } from "mongoose";

export interface ITicket extends Document {
  userId: Schema.Types.ObjectId | { name: string; email: string }; // populated
  eventId: string;
  qrCodeData: string;
  name?: string;  // optional, fallback from ticket
  email?: string; // optional, fallback from ticket
}

const TicketSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  eventId: { type: String, required: true },
  qrCodeData: { type: String, required: true },
});

export default mongoose.model<ITicket>("Ticket", TicketSchema);
