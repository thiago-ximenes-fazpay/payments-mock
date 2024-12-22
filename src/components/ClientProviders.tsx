'use client';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { Settings } from 'luxon';
import { ReactNode } from 'react';

Settings.defaultLocale = 'pt-BR';
Settings.defaultZone = 'America/Sao_Paulo';

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale="pt-BR">
      {children}
    </LocalizationProvider>
  );
}
