import { randomInt as nodeRandomInt } from 'crypto';

import { v4 as uuidv4 } from 'uuid';

/**
 * 범용 데이터 변환, 배열 처리, undefined/null 제거 등 공통 유틸리티 클래스
 */
export class CommonHelper {
  /**
   * key가 주어지면 'key-uuid' 형식의 문자열을, 그렇지 않으면 uuid를 반환합니다.
   * @param key - 선택적 접두사.
   * @returns 고유한 식별자.
   */
  static uuid(key?: string): string {
    const newUuid = uuidv4();
    return key
      ? `${key}-${newUuid}`
      : newUuid;
  }

  /**
   * cuid 형식의 고유한 식별자를 생성합니다.
   * @param key - 선택적 접두사.
   * @returns 고유한 식별자.
   */
  static cuid(key?: string): string {
    const newCuid = this.createCuid();
    return key
      ? `${key}-${newCuid}`
      : newCuid;
  }

  /**
   * 내부적으로 사용되는 cuid 생성 함수
   */
  private static _counter = 0;

  private static createCuid(): string {
    // c + timestamp(36진수) + 랜덤(36진수) + 카운터(36진수)
    const ts = Date.now().toString(36);
    const rand = Math.floor(Math.random() * 1e8).toString(36);
    this._counter = (this._counter + 1) % 1e6;
    const counter = this._counter.toString(36);
    return `c${ts}${rand}${counter}`;
  }

  /**
   * 데이터를 JSON 문자열로 변환합니다.
   * @param data - 문자열로 변환할 데이터.
   */
  static string<T>(data: T): string {
    return JSON.stringify(data);
  }

  /**
   * JSON 문자열을 객체로 파싱합니다.
   * @param stringData - 파싱할 JSON 문자열.
   */
  static parse<T>(stringData: string): T {
    return JSON.parse(stringData);
  }

  /**
   * 객체의 속성 값 중 null 또는 undefined를 빈 문자열로 바꿉니다. (얕은 복사)
   * @param obj - 처리할 객체.
   */
  static undefinedRemover<T extends Record<string, any>>(obj: T): T {
    if (!obj) return obj;
    const newObj = { ...obj, };
    for (const key in newObj) {
      if (
        Object.prototype.hasOwnProperty.call(newObj, key)
        && newObj[key] == null
      ) {
        (newObj as any)[key] = '';
      }
    }
    return newObj;
  }

  /**
   * 배열을 주어진 크기의 여러 하위 배열로 나눕니다.
   * @param array - 나눌 배열.
   * @param size - 각 하위 배열의 크기.
   * @example
   * CommonHelper.arraySlice([1,2,3,4,5], 2); // [[1,2],[3,4],[5]]
   */
  static arraySlice<T>(array: T[], size: number): T[][] {
    if (size <= 0) {
      return [];
    }
    const result: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }

  /**
   * 1부터 시작하는, 지정한 수만큼의 수 배열을 반환합니다.
   * @param number - 숫자
   * @returns {number[]} 수 배열
   * @example
   * CommonHelper.numberArray(5); // [1,2,3,4,5]
   */
  static numberArray(number: number): number[] {
    return Array.from({ length: number, }, (_, i) => i + 1);
  }

  /**
   * 숫자 1 에서 숫자 2 까지의 숫자 배열을 반환합니다.
   * @param number1 - 시작 숫자
   * @param number2 - 끝 숫자
   * @returns {number[]}
   * @example
   * CommonHelper.rangeArray(3, 7); // [3,4,5,6,7]
   */
  static rangeArray(number1: number, number2: number): number[] {
    return Array.from({ length: number2 - number1 + 1, }, (_, i) => number1 + i);
  }

  /**
   * 배열의 중복을 제거합니다.
   * @example CommonHelper.uniqueArray([1,2,2,3]) // [1,2,3]
   */
  static uniqueArray<T>(arr: T[]): T[] {
    return Array.from(new Set(arr));
  }

  /**
   * 다차원 배열을 1차원으로 평탄화합니다.
   * @example CommonHelper.flattenArray([1, [2, [3, 4]], 5]) // [1,2,3,4,5]
   */
  static flattenArray<T>(arr: any[]): T[] {
    return arr.flat(Infinity);
  }

  /**
   * 배열을 랜덤하게 섞습니다.
   * @example CommonHelper.shuffleArray([1,2,3,4])
   */
  static shuffleArray<T>(arr: T[]): T[] {
    return arr.slice().sort(() => Math.random() - 0.5);
  }

  /**
   * 배열의 마지막 값을 반환합니다.
   * @example CommonHelper.last([1,2,3]) // 3
   */
  static last<T>(arr: T[]): T | undefined {
    return arr.length
      ? arr[arr.length - 1]
      : undefined;
  }

  /**
   * 배열의 첫번째 값을 반환합니다.
   * @example CommonHelper.first([1,2,3]) // 1
   */
  static first<T>(arr: T[]): T | undefined {
    return arr.length
      ? arr[0]
      : undefined;
  }

  /**
   * 배열에서 falsy 값(0, '', null, undefined 등)을 제거합니다.
   * @example CommonHelper.compact([0, 1, false, 2, '', 3]) // [1,2,3]
   */
  static compact<T>(arr: T[]): T[] {
    return arr.filter(Boolean);
  }

