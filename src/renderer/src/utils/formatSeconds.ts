export function formatSeconds(seconds: number) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = Number((seconds % 60).toFixed(0))

  let result = ''
  if (hours > 0) {
    result += `${hours}:`.padStart(3, '0')
  }
  result += `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`

  return result
}
