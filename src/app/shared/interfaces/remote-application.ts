/**
 * remote applications class
 */
export interface RemoteApplication {
  /**
   * applications id
   */
  id?: number;
  /**
   * applications connection id
   */
  connectionId?: number;
  /**
   * applications image id
   */
  imageId?: number;
  /**
   * application's image.
   * when choosing a new image, this member gets the original image's information but
   * after the image is sent to server, an imageId is set to it and imageId would be used for showing the image.
   * So this field is only for those times when a new image is set for application but its imageId has not yet assigned
   * because the image has not sent to the server yet.
   */
  image?: string;
  /**
   * remote applications 'applicationLabel'
   */
  applicationLabel: string;
  /**
   * remote applications 'applicationName'
   */
  applicationName: string;
}
