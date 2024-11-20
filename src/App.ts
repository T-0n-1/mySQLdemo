// 1) imports
import express, { Express, Request, Response } from "express";
import mysql, { Pool } from "mysql";
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
  firstName: string;
  lastName: string;
  birth: Date;
  constructor(
    id: number = 0,
    firstName: string = "XXX",
    lastName: string = yyy,
    birth: Date = new Date(),
  ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.birth = birth;
  }

  public toString(): string {
    return `(${this.id} ${this.firstName} ${this.lastName} ${this.birth.toString()})`;
  }
}

// 5) db connection
const connectionPool: Pool = mysql.createPool({

// 6) rest api requests
// 7) app listen
