import { SessionSearchType } from '@shared/enums';

/**
 * found texts details in session-search result.
 */
export interface SessionSearchFoundTextsDetails {
  /**
   * the texts that contain our desired text.
   * They are not accurate but give an idea of what happened at that time.
   */
  foundTexts: string[];
  /**
   * number of milli-seconds after the start of video when text found.
   */
  videoTime: number;
  /**
   * the epoch which denotes the time when the text found in video.
   */
  textTime: number;
  /** */
  textInput: SessionSearchType;
}
