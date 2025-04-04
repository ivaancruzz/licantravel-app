import { Role } from '../../../services/user.service';

export interface Nav {
  label: string;
  permissions: string[];
  href?: string;
  icon?: string;
  link?: boolean;
  submenu?: {
    label: string;
    href: string;
    permissions: string[];
  }[];
}
export const NAV: Nav[] = [
  {
    label: 'Mis compras',
    href: '/mis-compras',
    icon: '@tui.shopping-bag',
    permissions: [Role.client],
  },
  {
    label: 'Mis tickets',
    href: '/mis-tickets',
    icon: '@tui.ticket',
    permissions: [Role.client],
  },
  {
    label: 'Panel de control',
    href: '',
    icon: '@tui.shield',
    link: true,
    permissions: [Role.supervisor, Role.superadmin],
  },
  {
    label: 'Escanear',
    href: '/escanear',
    icon: '@tui.scan',
    permissions: [Role.provider],
  },
  {
    label: 'Ajustes',
    href: 'ajustes',
    icon: '@tui.settings-2',
    permissions: [Role.client, Role.provider],
    submenu: [
      {
        label: 'Mis datos',
        href: 'ajustes/mis-datos',
        permissions: [Role.client, Role.provider],
      },
      {
        label: 'Cambiar contraseña',
        href: 'ajustes/cambiar-clave',
        permissions: [Role.client, Role.provider],
      },
    ],
  },
];
