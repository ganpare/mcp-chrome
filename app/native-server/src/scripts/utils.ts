import fs from 'fs';
import path from 'path';
import os from 'os';
import { execSync } from 'child_process';
import { promisify } from 'util';
import { COMMAND_NAME, DESCRIPTION, EXTENSION_ID, HOST_NAME } from './constant';

export const access = promisify(fs.access);
export const mkdir = promisify(fs.mkdir);
export const writeFile = promisify(fs.writeFile);

/**
 * カラーテキストを出力
 */
export function colorText(text: string, color: string): string {
  const colors: Record<string, string> = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m',
  };

  return colors[color] + text + colors.reset;
}

/**
 * Get user-level manifest file path
 */
export function getUserManifestPath(): string {
  if (os.platform() === 'win32') {
    // Windows: %APPDATA%\Google\Chrome\NativeMessagingHosts\
    return path.join(
      process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming'),
      'Google',
      'Chrome',
      'NativeMessagingHosts',
      `${HOST_NAME}.json`,
    );
  } else if (os.platform() === 'darwin') {
    // macOS: ~/Library/Application Support/Google/Chrome/NativeMessagingHosts/
    return path.join(
      os.homedir(),
      'Library',
      'Application Support',
      'Google',
      'Chrome',
      'NativeMessagingHosts',
      `${HOST_NAME}.json`,
    );
  } else {
    // Linux: ~/.config/google-chrome/NativeMessagingHosts/
    return path.join(
      os.homedir(),
      '.config',
      'google-chrome',
      'NativeMessagingHosts',
      `${HOST_NAME}.json`,
    );
  }
}

/**
 * Get system-level manifest file path
 */
export function getSystemManifestPath(): string {
  if (os.platform() === 'win32') {
    // Windows: %ProgramFiles%\Google\Chrome\NativeMessagingHosts\
    return path.join(
      process.env.ProgramFiles || 'C:\\Program Files',
      'Google',
      'Chrome',
      'NativeMessagingHosts',
      `${HOST_NAME}.json`,
    );
  } else if (os.platform() === 'darwin') {
    // macOS: /Library/Google/Chrome/NativeMessagingHosts/
    return path.join('/Library', 'Google', 'Chrome', 'NativeMessagingHosts', `${HOST_NAME}.json`);
  } else {
    // Linux: /etc/opt/chrome/native-messaging-hosts/
    return path.join('/etc', 'opt', 'chrome', 'native-messaging-hosts', `${HOST_NAME}.json`);
  }
}

/**
 * Get native host startup script file path
 */
export async function getMainPath(): Promise<string> {
  try {
    const packageDistDir = path.join(__dirname, '..');
    const wrapperScriptName = process.platform === 'win32' ? 'run_host.bat' : 'run_host.sh';
    const absoluteWrapperPath = path.resolve(packageDistDir, wrapperScriptName);
    return absoluteWrapperPath;
  } catch (error) {
    console.log(colorText('Cannot find global package path, using current directory', 'yellow'));
    throw error;
  }
}

/**
 * 重要ファイルの実行権限を確保
 */
export async function ensureExecutionPermissions(): Promise<void> {
  try {
    const packageDistDir = path.join(__dirname, '..');

    if (process.platform === 'win32') {
      // Windowsプラットフォームの処理
      await ensureWindowsFilePermissions(packageDistDir);
      return;
    }

    // Unix/Linuxプラットフォームの処理
    const filesToCheck = [
      path.join(packageDistDir, 'index.js'),
      path.join(packageDistDir, 'run_host.sh'),
      path.join(packageDistDir, 'cli.js'),
    ];

    for (const filePath of filesToCheck) {
      if (fs.existsSync(filePath)) {
        try {
          fs.chmodSync(filePath, '755');
          console.log(
            colorText(`✓ Set execution permissions for ${path.basename(filePath)}`, 'green'),
          );
        } catch (err: any) {
          console.warn(
            colorText(
              `⚠️ Unable to set execution permissions for ${path.basename(filePath)}: ${err.message}`,
              'yellow',
            ),
          );
        }
      } else {
        console.warn(colorText(`⚠️ File not found: ${filePath}`, 'yellow'));
      }
    }
  } catch (error: any) {
    console.warn(colorText(`⚠️ Error ensuring execution permissions: ${error.message}`, 'yellow'));
  }
}

/**
 * Windowsプラットフォームファイル権限処理
 */
async function ensureWindowsFilePermissions(packageDistDir: string): Promise<void> {
  const filesToCheck = [
    path.join(packageDistDir, 'index.js'),
    path.join(packageDistDir, 'run_host.bat'),
    path.join(packageDistDir, 'cli.js'),
  ];

  for (const filePath of filesToCheck) {
    if (fs.existsSync(filePath)) {
      try {
        // ファイルが読み取り専用かどうかをチェックし、読み取り専用の場合は読み取り専用属性を削除
        const stats = fs.statSync(filePath);
        if (!(stats.mode & parseInt('200', 8))) {
          // 書き込み権限をチェック
          // 読み取り専用属性を削除しようとする
          fs.chmodSync(filePath, stats.mode | parseInt('200', 8));
          console.log(
            colorText(`✓ Removed read-only attribute from ${path.basename(filePath)}`, 'green'),
          );
        }

        // ファイルの読み取り可能性を検証
        fs.accessSync(filePath, fs.constants.R_OK);
        console.log(
          colorText(`✓ Verified file accessibility for ${path.basename(filePath)}`, 'green'),
        );
      } catch (err: any) {
        console.warn(
          colorText(
            `⚠️ Unable to verify file permissions for ${path.basename(filePath)}: ${err.message}`,
            'yellow',
          ),
        );
      }
    } else {
      console.warn(colorText(`⚠️ File not found: ${filePath}`, 'yellow'));
    }
  }
}

