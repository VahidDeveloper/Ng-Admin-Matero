/** Properties of an uploading file. */
export interface UploadingFile {
  /** the name of the uploading file. */
  name: string;
  /** the target directory which file will be uploaded in. */
  target: string;
  /** percentage of uploaded. */
  uploadedPercentage: number;
  /** a flag to cancel the upload. */
  isCancelled: boolean;
  /** a flag which indicates uploaded done with errors. */
  hasError: boolean;
}
