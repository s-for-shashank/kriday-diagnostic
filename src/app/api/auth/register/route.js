import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import clientPromise from '../../../../lib/mongodb'
export const dynamic = 'force-static'
export async function POST(request) {
  try {
    const { email, password, name, role = 'user' } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db('kriday')
    const users = db.collection('users')

    // Check if user already exists
    const existingUser = await users.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const result = await users.insertOne({
      email,
      password: hashedPassword,
      name,
      role,
      createdAt: new Date()
    })

    return NextResponse.json({
      message: 'User created successfully',
      userId: result.insertedId
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}