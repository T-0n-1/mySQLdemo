import express, { Request, Response, Router } from "express";
import dotenv from "dotenv";
import Joi from "joi";
import mysql, { QueryError } from "mysql2";
import { connectionPool, PersonRow } from "../Utils";

const router: Router = express.Router();
dotenv.config();

router.get("/getall", (req: Request, res: Response) => {
  const querySchema = Joi.object().unknown(false);
  const { error } = querySchema.validate(req.query);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  } else {
    const queryStr: string = "SELECT * FROM ??";
    const query: string = mysql.format(queryStr, [process.env.DBTABLE]);
    const prow: PersonRow = new PersonRow();
    connectionPool.query(query, (err: QueryError, rows: PersonRow[]) => {
      if (err) {
        res.status(400).send(err.message);
        return;
      }
      rows.forEach((pr: PersonRow) => {
        prow.id = pr.id || -1;
        prow.fname = pr.fname || "noFname";
        prow.lname = pr.lname || "noLname";
        prow.birth = pr.birth || new Date();
        console.log(prow.toString());
      });
      res.json(rows);
    });
  }
});

router.get("/getonerow/:id", (req: Request, res: Response) => {
  const schema = Joi.object({
    id: Joi.number().integer().min(1).max(9999),
  }).unknown(false);
  const { error, value } = schema.validate(req.params);
  if (error) {
    res.status(400).json({ error: error.details[0].message });
  } else {
    const queryStr: string = "SELECT * FROM ?? WHERE id = ?";
    const query: string = mysql.format(queryStr, [
      process.env.DBTABLE,
      value.id,
    ]);
    const prow: PersonRow = new PersonRow();
    connectionPool.query(query, (err: QueryError, rows: PersonRow[]) => {
      if (err) {
        res.status(400).send(err.message);
        return;
      }
      if (rows.length > 0) {
        prow.birth = rows[0].birth || new Date();
        prow.fname = rows[0].fname || "noFname";
        prow.lname = rows[0].lname || "noLname";
        prow.id = rows[0].id || -1;
        console.log(prow.toString());
        res.json(prow);
        return;
      }
      res.status(404).send("No rows found");
    });
  }
});

export default router;
