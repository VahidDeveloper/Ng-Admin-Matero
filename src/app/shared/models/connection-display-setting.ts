/**
 * connection display setting
 * the way the remote machine is showed in wina
 */
import { ColorSchema } from '@shared/enums';

export class ConnectionDisplaySetting {
  /**
   * width of window
   */
  width?: number;
  /**
   * height of window
   */
  height: number | undefined;
  /**
   * dots per inch
   */
  dpi?: number;
  /**
   * if enabled thing like windows theme, fonts smoothness, colors, desktop background, menu animation,... will be shown
   */
  highResolutionEnabled?: boolean;

  /**
   * the way mouse cursor icon will be shown
   */
  cursor?: 'local' | 'remote';
  colorDepth?: number;
  /**
   * swaps all red colors with blue
   */
  swapRedBlue?: boolean;

  colorSchema?: ColorSchema;
  fontName?: string;
  fontSize?: string;
}
