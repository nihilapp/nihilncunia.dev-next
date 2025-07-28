import React from 'react';

import { Home } from '@/(common)/_components';
import { setMeta } from '@/_libs';
import { createActionClient } from '@/_libs/server/supabase';

export const metadata = setMeta({
  title: `대시보드`,
  url: `/`,
});

async function getSession() {
  try {
    const supabase = await createActionClient();
    const { data: { session, }, error, } = await supabase.auth.getSession();

    if (error) {
      console.error('Session error:', error);
      return null;
    }

    return session;
  }
  catch (error) {
    console.error('Failed to get session:', error);
    return null;
  }
}

export default async function IndexPage() {
  const session = await getSession();

  return (
    <Home session={session} />
  );
}
