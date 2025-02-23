/**
 * type of object in the clear storage base disk
 */
export interface DiskBaseElimination {
  // Delete files according to storage usage percent
  enabled: boolean;
  // Minimum acceptable storage usage percent
  lowerBound: number;
  // Partition mount point which session files is stored on it
  mountPoint: string;
  // Maximum acceptable storage usage percent
  upperBound: number;
  warning: {
    // Send warning
    enabled: boolean;
    startThreshold: number;
    // every number percent increment a new warning will be sent
    step: number;
  };
}
