import { createAdminVerification, verifyAdminCode } from '@/_entities/auth/service/admin-verification.service';
import { signIn } from '@/_entities/auth/service/signin.service';
import { signOut } from '@/_entities/auth/service/signout.service';
import { signUp, signUpAdmin } from '@/_entities/auth/service/signup.service';
import { updateTempPassword, resetPasswordAndSendEmail, resetPasswordWithTemp } from '@/_entities/auth/service/temp-password.service';
import { verifySession } from '@/_entities/auth/service/verify-session.service';

// 분리된 서비스 함수들을 객체로 export
export const authService = {
  signUp,
  signUpAdmin,
  createAdminVerification,
  verifyAdminCode,
  signIn,
  verifySession,
  signOut,
  updateTempPassword,
  resetPasswordAndSendEmail,
  resetPasswordWithTemp,
};

// export class AuthService {
//   static async signUp(signUpData: SignUpData): PrismaReturn<UserWithOmitPassword | null> {
//     return signUpAction(signUpData);
//   }

//   static async signUpAdmin(signUpData: AdminSignUpData): PrismaReturn<UserWithOmitPassword | null> {
//     return signUpAdminAction(signUpData);
//   }

//   static async signIn(signInData: SignInData): PrismaReturn<AuthResult | null> {
//     return signInAction(signInData);
//   }

//   static async verifySession(accessToken: string, refreshToken: string): PrismaReturn<AuthResult | null> {
//     return verifySessionAction(accessToken, refreshToken);
//   }

//   static async signOut(userId: string): PrismaReturn<boolean> {
//     return signOutAction(userId);
//   }

//   static async createAdminVerification(): PrismaReturn<boolean> {
//     return createAdminVerificationAction();
//   }

//   static async verifyAdminCode(code: string): PrismaReturn<boolean> {
//     return verifyAdminCodeAction(code);
//   }
// }
