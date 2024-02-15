import { DayDTO, Tag } from '../interfaces/api.interface';
import { IDay } from '../interfaces/models.interface';

/** Receives IDay model type and transforms to DTO
 * @returns "date" is a string
 */
export function transformDayToDTO(day: IDay): DayDTO {
  console.log(day.date);
  console.log(day.date.toString());

  return {
    id: day.id,
    date: day.date.toISOString(),
    title: day.title,
    entries: day.entries.map((entry) => ({
      text: entry.text,
      tag: entry.tag as Tag,
    })),
  };
}
