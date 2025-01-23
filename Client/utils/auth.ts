/**
 * Verify if the token is expired.
 * @param token - The JWT token to verify.
 * @returns `true` if the token is valid, `false` if it's expired.
 */
export const verifyToken = (token: string): boolean => {
    try {
      // Split the token into its parts (header, payload, signature)
      const parts = token.split('.');
      if (parts.length !== 3) {
        return false; // Invalid JWT format
      }
  
      // Decode the payload (second part of the JWT)
      const payload = JSON.parse(atob(parts[1])); // Decode base64 payload
  
      // Check if the token is expired
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
      if (payload.exp && payload.exp < currentTime) {
        return false; // Token is expired
      }
  
      return true; // Token is valid
    } catch (error) {
      console.error('Error verifying token:', error);
      return false; // Token is invalid
    }
  };