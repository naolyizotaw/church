import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.get("/api/auth", (req, res) => {
    res.send("Hello World");
});

app.get("/api/auth/register", (req, res) => {
    res.send("Hello World");
});





if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
    });
}



const PORT = process.env.PORT || 6001;
app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`)
});