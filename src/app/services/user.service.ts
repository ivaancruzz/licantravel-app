import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import {
  AuthSession,
  FunctionsHttpError,
  User,
  UserResponse,
} from '@supabase/supabase-js';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  transferStateKey = 'user';
  _session: AuthSession | null = null;

  constructor(
    private supabaseService: SupabaseService,
    private httpClient: HttpClient
  ) {}

  async signIn(email: string, password: string) {
    new Promise((resolve, reject) => {
      this.httpClient.post('/login', { email, password }).subscribe(
        () => {
          location.href = '/';
        },
        (error) => reject(error)
      );
    });
  }

  signOut() {
    new Promise((resolve, reject) => {
      this.httpClient.get('/signout').subscribe(
        () => {
          location.href = '/';
        },
        (error) => reject(error)
      );
    });
  }

  async getSession(): Promise<AuthSession | null> {
    const { data, error } = await this.supabaseService.getData<{
      session: AuthSession;
    }>('user', (client) => client.auth.getSession());
    console.log(data);

    if (error) throw error;

    this._session = data.session;

    if (error) throw error;

    return this._session;
  }

  async getUser(): Promise<User | null> {
    const { data, error } = await this.supabaseService.getData<{
      user: User | null;
    }>('user', (client) => client.auth.getUser());

    if (error && error instanceof FunctionsHttpError) {
      const errorMessage = await error.context.json();
      throw errorMessage;
    }

    return data.user;
  }
}
