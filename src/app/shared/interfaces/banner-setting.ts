import { SessionTimeoutPolicy } from './session-timeout-policy';
/**
 * banner-display config used on server and in our applications
 */
export interface BannerSetting {
  /** if true, a banner should be shown whenever the user log into the system */
  enabled: boolean;
  /** the title of the banner (only effective when enabled is true) */
  title: string;
  /** the body of the banner which can be a rich text (only effective when enabled is true) */
  description: string;
  /** whether to show web-timeout in banner or not (only effective when enabled is true) */
  showWebTimeout: boolean;
  /** whether to show connection-timeout in banner or not (only effective when enabled is true) */
  showConnectionTimeout: boolean;
  /** remote session timeout policy configs */
  sessionConfig: SessionTimeoutPolicy;
}
