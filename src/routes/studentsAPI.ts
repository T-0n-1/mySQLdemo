import express, { Request, Response, Router } from "express";
import dotenv from "dotenv";
import Joi from "joi";
import mysql, { MysqlError, OkPacket } from "mysql";
import { connectionPool, PersonRow } from "../Utils";
import type { queryArray } from "../Interfaces";

const router: Router = express.Router();
dotenv.config();

router.use(express.json());

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
    connectionPool.query(query, (err: MysqlError, rows: PersonRow[]) => {
      if (err) {
        res.status(400).send(err.sqlMessage);
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
    connectionPool.query(query, (err: MysqlError, rows: PersonRow[]) => {
      if (err) {
        res.status(400).send(err.sqlMessage);
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

router.post("/insert", (req: Request, res: Response) => {
  const schema = Joi.object({
    id: Joi.number().integer().min(1).max(9999).required(),
    fname: Joi.string().min(2).max(15).required(),
    lname: Joi.string().min(2).max(20).required(),
    birth: Joi.date().required(),
  }).unknown(false);
  const { error, value } = schema.validate(req.body);
  if (error) {
    res.status(400).json({ error: error.details[0].message });
    return;
  } else {
    const id: number = value.id;
    const fname: string = value.fname;
    const lname: string = value.lname;
    const birth: Date = value.birth;
    const queryStr: string =
      "INSERT INTO ?? (??, ??, ??, ??) VALUES (?, ?, ?, ?)";
    const query: string = mysql.format(queryStr, [
      process.env.DBTABLE,
      "id",
      "fname",
      "lname",
      "birth",
      id,
      fname,
      lname,
      birth,
    ]);
    connectionPool.query(query, (err: MysqlError, okPacket: OkPacket) => {
      if (err) {
        res.status(400).send(err.sqlMessage);
        return;
      }
      console.log(`Row inserted with id: ${okPacket.insertId}`);
      res.json({ message: `Rows affected/changed : ${okPacket.affectedRows}` });
    });
  }
});

router.put("/update", (req: Request, res: Response) => {
  const schema = Joi.object({
    id: Joi.number().integer().min(1).max(9999).required(),
    fname: Joi.string().max(15).optional(),
    lname: Joi.string().max(20).optional(),
    birth: Joi.date().optional(),
  }).unknown(false);
  const { error, value } = schema.validate(req.body);
  if (error) {
    res.status(400).json({ error: error.details[0].message });
    return;
  }
  const { id, ...fieldsToUpdate } = value;
  // Ensure there are fields to update other than `id`
  if (Object.keys(fieldsToUpdate).length === 0) {
    res.status(400).json({ error: "No fields to update provided." });
    return;
  }
  const setClauses: string[] = [];
  const queryValues: queryArray = [process.env.DBTABLE];
  for (const key in fieldsToUpdate) {
    setClauses.push("?? = ?");
    queryValues.push(key, fieldsToUpdate[key]);
  }
  const queryStr = `
    UPDATE ?? 
    SET ${setClauses.join(", ")} 
    WHERE ?? = ?
  `;
  queryValues.push("id", id);
  const query = mysql.format(queryStr, queryValues);
  connectionPool.query(query, (err: MysqlError, okPacket: OkPacket) => {
    if (err) {
      res.status(400).send(err.sqlMessage);
      return;
    }
    console.log(`Row updated with id: ${id}`);
    res.json({ message: `Rows affected/changed: ${okPacket.affectedRows}` });
  });
});

export default router;
