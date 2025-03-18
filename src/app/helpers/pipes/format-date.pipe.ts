import { Pipe, PipeTransform } from '@angular/core';
import dayjs from 'dayjs';
import 'dayjs/locale/es'; // Opcional: cambia 'es' por el idioma que necesites
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

type FormatOptions = {
  format?: string;
  locale?: string;
  timezone?: string;
};

@Pipe({
  name: 'formatDate',
})
export class FormatDatePipe implements PipeTransform {
  transform(value: string | Date, options?: FormatOptions): string {
    if (!value) return '';
    const format = options?.format || 'DD/MM/YYYY HH:mm';
    const locale = options?.locale || 'es';
    const tz = options?.timezone || 'UTC';

    return dayjs(value).tz(tz).locale(locale).format(format);
  }
}
