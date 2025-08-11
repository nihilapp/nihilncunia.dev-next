export const userKeys = {
  users: () => [ 'users', ] as const,
  all: () => [
    ...userKeys.users(),
    'list',
  ] as const,
  detail: (id: string) => [
    ...userKeys.users(),
    'detail',
    id,
  ] as const,
};
