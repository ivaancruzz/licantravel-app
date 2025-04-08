import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export function getExpirationWindow(minutes = 10) {
  // Elegís tu zona horaria local o la que necesites enviar al servidor
  const tz = dayjs.tz.guess(); // o 'America/Santiago', 'America/Argentina/Buenos_Aires', etc.

  const now = dayjs().tz(tz);
  const future = now.add(minutes, 'minute');

  // Formato solicitado: "yyyy-MM-dd'T'HH:mm:ssz"
  const format = 'YYYY-MM-DDTHH:mm:ssZ'; // El Z es para la zona horaria como +0300 o -0300

  return {
    expiration_date_from: now.format(format),
    expiration_date_to: future.format(format),
  };
}
