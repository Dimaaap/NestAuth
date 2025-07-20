const s = 1000;
const m = s * 60;
const h = m * 60;
const d = h * 24;
const w = d * 7;
const y = d * 365.25;

type Unit =
  | 'Years' | 'Year' | 'Yrs' | 'Yr' | 'Y'
  | 'Weeks' | 'Week' | 'W'
  | 'Days' | 'Day' | 'D'
  | 'Hours' | 'Hour' | 'Hrs' | 'Hr' | 'H'
  | 'Minutes' | 'Minute' | 'Min' | 'Mins' | 'M'
  | 'Seconds' | 'Second' | 'Sec' | 'Secs' | 'S'
  | 'Milliseconds' | 'Millisecond' | 'Millisecs' | 'Msecs' | 'Msec' | 'Ms';

type UnitAnyCase = Unit | Uppercase<Unit> | Lowercase<Unit>;

export type StringValue =
  | `${number}`
  | `${number}${UnitAnyCase}`
  | `${number} ${UnitAnyCase}`;


export function ms(str: StringValue): number {
  if (typeof str !== 'string' || str.length === 0 || str.length > 100) {
    throw new Error('Value provided to ms() must be a string with length between 1 and 99.');
  }

  const match = /^(-?(?:\d+)?\.?\d+)\s*(\w+)?$/i.exec(str.trim());
  if (!match) {
    throw new Error(`Invalid time format: ${str}`);
  }

  const n = parseFloat(match[1]);
  const type = (match[2] || 'ms').toLowerCase();

  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'weeks':
    case 'week':
    case 'w':
      return n * w;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      throw new Error(`Unknown time unit: ${type}`);
  }
}