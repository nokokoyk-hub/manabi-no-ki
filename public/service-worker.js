// まなびの木 Service Worker
// PWAインストール（ホーム画面に追加）を有効にする最小構成
// キャッシュは意図的にしない（常に最新版を読み込む）
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", () => { /* passthrough: let the network handle it */ });
