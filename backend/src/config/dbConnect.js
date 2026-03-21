import mongoose from "mongoose";

/** Atlas URI from hosting env or local .env (same value as MongoDB Atlas "Connect" string). */
function getMongoUri() {
    return (
        process.env.CONNECTION_STRING?.trim() ||
        process.env.MONGODB_URI?.trim() ||
        ""
    );
}

export const dbConnect = async () => {
    const uri = getMongoUri();
    if (!uri) {
        console.error(
            "[db] Missing CONNECTION_STRING or MONGODB_URI. On your host (Render/Railway/VPS), add the Atlas connection string as an environment variable. Local .env is not deployed."
        );
        process.exit(1);
    }
    try {
        const connect = await mongoose.connect(uri);
        console.log(`Database connected: ${connect.connection.host}, ${connect.connection.name}`);
    } catch (err) {
        console.error("[db] Connection failed:", err.message);
        process.exit(1);
    }
};