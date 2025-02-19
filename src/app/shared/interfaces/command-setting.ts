/**
 * a model for command setting
 */
export interface CommandSettingModel {
  id: number;
  name: string;
  description: string;
  commands: string[];
}
