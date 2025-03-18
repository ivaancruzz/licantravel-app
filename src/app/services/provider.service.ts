import { Injectable } from '@angular/core';

export interface ProviderOpenDays {
  day: DayOfWeek;
  open: boolean;
  hours: OpenHours[];
}

export interface OpenHours {
  open: string;
  close: string;
}

export enum DayOfWeek {
  monday = 1,
  tuesday = 2,
  wednesday = 3,
  thursday = 4,
  friday = 5,
  saturday = 6,
  domingo = 0,
}

@Injectable({
  providedIn: 'root',
})
export class ProviderService {
  constructor() {}
}
