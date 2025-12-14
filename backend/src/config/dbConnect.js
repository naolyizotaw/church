import mongoose from "mongoose";

export const dbConnect = async () => {
    try {
        const connect = await mongoose.connect(process.env.CONNECTION_STRING);
        console.log(`Database connected: ${connect.connection.host}, ${connect.connection.name}`);
        } catch(err) {
            console.log(err);
            console.log("Error connecting to database");
            process.exit(1);
    
        }
    
}