const wait = (n: number) => new Promise<void>((res) => setTimeout(res, n));

const frames: string[] = [];

export function addFrame(str: string) {
  frames.push(str);
}

export async function draw(n = 100) {
  while (frames.length) {
    console.clear();
    console.log(frames.shift());
    await wait(n);
  }
}
