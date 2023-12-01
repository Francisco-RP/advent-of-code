import fs from "node:fs";
import { exec } from "node:child_process";

// get current date
const d = new Date();

if (d.getMonth() !== 11) {
  console.log(`Hold your horses, it's not December yet.`);
  process.exit(0);
}

let day = d.getDate();
const year = d.getFullYear();

console.log(`\nToday is day ${day} of Advent of Code ${year}\n`);

// create directories for all missing days up to today, in case you skipped a few days
while (day > 0) {
  const url = `https://adventofcode.com/${year}/day/${day}`;

  if (!fs.existsSync(`day-${day}`)) {
    console.log(`- creating directory for 'day-${day}': ${url}`);
    exec(`cp -r -n ./template day-${day}`);
  } else {
    console.log(`A directory for 'day-${day}' already exists`);
  }
  day -= 1;
}
