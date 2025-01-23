const {
  PrismaClientKnownRequestError,
} = require('@prisma/client/runtime/library');

/**
 * Handles Prisma errors and returns a customized error message.
 * @param {PrismaClientKnownRequestError} error - The Prisma error object.
 * @returns {string} - Customized error message.
 */
const handlePrismaError = (error) => {
  if (!(error instanceof PrismaClientKnownRequestError)) {
    return 'An unexpected error occurred.';
  }

  switch (error.code) {
    case 'P2002':
      // Unique constraint violation
      if (error.meta?.target?.includes('email')) {
        return 'Email is already in use.';
      }
      if (error.meta?.target?.includes('username')) {
        return 'Username is already taken.';
      }
      if (error.meta?.target?.includes('phoneNumber')) {
        return 'Phone number is already in use.';
      }
      return 'Duplicate data: A unique constraint was violated.';

    case 'P2025':
      // Record not found
      return 'Required record not found.';

    case 'P2003':
      // Foreign key constraint violation
      return 'Invalid reference in the data.';

    case 'P2000':
      // Data too long for column
      return 'Input data exceeds the maximum allowed length.';

    case 'P2001':
      // Record does not exist
      return 'The requested record does not exist.';

    default:
      // Generic Prisma error
      return `Database error: ${error.message}`;
  }
};

module.exports = { handlePrismaError };
