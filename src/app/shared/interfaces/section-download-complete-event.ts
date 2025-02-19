export interface SectionDownloadCompleteEvent {
  /**
   * number of received characters gotten from server for this section.
   * Note that it omits redundant characters.
   * For example, assume that we got the index of 100 to 1000 from server but characters 900 to 100 does not make a frame.
   * in this case, characters 100 to 900 are used for the section.
   */
  numberOfReceivedCharacters: number;
  /**
   * section's start time in epoch
   * it shows date and time of section's first frame
   */
  startEpoch: number;
  /**
   * it shows date and time that the section ends
   * it shows date and time of section's end frame
   */
  endEpoch: number;
}
