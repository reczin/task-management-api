import mongoose, { Schema, Document, Types } from "mongoose";

export type TaskStatus = "pendente" | "em andamento" | "concluída";
export type TaskPriority = "baixa" | "media" | "alta";

export interface ITask extends Document {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  listId: Types.ObjectId;
  userId: Types.ObjectId;
}

const TaskSchema = new Schema<ITask>({
  title: { type: String, required: true },
  description: { type: String },
  status: {
    type: String,
    enum: ["pendente", "em andamento", "concluída"],
    default: "pendente",
  },
  priority: {
    type: String,
    enum: ["baixa", "media", "alta"],
    default: "media",
  },
  dueDate: { type: Date },
  listId: { type: Schema.Types.ObjectId, ref: "List", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

export default mongoose.model<ITask>("Task", TaskSchema);
