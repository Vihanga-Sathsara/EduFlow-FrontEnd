import { useEffect, useState } from "react"

export default function DashboardDateTime() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formattedDateTime = now.toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true, // 👈 AM / PM enable
  })

  return (
    <p className="text-gray-600 lg:text-base sm:text-base text-sm">
       📅 {formattedDateTime}
    </p>
  )
}
