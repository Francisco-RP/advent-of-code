export class Visual {
  constructor() {
    this.rows = 11;
    this.cols = 11;
    this.centerX = Math.floor(this.cols / 2);
    this.centerY = Math.floor(this.rows / 2);

    /**
     * @type {Array<[number, number, string]>} array of [x,y, marker]
     */
    this.plots = [];
  }

  /**
   * @param {[number, number]} coords
   * @param {string} marker
   */
  addPlot(coords, marker) {
    this.plots.push([...coords, marker]);
    const [x, y] = coords;
    if (this.centerX + Math.abs(x) > this.cols - 1) {
      this.cols = Math.abs(x) * 2 + 1;
      this.centerX = Math.floor(this.cols / 2);
    }
    if (this.centerY + Math.abs(y) > this.rows - 1) {
      this.rows = Math.abs(y) * 2 + 1;
      this.centerY = Math.floor(this.rows / 2);
    }
  }

  draw() {
    const grid = [];
    for (let i = 0; i < this.rows; i++) {
      grid.push([]);
      for (let n = 0; n < this.cols; n++) {
        grid[i].push(".");
      }
    }

    while (this.plots.length) {
      const p = this.plots.pop();
      const x = this.centerX + p[0];
      const y = this.centerY + p[1];
      grid[y][x] = p[2];
    }

    console.log(grid.map((line) => line.join("")).join("\n"));
    console.log("");
  }
}
