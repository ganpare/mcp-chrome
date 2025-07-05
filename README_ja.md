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

#### ステップ1: Chrome拡張機能のインストール

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
     <img width="475" alt="Screenshot 2025-06-09 15 52 06" src="https://github.com/user-attachments/assets/241e57b8-c55f-41a4-9188-0367293dc5bc" />

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

## 🛠️ 利用可能なツール

完全なツールリスト: [完全なツールリスト](docs/TOOLS.md)

<details>
<summary><strong>📊 ブラウザ管理（6ツール）</strong></summary>

- `get_windows_and_tabs` - すべてのブラウザウィンドウとタブをリスト
- `chrome_navigate` - URLナビゲーションとビューポート制御
- `chrome_close_tabs` - 特定のタブまたはウィンドウを閉じる
- `chrome_go_back_or_forward` - ブラウザナビゲーション制御
- `chrome_inject_script` - ウェブページにコンテンツスクリプトを注入
- `chrome_send_command_to_inject_script` - 注入されたコンテンツスクリプトにコマンドを送信
</details>

<details>
<summary><strong>📸 スクリーンショット＆ビジュアル（1ツール）</strong></summary>

- `chrome_screenshot` - 要素ターゲティング、フルページサポート、カスタム寸法対応の高度なスクリーンショット撮影
</details>

<details>
<summary><strong>🌐 ネットワーク監視（4ツール）</strong></summary>

- `chrome_network_capture_start/stop` - webRequest APIネットワークキャプチャ
- `chrome_network_debugger_start/stop` - レスポンスボディ付きデバッガAPI
- `chrome_network_request` - カスタムHTTPリクエストの送信
</details>

<details>
<summary><strong>🔍 コンテンツ解析（4ツール）</strong></summary>

- `search_tabs_content` - ブラウザタブ間でのAI駆動セマンティック検索
- `chrome_get_web_content` - ページからHTML/テキストコンテンツを抽出
- `chrome_get_interactive_elements` - クリック可能な要素を検索
- `chrome_console` - ブラウザタブからコンソール出力をキャプチャ・取得
</details>

<details>
<summary><strong>🎯 インタラクション（3ツール）</strong></summary>

- `chrome_click_element` - CSSセレクターを使用して要素をクリック
- `chrome_fill_or_select` - フォームを入力し、オプションを選択
- `chrome_keyboard` - キーボード入力とショートカットをシミュレート
</details>

<details>
<summary><strong>📚 データ管理（5ツール）</strong></summary>

- `chrome_history` - 時間フィルター付きブラウザ履歴検索
- `chrome_bookmark_search` - キーワードでブックマークを検索
- `chrome_bookmark_add` - フォルダサポート付きで新しいブックマークを追加
- `chrome_bookmark_delete` - ブックマークを削除
</details>

## 🧪 使用例

### AIがウェブページコンテンツを要約し、Excalidrawを自動制御して図を描画

プロンプト: [excalidraw-prompt](prompt/excalidraw-prompt.md)
指示: 現在のページコンテンツを要約し、理解を助けるための図を描いてください。

https://github.com/user-attachments/assets/fd17209b-303d-48db-9e5e-3717141df183

### 画像の内容を解析した後、LLMがExcalidrawを自動制御して画像を再現

プロンプト: [excalidraw-prompt](prompt/excalidraw-prompt.md)|[content-analize](prompt/content-analize.md)
指示: まず画像の内容を解析し、その解析と画像の内容を組み合わせて画像を再現してください。

https://github.com/user-attachments/assets/60d12b1a-9b74-40f4-994c-95e8fa1fc8d3

### AIが自動でスクリプトを注入し、ウェブページスタイルを修正

プロンプト: [modify-web-prompt](prompt/modify-web.md)
指示: 現在のページのスタイルを修正し、広告を削除してください。

https://github.com/user-attachments/assets/69cb561c-2e1e-4665-9411-4a3185f9643e

### AIが自動でネットワークリクエストをキャプチャ

クエリ: 小红书の検索APIは何で、レスポンス構造はどのようになっているか知りたい

https://github.com/user-attachments/assets/063f44ae-1754-46b6-b141-5988c86e4d96

### AIがブラウジング履歴を解析

クエリ: 過去1ヶ月のブラウジング履歴を解析してください

https://github.com/user-attachments/assets/e7a35118-e50e-4b1c-a790-0878aa2505ab

### ウェブページ会話

クエリ: 現在のウェブページを翻訳し、要約してください

https://github.com/user-attachments/assets/08aa86aa-7706-4df2-b400-576e2c7fcc7f

### AIが自動でスクリーンショットを撮影（ウェブページスクリーンショット）

クエリ: Hugging Faceのホームページのスクリーンショットを撮ってください

https://github.com/user-attachments/assets/b081e41b-6309-40d6-885b-0da01691b12e

### AIが自動でスクリーンショットを撮影（要素スクリーンショット）

クエリ: Hugging Faceのホームページからアイコンをキャプチャしてください

https://github.com/user-attachments/assets/25657076-b84b-4459-a72f-90f896f06364

### AIがブックマーク管理を支援

クエリ: 現在のページをブックマークに追加し、適切なフォルダに入れてください

https://github.com/user-attachments/assets/73c1ea26-65fb-4b5e-b537-e32fa9bcfa52

### 自動的にウェブページを閉じる

クエリ: shadcn関連のウェブページをすべて閉じてください

https://github.com/user-attachments/assets/ff160f48-58e0-4c76-a6b0-c4e1f91370c8

## 🤝 コントリビューション

コントリビューションを歓迎します！詳細なガイドラインについては、[CONTRIBUTING.md](docs/CONTRIBUTING.md)をご覧ください。

## 🚧 将来のロードマップ

Chrome MCP Serverの将来の開発について、エキサイティングな計画があります：

- [ ] 認証
- [ ] 記録と再生
- [ ] ワークフロー自動化
- [ ] 拡張ブラウザサポート（Firefox拡張機能）

---

**これらの機能のいずれかにコントリビューションしたいですか？** [コントリビューションガイド](docs/CONTRIBUTING.md)をチェックして、開発コミュニティに参加してください！

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
