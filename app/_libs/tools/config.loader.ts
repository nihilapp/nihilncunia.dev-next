import publicConfig from '@/_config/public.config.json';

// 앱 설정 (클라이언트에서 사용 가능)
export const app = {
  public: publicConfig,
  server: {
    ...publicConfig,
    nodemailer: {
      provider: {
        name: 'smtp.naver.com',
        port: 587,
        secure: true,
        auth: {
          user: '',
          pass: '',
        },
      },
    },
    supabase: {
      public: {
        url: '',
        public_key: '',
      },
      secret: {
        db_password: '',
        secret_key: '',
      },
    },
  },
};

// 타입 정의
export type PublicConfig = typeof publicConfig;
export type ServerConfig = typeof app.server;
export type AppConfig = typeof app;

// 서버에서만 사용할 수 있는 전체 설정 (민감한 정보 포함)
export async function getServerConfig() {
  try {
    const privateConfig = await import('@/_config/private.config.json');

    return {
      public: publicConfig,
      server: {
        ...publicConfig,
        ...privateConfig.default,
      },
    };
  }
  catch {
    console.warn('private.config.json 파일을 찾을 수 없습니다. 공개 설정만 사용합니다.');

    return app;
  }
}

// 편의를 위한 별칭
export const publicConfigExport = app.public;
export const serverConfig = app.server;
