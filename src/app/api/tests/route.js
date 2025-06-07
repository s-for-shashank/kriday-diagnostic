// Add this PATCH function to your existing /api/tests/route.js file

import clientPromise from '@/lib/mongodb'
import { validateTest, generateId, formatDate, COLLECTIONS } from '@/lib/models'
import { NextResponse } from 'next/server'

// GET - Fetch all tests
export async function GET(request) {
  try {
    const client = await clientPromise
    const db = client.db('kriday_diagnostics')
    
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    
    // Build query based on filters
    let query = {}
    
    if (category && category !== 'all') {
      query.category = category
    }
    
    if (status && status !== 'all') {
      query.active = status === 'active'
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { testCode: { $regex: search, $options: 'i' } }
      ]
    }
    
    const tests = await db.collection(COLLECTIONS.TESTS)
      .find(query)
      .sort({ createdAt: -1 })
      .toArray()
    
    return NextResponse.json({
      success: true,
      data: tests,
      count: tests.length
    })
    
  } catch (error) {
    console.error('Error fetching tests:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tests' },
      { status: 500 }
    )
  }
}

// POST - Create new test
export async function POST(request) {
  try {
    const client = await clientPromise
    const db = client.db('kriday_diagnostics')
    
    const body = await request.json()
    
    // Validate input data
    const validationErrors = validateTest(body)
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { success: false, errors: validationErrors },
        { status: 400 }
      )
    }
    
    // Check if test code already exists
    const existingTest = await db.collection(COLLECTIONS.TESTS)
      .findOne({ testCode: body.testCode })
    
    if (existingTest) {
      return NextResponse.json(
        { success: false, error: 'Test code already exists' },
        { status: 400 }
      )
    }
    
    // Prepare test data
    const testData = {
      _id: generateId('TEST_'),
      name: body.name.trim(),
      testCode: body.testCode.trim().toUpperCase(),
      category: body.category,
      price: parseFloat(body.price),
      originalPrice: parseFloat(body.originalPrice || body.price),
      duration: body.duration,
      description: body.description?.trim() || '',
      active: body.active !== undefined ? body.active : true,
      popularity: 0,
      bookings: 0,
      revenue: 0,
      requirements: Array.isArray(body.requirements) ? body.requirements : 
                   (body.requirements ? body.requirements.split(',').map(r => r.trim()) : []),
      includes: Array.isArray(body.includes) ? body.includes :
               (body.includes ? body.includes.split(',').map(i => i.trim()) : []),
      reportTime: body.reportTime || 'Same day',
      preparationTime: body.preparationTime || 'No preparation needed',
      sampleType: body.sampleType || 'Blood',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const result = await db.collection(COLLECTIONS.TESTS).insertOne(testData)
    
    if (result.acknowledged) {
      return NextResponse.json({
        success: true,
        message: 'Test created successfully',
        data: testData
      }, { status: 201 })
    } else {
      throw new Error('Failed to create test')
    }
    
  } catch (error) {
    console.error('Error creating test:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create test' },
      { status: 500 }
    )
  }
}

