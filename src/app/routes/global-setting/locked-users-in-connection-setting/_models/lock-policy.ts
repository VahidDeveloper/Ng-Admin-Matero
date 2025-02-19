/**
 * this model set block policy to block User connection
 */
export class LockPolicy {
  active: boolean;
  lockTimeMinutes: number;
  maxFailedAttempts: number;
  resetTimeMinutes: number;
}
