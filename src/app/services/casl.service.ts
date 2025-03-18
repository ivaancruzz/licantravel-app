import { Inject, Injectable } from '@angular/core';
import {
  AbilityBuilder,
  createMongoAbility,
  MongoAbility,
  PureAbility,
} from '@casl/ability';
import { Role } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class CaslService {
  constructor(@Inject(PureAbility) private ability: MongoAbility) {}

  updateAbility(role: Role) {
    const { can, cannot, rules } = new AbilityBuilder(createMongoAbility);

    if (role === Role.provider) {
      can('scan', 'Ticket');
      can('adjust', 'Account');
    } else if (role === Role.client) {
      can('read', 'Sale');
      can('read', 'Ticket');
      can('adjust', 'Account');
      can('create', 'Help');
      can('read', 'Product');
      can('buy', 'Cart');
      can('view', 'Footer');
    } else if (role === Role.superadmin || role === Role.supervisor) {
      can('administrate', 'App');
      can('read', 'Product');
      can('view', 'Footer');
    } else {
      //Anon
      can('buy', 'Cart');
      can('read', 'Product');
      can('view', 'Footer');
    }

    this.ability.update(rules);
  }

  removeAbility() {
    this.ability.update([]);
  }
}
