import { OperatingSystemType } from '@shared/types';
import { GenericListItem } from '@shared/interfaces';

/**
 * list of operating systems with both their original key and their label to be displayed.
 */
export const operatingSystemsList: GenericListItem<OperatingSystemType>[] = [
  { key: 'android', label: 'Android' },
  { key: 'centos', label: 'CentOS' },
  { key: 'debian', label: 'Debian' },
  { key: 'datadiode', label: 'Data Diode' },
  { key: 'esxi', label: 'ESXI' },
  { key: 'fedora', label: 'Fedora' },
  { key: 'freebsd', label: 'FreeBSD' },
  { key: 'gentoo', label: 'Gentoo' },
  { key: 'hp_ilo', label: 'HP Integrated Lights-Out' },
  { key: 'macos', label: 'MacOS' },
  { key: 'mint', label: 'Mint' },
  { key: 'nsg4', label: 'NSG4' },
  { key: 'oel', label: 'OEL' },
  { key: 'raspbian', label: 'Raspbian' },
  { key: 'redhat', label: 'Red Hat' },
  { key: 'solaris', label: 'Solaris' },
  { key: 'suse', label: 'Suse' },
  { key: 'windows', label: 'Windows' },
  { key: 'ubuntu', label: 'Ubuntu' },
  { key: 'ciscoios', label: 'Cisco IOS' },
  { key: 'others', label: 'Other operating systems' },
];
