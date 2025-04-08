import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Role, UserService } from '../services/user.service';
import { SupabaseService } from '../services/supabase.service';

/**
 * LoggedGuard prevents logged in users from accessing routes that are
 * meant for unauthenticated users.
 *
 * @returns {boolean} true if the user is not logged in, false otherwise
 */
export const LoggedGuard: CanActivateFn = async (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);
  if (userService._session()) {
    const isRegisterPage = state.url.includes('registro');
    const userEmailVerified =
      userService._session()?.user_metadata['email_verified'];
    //Cuando un usuario se registra, se le envía un correo de verificación.
    //Al hacer clic en el enlace de verificación, se redirige a la página de registro asignandolo al paso n°3
    if (userEmailVerified && isRegisterPage) {
      return true;
    }

    router.navigate(['/']);
    return false;
  }

  return true;
};
