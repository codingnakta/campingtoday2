export function calcRefund(checkIn, priceStr) {
  const price = parseInt(priceStr.replace(/,/g, ""), 10)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const checkInDate = new Date(checkIn)
  checkInDate.setHours(0, 0, 0, 0)
  const daysUntil = Math.floor((checkInDate - today) / (1000 * 60 * 60 * 24))

  let feeRate, label
  if (daysUntil <= 0)      { feeRate = 1.0; label = "입실 당일" }
  else if (daysUntil === 1) { feeRate = 0.8; label = "입실 1일 전" }
  else if (daysUntil === 2) { feeRate = 0.7; label = "입실 2일 전" }
  else if (daysUntil === 3) { feeRate = 0.6; label = "입실 3일 전" }
  else if (daysUntil === 4) { feeRate = 0.5; label = "입실 4일 전" }
  else if (daysUntil === 5) { feeRate = 0.4; label = "입실 5일 전" }
  else if (daysUntil === 6) { feeRate = 0.3; label = "입실 6일 전" }
  else                      { feeRate = 0;   label = "입실 7일 이상 전" }

  const fee = Math.floor(price * feeRate)
  const refund = price - fee
  return { label, feeRate, fee, refund, price }
}
