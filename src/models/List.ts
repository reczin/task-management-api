import mongoose, { Schema, Document, Types } from "mongoose";

export interface IList extends Document {
  name: string;
  userId: Types.ObjectId;
}

const ListSchema = new Schema<IList>({
  name: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

export default mongoose.model<IList>("List", ListSchema);
