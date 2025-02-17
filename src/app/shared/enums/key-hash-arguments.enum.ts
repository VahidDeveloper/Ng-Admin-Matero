/**
 * arguments associated with key-hash error.
 * in ssh connection or sftp, when key-hash error occurs, these arguments with their values are sent via web-socket.
 * we would show the value of these parameters in a modal so that the user decide whether to connect to remote-machine or not.
 */
export enum KeyHashArguments {
  HostKeyHash = 'hostKeyHash',
}
