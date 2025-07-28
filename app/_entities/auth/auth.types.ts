import type { User } from '@supabase/supabase-js';

import type { Profile } from '@/_entities/profiles';

export type UserSession = User & Profile;

export type ActionError = {
  code: string;
  message: string;
};

export type ActionResult<T>
  = | { success: true; data: T }
    | { success: false; error: ActionError };

export type SignUpFormState = {
  step: number;
  message: string;
};

export type SignUpData = {
  email: string;
  username: string;
  password: string;
  role: string;
};

export type RateLimitData = {
  attempts: number;
  firstAttempt: number;
  lockUntil?: number;
};

export type RateLimitResult = {
  allowed: boolean;
  attemptsLeft: number;
  lockTimeLeft: number;
  message: string;
};

export type AuthErrorInfo = {
  componentStack: string;
  errorBoundary: string;
  eventType: string;
};
