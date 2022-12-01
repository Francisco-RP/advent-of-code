Array.prototype.sum = function () {
  return this.reduce((a, b) => a + b, 0);
};

// better console.assert that actually throws if there's an error
console.assert = function (cond, text) {
  if (cond) return;
  throw new Error(text || "Assertion failed!");
};
