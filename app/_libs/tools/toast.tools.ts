import { toast } from 'sonner';

export class ToastHelper {
  /**
   * 성공 메시지 표시
   * @param message 표시할 메시지
   * @param options 추가 옵션
   */
  static success(message: string, options?: { duration?: number }) {
    return toast.success(message, {
      duration: options?.duration || 3000,
    });
  }

  /**
   * 에러 메시지 표시
   * @param message 표시할 메시지
   * @param options 추가 옵션
   */
  static error(message: string, options?: { duration?: number }) {
    return toast.error(message, {
      duration: options?.duration || 5000,
    });
  }

  /**
   * 정보 메시지 표시
   * @param message 표시할 메시지
   * @param options 추가 옵션
   */
  static info(message: string, options?: { duration?: number }) {
    return toast.info(message, {
      duration: options?.duration || 3000,
    });
  }

  /**
   * 경고 메시지 표시
   * @param message 표시할 메시지
   * @param options 추가 옵션
   */
  static warning(message: string, options?: { duration?: number }) {
    return toast.warning(message, {
      duration: options?.duration || 4000,
    });
  }

  /**
   * 로딩 메시지 표시
   * @param message 표시할 메시지
   * @returns 토스트 ID (나중에 업데이트/제거용)
   */
  static loading(message: string) {
    return toast.loading(message);
  }

  /**
   * 로딩 토스트를 성공으로 업데이트
   * @param toastId 토스트 ID
   * @param message 성공 메시지
   */
  static updateSuccess(toastId: string | number, message: string) {
    toast.success(message, { id: toastId, });
  }

  /**
   * 로딩 토스트를 에러로 업데이트
   * @param toastId 토스트 ID
   * @param message 에러 메시지
   */
  static updateError(toastId: string | number, message: string) {
    toast.error(message, { id: toastId, });
  }

  /**
   * 토스트 제거
   * @param toastId 토스트 ID
   */
  static dismiss(toastId: string | number) {
    toast.dismiss(toastId);
  }
}
