import mongoose from "mongoose";


const connectDb = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("DB Connected Successfully");
        
    } catch (error) {
        console.log("Error connecting to the DB : ",error);
    }
}

export default connectDb;