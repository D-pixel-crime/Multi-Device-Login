import express from "express";
const app = express();
const PORT = 3000;
app.get("/", (req, res) => {
    const device = req.headers;
    console.log(device);
    res.send(`Hello World! I am being served from a random!`);
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
