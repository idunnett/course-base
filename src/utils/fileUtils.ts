export function readFile(file: File): Promise<string | ArrayBuffer | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsArrayBuffer(file)
    reader.onload = () => {
      resolve(reader.result)
    }
    reader.onerror = reject
  })
}
