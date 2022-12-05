export type Subscription = {
  id: string;
  name: string;
  currency?: string;
  isDisabled?: boolean;
  firstBill?:string;
  isFavorite?: boolean;
  cost?: number;
  cycleMultiplier?: number;
  cyclePeriod?: string;
  durationMultiplier?: number;
  durationPeriod?: string;
  remindMeBeforeDays?: number;
  categoryId?: string | null;
  category?: { name: string; title: string }[];
  userId?: string;
  createdAt?: string;
};
