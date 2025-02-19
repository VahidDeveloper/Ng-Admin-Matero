/**
 * register remote machine agent
 */
export interface RegisterHostAgent {
  /**
   * remote machine id
   */
  hostId: number;
  /**
   * a flag to disable or enable remote machine agent
   */
  register: boolean;
}
