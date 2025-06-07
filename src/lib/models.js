// Database Models for Kriday Diagnostics

// Test Model
export const TestModel = {
  name: String,
  testCode: String, // Unique identifier
  category: String,
  price: Number,
  originalPrice: Number,
  duration: String,
  description: String,
  active: Boolean,
  popularity: Number,
  bookings: Number,
  revenue: Number,
  requirements: [String],
  includes: [String],
  reportTime: String,
  preparationTime: String,
  sampleType: String,
  createdAt: Date,
  updatedAt: Date
}

// Booking Model
export const BookingModel = {
  bookingId: String, // Unique booking ID
  customerName: String,
  customerEmail: String,
  customerPhone: String,
  customerAge: Number,
  customerGender: String,
  customerAddress: String,
  testName: String,
  testId: String, // Reference to test
  testPrice: Number,
  appointmentDate: String,
  appointmentTime: String,
  status: String, // pending, confirmed, completed, cancelled
  paymentStatus: String, // pending, paid, failed
  notes: String,
  createdAt: Date,
  updatedAt: Date
}

// Customer Model
export const CustomerModel = {
  customerId: String, // Unique customer ID
  name: String,
  email: String,
  phone: String,
  age: Number,
  gender: String,
  address: String,
  emergencyContact: String,
  medicalHistory: [String],
  favoriteTests: [String],
  totalBookings: Number,
  totalSpent: Number,
  lastVisit: Date,
  status: String, // active, inactive, vip
  rating: Number,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}

// Callback Model
export const CallbackModel = {
  callbackId: String, // Unique callback ID
  customerName: String,
  customerPhone: String,
  preferredTime: String, // morning, afternoon, evening, anytime
  status: String, // pending, in-progress, completed, failed
  priority: String, // high, normal, low
  notes: String,
  attempts: Number,
  lastAttempt: Date,
  completedBy: String,
  createdAt: Date,
  updatedAt: Date
}

// Admin User Model
export const AdminModel = {
  adminId: String,
  username: String,
  email: String,
  password: String, // Hashed
  fullName: String,
  phone: String,
  role: String, // super_admin, admin, staff
  avatar: String,
  lastLogin: Date,
  isActive: Boolean,
  permissions: [String],
  createdAt: Date,
  updatedAt: Date
}

// Settings Model
export const SettingsModel = {
  settingKey: String,
  settingValue: Object, // Can store any type of data
  category: String, // general, notifications, security, system
  description: String,
  updatedBy: String,
  updatedAt: Date
}

// Utility functions for data validation
export const validateTest = (data) => {
  const errors = []
  
  if (!data.name || data.name.trim().length < 3) {
    errors.push('Test name must be at least 3 characters long')
  }
  
  if (!data.testCode || data.testCode.trim().length < 3) {
    errors.push('Test code must be at least 3 characters long')
  }
  
  if (!data.category) {
    errors.push('Test category is required')
  }
  
  if (!data.price || data.price <= 0) {
    errors.push('Valid price is required')
  }
  
  if (!data.duration) {
    errors.push('Test duration is required')
  }
  
  return errors
}

export const validateBooking = (data) => {
  const errors = []
  
  if (!data.customerName || data.customerName.trim().length < 2) {
    errors.push('Customer name is required')
  }
  
  if (!data.customerEmail || !isValidEmail(data.customerEmail)) {
    errors.push('Valid email is required')
  }
  
  if (!data.customerPhone || data.customerPhone.length < 10) {
    errors.push('Valid phone number is required')
  }
  
  if (!data.testName) {
    errors.push('Test selection is required')
  }
  
  if (!data.appointmentDate) {
    errors.push('Appointment date is required')
  }
  
  if (!data.appointmentTime) {
    errors.push('Appointment time is required')
  }
  
  return errors
}

export const validateCustomer = (data) => {
  const errors = []
  
  if (!data.name || data.name.trim().length < 2) {
    errors.push('Customer name must be at least 2 characters long')
  }
  
  if (!data.email || !isValidEmail(data.email)) {
    errors.push('Valid email is required')
  }
  
  if (!data.phone || data.phone.length < 10) {
    errors.push('Valid phone number is required')
  }
  
  if (!data.age || data.age < 1 || data.age > 120) {
    errors.push('Valid age is required')
  }
  
  if (!data.gender) {
    errors.push('Gender is required')
  }
  
  return errors
}

export const validateCallback = (data) => {
  const errors = []
  
  if (!data.customerName || data.customerName.trim().length < 2) {
    errors.push('Customer name is required')
  }
  
  if (!data.customerPhone || data.customerPhone.length < 10) {
    errors.push('Valid phone number is required')
  }
  
  if (!data.preferredTime) {
    errors.push('Preferred time is required')
  }
  
  return errors
}

// Helper function for email validation
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Helper function to generate unique IDs
export const generateId = (prefix = '') => {
  const timestamp = Date.now().toString(36)
  const randomStr = Math.random().toString(36).substring(2, 7)
  return `${prefix}${timestamp}${randomStr}`.toUpperCase()
}

// Helper function to format dates
export const formatDate = (date) => {
  return new Date(date).toISOString()
}

// Database collection names
export const COLLECTIONS = {
  TESTS: 'tests',
  BOOKINGS: 'bookings',
  CUSTOMERS: 'customers',
  CALLBACKS: 'callbacks',
  ADMINS: 'admins',
  SETTINGS: 'settings'
}