
export enum Types {
  AC = 1,
  LIGHT = 2,
  MUSIC = 3,
  TV = 4,
  FAN = 5,
  OTHER = 6
}
export class Device {
  id: number;
  name: string;
  description: string;
  state: number;
  type: Types;
}

