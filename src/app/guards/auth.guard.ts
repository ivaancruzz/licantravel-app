import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Role, UserService } from '../services/user.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const userSrvice = inject(UserService);
  const router = inject(Router);

  const user = await userSrvice.getUser();

  if (user?.role === Role.provider) {
    router.navigate(['/escanear']);
    return false;
  }

  return true;
};