/**
 * Create Native Messaging host manifest content
 */
export async function createManifestContent(): Promise<any> {
  const mainPath = await getMainPath();

  return {
    name: HOST_NAME,
    description: DESCRIPTION,
    path: mainPath, // Node.js実行ファイルのパス
    type: 'stdio',
    allowed_origins: [
      `chrome-extension://${EXTENSION_ID}/`,
      'chrome-extension://*/', // 一時的なワイルドカード許可
    ],
  };
}

/**
 * Windowsレジストリエントリが存在するかを検証
 */
function verifyWindowsRegistryEntry(registryKey: string, expectedPath: string): boolean {
  if (os.platform() !== 'win32') {
    return true; // 非Windowsプラットフォームは検証をスキップ
  }

  try {
    const result = execSync(`reg query "${registryKey}" /ve`, { encoding: 'utf8', stdio: 'pipe' });
    const lines = result.split('\n');
    for (const line of lines) {
      if (line.includes('REG_SZ') && line.includes(expectedPath.replace(/\\/g, '\\\\'))) {
        return true;
      }
    }
    return false;
  } catch (error) {
    return false;
  }
}

/**
 * ユーザーレベルのNative Messagingホストの登録を試行
 */
export async function tryRegisterUserLevelHost(): Promise<boolean> {
  try {
    console.log(colorText('ユーザーレベルNative Messagingホストの登録を試行中...', 'blue'));

    // 1. 実行権限を確保
    await ensureExecutionPermissions();

    // 2. マニフェストファイルパスを決定
    const manifestPath = getUserManifestPath();

    // 3. ディレクトリの存在を確保
    await mkdir(path.dirname(manifestPath), { recursive: true });

    // 4. マニフェストコンテンツを作成
    const manifest = await createManifestContent();

    console.log('manifest path==>', manifest, manifestPath);

    // 5. マニフェストファイルを書き込み
    await writeFile(manifestPath, JSON.stringify(manifest, null, 2));

    if (os.platform() === 'win32') {
      const registryKey = `HKCU\\Software\\Google\\Chrome\\NativeMessagingHosts\\${HOST_NAME}`;
      try {
        // パスが正しいエスケープ形式を使用することを確保
        const escapedPath = manifestPath.replace(/\\/g, '\\\\');
        const regCommand = `reg add "${registryKey}" /ve /t REG_SZ /d "${escapedPath}" /f`;

        console.log(colorText(`レジストリコマンドを実行中: ${regCommand}`, 'blue'));
        execSync(regCommand, { stdio: 'pipe' });

        // レジストリエントリが正常に作成されたかを確認
        if (verifyWindowsRegistryEntry(registryKey, manifestPath)) {
          console.log(colorText('✓ Windowsレジストリエントリが正常に作成されました', 'green'));
        } else {
          console.log(
            colorText('⚠️ レジストリエントリは作成されましたが、検証に失敗しました', 'yellow'),
          );
        }
      } catch (error: any) {
        console.log(
          colorText(`⚠️ Windowsレジストリエントリを作成できません: ${error.message}`, 'yellow'),
        );
        console.log(colorText(`レジストリキー: ${registryKey}`, 'yellow'));
        console.log(colorText(`マニフェストパス: ${manifestPath}`, 'yellow'));
        return false; // Windows上でレジストリエントリの作成が失敗した場合、全体の登録プロセスは失敗とみなす
      }
    }

    console.log(colorText('ユーザーレベルNative Messagingホストが正常に登録されました！', 'green'));
    return true;
  } catch (error) {
    console.log(
      colorText(
        `ユーザーレベル登録に失敗: ${error instanceof Error ? error.message : String(error)}`,
        'yellow',
      ),
    );
    return false;
  }
}

// is-adminパッケージのインポート（Windowsプラットフォームでのみ使用）
let isAdmin: () => boolean = () => false;
if (process.platform === 'win32') {
  try {
    isAdmin = require('is-admin');
  } catch (error) {
    console.warn(
      'is-admin依存関係が不足しています。Windowsプラットフォームで管理者権限を正しく検出できない可能性があります',
    );
    console.warn(error);
  }
}

/**
 * 昇格権限を使用してシステムレベルマニフェストを登録
 */
