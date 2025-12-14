import express from "express";
import dotenv from "dotenv";
import path from "path";




const app = express();
const __dirname = path.resolve();

app.get("/api/auth", (req, res) => {
    res.send("Hello World");
});

app.get("/api/auth/register", (req, res) => {
    res.send("Hello World");
});





if (process.env.NODE_ENV !== "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
    });
}



const PORT = process.env.PORT || 6001;
app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`)
});