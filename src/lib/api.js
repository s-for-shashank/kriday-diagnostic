// API Client Service for Kriday Diagnostics Admin

const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://your-domain.com/api"
    : "/api";

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    const defaultOptions = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const config = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // GET request
  async get(endpoint, params = {}) {
    const searchParams = new URLSearchParams();

    Object.keys(params).forEach((key) => {
      if (
        params[key] !== null &&
        params[key] !== undefined &&
        params[key] !== ""
      ) {
        searchParams.append(key, params[key]);
      }
    });

    const queryString = searchParams.toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;

    return this.request(url, { method: "GET" });
  }

  // POST request
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint, params = {}) {
    const searchParams = new URLSearchParams(params);
    const queryString = searchParams.toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;

    return this.request(url, { method: "DELETE" });
  }

  // PATCH request
  async patch(endpoint, data) {
    return this.request(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }
}

// Create API service instance
const apiService = new ApiService();

// Tests API
export const testsApi = {
  // Get all tests with filters
  getAll: (filters = {}) => {
    return apiService.get("/tests", filters);
  },

  // Get single test by ID
  getById: (id) => {
    return apiService.get(`/tests/${id}`);
  },

  // Create new test
  create: (testData) => {
    return apiService.post("/tests", testData);
  },

  // Update test
  update: (id, testData) => {
    return apiService.put("/tests", { id, ...testData });
  },

  // Delete test
  delete: (id) => {
    return apiService.delete("/tests", { id });
  },

  // Toggle test status
  toggleStatus: (id) => {
    return apiService.patch("/tests", { id });
  },
};

// Bookings API
export const bookingsApi = {
  // Get all bookings with filters
  getAll: (filters = {}) => {
    return apiService.get("/bookings", filters);
  },

  // Get single booking by ID
  getById: (id) => {
    return apiService.get(`/bookings/${id}`);
  },

  // Create new booking
  create: (bookingData) => {
    return apiService.post("/bookings", bookingData);
  },

  // Update booking
  update: (id, bookingData) => {
    return apiService.put("/bookings", { id, ...bookingData });
  },

  // Delete booking
  delete: (id) => {
    return apiService.delete("/bookings", { id });
  },

  // Update booking status
  updateStatus: (id, status) => {
    return apiService.put("/bookings", { id, status });
  },

  // Get bookings by date range
  getByDateRange: (startDate, endDate) => {
    return apiService.get("/bookings", { startDate, endDate });
  },
};

// Customers API
export const customersApi = {
  // Get all customers with filters
  getAll: (filters = {}) => {
    return apiService.get("/customers", filters);
  },

  // Get single customer by ID
  getById: (id) => {
    return apiService.get(`/customers/${id}`);
  },

  // Create new customer
  create: (customerData) => {
    return apiService.post("/customers", customerData);
  },

  // Update customer
  update: (id, customerData) => {
    return apiService.put("/customers", { id, ...customerData });
  },

  // Delete customer
  delete: (id) => {
    return apiService.delete("/customers", { id });
  },

  // Get customer bookings
  getBookings: (customerId) => {
    return apiService.get(`/customers/${customerId}/bookings`);
  },

  // Update customer status
  updateStatus: (id, status) => {
    return apiService.put("/customers", { id, status });
  },
};

// Callbacks API
export const callbacksApi = {
  // Get all callbacks with filters
  getAll: (filters = {}) => {
    return apiService.get("/callbacks", filters);
  },

  // Get single callback by ID
  getById: (id) => {
    return apiService.get(`/callbacks/${id}`);
  },

  // Create new callback request
  create: (callbackData) => {
    return apiService.post("/callbacks", callbackData);
  },

  // Update callback
  update: (id, callbackData) => {
    return apiService.put("/callbacks", { id, ...callbackData });
  },

  // Delete callback
  delete: (id) => {
    return apiService.delete("/callbacks", { id });
  },

  // Update callback status
  updateStatus: (id, status, completedBy = null) => {
    return apiService.put("/callbacks", { id, status, completedBy });
  },

  // Bulk update callback status
  bulkUpdateStatus: (ids, status, completedBy = null) => {
    return apiService.patch("/callbacks", { ids, status, completedBy });
  },
};

// Dashboard API - UPDATED WITH PROPER ENDPOINTS
export const dashboardApi = {
  // Get dashboard statistics
  getStats: (period = "today") => {
    return apiService.get("/dashboard/stats", { period });
  },

  // Get recent activity
  getRecentActivity: (limit = 10) => {
    return apiService.get("/dashboard/activity", { limit });
  },

  // Get revenue analytics (if you add this endpoint later)
  getRevenueAnalytics: (period = "month") => {
    return apiService.get("/dashboard/revenue", { period });
  },

  // Get test performance data (if you add this endpoint later)
  getTestPerformance: () => {
    return apiService.get("/dashboard/test-performance");
  },

  // Get customer insights (if you add this endpoint later)
  getCustomerInsights: () => {
    return apiService.get("/dashboard/customer-insights");
  },
};

// Settings API
export const settingsApi = {
  // Get all settings
  getAll: () => {
    return apiService.get("/settings");
  },

  // Get settings by category
  getByCategory: (category) => {
    return apiService.get("/settings", { category });
  },

  // Update settings
  update: (settings) => {
    return apiService.put("/settings", settings);
  },

  // Get single setting
  get: (key) => {
    return apiService.get(`/settings/${key}`);
  },

  // Set single setting
  set: (key, value) => {
    return apiService.post("/settings", { key, value });
  },
};

// Reports API
export const reportsApi = {
  // Get revenue report
  getRevenue: (startDate, endDate) => {
    return apiService.get("/reports/revenue", { startDate, endDate });
  },

  // Get bookings report
  getBookings: (startDate, endDate) => {
    return apiService.get("/reports/bookings", { startDate, endDate });
  },

  // Get customers report
  getCustomers: (startDate, endDate) => {
    return apiService.get("/reports/customers", { startDate, endDate });
  },

  // Get tests performance report
  getTestsPerformance: (startDate, endDate) => {
    return apiService.get("/reports/tests-performance", { startDate, endDate });
  },

  // Export report
  export: (reportType, format = "json", filters = {}) => {
    return apiService.get(`/reports/export/${reportType}`, {
      format,
      ...filters,
    });
  },
};

// Utility functions for API calls with error handling
export const withErrorHandling = (apiCall) => {
  return async (...args) => {
    try {
      const result = await apiCall(...args);
      return { success: true, data: result };
    } catch (error) {
      console.error("API call failed:", error);
      return {
        success: false,
        error: error.message,
        details: error,
      };
    }
  };
};

// Utility function to handle loading states
export const withLoadingState = (apiCall, setLoading) => {
  return async (...args) => {
    setLoading(true);
    try {
      const result = await apiCall(...args);
      return result;
    } finally {
      setLoading(false);
    }
  };
};