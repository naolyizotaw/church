import express from "express";
import dotenv from "dotenv";




const app = express();

app.get("/api/auth", (req, res) => {
    res.send("Hello World");
});

app.get("/api/auth/register", (req, res) => {
    res.send("Hello World");
});






const PORT = process.env.PORT || 6002;
app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`)
});