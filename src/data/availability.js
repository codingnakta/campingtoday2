function genAllAvailability() {
  const today = new Date()
  const result = {}
  for (let siteId = 1; siteId <= 10; siteId++) {
    result[siteId] = {}
    for (let offset = 0; offset < 60; offset++) {
      const d = new Date(today)
      d.setDate(d.getDate() + offset)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
      result[siteId][key] = Math.random() > 0.35
    }
  }
  return result
}

export const AVAILABILITY = genAllAvailability()
