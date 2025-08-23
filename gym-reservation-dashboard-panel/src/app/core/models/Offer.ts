export class Offer {
  Id: number = 0;
  Value: number = 0;
  SubscriptionId: number | null = null;
  IsGeneralOffer: boolean = false;
  IsActive: boolean = true;
  StartDate: Date = new Date();
  EndDate: Date = new Date();
}