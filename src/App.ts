// 1) imports
import express, { Express, Request, Response } from "express";
import mysql from "mysql";
import dotenv from "dotenv";
import joi from "joi";
import { Person } from "./Interfaces";

dotenv.config();

// 2) app
const app: Express = express();

// 3) app config for json
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // nested jsons

// 4) a class representing the table row
/** mySQL table to be used
 * CREATE TABLE `Person` (
  `id` int(11) NOT NULL,
  `fname` varchar(30) DEFAULT NULL,
  `lname` varchar(100) DEFAULT NULL,
  `birth` date DEFAULT NULL,
  PRIMARY KEY (`id`)
  )
 */
class PersonRow implements Person {
  id: number;
  fname: string;
  lname: string;
  birth: Date;
  constructor(
    id: number = 0,
    fname: string = "XXX",
    lname: string = yyy,
    birth: Date = new Date(),
  ) {
    this.id = id;
    this.fname = fname;
    this.lname = lname;
    this.birth = birth;
  }
}

// 5) db connection
// 6) rest api requests
// 7) app listen
