// app/unauthorized/page.js
export default function UnauthorizedPage() {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            403 - Unauthorized
          </h1>
          <p className="text-gray-600 mb-8">
            You don't have permission to access this page.
          </p>
          <a
            href="/"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Go Home
          </a>
        </div>
      </div>
    )
  }