import mongoose, { Schema } from "mongoose";

const subtaskSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim : true
    },
    task: {
        type: Schem.Types.ObjectId,
        ref: "Task",
        required: true,
    },
    isCompleted: {
        type: Boolean,
        default: false,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
}, {timestamps: true}) ;

const Subtask = mongoose.model("Subtask", subtaskSchema) ;