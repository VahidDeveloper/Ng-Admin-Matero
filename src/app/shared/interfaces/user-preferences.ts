import { RemoteMachinesListViewEnum } from '@shared/enums';

/** user preferences interface. */
export interface UserPreferences {
  /** how remote machines should be displayed. */
  initPageInRemote: RemoteMachinesListViewEnum;
  /** id of favorite remote machines. */
  favoriteNodes: number[];
  /** a flag which is used to ping before establishing connection. */
  pingBeforeConnection: boolean;
}
