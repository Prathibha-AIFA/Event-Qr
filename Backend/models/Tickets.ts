import mongoose, { Schema, Document } from "mongoose";

export interface ITicket extends Document {
  userId: Schema.Types.ObjectId | { name: string; email: string }; // populated
  eventId: string;
  qrCodeData: string;
  scanned: boolean;  // <-- NEW field
  name?: string;  
  email?: string; 
}

const TicketSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  eventId: { type: String, required: true },
  qrCodeData: { type: String, required: true },
  scanned: { type: Boolean, default: false }, // <-- NEW
});

export default mongoose.model<ITicket>("Ticket", TicketSchema);
