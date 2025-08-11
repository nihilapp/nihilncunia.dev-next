export const authKeys = {
  all: () => [ 'auth', ] as const,
  signUp: () => [
    ...authKeys.all(),
    'signUp',
  ] as const,
  signIn: () => [
    ...authKeys.all(),
    'signIn',
  ] as const,
  signOut: () => [
    ...authKeys.all(),
    'signOut',
  ] as const,
  session: () => [
    ...authKeys.all(),
    'session',
  ] as const,
  resetPassword: () => [
    ...authKeys.all(),
    'resetPassword',
  ] as const,
  verifyEmail: () => [
    ...authKeys.all(),
    'verifyEmail',
  ] as const,
  otp: () => [
    ...authKeys.all(),
    'otp',
  ] as const,
};
