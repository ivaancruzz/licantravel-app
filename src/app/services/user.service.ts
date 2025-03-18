import { Injectable, signal } from '@angular/core';
import { SupabaseService } from './supabase.service';
import {
  AuthSession,
  FunctionsHttpError,
  SignOut,
  SignUpWithPasswordCredentials,
  User,
  UserMetadata,
  UserResponse,
} from '@supabase/supabase-js';
import { HttpClient } from '@angular/common/http';
import { rejects } from 'assert';
import { TablesUpdate } from '../lib/database.types';

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
  _session = signal<AuthSession | null>(null);
  _isAuthenticated = signal<boolean>(false);

  constructor(
    private supabaseService: SupabaseService,
    private httpClient: HttpClient,
  ) {}

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

  async updateUser(body: TablesUpdate<'client'>) {
    const { data, error } =
      await this.supabaseService.clientBrowser.auth.updateUser({
        data: body,
      });

    if (error) throw error;
  }
  async getUser(): Promise<User | null> {
    const { data, error } = await this.supabaseService.getData<{
      user: User | null;
    }>('user', (client) => client.auth.getUser());

    if (error && error instanceof FunctionsHttpError) {
      const errorMessage = await error.context.json();

      throw errorMessage;
    }

    return data?.user;
  }

  async confirmAccount(userId: string) {
    const { data, error } = await this.supabaseService.clientBrowser
      .from('client')
      .update({ is_active: true })
      .eq('user_id', userId);
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
          redirectTo: `${location.origin}/cambiar-clave`,
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

    if (error && error instanceof FunctionsHttpError) {
      const errorMessage = await error.context.json();
      throw errorMessage;
    }
  }

  async acceptInvitation(password: string) {
    const { data, error } =
      await this.supabaseService.clientBrowser.functions.invoke(
        'accept_invitation',
        {
          body: {
            password,
          },
        },
      );

    if (error && error instanceof FunctionsHttpError) {
      const errorMessage = await error.context.json();
      throw errorMessage;
    }

    return data;
  }
}
