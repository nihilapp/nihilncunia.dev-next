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
