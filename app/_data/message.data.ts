export const messageData = {
  common: {
    success: '요청이 성공적으로 처리되었습니다.',
    error: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
    unauthorized: '권한이 없습니다.',
    forbidden: '접근이 금지되었습니다.',
    notFound: '요청한 리소스를 찾을 수 없습니다.',
    invalidRequest: '잘못된 요청입니다.',
    alreadyExists: '이미 존재하는 항목입니다.',
    deleted: '성공적으로 삭제되었습니다.',
  },

  auth: {
    signUpSuccess: '회원가입이 완료되었습니다.',
    signUpError: '회원가입 중 오류가 발생했습니다.',
    signInSuccess: '로그인되었습니다.',
    signInError: '로그인 중 오류가 발생했습니다.',
    signOutSuccess: '로그아웃되었습니다.',
    emailInUse: '이미 등록된 이메일입니다.',
    invalidCredentials: '이메일 또는 비밀번호가 올바르지 않습니다.',
    sessionExpired: '세션이 만료되었습니다. 다시 로그인해주세요.',
    alreadyExists: '이미 존재하는 계정입니다.',
    notFound: '계정을 찾을 수 없습니다.',
    deleted: '계정이 삭제되었습니다.',
    invalidInput: '이메일, 사용자명, 비밀번호는 필수 입력 항목입니다.',
  },

  profile: {
    // 조회 관련
    getSuccess: '프로필 정보를 조회했습니다.',
    getError: '프로필 정보 조회에 실패했습니다.',
    getByEmailSuccess: '이메일로 프로필을 조회했습니다.',
    getByEmailError: '이메일로 프로필 조회에 실패했습니다.',
    listSuccess: '프로필 목록을 조회했습니다.',
    listError: '프로필 목록 조회에 실패했습니다.',
    notFound: '해당 프로필을 찾을 수 없습니다.',

    // 생성/수정 관련
    createSuccess: '프로필이 생성되었습니다.',
    createError: '프로필 생성 중 오류가 발생했습니다.',
    updateSuccess: '프로필 정보가 수정되었습니다.',
    updateError: '프로필 정보 수정 중 오류가 발생했습니다.',

    // 삭제 관련
    deleteSuccess: '프로필이 삭제되었습니다.',
    deleteError: '프로필 삭제 중 오류가 발생했습니다.',
    deleteMultipleSuccess: '선택한 프로필들이 삭제되었습니다.',
    deleteMultipleError: '다중 프로필 삭제 중 오류가 발생했습니다.',

    // 중복 체크 관련
    emailExists: '해당 이메일은 이미 사용 중입니다.',
    usernameExists: '해당 사용자명은 이미 존재합니다.',

    // 비밀번호 관련
    passwordChangeSuccess: '비밀번호가 변경되었습니다.',
    passwordChangeError: '비밀번호 변경 중 오류가 발생했습니다.',
    invalidPassword: '현재 비밀번호가 올바르지 않습니다.',

    // 이미지 관련
    imageChangeSuccess: '프로필 이미지가 변경되었습니다.',
    imageChangeError: '프로필 이미지 변경 중 오류가 발생했습니다.',
  },
};
