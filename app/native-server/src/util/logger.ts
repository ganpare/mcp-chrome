// import { stderr } from 'process';
// import * as fs from 'fs';
// import * as path from 'path';

// // ログファイルパスを設定
// const LOG_DIR = path.join(
//   '/Users/hang/code/ai/chrome-mcp-server/app/native-server/dist/',
//   '.debug-log',
// ); // 異なるディレクトリを使用して区別
// const LOG_FILE = path.join(
//   LOG_DIR,
//   `native-host-${new Date().toISOString().replace(/:/g, '-')}.log`,
// );
// // ログディレクトリが存在することを確保
// if (!fs.existsSync(LOG_DIR)) {
//   try {
//     fs.mkdirSync(LOG_DIR, { recursive: true });
//   } catch (err) {
//     stderr.write(`[ERROR] ログディレクトリの作成に失敗: ${err}\n`);
//   }
// }

// // ログ関数
// function writeLog(level: string, message: string): void {
//   const timestamp = new Date().toISOString();
//   const logMessage = `[${timestamp}] [${level}] ${message}\n`;

//   // ファイルに書き込み
//   try {
//     fs.appendFileSync(LOG_FILE, logMessage);
//   } catch (err) {
//     stderr.write(`[ERROR] ログの書き込みに失敗: ${err}\n`);
//   }

//   // 同時にstderrに出力（native messagingプロトコルに影響しない）
//   stderr.write(logMessage);
// }

// // ログレベル関数
// export const logger = {
//   debug: (message: string) => writeLog('DEBUG', message),
//   info: (message: string) => writeLog('INFO', message),
//   warn: (message: string) => writeLog('WARN', message),
//   error: (message: string) => writeLog('ERROR', message),
// };
