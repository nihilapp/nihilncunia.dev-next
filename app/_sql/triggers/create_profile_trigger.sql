-- 함수가 존재하지 않으면 생성
CREATE OR REPLACE FUNCTION public.create_profile_trigger()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET SEARCH_PATH = ''
AS $$
BEGIN
  -- 이메일 제공자를 통한 회원가입인지 확인
  IF new.raw_app_meta_data IS NOT NULL THEN
    IF new.raw_app_meta_data ? 'provider'
      AND new.raw_app_meta_data ->> 'provider' = 'email' THEN
      IF new.raw_user_meta_data ? 'username' THEN
        INSERT INTO public.profiles (
          profile_id,
          email,
          username,
          role
        )
        VALUES (
          new.id,
          new.email,
          new.raw_user_meta_data ->> 'username',
          COALESCE((new.raw_user_meta_data ->> 'role')::public.profile_role, 'USER'::public.profile_role)
        );
      END IF;
    END IF;
  END IF;

  RETURN new;
END;
$$;

-- 트리거가 존재하지 않으면 생성
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'create_profile_trigger'
  ) THEN
    CREATE TRIGGER create_profile_trigger
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.create_profile_trigger();
  END IF;
END;
$$;

-- 트리거 함수에 대한 권한 부여
GRANT EXECUTE ON FUNCTION public.create_profile_trigger() TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_profile_trigger() TO service_role;
