import { UserRole } from '@shared/enums';
import { UserBriefInfo } from '@shared/models';

export const admin: UserBriefInfo = {
  username: 'Zongbin',
  displayName: 'nzb329@163.com',
  userImage: 'images/avatar.jpg',
  role: UserRole.RemoteAdmin,
};

export const guest: UserBriefInfo = {
  username: 'unknown',
  displayName: 'unknown',
  userImage: 'images/avatar-default.jpg',
  role: UserRole.RemoteUser,
};
