/**
 * absolute frame information saved in server.
 * the absolute frame itself is stored in 'frame' member but it has to be parsed to JSON by JSON.parse function
 */
export interface SavedAbsoluteFrameInfo {
  /**
   * id of the frame
   */
  id: number;
  /**
   * tunnel uuid associated with connection's video.
   */
  tunnelUuid: string;
  /**
   * frame's estimate index in video file's whole content.
   * IMPORTANT:
   * most of the time, absolute frames are saved in server while interacting with remote-machine
   * While interacting with remote-machine, we cannot find out the accurate index of frame in VIDEO file's content because
   * Guac does not save all received web-socket contents in video file's content because some of them are redundant and
   * they are only related to interaction time.
   * in this case, we send estimatedIndex instead of index;
   * If the user request such frame, based on estimatedIndex, the server find the accurate index and save it. For all further
   * requests to server for this frame, the server just return that frame because it has already calculated the accurate index.
   * Note that when retrieving a frame, estimatedIndex is useless and only index is used for us.
   * In fact, the server should not return a frame when the index is null.
   */
  estimatedIndex: number;
  /**
   * accurate index of the frame in video file's whole contents.
   * as mentioned above, while interacting with remote-machine, we cannot find out the accurate index
   * so we send member as null and instead we send estimatedIndex.
   * Note also that, while watching, we know the accurate index of a frame so in this case, we do not send estimatedIndex.
   */
  index: number;
  /**
   * frame's EPOCH.
   * Note that it is the epoch received via web-socket and most of the time, it can be found in video file's content.
   */
  time: number;
  /**
   * the absolute frame's information which is parsed to string so it should be parsed to JSON again.
   * it has all the required information to show the display of the frame independently.
   * because of its independent nature, we can split video into multiple sections to reduce memory and cpu usage.
   * The reason for reducing cpu usage: it is not needed to execute all the frames before this frame.
   * The reason for reducing memory usage: it is not needed to store whole video contents and its frames.
   * For example, a video content of 20 MB would require about 250 MB of storage if we do not split the video into sections.
   */
  frame: string;
  /**
   * extra information which is not used in UI.
   * it shows that at the time of saving the frame, how much characters we consider for each section.
   * it may be useful for troubleshooting.
   */
  sectionMaxCharacters?: number;
}
