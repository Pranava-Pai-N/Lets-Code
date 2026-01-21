import Notification from "../models/notifications.models.js";



const gettopKNotifications = async (req, res) => {
    try {
        const top_n = parseInt(req.body.top_n) || 5;
    
        const notifications = await Notification.find({ }).sort({ createdAt : -1}).limit(top_n).lean();

        if (notifications.length === 0)
            return res.status(400).json({
                success: true,
                message: "No notification exists ..."
            })

        return res.status(200).json({
            success: true,
            message: `All top-${top_n} recent notifications retrieved successfully ...`,
            count : notifications.length,
            allNotifications: notifications
        });
        
    } catch (error) {
        console.log("Error retrieving recent notifications . Try again Later : ", error);

        return res.status(500).json({
            success: false,
            message: "Error retrieving notifications."
        });
    }
}


const getAllNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find();

        if (!notifications)
            return res.status(400).json({
                success: true,
                message: "No notification exists ..."
            })

        return res.status(200).json({
            success: true,
            message: "All notifications retrieved successfully ...",
            allNotifications: notifications
        })
    } catch (error) {
        console.log("Error retrieving notifications . Try again Later : ", error);

        return res.status(500).json({
            success: false,
            message: "Error retrieving notifications."
        });
    }
}



const notificationController = {
    gettopKNotifications,
    getAllNotifications
}



export default notificationController;