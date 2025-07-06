# Chrome MCP Server 🚀

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8+-blue.svg)](https://www.typescriptlang.org/)
[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-green.svg)](https://developer.chrome.com/docs/extensions/)

> 🌟 **Chromeブラウザを賢いアシスタントに変身させる** - AIがブラウザを制御し、強力なAI制御自動化ツールに変換します。

**🇯🇵 日本語化プロジェクト進行中**: このプロジェクトの日本語化を進めています。UI、ドキュメント、プロンプトなどを日本語に翻訳しています。

**📖 ドキュメント**: [English](README.md) | [中文](README_zh.md) | [日本語](README_ja.md)

---

## 🎯 Chrome MCP Serverとは？

Chrome MCP Serverは、Chrome拡張機能ベースの**Model Context Protocol（MCP）サーバー**で、ChromeブラウザーのAPIをClaudeなどのAIアシスタントに公開し、複雑なブラウザー自動化、コンテンツ解析、セマンティック検索を可能にします。従来のブラウザー自動化ツール（Playwrightなど）とは異なり、**Chrome MCP Server**は日常使用しているChromeブラウザを直接使用し、既存のユーザー習慣、設定、ログイン状態を活用することで、さまざまな大規模言語モデルやチャットボットがブラウザを制御し、真の日常アシスタントとなることを可能にします。

### 🔧 システム構成

このプロジェクトは**2つの主要コンポーネント**で構成されています：

1. **🌐 Chrome拡張機能** (`app/chrome-extension/`)

   - Chromeブラウザ内で動作する拡張機能
   - ブラウザAPIへの直接アクセス
   - ページコンテンツの取得、スクリーンショット撮影、DOM操作など

2. **🖥️ Native MCPサーバー** (`app/native-server/`)
   - ローカルで動作するNode.jsベースのMCPサーバー
   - Chrome拡張機能とNative Messaging APIで通信
   - AIクライアント（Claude、CherryStudioなど）との橋渡し

**両方のコンポーネントが必要です**：Chrome拡張機能とMCPサーバーの両方をインストール・起動する必要があります。

## 🏗️ システムアーキテクチャ

このプロジェクトは2つの連携するコンポーネントで構成されています：

### 1. Chrome拡張機能

- **役割**: ブラウザ内でのWebページ操作、DOM解析、ユーザーインタフェース
- **通信**: ChromeのNative Messaging APIを使用してNative Messaging Hostと通信（標準入出力）
- **ポート設定**: 拡張機能UIで設定するポートは「MCPサーバー用ポート」（デフォルト: 3000）

### 2. Native Messaging Host + MCPサーバー

- **Native Messaging Host** (`node dist/index.js`)
  - Chrome拡張機能からの指示を受信（サーバー開始/停止等）
  - 標準入出力（stdin/stdout）でChrome拡張機能と通信
  - 内部でMCPサーバーの起動/停止を制御
- **MCPサーバー**
  - Native Messaging Hostによって動的に起動される
  - 指定されたHTTPポートでリッスン（拡張機能から設定可能）
  - AIクライアント（Claude Desktop等）からの接続を受け入れ

### 通信フロー

```text
Chrome拡張機能 ←→ Native Messaging Host ←→ MCPサーバー ←→ AIクライアント
   (Native Messaging API)    (内部制御)      (HTTP)
```

### 起動順序

1. Native Messaging Hostを起動 (`node dist/index.js`)
2. Chrome拡張機能で「サーバー開始」をクリック
3. MCPサーバーが指定ポートで自動起動
4. AIクライアントからMCPサーバーに接続

**重要**: Native Messaging Hostは常に起動しておく必要があります。MCPサーバーは拡張機能から動的に制御されます。

## ✨ 主要機能

- 😁 **チャットボット/モデル非依存**: お好みのLLMやチャットボットクライアント、エージェントでブラウザを自動化
- ⭐️ **既存ブラウザの活用**: 既存のブラウザ環境（設定、ログイン状態など）とシームレスに統合
- 💻 **完全ローカル**: 純粋なローカルMCPサーバーでユーザープライバシーを確保
- 🚄 **ストリーミングHTTP**: ストリーミングHTTP接続方式
- 🏎 **クロスタブ**: タブ間コンテキスト
- 🧠 **セマンティック検索**: インテリジェントなブラウザタブコンテンツ発見のための組み込みベクターデータベース
- 🔍 **スマートコンテンツ解析**: AI駆動のテキスト抽出と類似性マッチング
- 🌐 **20以上のツール**: スクリーンショット、ネットワーク監視、インタラクティブ操作、ブックマーク管理、ブラウジング履歴など20以上のツールをサポート
- 🚀 **SIMD高速化AI**: カスタムWebAssembly SIMD最適化により、ベクター演算を4-8倍高速化

## 🆚 類似プロジェクトとの比較

| 比較項目                     | Playwrightベース MCPサーバー                                                                                  | Chrome拡張機能ベース MCPサーバー                                                          |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| **リソース使用量**           | ❌ 独立したブラウザプロセスの起動、Playwright依存関係のインストール、ブラウザバイナリのダウンロードなどが必要 | ✅ 独立したブラウザプロセスの起動が不要、ユーザーの既に開いているChromeブラウザを直接利用 |
| **ユーザーセッション再利用** | ❌ 再ログインが必要                                                                                           | ✅ 既存のログイン状態を自動使用                                                           |
| **ブラウザ環境**             | ❌ クリーン環境はユーザー設定を欠く                                                                           | ✅ ユーザー環境を完全に保持                                                               |
| **API アクセス**             | ⚠️ Playwright APIに限定                                                                                       | ✅ Chromeネイティブ APIへの完全アクセス                                                   |
| **起動速度**                 | ❌ ブラウザプロセスの起動が必要                                                                               | ✅ 拡張機能の起動のみ                                                                     |
| **応答速度**                 | 50-200msのプロセス間通信                                                                                      | ✅ より高速                                                                               |

## 🚀 クイックスタート

### 前提条件

- Node.js 18+ と pnpm
- Chrome/Chromiumブラウザ

### インストール手順

Chrome MCP Serverを使用するには、**以下の2つのコンポーネントを両方インストールする必要があります**：

#### 🚀 簡単インストール（推奨）

1. **GitHubから最新のChrome拡張機能をダウンロード**

   - [リリースページ](https://github.com/hangwin/mcp-chrome/releases)から最新版をダウンロード
   - Chrome拡張機能をインストール

2. **Native MCPサーバーをインストール**
   ```bash
   npm install -g mcp-chrome-bridge
   # または
   pnpm install -g mcp-chrome-bridge
   ```

#### 🛠️ 開発者向けセットアップ（カスタマイズ用）

開発・カスタマイズが必要な場合のみ：

**ステップ1: Chrome拡張機能のビルド**

1. **GitHubから最新のChrome拡張機能をダウンロード**

   [リリースページ](https://github.com/hangwin/mcp-chrome/releases)から最新版をダウンロード

2. **Chrome拡張機能をロード**
   - Chromeを開き、`chrome://extensions/`にアクセス
   - 「デベロッパーモード」を有効にする
   - 「パッケージ化されていない拡張機能を読み込む」をクリックし、ダウンロードした拡張機能フォルダを選択
   - 拡張機能アイコンをクリックしてプラグインを開き、「接続」をクリックしてMCP設定を確認

#### ステップ2: Native MCPサーバーのインストール

1. **mcp-chrome-bridgeをグローバルインストール**

npm

```bash
npm install -g mcp-chrome-bridge
```

pnpm

```bash
# 方法1: スクリプトをグローバルに有効化（推奨）
pnpm config set enable-pre-post-scripts true
pnpm install -g mcp-chrome-bridge

# 方法2: 手動登録（postinstallが実行されない場合）
pnpm install -g mcp-chrome-bridge
mcp-chrome-bridge register
```

> 注意: pnpm v7+はセキュリティのためデフォルトでpostinstallスクリプトを無効にします。`enable-pre-post-scripts`設定は、プリ/ポストインストールスクリプトが実行されるかどうかを制御します。自動登録が失敗した場合は、上記の手動登録コマンドを使用してください。

3. **Chrome拡張機能をロード**
   - Chromeを開き、`chrome://extensions/`にアクセス
   - 「デベロッパーモード」を有効にする
   - 「パッケージ化されていない拡張機能を読み込む」をクリックし、`ダウンロードした拡張機能フォルダ`を選択
   - 拡張機能アイコンをクリックしてプラグインを開き、「接続」をクリックしてMCP設定を確認

> **重要**: Chrome拡張機能が正常に動作するには、以下の2つのプロセスが両方とも起動している必要があります：
>
> 1. **Native Messaging Host** - Chrome拡張機能とサーバー間の通信を担当
> 2. **MCP HTTPサーバー** - MCPクライアント（Claude等）からの接続を受け付け
>
> 拡張機能のポップアップで「サーバー未起動」と表示される場合は、両方のプロセスが起動していることを確認してください。

![Screenshot](https://github.com/user-attachments/assets/241e57b8-c55f-41a4-9188-0367293dc5bc)

### MCPプロトコルクライアントでの使用

#### ストリーミングHTTP接続の使用（👍🏻 推奨）

MCPクライアント設定に以下の設定を追加してください（CherryStudioを例として）：

> ストリーミングHTTP接続方式を推奨

```json
{
  "mcpServers": {
    "chrome-mcp-server": {
      "type": "streamableHttp",
      "url": "http://127.0.0.1:12306/mcp"
    }
  }
}
```

#### STDIO接続の使用（代替手段）

クライアントがstdio接続方式のみをサポートしている場合は、以下のアプローチを使用してください：

1. まず、インストールしたnpmパッケージのインストール場所を確認

```sh
# npm確認方法
npm list -g mcp-chrome-bridge
# pnpm確認方法
pnpm list -g mcp-chrome-bridge
```

上記のコマンドがパス: /Users/xxx/Library/pnpm/global/5 を出力すると仮定すると
最終パスは: /Users/xxx/Library/pnpm/global/5/node_modules/mcp-chrome-bridge/dist/mcp/mcp-server-stdio.js になります

2. 以下の設定で、取得した最終パスに置き換えてください

```json
{
  "mcpServers": {
    "chrome-mcp-stdio": {
      "command": "npx",
      "args": [
        "node",
        "/Users/xxx/Library/pnpm/global/5/node_modules/mcp-chrome-bridge/dist/mcp/mcp-server-stdio.js"
      ]
    }
  }
}
```

例：augmentでの設定:

<img width="494" alt="截屏2025-06-22 22 11 25" src="https://github.com/user-attachments/assets/48eefc0c-a257-4d3b-8bbe-d7ff716de2bf" />

## 🛠️ 便利コマンド集

### 🚀 本番用（リリース版）コマンド

本番環境で使用する際の便利コマンドです。

#### インストール・セットアップ

```bash
# MCPサーバーをグローバルインストール
npm install -g mcp-chrome-bridge
# または
pnpm install -g mcp-chrome-bridge

# Native Messaging Host登録確認（Windowsの場合）
reg query "HKEY_CURRENT_USER\Software\Google\Chrome\NativeMessagingHosts\com.chromemcp.nativehost"

# パッケージインストール場所確認
npm list -g mcp-chrome-bridge
# または
pnpm list -g mcp-chrome-bridge
```

#### 起動・停止

```bash
# Native Messaging Hostを起動（バックグラウンドで実行）
mcp-chrome-bridge start

# MCPサーバーの状態確認
mcp-chrome-bridge status

# プロセス確認
tasklist | findstr node
netstat -ano | findstr :3000    # デフォルトポート3000の確認

# Native Messaging Hostを停止
mcp-chrome-bridge stop
```

#### メンテナンス

```bash
# パッケージ更新
npm update -g mcp-chrome-bridge
# または
pnpm update -g mcp-chrome-bridge

# アンインストール
npm uninstall -g mcp-chrome-bridge
# または
pnpm uninstall -g mcp-chrome-bridge

# ログ確認
mcp-chrome-bridge logs
```

### 🔧 開発用（ソースビルド）コマンド

開発・カスタマイズ時に使用する便利コマンドです。

#### 初期セットアップ

```bash
# リポジトリクローン
git clone https://github.com/hangwin/mcp-chrome.git
cd chrome-mcp

# 依存関係インストール
pnpm install

# 全体ビルド
pnpm build

# 開発環境用Native Messaging Host登録
cd app/native-server
pnpm run register:dev
```

#### 開発サーバー起動

```bash
# Chrome拡張機能開発サーバー（ホットリロード）
pnpm dev:extension

# Native MCPサーバー開発サーバー
pnpm dev:native

# または、ルートディレクトリから
pnpm dev:extension
pnpm dev:native
```

#### 開発用Native Messaging Host起動

```bash
# 開発版Native Messaging Host起動
cd app/native-server
node dist/index.js

# または、登録後は
mcp-chrome-bridge start
```

#### 開発用デバッグ・確認

```bash
# ポート使用状況確認
netstat -an | findstr :56889
netstat -an | findstr :3000

# プロセス確認
tasklist | findstr node.exe

# Native Messaging Host登録確認
reg query "HKEY_CURRENT_USER\Software\Google\Chrome\NativeMessagingHosts\com.chromemcp.nativehost"

# 設定ファイル確認
cat "%APPDATA%\Google\Chrome\NativeMessagingHosts\com.chromemcp.nativehost.json"

# ログ確認（開発時）
cd app/native-server
node dist/index.js | findstr "INFO\|ERROR\|WARN"
```

#### 開発用Chrome拡張機能

```bash
# 拡張機能ID確認（.env.local設定後）
cd app/chrome-extension
cat .env.local

# 開発用ビルド
pnpm build

# 開発用ビルド（監視モード）
pnpm dev
```

### 🚀 本番用コマンド

#### 本番環境セットアップ

```bash
# グローバルインストール（npm）
npm install -g mcp-chrome-bridge

# グローバルインストール（pnpm）
pnpm config set enable-pre-post-scripts true
pnpm install -g mcp-chrome-bridge

# 手動登録（自動登録が失敗した場合）
mcp-chrome-bridge register
```

#### 本番用サーバー起動・停止

```bash
# サーバー起動
mcp-chrome-bridge start

# サーバー停止
mcp-chrome-bridge stop

# サーバー再起動
mcp-chrome-bridge restart

# サーバー状態確認
mcp-chrome-bridge status
```

#### 本番用デバッグ・確認

```bash
# インストール確認
npm list -g mcp-chrome-bridge
# または
pnpm list -g mcp-chrome-bridge

# 設定ファイル確認
mcp-chrome-bridge config

# ログ確認
mcp-chrome-bridge logs

# Native Messaging Host登録確認
mcp-chrome-bridge check

# ポート使用状況確認
netstat -an | findstr :56889
netstat -an | findstr :3000

# プロセス確認
tasklist | findstr "mcp-chrome-bridge\|node.exe"
```

#### 本番用Chrome拡張機能

```bash
# 最新リリース版ダウンロード
# https://github.com/hangwin/mcp-chrome/releases

# Chrome拡張機能手動インストール
# 1. chrome://extensions/ を開く
# 2. デベロッパーモードを有効
# 3. 「パッケージ化されていない拡張機能を読み込む」
# 4. ダウンロードした拡張機能フォルダを選択
```

### 🔧 トラブルシューティング用コマンド

#### 接続問題の診断

```bash
# 全サービス状態確認
mcp-chrome-bridge status
netstat -an | findstr :56889
tasklist | findstr node.exe

# Native Messaging Host再登録
mcp-chrome-bridge unregister
mcp-chrome-bridge register

# 設定ファイル再生成
mcp-chrome-bridge config --reset

# キャッシュクリア（開発時）
cd app/chrome-extension
rm -rf dist/ .output/
pnpm build
```

#### ログ・デバッグ情報取得

```bash
# 詳細ログ出力（開発時）
cd app/native-server
set DEBUG=mcp-chrome:*
node dist/index.js

# 本番ログ確認
mcp-chrome-bridge logs --tail

# Chrome拡張機能ログ確認
# Chrome DevTools > Console でエラーログを確認
```

#### ポート・プロセス管理

```bash
# ポート強制解放（必要時のみ）
netstat -ano | findstr :56889
taskkill /PID <プロセスID> /F

# 全MCPプロセス停止
taskkill /IM "mcp-chrome-bridge.exe" /F
taskkill /IM "node.exe" /F /FI "WINDOWTITLE eq mcp-chrome*"

# サービス完全リセット
mcp-chrome-bridge stop
timeout /t 3
mcp-chrome-bridge start
```

### 💡 運用のベストプラクティス

#### 開発時

- Chrome拡張機能IDを固定 (`.env.local`でCHROME_EXTENSION_KEY設定)
- Native Messaging Host設定でallowed_originsに固定IDを指定
- 開発サーバーは`pnpm dev`で監視モード推奨

#### 本番時

- グローバルインストール版 (`mcp-chrome-bridge`) を使用
- Chrome拡張機能は公式リリース版を推奨
- 定期的な`mcp-chrome-bridge status`でヘルスチェック

#### セキュリティ

- 本番環境では拡張機能IDを固定推奨
- allowed_originsにワイルドカード (`chrome-extension://*/*`) 使用時は注意
- 必要最小限の権限での運用を心がける

---

## 📄 ライセンス

このプロジェクトはMITライセンスの下でライセンスされています。詳細については、[LICENSE](LICENSE)ファイルをご覧ください。

## 📚 その他のドキュメント

- [アーキテクチャ設計](docs/ARCHITECTURE.md) - 詳細な技術アーキテクチャドキュメント
- [TOOLS API](docs/TOOLS.md) - 完全なツールAPIドキュメント
- [トラブルシューティング](docs/TROUBLESHOOTING.md) - よくある問題の解決策

### 🔧 開発者向け情報

このプロジェクトを開発・カスタマイズしたい場合：

#### 🇯🇵 日本語化について

このプロジェクトは現在日本語化を進めています：

- ✅ **UI日本語化**: Chrome拡張機能のポップアップUIを完全日本語化
- ✅ **ドキュメント日本語化**: README、アーキテクチャ、ツール説明を日本語化
- ✅ **プロンプト日本語化**: AI用プロンプトテンプレートを日本語化
- ✅ **サーバーメッセージ日本語化**: MCPサーバーのログ・エラーメッセージを日本語化
- 🔄 **継続的改善**: より自然な日本語表現への改善を継続中

日本語化に貢献したい場合は、[コントリビューションガイド](docs/CONTRIBUTING.md)をご覧ください。

#### 開発環境のセットアップ

```bash
# リポジトリをクローン
git clone https://github.com/hangwin/mcp-chrome.git
cd mcp-chrome

# 依存関係をインストール
pnpm install

# 開発サーバーを起動
pnpm dev:extension  # Chrome拡張機能の開発モード
pnpm dev:native     # Native MCPサーバーの開発モード
```

#### プロジェクト構造

- `app/chrome-extension/` - Chrome拡張機能のソースコード
- `app/native-server/` - Native MCPサーバーのソースコード
- `packages/shared/` - 共有ライブラリ
- `packages/wasm-simd/` - WASM SIMD最適化ライブラリ
