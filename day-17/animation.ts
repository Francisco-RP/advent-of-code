const wait = (n: number) => new Promise<void>((res) => setTimeout(res, n));

const frames: string[] = [];

export function addFrame(str: string) {
  frames.push(str);
}

export async function draw(n = 100) {
  for (let i = 0; i < frames.length; i++) {
    console.clear();
    console.log(frames[i]);
    await wait(n);
  }
}
