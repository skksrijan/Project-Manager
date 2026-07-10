import mongoose, {Schema} from 'mongoose';import mongoose, { Schema } from "mongoose";
import { AvailableTaskStatuses, TaskStatusEnum } from "../utils/constants.js";


const taskScheme = new Schema(
  {
    title: {
      type: string,
      trim: true,
      reuired: true,
    },
    description: String,
    project: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Project",
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    assignedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
        type: String,
        enum: AvailableTaskStatuses,
        default: TaskStatusEnum.TODO,
    },
    attachments: {
        type: [{
            url: String,
            mimetype: String,
            size: Number,
        }],
        default: []
    }
  },
  { timestamps: true },
) ;

export const task = mongoose.model("Task", taskSchema) ;