import { TimelineIcon } from '@shared/enums';
import { SessionSearchFoundTextsDetails } from './session-search-found-texts-details';

/**  class for get horizontal timeline items */
export interface HorizontalTimeline {
  icon: TimelineIcon;
  // user in template just for client side
  left: number;
  // user in template just for client side
  index: number;
  tooltip: string;
  sessionSearch: SessionSearchFoundTextsDetails;
}
