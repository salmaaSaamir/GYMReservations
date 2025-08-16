import { Trainer } from "./Trainer";

export class GymClass {
  Id: number = 0;
  Name: string = '';
  ClassDay: string = '';
  TrainerId: number = 0;
  ClassTime: string = '';
  IsCancelled: boolean = false;
  ClassLimit: number = 0;
  Trainer:Trainer = new Trainer();
}