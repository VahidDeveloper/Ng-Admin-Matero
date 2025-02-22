/**
 * this model set block policy to block User connection
 */
export interface LockPolicy {
  active: boolean;
  lockTimeMinutes: number;
  maxFailedAttempts: number;
  resetTimeMinutes: number;
}
