import { tuiIsFalsy } from '@taiga-ui/cdk';
import { tuiValidationErrorsProvider } from '@taiga-ui/kit';
import { interval, map, of, scan, startWith } from 'rxjs';

export const TuiValidationErrors = tuiValidationErrorsProvider({
  required: 'Este campo es requerido',
  email: 'Ingrese un correo válido',
  pattern: 'Formato no valido',
  maxlength: ({ requiredLength }: { requiredLength: string }) =>
    `Máximo de ${requiredLength} caracteres`,
  minlength: ({ requiredLength }: { requiredLength: string }) =>
    of(`Minimo de ${requiredLength} caracteres`),
  min: interval(2000).pipe(
    scan(tuiIsFalsy, false),
    map((val) => (val ? 'Fix please' : 'Min number 3')),
    startWith('Min number 3')
  ),
});
