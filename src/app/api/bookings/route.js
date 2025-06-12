import clientPromise from '@/lib/mongodb'
import { validateBooking, generateId, COLLECTIONS } from '@/lib/models'
import { NextResponse } from 'next/server'
export const dynamic = 'force-static'
// GET - Fetch all bookings
export async function GET(request) {
  try {
    const client = await clientPromise
    const db = client.db('kriday_diagnostics')
    
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const date = searchParams.get('date')
    const limit = parseInt(searchParams.get('limit')) || 50
    const page = parseInt(searchParams.get('page')) || 1
    const skip = (page - 1) * limit
    
    // Build query based on filters
    let query = {}
    
    if (status && status !== 'all') {
      query.status = status
    }
    
    if (date) {
      query.appointmentDate = date
    }
    
    if (search) {
      query.$or = [
        { customerName: { $regex: search, $options: 'i' } },
        { customerEmail: { $regex: search, $options: 'i' } },
        { customerPhone: { $regex: search, $options: 'i' } },
        { testName: { $regex: search, $options: 'i' } },
        { bookingId: { $regex: search, $options: 'i' } }
      ]
    }
    
    const bookings = await db.collection(COLLECTIONS.BOOKINGS)
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()
    
    const totalCount = await db.collection(COLLECTIONS.BOOKINGS)
      .countDocuments(query)
    
    return NextResponse.json({
      success: true,
      data: bookings,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    })
    
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}

// POST - Create new booking
export async function POST(request) {
  try {
    const client = await clientPromise
    const db = client.db('kriday_diagnostics')
    
    const body = await request.json()
    
    // Validate input data
    const validationErrors = validateBooking(body)
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { success: false, errors: validationErrors },
        { status: 400 }
      )
    }
    
    // Check if test exists
    const test = await db.collection(COLLECTIONS.TESTS)
      .findOne({ name: body.testName, active: true })
    
    if (!test) {
      return NextResponse.json(
        { success: false, error: 'Selected test is not available' },
        { status: 400 }
      )
    }
    
    // Check for existing booking conflicts
    const conflictingBooking = await db.collection(COLLECTIONS.BOOKINGS)
      .findOne({
        appointmentDate: body.appointmentDate,
        appointmentTime: body.appointmentTime,
        status: { $in: ['pending', 'confirmed'] }
      })
    
    if (conflictingBooking) {
      return NextResponse.json(
        { success: false, error: 'Time slot is already booked' },
        { status: 400 }
      )
    }
    
    // Generate unique booking ID
    const bookingId = generateId('BK')
    
    // Prepare booking data
    const bookingData = {
      _id: bookingId,
      bookingId: bookingId,
      customerName: body.customerName.trim(),
      customerEmail: body.customerEmail.trim().toLowerCase(),
      customerPhone: body.customerPhone.trim(),
      customerAge: parseInt(body.customerAge) || null,
      customerGender: body.customerGender || null,
      customerAddress: body.customerAddress?.trim() || '',
      testName: body.testName,
      testId: test._id,
      testPrice: test.price,
      appointmentDate: body.appointmentDate,
      appointmentTime: body.appointmentTime,
      status: body.status || 'pending',
      paymentStatus: body.paymentStatus || 'pending',
      notes: body.notes?.trim() || '',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    // Start transaction for atomic operations
    const session = client.startSession()
    
    try {
      await session.withTransaction(async () => {
        // Insert booking
        await db.collection(COLLECTIONS.BOOKINGS).insertOne(bookingData, { session })
        
        // Update test statistics
        await db.collection(COLLECTIONS.TESTS).updateOne(
          { _id: test._id },
          { 
            $inc: { 
              bookings: 1,
              revenue: test.price 
            },
            $set: { updatedAt: new Date() }
          },
          { session }
        )
        
        // Update or create customer record
        const customerId = generateId('CUST')
        await db.collection(COLLECTIONS.CUSTOMERS).updateOne(
          { email: body.customerEmail.trim().toLowerCase() },
          {
            $set: {
              name: body.customerName.trim(),
              email: body.customerEmail.trim().toLowerCase(),
              phone: body.customerPhone.trim(),
              age: parseInt(body.customerAge) || null,
              gender: body.customerGender || null,
              address: body.customerAddress?.trim() || '',
              lastVisit: new Date(),
              updatedAt: new Date()
            },
            $inc: { 
              totalBookings: 1,
              totalSpent: test.price
            },
            $setOnInsert: {
              _id: customerId,
              customerId: customerId,
              emergencyContact: '',
              medicalHistory: [],
              favoriteTests: [body.testName],
              status: 'active',
              rating: 0,
              notes: '',
              createdAt: new Date()
            }
          },
          { upsert: true, session }
        )
      })
      
      return NextResponse.json({
        success: true,
        message: 'Booking created successfully',
        data: bookingData
      }, { status: 201 })
      
    } finally {
      await session.endSession()
    }
    
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}

// PUT - Update booking
export async function PUT(request) {
  try {
    const client = await clientPromise
    const db = client.db('kriday_diagnostics')
    
    const body = await request.json()
    const { id, ...updateData } = body
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Booking ID is required' },
        { status: 400 }
      )
    }
    
    // Check if booking exists
    const existingBooking = await db.collection(COLLECTIONS.BOOKINGS)
      .findOne({ _id: id })
    
    if (!existingBooking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      )
    }
    
    // Prepare update data
    const bookingUpdate = {
      ...updateData,
      updatedAt: new Date()
    }
    
    // Remove undefined values
    Object.keys(bookingUpdate).forEach(key => {
      if (bookingUpdate[key] === undefined) {
        delete bookingUpdate[key]
      }
    })
    
    const result = await db.collection(COLLECTIONS.BOOKINGS)
      .updateOne({ _id: id }, { $set: bookingUpdate })
    
    if (result.modifiedCount > 0) {
      return NextResponse.json({
        success: true,
        message: 'Booking updated successfully'
      })
    } else {
      return NextResponse.json(
        { success: false, error: 'No changes made' },
        { status: 400 }
      )
    }
    
  } catch (error) {
    console.error('Error updating booking:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update booking' },
      { status: 500 }
    )
  }
}

