/**
 * connection's video section
 */
export class ConnectionVideoSection {
  /**
   * the first absolute frame of the section so that the section can be shown independent of previous sections.
   * Note that for the first section it is null and for all the others, it has value.
   */
  firstFrame: any;
  /**
   * section's start-time
   */
  startTime: number;
  /**
   * section's end-time.
   * most of the time, at the time of creation, we do not know endTime.
   * after getting the whole section's characters from server, it would get value.
   */
  endTime: number | undefined;
  /**
   * section's start-index in video's whole characters.
   * For example, the startIndex of 1 million means that the section starts from index of 1 million
   * so for this section, when getting video characters from server, the server omits the first 1 million characters
   */
  startIndex: number;
  /**
   * section's end-index in video's whole characters.
   * most of the time, at the time of creation, we do not know endTime.
   * after getting the whole section's characters from server, it would get value.
   * for example, the startIndex of 1 million and endIndex of 1.2 million means that for this section, only
   * characters from index 1 million to 1.2 million are used from the whole video characters.
   */
  endIndex: number | undefined;

  /**
   * CONSTRUCTOR
   * note that most of the time, endTime and endIndex is not known at the time of creation.
   */
  constructor(firstFrame: any, startTime: number, startIndex: number) {
    this.firstFrame = firstFrame;
    this.startTime = startTime;
    this.startIndex = startIndex;
  }
}
