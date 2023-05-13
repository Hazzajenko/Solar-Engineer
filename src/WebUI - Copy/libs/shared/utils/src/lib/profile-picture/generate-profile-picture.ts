export function generateProfilePicture(
  initials: string,
  size: number = 128,
  backgroundColor: string = '#4caf50',
  textColor: string = '#ffffff',
): string {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size

  const context = canvas.getContext('2d')
  if (context) {
    // Draw the background color
    context.fillStyle = backgroundColor
    context.fillRect(0, 0, size, size)

    // Draw the initials
    context.font = `${size / 2}px Arial`
    context.fillStyle = textColor
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.fillText(initials.toUpperCase(), size / 2, size / 2 + 2)

    // Return the data URL of the generated image
    return canvas.toDataURL()
  }

  // If canvas context is not available, return an empty string
  return ''
}
