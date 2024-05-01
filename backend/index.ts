import express, { Express, Response, Request } from "express";

const app: Express = express();
const PORT = 2000;

app.get("/", (req: Request, res: Response) => {
  const device = req.headers;
  console.log(device);

  res.send(`Hello World! I am being served from a random!`);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
