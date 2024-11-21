import express, { Request, Response, Router } from "express";
import dotenv from "dotenv";
import Joi from "joi";
import mysql, { MysqlError } from "mysql";
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
    connectionPool.query(query, (err: MysqlError, rows: PersonRow[]) => {
      if (err) {
        res.status(400).send(err.sqlMessage);
        return;
      }
      const prow: PersonRow = new PersonRow();
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

export default router;
