import { app } from '@/_libs/tools/config.loader';

export function Home() {
  return (
    <div>
      <h1>{app.public.site.title}</h1>
      <p>{app.public.site.description}</p>
      <p>
        Version:
        {app.public.global.version}
      </p>
    </div>
  );
}
