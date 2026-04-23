const STORE_TIMEZONE = "Africa/Cairo"

function getMinutesInTimezone(value: Date | string, timeZone: string): number {
  const date = typeof value === "string" ? new Date(value) : value
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  })
  const parts = formatter.formatToParts(date)
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? "0")
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? "0")
  return hour * 60 + minute
}

export function isStoreOpenNow(
  workingHours?: { opensAt?: string | null; closesAt?: string | null } | null
): boolean {
  if (!workingHours?.opensAt || !workingHours?.closesAt) return false
  const openMin = getMinutesInTimezone(workingHours.opensAt, STORE_TIMEZONE)
  const closeMin = getMinutesInTimezone(workingHours.closesAt, STORE_TIMEZONE)
  const nowMin = getMinutesInTimezone(new Date(), STORE_TIMEZONE)
  if (openMin === closeMin) return true
  if (closeMin > openMin) return nowMin >= openMin && nowMin < closeMin
  return nowMin >= openMin || nowMin < closeMin
}
