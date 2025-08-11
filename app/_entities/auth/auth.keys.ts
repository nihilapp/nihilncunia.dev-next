export const authKeys = {
  all: () => [ 'auth', ] as const,
  session: () => [
    ...authKeys.all(),
    'session',
  ] as const,
  signin: () => [
    ...authKeys.all(),
    'signin',
  ] as const,
  signup: () => [
    ...authKeys.all(),
    'signup',
  ] as const,
};
