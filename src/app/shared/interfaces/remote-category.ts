import { RemoteMachine } from './remote-machine';
/**
 * remote category class
 */
export interface RemoteCategory {
  /**
   * remote category 'description'
   */
  description: string;
  /**
   * remote category 'hosts'
   */
  hosts: RemoteMachine[];
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
  imageId: number;
  /**
   * remote category 'name'
   */
  name: string;
  /**
   * remote machines
   */
  members?: number[];
  /**
   * category id
   */
  objectId?: number;
}
