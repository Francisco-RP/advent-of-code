import assert from "node:assert/strict";
import fs from "node:fs";
import { getResult } from "../lib.js";

const input = fs.readFileSync("./input.txt", { encoding: "utf-8" });
const testInput = ``;

/**
 * @param {string} str the input string
 * @returns {string|number}
 */
function doThing(str) {}

// test
doThing(testInput);
// assert.equal(doThing(testInput), 00000000);

// getResult(doThing, input, "part 1");

/*********************************
 * Part 2
 */

// test
// assert.equal(doThing(testInput), 00000000);

// getResult(doThing, input, "part 2");
