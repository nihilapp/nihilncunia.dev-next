import type { User } from '@supabase/supabase-js';

import type { Profile } from '@/_entities/profiles';

export type UserSession = User & Profile;
