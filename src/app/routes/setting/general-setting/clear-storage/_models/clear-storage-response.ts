import { DiskBaseElimination } from './disk-base-elimination';
import { TimeBaseElimination } from './time-base-elimination';

/**
 * Clear storage response
 */
export interface ClearStorageResponse {
  // percent base edition
  diskBaseElimination: DiskBaseElimination;
  // time base edition
  timeBaseElimination: TimeBaseElimination;
}
