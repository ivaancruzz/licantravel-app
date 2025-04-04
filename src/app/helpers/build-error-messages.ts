import { TuiAlertService } from '@taiga-ui/core';

export interface ShowErrorMessage {
  baseMessage: string;
  alert: TuiAlertService;
  errorApi?: string | undefined;
}

export function showErrorMessage({
  baseMessage,
  alert,
  errorApi,
}: ShowErrorMessage): void {
  let error = [baseMessage];

  if (errorApi) {
    error.push(errorApi);
  }

  const finalError = error.join('▪️');

  console.error(finalError);

  alert
    .open(errorApi || baseMessage, {
      label: 'Error',
      appearance: 'negative',
      autoClose: 0,
    })
    .subscribe();
}
