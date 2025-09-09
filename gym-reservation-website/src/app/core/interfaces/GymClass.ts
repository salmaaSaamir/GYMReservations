import { Trainer } from "./Trainer";

export interface GymClass {
  Id: number ;
  Name: string ;
  ClassDay: string ;
  TrainerId: number ;
  ClassTime: string ;
  IsCancelled: boolean;
  ClassLimit: number ;
  Trainer:Trainer;
}