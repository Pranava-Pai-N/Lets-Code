import mongoose, { Schema } from "mongoose";


const notificationSchema = new Schema({
    message: {
        type: String,
        required: true
    },

    link: {
        type: String
    },

    added_on: {
        type: String
    },

    added_by: {
        type: String,
        required: true,
        default: "admin"
    }
},
    {
        timestamps: true
    })



const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;