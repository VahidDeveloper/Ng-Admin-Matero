/** remote session timeout policy configs */
export interface SessionTimeoutPolicy {
  webTimeoutMinutes: number;
  connectionTimeoutMinutes: number;
  connectionTimeoutEnabled: boolean;
}
