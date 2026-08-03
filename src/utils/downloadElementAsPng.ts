import html2canvas from 'html2canvas'

export async function downloadElementAsPng(element: HTMLElement, filename: string) {
  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
  await document.fonts.ready

  const canvas = await html2canvas(element, { scale: 2 })
  const imageBlob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob)
        return
      }

      reject(new Error('Unable to create the export image.'))
    }, 'image/png')
  })
  const objectUrl = URL.createObjectURL(imageBlob)

  try {
    const downloadLink = document.createElement('a')
    downloadLink.href = objectUrl
    downloadLink.download = filename
    downloadLink.click()
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}
