// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next"
import { BetaAnalyticsDataClient } from "@google-analytics/data"

// 👇 Setting PropertyId
const propertyId = process.env.NEXT_PUBLIC_GA_PROPERTY_ID

const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: {
    client_email: process.env.NEXT_PUBLIC_GA_CLIENT_EMAIL,
    private_key: process.env.NEXT_PUBLIC_GA_PRIVATE_KEY?.replace(/\\n/g, '\n')
  },
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: "7daysAgo",
          endDate: "today",
        },
      ],
      dimensions: [
        {
          name: "week", // Changed from "year" to "week" for weekly data
        },
      ],
      metrics: [
        {
          name: "activeUsers", // It returns the active users
        },
      ],
    })

    let totalVisitors = 0
    response.rows?.forEach((row: any) => {
      totalVisitors += parseInt(row.metricValues[0].value)
    })

    res.status(200).json(totalVisitors)
  } catch (error) {
    console.error("Error fetching analytics data:", error)
    res.status(500).json({ error: "Failed to fetch analytics data" })
  }
}