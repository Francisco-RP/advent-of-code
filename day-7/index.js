import assert from "node:assert/strict";
import fs from "node:fs";

const input = fs.readFileSync("./input.txt", { encoding: "utf-8" });
const testInput = `
$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k`;

class Node {
  constructor(name, parent) {
    /**
     * @type {string}
     */
    this.name = name;
    /**
     * @type {Node}
     */
    this.parent = parent;
    /**
     * @type {Node[]}
     */
    this.subDirs = [];
    this.total = 0;
  }

  /**
   * @param {Node} dirNode
   */
  addDir(dirNode) {
    this.subDirs.push(dirNode);
  }

  /**
   * @param {string} name
   * @returns {Node}
   */
  findDir(name) {
    return this.subDirs.find((d) => d.name === name);
  }

  /**
   * @param {number*} size
   */
  updateTotal(size) {
    this.total += size;

    // add size to the parent as well, this will continue up the tree to each parent node
    this.parent?.updateTotal(size);
  }
}

let directory;
let currentNode;

function handleCommand(cmdLine) {
  const [cmd, arg] = cmdLine.substring(2).split(" ");
  if (cmd !== "cd") return;

  // only 'cd' is important, 'ls' can be ignored
  if (arg === "..") {
    currentNode = currentNode.parent;
  } else {
    currentNode = currentNode.findDir(arg);
  }
}

function handleList(line) {
  const [info, name] = line.split(" ");
  if (info === "dir") {
    currentNode.addDir(new Node(name, currentNode));
  } else {
    // tracking files is not important, we only really need their size
    currentNode.updateTotal(Number(info));
  }
}

/**
 * @param {string} line
 */
function parseLine(line) {
  if (line.startsWith("$")) {
    handleCommand(line);
  } else {
    handleList(line);
  }
}

/**
 * recursively sum totals of dirs that are <= 100000
 * travels from starting node down through all of its children
 * @param {Node} n
 * @returns {number}
 */
function getSum(n) {
  let total = 0;
  for (let i = 0; i < n.subDirs.length; i++) {
    const dir = n.subDirs[i];
    if (dir.total <= 100000) {
      total += dir.total;
    }
    if (dir.subDirs.length) {
      total += getSum(dir);
    }
  }

  return total;
}

/**
 *
 * @param {string} str the input string
 * @returns {number}
 */
function part1(str) {
  // always reset the starting node at the beginning
  // I don't like this because it's a side effect but for now this will do
  directory = new Node("/");
  currentNode = directory;

  // build the tree of nodes with their totals.
  str.trim().split("\n").splice(1).forEach(parseLine);

  return getSum(directory);
}

// test
assert.equal(part1(testInput), 95437);

console.time("Part 1");
const result1 = part1(input);
console.timeEnd("Part 1");

assert.equal(result1, 1886043);
console.log("Result 1:", result1);

/***********************************************************************
 * Part 2
 */

const disk = 70000000;
const needed = 30000000;

/**
 * Find all directories that are when added to the difference, is over the needed amount
 * recursively travels from starting node down through all of its children
 * @param {Node} n current Node
 * @param {number} diff how much is left in the disk space overall (total disk space - top level dir's '/' total)
 * @return {number}
 */
function getAllTotals(n, diff) {
  let options = [];
  for (let i = 0; i < n.subDirs.length; i++) {
    const dir = n.subDirs[i];
    if (diff + dir.total > needed) {
      options.push(dir.total);
    }
    if (dir.subDirs.length) {
      options = options.concat(getAllTotals(dir, diff));
    }
  }
  return options;
}

/**
 * @param {string} str the input string
 * @returns {number}
 */
function part2(str) {
  // always reset the starting node at the beginning
  // I don't like this because it's a side effect but for now this will do
  directory = new Node("/");
  currentNode = directory;

  // build the tree of nodes with their totals.
  str.trim().split("\n").splice(1).forEach(parseLine);

  // get array of possible dir totals that could be deleted, sort them and get the smallest one
  return getAllTotals(directory, disk - directory.total)
    .sort((a, b) => b - a)
    .pop();
}

// test
console.log(part2(testInput));
assert.equal(part2(testInput), 24933642);

console.time("Part 2");
const result2 = part2(input);
console.timeEnd("Part 2");

assert.equal(result2, 3842121);

console.log("Result 2:", result2);
