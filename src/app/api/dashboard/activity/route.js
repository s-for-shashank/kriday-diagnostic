import clientPromise from '@/lib/mongodb'
import { COLLECTIONS } from '@/lib/models'
import { NextResponse } from 'next/server'
export const dynamic = 'force-static'
// GET - Fetch recent activity for dashboard
export async function GET(request) {
  try {
    const client = await clientPromise
    const db = client.db('kriday_diagnostics')
    
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit')) || 10
    
    console.log(`Fetching recent activity with limit: ${limit}`)
    
    // Fetch recent bookings as activity
    const recentBookings = await db.collection(COLLECTIONS.BOOKINGS)
      .find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray()
    
    console.log(`Found ${recentBookings.length} recent bookings`)
    
    // Transform bookings into activity format
    const activities = recentBookings.map(booking => ({
      id: booking._id,
      type: 'booking',
      title: `New booking: ${booking.testName}`,
      description: `${booking.customerName} booked ${booking.testName}`,
      timestamp: booking.createdAt,
      status: booking.status,
      amount: booking.testPrice,
      customer: {
        name: booking.customerName,
        email: booking.customerEmail,
        phone: booking.customerPhone
      }
    }))
    
    return NextResponse.json({
      success: true,
      data: activities,
      count: activities.length
    })
    
  } catch (error) {
    console.error('Error fetching dashboard activity:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard activity', details: error.message },
      { status: 500 }
    )
  }
}