  /**
   * 객체를 깊은 복사합니다.
   * @example CommonHelper.deepClone({a:1, b:{c:2}})
   */
  static deepClone(obj: any): any {
    return JSON.parse(JSON.stringify(obj));
  }

  /**
   * 객체에서 특정 키만 추출합니다.
   * @example CommonHelper.pick({a:1,b:2}, ['a']) // {a:1}
   */
  static pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
    const result = {} as Pick<T, K>;
    keys.forEach((key) => {
      if (key in obj) result[key] = obj[key];
    });
    return result;
  }

  /**
   * 객체에서 특정 키를 제외합니다.
   * @example CommonHelper.omit({a:1,b:2}, ['a']) // {b:2}
   */
  static omit<T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
    const result = { ...obj, };
    keys.forEach((key) => {
      delete result[key];
    });
    return result;
  }

  /**
   * 값이 비었는지 확인합니다(배열/객체/문자열/null/undefined).
   * @example CommonHelper.isEmpty([]) // true
   * @example CommonHelper.isEmpty({}) // true
   * @example CommonHelper.isEmpty('') // true
   */
  static isEmpty(val: any): boolean {
    if (val == null) return true;
    if (Array.isArray(val) || typeof val === 'string') return val.length === 0;
    if (typeof val === 'object') return Object.keys(val).length === 0;
    return false;
  }

  /**
   * 문자열의 첫 글자를 대문자로 변환합니다.
   * @example CommonHelper.capitalize('hello') // 'Hello'
   */
  static capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * 문자열을 kebab-case로 변환합니다.
   * @example CommonHelper.kebabCase('Hello World') // 'hello-world'
   */
  static kebabCase(str: string): string {
    return str
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/\s+/g, '-')
      .toLowerCase();
  }

  /**
   * 문자열을 camelCase로 변환합니다.
   * @example CommonHelper.camelCase('hello-world') // 'helloWorld'
   */
  static camelCase(str: string): string {
    return str
      .replace(/[-_\s]+(.)?/g, (_, c) => (c
        ? c.toUpperCase()
        : ''))
      .replace(/^(.)/, (c) => c.toLowerCase());
  }

  /**
   * 문자열을 snake_case로 변환합니다.
   * @example CommonHelper.snakeCase('helloWorld') // 'hello_world'
   */
  static snakeCase(str: string): string {
    return str
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .replace(/\s+/g, '_')
      .toLowerCase();
  }

  /**
   * 문자열을 지정 길이만큼 앞/뒤로 채웁니다.
   * @example CommonHelper.padStart('1', 3, '0') // '001'
   * @example CommonHelper.padEnd('1', 3, '0') // '100'
   */
  static padStart(str: string, length: number, pad: string): string {
    return str.padStart(length, pad);
  }

  static padEnd(str: string, length: number, pad: string): string {
    return str.padEnd(length, pad);
  }

  /**
   * 문자열을 지정 길이로 자르고 ...을 붙입니다.
   * @example CommonHelper.truncate('hello world', 5) // 'hello...'
   */
  static truncate(str: string, length: number): string {
    return str.length > length
      ? str.slice(0, length) + '...'
      : str;
  }

  /**
   * min~max 범위의 진짜에 가까운 랜덤 정수 반환 (Node.js crypto 기반)
   * @example CommonHelper.randomInt(1, 10)
   */
  static randomInt(min: number, max: number): number {
    // crypto.randomInt는 max 미포함이므로 +1
    return nodeRandomInt(min, max + 1);
  }

  /**
   * 값이 min~max 범위 내에 있도록 제한
   * @example CommonHelper.clamp(15, 0, 10) // 10
   */
  static clamp(val: number, min: number, max: number): number {
    return Math.min(Math.max(val, min), max);
  }

  /**
   * 임시 비밀번호 생성 (영대소문자, 숫자, 특수문자 각각 하나씩 포함)
   * @returns 8자리 임시 비밀번호
   * @example CommonHelper.generateTemporaryPassword() // 'Kj9#mN2p'
   */
  static generateTemporaryPassword(): string {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    // 각 카테고리에서 하나씩 선택
    const upperChar = uppercase[Math.floor(Math.random() * uppercase.length)];
    const lowerChar = lowercase[Math.floor(Math.random() * lowercase.length)];
    const numberChar = numbers[Math.floor(Math.random() * numbers.length)];
    const specialChar = specialChars[Math.floor(Math.random() * specialChars.length)];

    // 나머지 4자리는 모든 문자에서 랜덤 선택
    const allChars = uppercase + lowercase + numbers + specialChars;
    const remainingChars = Array.from({ length: 4, }, () =>
      allChars[Math.floor(Math.random() * allChars.length)]);

    // 모든 문자를 배열로 만들고 섞기
    const passwordArray = [
      upperChar,
      lowerChar,
      numberChar,
      specialChar,
      ...remainingChars,
    ];

    // Fisher-Yates 셔플 알고리즘으로 배열 섞기
    for (let i = passwordArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [
        passwordArray[i],
        passwordArray[j],
      ] = [
        passwordArray[j],
        passwordArray[i],
      ];
    }

    return passwordArray.join('');
  }
}
