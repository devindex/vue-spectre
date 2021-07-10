import { getLocale } from '@/config';

const base = {
  daysOfWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  months: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ],
};

const data = {
  en: base,
  'pt-br': {
    ...base,
    daysOfWeek: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
    months: [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro'
    ],
  },
};

export function get(key = null) {
  const locale = getLocale();
  const language = locale in data ? data[locale] : base;

  if (key !== null) {
    return key in language ? language[key] : null;
  }

  return language;
}

export default data;
