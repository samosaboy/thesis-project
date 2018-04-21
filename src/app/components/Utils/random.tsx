export const random = (low, high, round?) => {
  round = round || false

  const randomValue = Math.random() * (high - low) + low

  if (round) {
    return Math.floor(randomValue)
  }

  return randomValue
}
