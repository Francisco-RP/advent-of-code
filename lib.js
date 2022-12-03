Array.prototype.sum = function () {
  return this.reduce((a, b) => a + b, 0);
};

/**
 * Take a flat array and split it into chunks of `size` length
 * @param {unknown[]} size size of each chunk
 * @returns {unknown[][]} an array of chunks (which are also arrays)
 */
Array.prototype.chunk = function (size) {
  let chunk = [];
  const chunks = [];
  this.forEach((item) => {
    if (chunk.length < size) {
      chunk.push(item);
    } else {
      chunks.push(chunk);
      chunk = [item];
    }
  });
  if (chunk.length) chunks.push(chunk);
  return chunks;
};
