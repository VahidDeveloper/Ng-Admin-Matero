/**
 * type of clear storage base time
 */
export interface TimeBaseElimination {
  // Number of days files will be kept
  elapsedInSeconds: number;
  // Delete by file creation time
  enabled: boolean;
  warning: {
    // Reminder
    enabled: boolean;
    // Reminding period by day
    startThreshold: number;
    step: number;
  };
}
