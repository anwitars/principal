export type PrincipalTimeOffsetOptions = {
  years?: number;
  months?: number;
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
};

export class PrincipalTime {
  readonly date: Date;

  constructor(date?: Date | undefined) {
    this.date = date ?? new Date();
  }

  static fromString(time: string): PrincipalTime {
    return new PrincipalTime(new Date(time));
  }

  static fromUnixTimestamp(timestamp: number): PrincipalTime {
    return new PrincipalTime(new Date(timestamp));
  }

  localeString(): string {
    return this.date.toLocaleString("hu-HU");
  }

  offset(options: PrincipalTimeOffsetOptions): PrincipalTime {
    const { years, months, days, hours, minutes, seconds } = options;

    const date = new Date(this.date);

    if (years) {
      date.setFullYear(date.getFullYear() + years);
    }

    if (months) {
      date.setMonth(date.getMonth() + months);
    }

    if (days) {
      date.setDate(date.getDate() + days);
    }

    if (hours) {
      date.setHours(date.getHours() + hours);
    }

    if (minutes) {
      date.setMinutes(date.getMinutes() + minutes);
    }

    if (seconds) {
      date.setSeconds(date.getSeconds() + seconds);
    }

    return new PrincipalTime(date);
  }

  toString(): string {
    return this.date.toLocaleString("hu-HU");
  }
}
