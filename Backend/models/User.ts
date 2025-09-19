import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  googleId?: string;
   // optional for manual users
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    googleId: { type: String }
    // sparse:true allows multiple docs with no googleId
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
