import * as moment from 'moment';

/** A visit is dated between the pet's birth and one year from today — the backend enforces the same. */
export interface VisitDateRange {
  min: moment.Moment | null;
  max: moment.Moment;
}

export function visitDateRange(petBirthDate: string | undefined, today = moment()): VisitDateRange {
  return {
    min: petBirthDate ? moment(petBirthDate, 'YYYY-MM-DD') : null,
    max: today.clone().startOf('day').add(1, 'year'),
  };
}
