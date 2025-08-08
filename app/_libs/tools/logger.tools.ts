/**
 * 애플리케이션 로깅 유틸리티
 * 구조화된 로그 메시지와 컨텍스트 정보를 제공합니다.
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogContext {
  [key: string]: any;
}

interface LogMessage {
  level: LogLevel;
  category: string;
  message: string;
  context?: LogContext;
  timestamp: string;
}

export class Logger {
  private static formatTimestamp(): string {
    return new Date().toISOString();
  }

  private static formatMessage(
    level: LogLevel,
    category: string,
    message: string,
    context?: LogContext
  ): LogMessage {
    return {
      level,
      category,
      message,
      context,
      timestamp: this.formatTimestamp(),
    };
  }

  private static log(logMessage: LogMessage): void {
    const { level, category, message, context, timestamp, } = logMessage;
    const prefix = `[${timestamp}] [${level.toUpperCase()}] [${category}]`;

    switch (level) {
    case 'error':
      console.error(prefix, message, context || '');
      break;
    case 'warn':
      console.warn(prefix, message, context || '');
      break;
    case 'debug':
      if (process.env.NODE_ENV === 'development') {
        console.debug(prefix, message, context || '');
      }
      break;
    default:
      console.log(prefix, message, context || '');
    }
  }

  /**
   * API 요청 시작 로그
   */
  static apiRequest(method: string, path: string, context?: LogContext): void {
    this.log(this.formatMessage('info', 'API', `${method} ${path} 요청 시작`, context));
  }

  /**
   * API 요청 성공 로그
   */
  static apiSuccess(method: string, path: string, context?: LogContext): void {
    this.log(this.formatMessage('info', 'API', `${method} ${path} 요청 성공`, context));
  }

  /**
   * API 요청 실패 로그
   */
  static apiError(method: string, path: string, error: string, context?: LogContext): void {
    this.log(this.formatMessage('error', 'API', `${method} ${path} 요청 실패: ${error}`, context));
  }

  /**
   * 인증 관련 로그
   */
  static auth(message: string, context?: LogContext): void {
    this.log(this.formatMessage('info', 'AUTH', message, context));
  }

  /**
   * 인증 에러 로그
   */
  static authError(message: string, context?: LogContext): void {
    this.log(this.formatMessage('error', 'AUTH', message, context));
  }

  /**
   * 세션 관련 로그
   */
  static session(message: string, context?: LogContext): void {
    this.log(this.formatMessage('info', 'SESSION', message, context));
  }

  /**
   * 세션 에러 로그
   */
  static sessionError(message: string, context?: LogContext): void {
    this.log(this.formatMessage('error', 'SESSION', message, context));
  }

  /**
   * 데이터베이스 관련 로그
   */
  static database(message: string, context?: LogContext): void {
    this.log(this.formatMessage('info', 'DB', message, context));
  }

  /**
   * 데이터베이스 에러 로그
   */
  static databaseError(message: string, context?: LogContext): void {
    this.log(this.formatMessage('error', 'DB', message, context));
  }

  /**
   * 일반 정보 로그
   */
  static info(category: string, message: string, context?: LogContext): void {
    this.log(this.formatMessage('info', category, message, context));
  }

  /**
   * 경고 로그
   */
  static warn(category: string, message: string, context?: LogContext): void {
    this.log(this.formatMessage('warn', category, message, context));
  }

  /**
   * 에러 로그
   */
  static error(category: string, message: string, context?: LogContext): void {
    this.log(this.formatMessage('error', category, message, context));
  }

  /**
   * 디버그 로그 (개발 환경에서만 출력)
   */
  static debug(category: string, message: string, context?: LogContext): void {
    this.log(this.formatMessage('debug', category, message, context));
  }

  /**
   * 사용자 액션 로그
   */
  static userAction(action: string, userId?: string, context?: LogContext): void {
    const userContext = userId
      ? {
        userId,
        ...context,
      }
      : context;
    this.log(this.formatMessage('info', 'USER', `사용자 액션: ${action}`, userContext));
  }

  /**
   * 보안 관련 로그
   */
  static security(message: string, context?: LogContext): void {
    this.log(this.formatMessage('warn', 'SECURITY', message, context));
  }
}