// DELETE - Delete booking
export async function DELETE(request) {
  try {
    const client = await clientPromise
    const db = client.db('kriday_diagnostics')
    
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Booking ID is required' },
        { status: 400 }
      )
    }
    
    // Check if booking exists
    const existingBooking = await db.collection(COLLECTIONS.BOOKINGS)
      .findOne({ _id: id })
    
    if (!existingBooking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      )
    }
    
    // Check if booking can be deleted (only allow deletion of pending or cancelled bookings)
    if (existingBooking.status === 'completed') {
      return NextResponse.json(
        { success: false, error: 'Cannot delete completed booking' },
        { status: 400 }
      )
    }
    
    const session = client.startSession()
    
    try {
      await session.withTransaction(async () => {
        // Delete booking
        await db.collection(COLLECTIONS.BOOKINGS).deleteOne({ _id: id }, { session })
        
        // Update test statistics
        await db.collection(COLLECTIONS.TESTS).updateOne(
          { _id: existingBooking.testId },
          { 
            $inc: { 
              bookings: -1,
              revenue: -existingBooking.testPrice 
            },
            $set: { updatedAt: new Date() }
          },
          { session }
        )
        
        // Update customer statistics
        await db.collection(COLLECTIONS.CUSTOMERS).updateOne(
          { email: existingBooking.customerEmail },
          {
            $inc: { 
              totalBookings: -1,
              totalSpent: -existingBooking.testPrice
            },
            $set: { updatedAt: new Date() }
          },
          { session }
        )
      })
      
      return NextResponse.json({
        success: true,
        message: 'Booking deleted successfully'
      })
      
    } finally {
      await session.endSession()
    }
    
  } catch (error) {
    console.error('Error deleting booking:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete booking' },
      { status: 500 }
    )
  }
}