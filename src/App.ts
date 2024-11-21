import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import joi from "joi";
import studentsRouter from "./routes/studentsAPI";

dotenv.config();

const app: Express = express();
const port: number = Number(process.env.SERVERPORT) || 4444;

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // nested jsons
app.use("/api", studentsRouter);

app.get("/", (req: Request, res: Response) => {
  const querySchema = joi.object().unknown(false);
  const { error } = querySchema.validate(req.query);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  } else {
    res.send("Hello - connected to mySQL server");
  }
});

// const server =
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
