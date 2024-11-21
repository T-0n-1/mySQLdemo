import mysql, { Pool } from "mysql";
import type { Person } from "./Interfaces";

// a class representing the table row
/** mySQL table to be used
 * CREATE TABLE `Person` (
  `id` int(11) NOT NULL,
  `fname` varchar(30) DEFAULT NULL,
  `lname` varchar(100) DEFAULT NULL,
  `birth` date DEFAULT NULL,
  PRIMARY KEY (`id`)
  )
 */
export class PersonRow implements Person {
  id: number;
  fname: string;
  lname: string;
  birth: Date;
  constructor(
    id: number = 0,
    fname: string = "XXX",
    lname: string = "yyy",
    birth: Date = new Date(),
  ) {
    this.id = id;
    this.fname = fname;
    this.lname = lname;
    this.birth = birth;
  }

  public toString(): string {
    return `(${this.id} ${this.fname} ${this.lname} ${this.birth.toString()})`;
  }
}

export const connectionPool: Pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DBSERVER,
  database: process.env.DBNAME,
  user: process.env.DBUSER,
  password: process.env.DBPASSWORD,
});
