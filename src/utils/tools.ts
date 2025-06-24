export const splitNote = (note: string) => {
  const match = note.match(/^([A-G]#?)(\d+)$/)
  return match ? [match[1], match[2]] : null
}


//翻转对象的键和值
export const flipObject = (obj: Record<string, any>) => {
  const flipped: Record<string, any> = {}
  for (const key in obj) {
    flipped[obj[key]] = key
  }
  return flipped
}