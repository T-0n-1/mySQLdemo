import express, { Request, Response, Router } from "express";
import dotenv from "dotenv";
import Joi from "joi";

const router: Router = express.Router();
dotenv.config();

router.get("/getall", (req: Request, res: Response) => {
  const querySchema = Joi.object().unknown(false);
  const { error } = querySchema.validate(req.query);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  } else {
    res.send("Get all students");
  }
});

export default router;
