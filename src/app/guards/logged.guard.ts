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
    if (userService._session()?.user_metadata['email_verified']) {
      return true;
    }

    router.navigate(['/']);
    return false;
  }

  return true;
};
