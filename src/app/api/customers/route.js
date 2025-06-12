import clientPromise from '@/lib/mongodb'
import { validateCustomer, generateId, COLLECTIONS } from '@/lib/models'
import { NextResponse } from 'next/server'
export const dynamic = 'force-static'
// GET - Fetch all customers
export async function GET(request) {
  try {
    const client = await clientPromise
    const db = client.db('kriday_diagnostics')
    
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const gender = searchParams.get('gender')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit')) || 50
    const page = parseInt(searchParams.get('page')) || 1
    const skip = (page - 1) * limit
    
    // Build query based on filters
    let query = {}
    
    if (status && status !== 'all') {
      query.status = status
    }
    
    if (gender && gender !== 'all') {
      query.gender = { $regex: new RegExp(gender, 'i') }
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { customerId: { $regex: search, $options: 'i' } }
      ]
    }
    
    const customers = await db.collection(COLLECTIONS.CUSTOMERS)
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()
    
    const totalCount = await db.collection(COLLECTIONS.CUSTOMERS)
      .countDocuments(query)
    
    return NextResponse.json({
      success: true,
      data: customers,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    })
    
  } catch (error) {
    console.error('Error fetching customers:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch customers' },
      { status: 500 }
    )
  }
}

// POST - Create new customer
export async function POST(request) {
  try {
    const client = await clientPromise
    const db = client.db('kriday_diagnostics')
    
    const body = await request.json()
    
    // Validate input data
    const validationErrors = validateCustomer(body)
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { success: false, errors: validationErrors },
        { status: 400 }
      )
    }
    
    // Check if customer already exists
    const existingCustomer = await db.collection(COLLECTIONS.CUSTOMERS)
      .findOne({ 
        $or: [
          { email: body.email.trim().toLowerCase() },
          { phone: body.phone.trim() }
        ]
      })
    
    if (existingCustomer) {
      return NextResponse.json(
        { success: false, error: 'Customer with this email or phone already exists' },
        { status: 400 }
      )
    }
    
    // Generate unique customer ID
    const customerId = generateId('CUST')
    
    // Prepare customer data
    const customerData = {
      _id: customerId,
      customerId: customerId,
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      phone: body.phone.trim(),
      age: parseInt(body.age),
      gender: body.gender,
      address: body.address?.trim() || '',
      emergencyContact: body.emergencyContact?.trim() || '',
      medicalHistory: Array.isArray(body.medicalHistory) ? body.medicalHistory :
                     (body.medicalHistory ? body.medicalHistory.split(',').map(h => h.trim()) : []),
      favoriteTests: [],
      totalBookings: 0,
      totalSpent: 0,
      lastVisit: null,
      status: body.status || 'active',
      rating: 0,
      notes: body.notes?.trim() || '',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const result = await db.collection(COLLECTIONS.CUSTOMERS).insertOne(customerData)
    
    if (result.acknowledged) {
      return NextResponse.json({
        success: true,
        message: 'Customer created successfully',
        data: customerData
      }, { status: 201 })
    } else {
      throw new Error('Failed to create customer')
    }
    
  } catch (error) {
    console.error('Error creating customer:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create customer' },
      { status: 500 }
    )
  }
}

// PUT - Update customer
export async function PUT(request) {
  try {
    const client = await clientPromise
    const db = client.db('kriday_diagnostics')
    
    const body = await request.json()
    const { id, ...updateData } = body
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Customer ID is required' },
        { status: 400 }
      )
    }
    
    // Check if customer exists
    const existingCustomer = await db.collection(COLLECTIONS.CUSTOMERS)
      .findOne({ _id: id })
    
    if (!existingCustomer) {
      return NextResponse.json(
        { success: false, error: 'Customer not found' },
        { status: 404 }
      )
    }
    
    // Validate update data if provided
    if (updateData.name || updateData.email || updateData.phone || updateData.age || updateData.gender) {
      const validationErrors = validateCustomer({ ...existingCustomer, ...updateData })
      if (validationErrors.length > 0) {
        return NextResponse.json(
          { success: false, errors: validationErrors },
          { status: 400 }
        )
      }
    }
    
    // Check for email/phone conflicts if they're being updated
    if (updateData.email || updateData.phone) {
      const conflictQuery = {
        _id: { $ne: id },
        $or: []
      }
      
      if (updateData.email) {
        conflictQuery.$or.push({ email: updateData.email.trim().toLowerCase() })
      }
      
      if (updateData.phone) {
        conflictQuery.$or.push({ phone: updateData.phone.trim() })
      }
      
      const conflictingCustomer = await db.collection(COLLECTIONS.CUSTOMERS)
        .findOne(conflictQuery)
      
      if (conflictingCustomer) {
        return NextResponse.json(
          { success: false, error: 'Another customer with this email or phone already exists' },
          { status: 400 }
        )
      }
    }
    
    // Prepare update data
    const customerUpdate = {
      ...updateData,
      updatedAt: new Date()
    }
    
    // Handle special fields
    if (updateData.email) {
      customerUpdate.email = updateData.email.trim().toLowerCase()
    }
    
    if (updateData.phone) {
      customerUpdate.phone = updateData.phone.trim()
    }
    
    if (updateData.name) {
      customerUpdate.name = updateData.name.trim()
    }
    
    if (updateData.medicalHistory) {
      customerUpdate.medicalHistory = Array.isArray(updateData.medicalHistory) ? 
        updateData.medicalHistory :
        updateData.medicalHistory.split(',').map(h => h.trim())
    }
    
    // Remove undefined values
    Object.keys(customerUpdate).forEach(key => {
      if (customerUpdate[key] === undefined) {
        delete customerUpdate[key]
      }
    })
    
    const result = await db.collection(COLLECTIONS.CUSTOMERS)
      .updateOne({ _id: id }, { $set: customerUpdate })
    
    if (result.modifiedCount > 0) {
      return NextResponse.json({
        success: true,
        message: 'Customer updated successfully'
      })
    } else {
      return NextResponse.json(
        { success: false, error: 'No changes made' },
        { status: 400 }
      )
    }
    
  } catch (error) {
    console.error('Error updating customer:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update customer' },
      { status: 500 }
    )
  }
}

// DELETE - Delete customer
export async function DELETE(request) {
  try {
    const client = await clientPromise
    const db = client.db('kriday_diagnostics')
    
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Customer ID is required' },
        { status: 400 }
      )
    }
    
    // Check if customer exists
    const existingCustomer = await db.collection(COLLECTIONS.CUSTOMERS)
      .findOne({ _id: id })
    
    if (!existingCustomer) {
      return NextResponse.json(
        { success: false, error: 'Customer not found' },
        { status: 404 }
      )
    }
    
    // Check if customer has associated bookings
    const bookingCount = await db.collection(COLLECTIONS.BOOKINGS)
      .countDocuments({ customerEmail: existingCustomer.email })
    
    if (bookingCount > 0) {
      return NextResponse.json(
        { success: false, error: `Cannot delete customer. ${bookingCount} booking(s) are associated with this customer.` },
        { status: 400 }
      )
    }
    
    const result = await db.collection(COLLECTIONS.CUSTOMERS)
      .deleteOne({ _id: id })
    
    if (result.deletedCount > 0) {
      return NextResponse.json({
        success: true,
        message: 'Customer deleted successfully'
      })
    } else {
      throw new Error('Failed to delete customer')
    }
    
  } catch (error) {
    console.error('Error deleting customer:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete customer' },
      { status: 500 }
    )
  }
}