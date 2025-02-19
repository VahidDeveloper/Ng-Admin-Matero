import { RemoteMachine } from './remote-machine';
/**
 * remote category class
 */
export interface RemoteCategory {
  /**
   * remote category 'description'
   */
  description: string | undefined;
  /**
   * remote category 'hosts'
   */
  hosts: RemoteMachine[] | undefined;
  /**
   * remote category 'id'
   */
  id: number;
  /**
   * remote category 'image'
   */
  image: string;
  /**
   * remote category 'imageId'
   */
  imageId: number | undefined;
  /**
   * remote category 'name'
   */
  name: string;
  /**
   * remote machines
   */
  members: number[] | undefined;
  /**
   * category id
   */
  objectId: number | undefined;
}
