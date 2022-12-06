import fs from "node:fs";
import { exec } from "node:child_process";

// get current date
const d = new Date();
const day = d.getDate();
const year = d.getFullYear();

// check if a directory exists with that day
if (!fs.existsSync(`day-${day}`)) {
  // make new dir if not
  exec(`cp -r -n ./template day-${day}`);
} else {
  console.log(`Today is Dec ${day} and a directory for 'day-${day}' already exists`);
}

// open the next one
const todayUrl = `https://adventofcode.com/${year}/day/${day}`;

console.log(`\nToday's URL:`);
console.log(todayUrl);
