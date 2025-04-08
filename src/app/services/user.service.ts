import { Injectable, signal } from '@angular/core';
import { SupabaseService } from './supabase.service';
import {
  AuthResponse,
  AuthSession,
  FunctionsHttpError,
  Session,
  SignOut,
  SignUpWithPasswordCredentials,
  User,
  UserMetadata,
  UserResponse,
} from '@supabase/supabase-js';
import { rejects } from 'assert';
import { Tables, TablesUpdate } from '../lib/database.types';

export enum Role {
  anon = 'anon',
  superadmin = 'lican_superadmin',
  supervisor = 'lican_admin',
  provider = 'lican_provider',
  client = 'authenticated',
}

export enum Gender {
  male = 'male',
  female = 'female',
  other = 'other',
}

export interface MetadataAdmin extends UserMetadata {
  first_name: string;
  last_name: string;
  is_active: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  transferStateKey = 'user';
  _session = signal<User | undefined | null>(undefined);
  _isAuthenticated = signal<boolean>(false);

  constructor(private supabaseService: SupabaseService) {}

  async signIn(email: string, password: string) {
    const { data, error } =
      await this.supabaseService.clientBrowser.auth.signInWithPassword({
        email,
        password,
      });
    if (error) throw error;

    return data;
  }

  async signOut() {
    const { error } = await this.supabaseService.clientBrowser.auth.signOut();

    if (error) throw error;
  }

  async register(body: SignUpWithPasswordCredentials) {
    const { data, error } =
      await this.supabaseService.clientBrowser.auth.signUp(body);

    if (error) throw error;

    return data;
  }

  async updateUser(body: TablesUpdate<'clients'>) {
    const { data, error } =
      await this.supabaseService.clientBrowser.auth.updateUser({
        data: body,
      });

    if (error) throw error;
  }
  async getUser(): Promise<{
    user: User | null;
    session: Session | null;
  } | null> {
    const { data, error } = await this.supabaseService.getData<{
      user: User | null;
      session: Session | null;
    }>('user', (client) => client.auth.getUser());

    if (error) {
      throw error;
    }

    this._session.set(data?.user);

    return data;
  }

  async getSession(): Promise<
    | {
        session: AuthSession;
      }
    | {
        session: null;
      }
  > {
    const { data, error } =
      await this.supabaseService.clientBrowser.auth.getSession();

    if (error) throw error;

    return data;
  }

  async confirmAccount(userId: string) {
    const table =
      this._session()?.role === Role.client ? 'clients' : 'providers';

    const { error } = await this.supabaseService.clientBrowser
      .from(table)
      .update({ is_active: true })
      .eq('user_id', this._session()?.id);

    if (error) throw error;
  }

  async resendEmailConfirmation(email: string): Promise<void> {
    const { error } = await this.supabaseService.clientBrowser.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${location.origin}/registro`,
      },
    });

    if (error && error instanceof FunctionsHttpError) {
      const errorMessage = await error.context.json();
      throw errorMessage;
    }
  }

  async recoveryPassword(email: string) {
    const { error } =
      await this.supabaseService.clientBrowser.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: `${location.origin}/ajustes/cambiar-clave`,
        },
      );

    if (error && error instanceof FunctionsHttpError) {
      const errorMessage = await error.context.json();
      throw errorMessage;
    }
  }

  async updatePassoword(password: string) {
    const { error } = await this.supabaseService.clientBrowser.auth.updateUser({
      password,
    });

    if (error) throw error;
  }

  async getClientProfile(): Promise<Tables<'clients'> | null> {
    const { data, error } = await this.supabaseService.clientBrowser
      .from('clients')
      .select('*')
      .eq('user_id', this._session()?.id)
      .single();

    console.log(data, error);

    if (error) throw error;

    return data;
  }

  async updateProfile(body: TablesUpdate<'clients'>) {
    const { error } = await this.supabaseService.clientBrowser
      .from('clients')
      .update(body)
      .eq('user_id', this._session()?.id);

    if (error) throw error;
  }

  async acceptInvitation(password: string) {
    const { data, error } =
      await this.supabaseService.clientBrowser.auth.updateUser({
        password,
      });

    return data;
  }
}
