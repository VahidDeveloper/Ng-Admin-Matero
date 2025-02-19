import { Pipe, PipeTransform } from '@angular/core';

/**
 * it would return video time in readable format to be used in our video-player to show current and total time.
 */
@Pipe({
  name: 'readableVideoTime',
})
export class ReadableVideoTimePipe implements PipeTransform {
  /**
   * it would return a string desired for video-player: (HH:MM:SS or MM:SS)
   * For example:
   * 0 -> 00:00
   * 75000 -> 01:15
   * 3672000 -> 01:01:12
   */
  transform(millis: number): string {
    return this._formatTime(millis);
  }

  /**
   * it would return a string based on specified number in a way that the string's length is always equal to minLength.
   * It is brought from guac's example code:
   * For example,
   * (8, 2) -> 08
   * (8, 4) -> 0008
   * (12, 2) -> 12
   * (12, 4) -> 0012
   */
  private _zeroPad = (num: number, minLength: number): string => {
    // Convert provided number to string
    let str = num.toString();

    // Add leading zeroes until string is long enough
    while (str.length < minLength) {
      str = '0' + str;
    }
    return str;
  };

  /**
   * it would return a string desired for video-player: (HH:MM:SS or MM:SS)
   * It is brought from guac's example code:
   * For example:
   * 0 -> 00:00
   * 75000 -> 01:15
   * 3672000 -> 01:01:12
   */
  private _formatTime(millis: number): string {
    if (!millis) {
      return '00:00';
    }

    // Calculate total number of whole seconds
    const totalSeconds = Math.floor(millis / 1000);

    // Split into seconds and minutes
    const hours = Math.floor(totalSeconds / 3600);
    const remainingSeconds = totalSeconds % 3600;
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;

    let timeStr = hours > 0 ? this._zeroPad(hours, 2) + ':' : '';
    timeStr += this._zeroPad(minutes, 2) + ':' + this._zeroPad(seconds, 2);

    // Format seconds and minutes as MM:SS
    return timeStr;
  }
}
