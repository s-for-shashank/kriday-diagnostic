import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import clientPromise from '../../../../lib/mongodb'
import { ObjectId } from 'mongodb'
export const dynamic = 'force-static'
export async function GET(request) {
  try {
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    const client = await clientPromise
    const db = client.db('kriday')
    const users = db.collection('users')

    // Get current user data
    const user = await users.findOne(
      { _id: new ObjectId(decoded.userId) },
      { projection: { password: 0 } } // Exclude password
    )

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role || 'user'
    })
  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json(
      { message: 'Invalid token' },
      { status: 401 }
    )
  }
}
