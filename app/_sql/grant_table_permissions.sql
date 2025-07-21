-- profiles 테이블에 대한 권한 부여
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

-- RLS(Row Level Security) 정책이 있다면 추가 권한이 필요할 수 있음
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;
