import { Injectable, signal } from '@angular/core';
import { SupabaseService } from './supabase.service';
import {
  AuthSession,
  FunctionsHttpError,
  SignOut,
  SignUpWithPasswordCredentials,
  User,
  UserResponse,
} from '@supabase/supabase-js';
import { HttpClient } from '@angular/common/http';
import { rejects } from 'assert';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  transferStateKey = 'user';
  _session = signal<AuthSession | null>(null);
  _isAuthenticated = signal<boolean>(false);

  constructor(
    private supabaseService: SupabaseService,
    private httpClient: HttpClient
  ) {}

  async signIn(email: string, password: string) {
    new Promise((resolve, reject) => {
      this.httpClient.post('/login', { email, password }).subscribe(
        async () => {
          const { data, error } =
            await this.supabaseService.clientBrowser.auth.signInWithPassword({
              email,
              password,
            });
          if (error) reject(error);

          // location.href = '/';
        },
        (error) => reject(error)
      );
    });
  }

  signOut() {
    new Promise((resolve, reject) => {
      this.httpClient.get('/signout').subscribe(
        async () => {
          const { error } =
            await this.supabaseService.clientBrowser.auth.signOut();

          if (error) reject(error);

          // location.href = '/';
        },
        (error) => reject(error)
      );
    });
  }

  async register(body: SignUpWithPasswordCredentials) {
    const { data, error } = await this.supabaseService.client.auth.signUp(body);

    if (error) throw error;

    return data;
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
}
