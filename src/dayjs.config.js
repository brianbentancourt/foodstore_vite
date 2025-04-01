import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/es';

// Configura los plugins
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);

// Configura español como idioma por defecto
dayjs.locale('es');

// Configura la zona horaria de Uruguay (America/Montevideo)
dayjs.tz.setDefault('America/Montevideo');

dayjs.extend(relativeTime)

export default dayjs;