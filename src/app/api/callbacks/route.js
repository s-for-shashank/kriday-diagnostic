import clientPromise from '@/lib/mongodb'
import { validateCallback, generateId, COLLECTIONS } from '@/lib/models'
import { NextResponse } from 'next/server'
export const dynamic = 'force-static'
// GET - Fetch all callbacks
export async function GET(request) {
  try {
    const client = await clientPromise
    const db = client.db('kriday_diagnostics')
    
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const preferredTime = searchParams.get('preferredTime')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit')) || 50
    const page = parseInt(searchParams.get('page')) || 1
    const skip = (page - 1) * limit
    
    // Build query based on filters
    let query = {}
    
    if (status && status !== 'all') {
      query.status = status
    }
    
    if (priority && priority !== 'all') {
      query.priority = priority
    }
    
    if (preferredTime && preferredTime !== 'all') {
      query.preferredTime = preferredTime
    }
    
    if (search) {
      query.$or = [
        { customerName: { $regex: search, $options: 'i' } },
        { customerPhone: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } },
        { callbackId: { $regex: search, $options: 'i' } }
      ]
    }
    
    const callbacks = await db.collection(COLLECTIONS.CALLBACKS)
      .find(query)
      .sort({ 
        priority: 1, // high priority first
        createdAt: -1 
      })
      .skip(skip)
      .limit(limit)
      .toArray()
    
    const totalCount = await db.collection(COLLECTIONS.CALLBACKS)
      .countDocuments(query)
    
    return NextResponse.json({
      success: true,
      data: callbacks,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    })
    
  } catch (error) {
    console.error('Error fetching callbacks:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch callbacks' },
      { status: 500 }
    )
  }
}

// POST - Create new callback request
export async function POST(request) {
  try {
    const client = await clientPromise
    const db = client.db('kriday_diagnostics')
    
    const body = await request.json()
    
    // Validate input data
    const validationErrors = validateCallback(body)
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { success: false, errors: validationErrors },
        { status: 400 }
      )
    }
    
    // Check for recent callback requests from same phone number
    const recentCallback = await db.collection(COLLECTIONS.CALLBACKS)
      .findOne({
        customerPhone: body.customerPhone.trim(),
        status: { $in: ['pending', 'in-progress'] },
        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24 hours
      })
    
    if (recentCallback) {
      return NextResponse.json(
        { success: false, error: 'A callback request from this number is already pending or in progress' },
        { status: 400 }
      )
    }
    
    // Generate unique callback ID
    const callbackId = generateId('CB')
    
    // Prepare callback data
    const callbackData = {
      _id: callbackId,
      callbackId: callbackId,
      customerName: body.customerName.trim(),
      customerPhone: body.customerPhone.trim(),
      preferredTime: body.preferredTime,
      status: 'pending',
      priority: body.priority || 'normal',
      notes: body.notes?.trim() || '',
      attempts: 0,
      lastAttempt: null,
      completedBy: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const result = await db.collection(COLLECTIONS.CALLBACKS).insertOne(callbackData)
    
    if (result.acknowledged) {
      return NextResponse.json({
        success: true,
        message: 'Callback request created successfully',
        data: callbackData
      }, { status: 201 })
    } else {
      throw new Error('Failed to create callback request')
    }
    
  } catch (error) {
    console.error('Error creating callback:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create callback request' },
      { status: 500 }
    )
  }
}

// PUT - Update callback
export async function PUT(request) {
  try {
    const client = await clientPromise
    const db = client.db('kriday_diagnostics')
    
    const body = await request.json()
    const { id, status, completedBy, ...updateData } = body
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Callback ID is required' },
        { status: 400 }
      )
    }
    
    // Check if callback exists
    const existingCallback = await db.collection(COLLECTIONS.CALLBACKS)
      .findOne({ _id: id })
    
    if (!existingCallback) {
      return NextResponse.json(
        { success: false, error: 'Callback not found' },
        { status: 404 }
      )
    }
    
    // Prepare update data
    const callbackUpdate = {
      ...updateData,
      updatedAt: new Date()
    }
    
    // Handle status changes
    if (status) {
      callbackUpdate.status = status
      
      if (status === 'in-progress') {
        callbackUpdate.attempts = (existingCallback.attempts || 0) + 1
        callbackUpdate.lastAttempt = new Date()
      }
      
      if (status === 'completed' && completedBy) {
        callbackUpdate.completedBy = completedBy
        callbackUpdate.lastAttempt = new Date()
      }
      
      if (status === 'failed') {
        callbackUpdate.attempts = (existingCallback.attempts || 0) + 1
        callbackUpdate.lastAttempt = new Date()
      }
    }
    
    // Remove undefined values
    Object.keys(callbackUpdate).forEach(key => {
      if (callbackUpdate[key] === undefined) {
        delete callbackUpdate[key]
      }
    })
    
    const result = await db.collection(COLLECTIONS.CALLBACKS)
      .updateOne({ _id: id }, { $set: callbackUpdate })
    
    if (result.modifiedCount > 0) {
      return NextResponse.json({
        success: true,
        message: 'Callback updated successfully'
      })
    } else {
      return NextResponse.json(
        { success: false, error: 'No changes made' },
        { status: 400 }
      )
    }
    
  } catch (error) {
    console.error('Error updating callback:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update callback' },
      { status: 500 }
    )
  }
}

// DELETE - Delete callback
export async function DELETE(request) {
  try {
    const client = await clientPromise
    const db = client.db('kriday_diagnostics')
    
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Callback ID is required' },
        { status: 400 }
      )
    }
    
    // Check if callback exists
    const existingCallback = await db.collection(COLLECTIONS.CALLBACKS)
      .findOne({ _id: id })
    
    if (!existingCallback) {
      return NextResponse.json(
        { success: false, error: 'Callback not found' },
        { status: 404 }
      )
    }
    
    const result = await db.collection(COLLECTIONS.CALLBACKS)
      .deleteOne({ _id: id })
    
    if (result.deletedCount > 0) {
      return NextResponse.json({
        success: true,
        message: 'Callback deleted successfully'
      })
    } else {
      throw new Error('Failed to delete callback')
    }
    
  } catch (error) {
    console.error('Error deleting callback:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete callback' },
      { status: 500 }
    )
  }
}

// Additional endpoint for bulk status updates
export async function PATCH(request) {
  try {
    const client = await clientPromise
    const db = client.db('kriday_diagnostics')
    
    const body = await request.json()
    const { ids, status, completedBy } = body
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Callback IDs array is required' },
        { status: 400 }
      )
    }
    
    if (!status) {
      return NextResponse.json(
        { success: false, error: 'Status is required' },
        { status: 400 }
      )
    }
    
    // Prepare update data
    const updateData = {
      status: status,
      updatedAt: new Date()
    }
    
    if (status === 'completed' && completedBy) {
      updateData.completedBy = completedBy
      updateData.lastAttempt = new Date()
    }
    
    if (status === 'in-progress' || status === 'failed') {
      updateData.lastAttempt = new Date()
      updateData.$inc = { attempts: 1 }
    }
    
    const result = await db.collection(COLLECTIONS.CALLBACKS)
      .updateMany(
        { _id: { $in: ids } },
        updateData.$inc ? { $set: updateData, $inc: updateData.$inc } : { $set: updateData }
      )
    
    return NextResponse.json({
      success: true,
      message: `${result.modifiedCount} callback(s) updated successfully`,
      modifiedCount: result.modifiedCount
    })
    
  } catch (error) {
    console.error('Error bulk updating callbacks:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update callbacks' },
      { status: 500 }
    )
  }
}