import { DateTime } from 'luxon';

export const formatDate = (isoDate: string) => {
  return DateTime.fromISO(isoDate, { zone: 'UTC' })
    .setZone('America/Sao_Paulo')
    .toFormat('dd/MM/yyyy');
};
