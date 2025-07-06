#!/usr/bin/env node
import { Server } from './server';
import { NATIVE_SERVER_PORT } from './constant';

console.log('🚀 MCPサーバー本番版を起動中...');
console.log(`📡 ポート: ${NATIVE_SERVER_PORT}`);

const server = new Server();

server
  .start(NATIVE_SERVER_PORT, null as any)
  .then(() => {
    console.log('✅ MCPサーバー本番版が正常に起動しました');
    console.log(`🌐 HTTP接続: http://127.0.0.1:${NATIVE_SERVER_PORT}`);
    console.log(`🔗 MCP接続: http://127.0.0.1:${NATIVE_SERVER_PORT}/mcp`);
  })
  .catch((error) => {
    console.error('❌ MCPサーバーの起動に失敗:', error);
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n⏹️  MCPサーバーを停止中...');
  await server.stop();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n⏹️  MCPサーバーを停止中...');
  await server.stop();
  process.exit(0);
});
