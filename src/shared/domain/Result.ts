/**
 * Generic Result type for functional error handling.
 * Uses a Discriminated Union pattern with 'success' as the discriminant.
 */
export type Result<T, E = string> = 
  | { success: true; value: T }
  | { success: false; error: E };
