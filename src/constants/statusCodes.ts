export const STATUS_CODES = {
  // Success
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  
  // Client errors
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  
  // Server errors
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503
};

export const HTTP_STATUS = {
  // Request statuses
  PENDING: 'pending',
  FULFILLED: 'fulfilled',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  
  // Donation statuses
  SCHEDULED: 'scheduled',
  IN_PROGRESS: 'in-progress',
  DONATED: 'donated',
  FAILED: 'failed'
}; 