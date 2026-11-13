import * as moment from 'moment';
import {visitDateRange} from './visit-date-range';

describe('visitDateRange', () => {
  const today = moment('2026-09-10 15:30', 'YYYY-MM-DD HH:mm');

  it('starts on the pet\'s birth date', () => {
    expect(visitDateRange('2020-03-01', today).min.format('YYYY-MM-DD')).toBe('2020-03-01');
  });

  it('ends one year from today', () => {
    expect(visitDateRange('2020-03-01', today).max.format('YYYY-MM-DD')).toBe('2027-09-10');
  });

  it('has no lower bound while the birth date is unknown', () => {
    expect(visitDateRange(undefined, today).min).toBeNull();
  });

  it('does not move today', () => {
    visitDateRange('2020-03-01', today);
    expect(today.format('YYYY-MM-DD')).toBe('2026-09-10');
  });
});
