export function sample<T = any>(items: T[], count: number): T[] {
  return items.sort(() => Math.random() - 0.5).slice(0, count)
}

export function sampleOne<T = any>(items: T[]): T {
  return sample(items, 1)[0]!
}