export async function registerWithElevatedPermissions(): Promise<void> {
  try {
    console.log(colorText('システムレベルマニフェストの登録を試行中...', 'blue'));

    // 1. 実行権限を確保
    await ensureExecutionPermissions();

    // 2. マニフェストコンテンツを準備
    const manifest = await createManifestContent();

    // 3. システムレベルマニフェストパスを取得
    const manifestPath = getSystemManifestPath();

    // 4. 一時マニフェストファイルを作成
    const tempManifestPath = path.join(os.tmpdir(), `${HOST_NAME}.json`);
    await writeFile(tempManifestPath, JSON.stringify(manifest, null, 2));

    // 5. 管理者権限を既に持っているかどうかを検出
    const isRoot = process.getuid && process.getuid() === 0; // Unix/Linux/Mac
    const hasAdminRights = process.platform === 'win32' ? isAdmin() : false; // Windowsプラットフォームで管理者権限を検出
    const hasElevatedPermissions = isRoot || hasAdminRights;

    // コマンドを準備
    const command =
      os.platform() === 'win32'
        ? `if not exist "${path.dirname(manifestPath)}" mkdir "${path.dirname(manifestPath)}" && copy "${tempManifestPath}" "${manifestPath}"`
        : `mkdir -p "${path.dirname(manifestPath)}" && cp "${tempManifestPath}" "${manifestPath}" && chmod 644 "${manifestPath}"`;

    if (hasElevatedPermissions) {
      // 既に管理者権限を持っているため、コマンドを直接実行
      try {
        // ディレクトリを作成
        if (!fs.existsSync(path.dirname(manifestPath))) {
          fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
        }

        // ファイルをコピー
        fs.copyFileSync(tempManifestPath, manifestPath);

        // 権限を設定（非Windowsプラットフォーム）
        if (os.platform() !== 'win32') {
          fs.chmodSync(manifestPath, '644');
        }

        console.log(colorText('システムレベルマニフェストの登録が成功しました！', 'green'));
      } catch (error: any) {
        console.error(
          colorText(
            `システムレベルマニフェストのインストールに失敗しました: ${error.message}`,
            'red',
          ),
        );
        throw error;
      }
    } else {
      // 管理者権限がないため、手動操作の手順を出力
      console.log(colorText('⚠️ システムレベルインストールには管理者権限が必要です', 'yellow'));
      console.log(colorText('管理者権限で以下のいずれかのコマンドを実行してください:', 'blue'));

      if (os.platform() === 'win32') {
        console.log(colorText('  1. 管理者としてコマンドプロンプトを開いて実行:', 'blue'));
        console.log(colorText(`     ${command}`, 'cyan'));
      } else {
        console.log(colorText('  1. sudoで実行:', 'blue'));
        console.log(colorText(`     sudo ${command}`, 'cyan'));
      }

      console.log(colorText('  2. または昇格権限で登録コマンドを実行:', 'blue'));
      console.log(colorText(`     sudo ${COMMAND_NAME} register --system`, 'cyan'));

      throw new Error('システムレベルインストールには管理者権限が必要です');
    }

    // 6. Windows特別処理 - システムレベルレジストリを設定
    if (os.platform() === 'win32') {
      const registryKey = `HKLM\\Software\\Google\\Chrome\\NativeMessagingHosts\\${HOST_NAME}`;
      // パスが正しいエスケープ形式を使用することを確保
      const escapedPath = manifestPath.replace(/\\/g, '\\\\');
      const regCommand = `reg add "${registryKey}" /ve /t REG_SZ /d "${escapedPath}" /f`;

      console.log(colorText(`システムレジストリエントリを作成中: ${registryKey}`, 'blue'));
      console.log(colorText(`マニフェストパス: ${manifestPath}`, 'blue'));

      if (hasElevatedPermissions) {
        // 既に管理者権限を持っているため、レジストリコマンドを直接実行
        try {
          execSync(regCommand, { stdio: 'pipe' });

          // レジストリエントリが正常に作成されたかを検証
          if (verifyWindowsRegistryEntry(registryKey, manifestPath)) {
            console.log(colorText('Windowsレジストリエントリが正常に作成されました！', 'green'));
          } else {
            console.log(
              colorText('⚠️ レジストリエントリは作成されましたが、検証に失敗しました', 'yellow'),
            );
          }
        } catch (error: any) {
          console.error(
            colorText(`Windowsレジストリエントリの作成に失敗しました: ${error.message}`, 'red'),
          );
          console.error(colorText(`コマンド: ${regCommand}`, 'red'));
          throw error;
        }
      } else {
        // 管理者権限がないため、手動操作の手順を出力
        console.log(colorText('⚠️ Windowsレジストリの変更には管理者権限が必要です', 'yellow'));
        console.log(colorText('管理者として以下のコマンドを実行してください:', 'blue'));
        console.log(colorText(`  ${regCommand}`, 'cyan'));
        console.log(colorText('または昇格権限で登録コマンドを実行:', 'blue'));
        console.log(
          colorText(
            `  管理者としてコマンドプロンプトを開いて実行: ${COMMAND_NAME} register --system`,
            'cyan',
          ),
        );

        throw new Error('Windowsレジストリの変更には管理者権限が必要です');
      }
    }
  } catch (error: any) {
    console.error(colorText(`注册失败: ${error.message}`, 'red'));
    throw error;
  }
}
