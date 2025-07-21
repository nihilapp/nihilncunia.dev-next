import { DateTime, type DurationLike, type DurationUnit } from 'luxon';

// --- 타입 정의 ---
type DateInput = Date | string | number | DateTime;
type FormatString
  = | 'yyyy-MM-ddTHH:mm:ss.SSSZ'
    | 'yyyy-MM-dd'
    | 'yyyy-MM-dd HH:mm:ss'
    | 'yyyyMMdd'
    | 'yyyy.MM.dd'
    | 'yyyy년 MM월 dd일'
    | 'HH:mm:ss'
    | 'HH:mm';

export class DateTools {
  /**
   * 내부 헬퍼: DateInput을 DateTime 객체로 변환 (서울/한국어)
   */
  private static toDateTime(date: DateInput): DateTime {
    const config = {
      zone: 'Asia/Seoul',
      locale: 'ko_KR',
    };

    if (DateTime.isDateTime(date)) {
      return date.setZone(config.zone).setLocale(config.locale);
    }

    if (date instanceof Date) {
      return DateTime.fromJSDate(date, config);
    }

    if (typeof date === 'string') {
      return DateTime.fromISO(date, config);
    }

    if (typeof date === 'number') {
      return DateTime.fromMillis(date, config);
    }

    return DateTime.now().setZone(config.zone).setLocale(config.locale);
  }

  /**
   * 현재 시간을 서울 시간대 기준으로 DateTime 객체로 반환합니다.
   * @example
   * const nowDate = DateTools.now();
   * // => DateTime 객체 (Asia/Seoul, ko_KR)
   */
  static now(): DateTime {
    return this.toDateTime(new Date());
  }

  /**
   * 주어진 날짜를 지정된 형식의 문자열로 변환합니다.
   * @example
   * DateTools.format('2024-05-01', 'yyyy년 MM월 dd일'); // '2024년 05월 01일'
   * DateTools.format(new Date(), 'yyyy-MM-dd'); // '2024-05-01'
   */
  static format(date: DateInput, formatString: FormatString): string {
    return this.toDateTime(date).toFormat(formatString);
  }

  /**
   * 주어진 날짜에 기간을 더합니다.
   * @example
   * DateTools.add('2024-05-01', { days: 7 }); // 2024-05-08 (DateTime)
   * DateTools.add(DateTools.now(), { months: 1, hours: 2 });
   */
  static add(date: DateInput, duration: DurationLike): DateTime {
    return this.toDateTime(date).plus(duration);
  }

  /**
   * 주어진 날짜에서 기간을 뺍니다.
   * @example
   * DateTools.subtract('2024-05-10', { days: 3 }); // 2024-05-07 (DateTime)
   * DateTools.subtract(DateTools.now(), { years: 1 });
   */
  static subtract(date: DateInput, duration: DurationLike): DateTime {
    return this.toDateTime(date).minus(duration);
  }

  /**
   * 두 날짜의 차이를 지정된 단위로 계산합니다.
   * @example
   * DateTools.diff('2024-05-10', '2024-05-01', 'days'); // 9
   * DateTools.diff(DateTools.now(), '2024-05-01', 'hours');
   */
  static diff(
    date1: DateInput,
    date2: DateInput,
    unit: DurationUnit = 'milliseconds'
  ): number {
    const d1 = this.toDateTime(date1);
    const d2 = this.toDateTime(date2);
    const duration = d1.diff(d2, unit);

    // unit을 단수형으로 변환 (예: 'days' -> 'day')
    const singularUnit = unit.endsWith('s')
      ? unit.slice(0, -1)
      : unit;

    return duration.as(singularUnit as DurationUnit) || 0;
  }

  /**
   * 주어진 날짜가 다른 날짜보다 이전인지 확인합니다.
   * @example
   * DateTools.isBefore('2024-05-01', '2024-05-10'); // true
   * DateTools.isBefore(DateTools.now(), '2024-01-01'); // false
   */
  static isBefore(date1: DateInput, date2: DateInput): boolean {
    return this.toDateTime(date1) < this.toDateTime(date2);
  }

  /**
   * 주어진 날짜가 다른 날짜보다 이후인지 확인합니다.
   * @example
   * DateTools.isAfter('2024-05-10', '2024-05-01'); // true
   * DateTools.isAfter(DateTools.now(), '2025-01-01'); // false
   */
  static isAfter(date1: DateInput, date2: DateInput): boolean {
    return this.toDateTime(date1) > this.toDateTime(date2);
  }

  /**
   * 주어진 날짜를 기준으로 상대적인 시간 문자열을 반환합니다. (예: "3일 전")
   * @example
   * DateTools.toRelative('2024-05-01'); // '2일 전' (현재가 5월 3일이라면)
   * DateTools.toRelative(DateTools.now()); // '방금 전'
   */
  static toRelative(date: DateInput): string | null {
    return this.toDateTime(date).toRelative();
  }

  /**
   * 주어진 날짜를 ISO 8601 형식 문자열로 변환합니다.
   * @example
   * DateTools.toISO('2024-05-01'); // '2024-05-01T00:00:00.000+09:00'
   * DateTools.toISO(DateTools.now());
   */
  static toISO(date: DateInput): string {
    return this.toDateTime(date).toISO() ?? '';
  }
}