// PUT - Update test
export async function PUT(request) {
  try {
    const client = await clientPromise
    const db = client.db('kriday_diagnostics')
    
    const body = await request.json()
    const { id, ...updateData } = body
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Test ID is required' },
        { status: 400 }
      )
    }
    
    // Validate input data
    const validationErrors = validateTest(updateData)
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { success: false, errors: validationErrors },
        { status: 400 }
      )
    }
    
    // Check if test exists
    const existingTest = await db.collection(COLLECTIONS.TESTS)
      .findOne({ _id: id })
    
    if (!existingTest) {
      return NextResponse.json(
        { success: false, error: 'Test not found' },
        { status: 404 }
      )
    }
    
    // Prepare update data
    const testUpdate = {
      name: updateData.name.trim(),
      testCode: updateData.testCode.trim().toUpperCase(),
      category: updateData.category,
      price: parseFloat(updateData.price),
      originalPrice: parseFloat(updateData.originalPrice || updateData.price),
      duration: updateData.duration,
      description: updateData.description?.trim() || '',
      active: updateData.active !== undefined ? updateData.active : existingTest.active,
      requirements: Array.isArray(updateData.requirements) ? updateData.requirements : 
                   (updateData.requirements ? updateData.requirements.split(',').map(r => r.trim()) : []),
      includes: Array.isArray(updateData.includes) ? updateData.includes :
               (updateData.includes ? updateData.includes.split(',').map(i => i.trim()) : []),
      reportTime: updateData.reportTime || existingTest.reportTime,
      preparationTime: updateData.preparationTime || existingTest.preparationTime,
      sampleType: updateData.sampleType || existingTest.sampleType,
      updatedAt: new Date()
    }
    
    const result = await db.collection(COLLECTIONS.TESTS)
      .updateOne({ _id: id }, { $set: testUpdate })
    
    if (result.modifiedCount > 0) {
      return NextResponse.json({
        success: true,
        message: 'Test updated successfully'
      })
    } else {
      return NextResponse.json(
        { success: false, error: 'No changes made' },
        { status: 400 }
      )
    }
    
  } catch (error) {
    console.error('Error updating test:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update test' },
      { status: 500 }
    )
  }
}

// PATCH - Toggle test status (ADD THIS NEW METHOD)
export async function PATCH(request) {
  try {
    const client = await clientPromise
    const db = client.db('kriday_diagnostics')
    
    const body = await request.json()
    const { id } = body
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Test ID is required' },
        { status: 400 }
      )
    }
    
    console.log('Toggling status for test ID:', id) // Debug log
    
    // Check if test exists and get current status
    const existingTest = await db.collection(COLLECTIONS.TESTS)
      .findOne({ _id: id })
    
    if (!existingTest) {
      console.log('Test not found:', id) // Debug log
      return NextResponse.json(
        { success: false, error: 'Test not found' },
        { status: 404 }
      )
    }
    
    console.log('Current test status:', existingTest.active) // Debug log
    
    // Toggle the active status
    const newStatus = !existingTest.active
    
    const result = await db.collection(COLLECTIONS.TESTS)
      .updateOne(
        { _id: id }, 
        { 
          $set: { 
            active: newStatus,
            updatedAt: new Date()
          } 
        }
      )
    
    console.log('Update result:', result) // Debug log
    
    if (result.modifiedCount > 0) {
      return NextResponse.json({
        success: true,
        message: `Test ${newStatus ? 'activated' : 'deactivated'} successfully`,
        data: { id, active: newStatus }
      })
    } else {
      return NextResponse.json(
        { success: false, error: 'Failed to update test status' },
        { status: 400 }
      )
    }
    
  } catch (error) {
    console.error('Error toggling test status:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to toggle test status' },
      { status: 500 }
    )
  }
}

// DELETE - Delete test
export async function DELETE(request) {
  try {
    const client = await clientPromise
    const db = client.db('kriday_diagnostics')
    
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Test ID is required' },
        { status: 400 }
      )
    }
    
    // Check if test exists
    const existingTest = await db.collection(COLLECTIONS.TESTS)
      .findOne({ _id: id })
    
    if (!existingTest) {
      return NextResponse.json(
        { success: false, error: 'Test not found' },
        { status: 404 }
      )
    }
    
    // Check if test has associated bookings
    const bookingCount = await db.collection(COLLECTIONS.BOOKINGS)
      .countDocuments({ testId: id })
    
    if (bookingCount > 0) {
      return NextResponse.json(
        { success: false, error: `Cannot delete test. ${bookingCount} booking(s) are associated with this test.` },
        { status: 400 }
      )
    }
    
    const result = await db.collection(COLLECTIONS.TESTS)
      .deleteOne({ _id: id })
    
    if (result.deletedCount > 0) {
      return NextResponse.json({
        success: true,
        message: 'Test deleted successfully'
      })
    } else {
      throw new Error('Failed to delete test')
    }
    
  } catch (error) {
    console.error('Error deleting test:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete test' },
      { status: 500 }
    )
  }
}