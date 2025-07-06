export enum NATIVE_MESSAGE_TYPE {
  START = 'start',
  STARTED = 'started',
  STOP = 'stop',
  STOPPED = 'stopped',
  PING = 'ping',
  PONG = 'pong',
  ERROR = 'error',
}

export const NATIVE_SERVER_PORT = 56889;

// タイムアウト定数（ミリ秒）
export const TIMEOUTS = {
  DEFAULT_REQUEST_TIMEOUT: 15000,
  EXTENSION_REQUEST_TIMEOUT: 20000,
  PROCESS_DATA_TIMEOUT: 20000,
} as const;

// サーバー設定
export const SERVER_CONFIG = {
  HOST: '127.0.0.1',
  CORS_ORIGIN: true,
  LOGGER_ENABLED: false,
} as const;

// HTTPステータスコード
export const HTTP_STATUS = {
  OK: 200,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  INTERNAL_SERVER_ERROR: 500,
  GATEWAY_TIMEOUT: 504,
} as const;

// エラーメッセージ
export const ERROR_MESSAGES = {
  NATIVE_HOST_NOT_AVAILABLE: 'ネイティブホスト接続が確立されていません。',
  SERVER_NOT_RUNNING: 'サーバーが実行されていません。',
  REQUEST_TIMEOUT: '拡張機能へのリクエストがタイムアウトしました。',
  INVALID_MCP_REQUEST: '無効なMCPリクエストまたはセッションです。',
  INVALID_SESSION_ID: '無効または欠落したMCPセッションIDです。',
  INTERNAL_SERVER_ERROR: '内部サーバーエラー',
  MCP_SESSION_DELETION_ERROR: 'MCPセッション削除中に内部サーバーエラーが発生しました。',
  MCP_REQUEST_PROCESSING_ERROR: 'MCPリクエスト処理中に内部サーバーエラーが発生しました。',
  INVALID_SSE_SESSION: 'SSE用のMCPセッションIDが無効または欠落しています。',
} as const;
