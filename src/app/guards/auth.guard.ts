import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Role, UserService } from '../services/user.service';
import { SupabaseService } from '../services/supabase.service';

/**
 * Auth guard function to determine if a route can be activated.
 * - Returns false if the request is from the server.
 * - Fetches the current user and checks their role.
 * - Redirects to '/escanear' and returns false if the user's role is 'provider'.
 * - Returns true if the user is allowed to access the route.
 *
 * @param route - The activated route snapshot.
 * @param state - The router state snapshot.
 * @returns A promise that resolves to a boolean indicating if the route can be activated.
 */

export const AuthGuard: CanActivateFn = async (route, state) => {
  const userService = inject(UserService);
  const supabaseService = inject(SupabaseService);
  const router = inject(Router);

  const session = userService._session();

  if (supabaseService.isServer) return false;

  if (session) {
    const urlAcceptInvitation = route.url[0].path === 'aceptar-invitacion';
    if (urlAcceptInvitation && session.user_metadata['is_active'] === false)
      // Si el usuario acepta una invitación por correo,
      // se le permite el acceso. Esto se debe a que los enlaces de invitación generan una sesión válida,
      // por lo que no queremos redirigirlo a la página de inicio, sino generar una contraseña.
      return true;

    router.navigate(['/']);
    return false;
  }

  return !!userService._session();
};
