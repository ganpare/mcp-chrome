import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const distDir = path.join(__dirname, '..', '..', 'dist');
// 前回のビルドをクリア
console.log('前回のビルドをクリア中...');
try {
  fs.rmSync(distDir, { recursive: true, force: true });
} catch (err) {
  // ディレクトリが存在しないエラーを無視
  console.log(err);
}

// distディレクトリを作成
fs.mkdirSync(distDir, { recursive: true });
fs.mkdirSync(path.join(distDir, 'logs'), { recursive: true }); // logsディレクトリを作成
console.log('dist および dist/logs ディレクトリが作成/確認されました');

// TypeScriptをコンパイル
console.log('TypeScriptをコンパイル中...');
execSync('tsc', { stdio: 'inherit' });

// 設定ファイルをコピー
console.log('設定ファイルをコピー中...');
const configSourcePath = path.join(__dirname, '..', 'mcp', 'stdio-config.json');
const configDestPath = path.join(distDir, 'mcp', 'stdio-config.json');

try {
  // ターゲットディレクトリが存在することを確認
  fs.mkdirSync(path.dirname(configDestPath), { recursive: true });

  if (fs.existsSync(configSourcePath)) {
    fs.copyFileSync(configSourcePath, configDestPath);
    console.log(`stdio-config.json を ${configDestPath} にコピーしました`);
  } else {
    console.error(`エラー: 設定ファイルが見つかりません: ${configSourcePath}`);
  }
} catch (error) {
  console.error('設定ファイルのコピー中にエラーが発生しました:', error);
}

// package.jsonをコピーして内容を更新
console.log('package.jsonを準備中...');
const packageJson = require('../../package.json');

// READMEを作成
const readmeContent = `# ${packageJson.name}

このプログラムはChrome拡張機能のNative Messagingホストです。

## インストール方法

1. Node.jsがインストールされていることを確認
2. このプログラムをグローバルインストール:
   \`\`\`
   npm install -g ${packageJson.name}
   \`\`\`
3. Native Messagingホストを登録:
   \`\`\`
   # ユーザーレベルでのインストール（推奨）
   ${packageJson.name} register

   # ユーザーレベルでのインストールが失敗した場合、システムレベルでの試行
   ${packageJson.name} register --system
   # または管理者権限を使用
   sudo ${packageJson.name} register
   \`\`\`

## 使用方法

このアプリケーションはChrome拡張機能によって自動起動されるため、手動で実行する必要はありません。
`;

fs.writeFileSync(path.join(distDir, 'README.md'), readmeContent);

console.log('ラッパースクリプトをコピー中...');
const scriptsSourceDir = path.join(__dirname, '.');
const macOsWrapperSourcePath = path.join(scriptsSourceDir, 'run_host.sh');
const windowsWrapperSourcePath = path.join(scriptsSourceDir, 'run_host.bat');

const macOsWrapperDestPath = path.join(distDir, 'run_host.sh');
const windowsWrapperDestPath = path.join(distDir, 'run_host.bat');

try {
  if (fs.existsSync(macOsWrapperSourcePath)) {
    fs.copyFileSync(macOsWrapperSourcePath, macOsWrapperDestPath);
    console.log(`${macOsWrapperSourcePath} を ${macOsWrapperDestPath} にコピーしました`);
  } else {
    console.error(
      `エラー: macOS ラッパースクリプトのソースファイルが見つかりません: ${macOsWrapperSourcePath}`,
    );
  }

  if (fs.existsSync(windowsWrapperSourcePath)) {
    fs.copyFileSync(windowsWrapperSourcePath, windowsWrapperDestPath);
    console.log(`${windowsWrapperSourcePath} を ${windowsWrapperDestPath} にコピーしました`);
  } else {
    console.error(
      `エラー: Windows ラッパースクリプトのソースファイルが見つかりません: ${windowsWrapperSourcePath}`,
    );
  }
} catch (error) {
  console.error('ラッパースクリプトのコピー中にエラーが発生しました:', error);
}

// 重要なJavaScriptファイルとmacOSラッパースクリプトに実行権限を追加
console.log('実行権限を追加中...');
const filesToMakeExecutable = ['index.js', 'cli.js', 'run_host.sh']; // cli.jsはdistルートディレクトリにあると想定

filesToMakeExecutable.forEach((file) => {
  const filePath = path.join(distDir, file); // filePathは現在のターゲットパス
  try {
    if (fs.existsSync(filePath)) {
      fs.chmodSync(filePath, '755');
      console.log(`${file} に実行権限 (755) を追加しました`);
    } else {
      console.warn(`警告: ${filePath} が存在しないため、実行権限を追加できません`);
    }
  } catch (error) {
    console.error(`${file} に実行権限を追加中にエラーが発生しました:`, error);
  }
});

console.log('✅ ビルド完了');
