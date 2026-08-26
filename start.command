#!/bin/bash
# ゼロから筋トレ — Mac でダブルクリックして起動する
# （Service Worker と PWA は file:// では動かないので、簡易サーバーを立てて開く）
cd "$(dirname "$0")"
PORT=8804

if lsof -nP -iTCP:$PORT -sTCP:LISTEN >/dev/null 2>&1; then
  echo "すでにポート $PORT で起動しています。ブラウザを開きます。"
else
  echo "サーバーを起動します（このウィンドウは閉じないでください）"
  python3 -m http.server $PORT --directory "$(pwd)" >/dev/null 2>&1 &
  sleep 1
fi

open "http://localhost:$PORT/"
echo ""
echo "ゼロから筋トレを開きました → http://localhost:$PORT/"
echo "スマホで使うときは、同じWi-Fiにつないで http://$(ipconfig getifaddr en0 2>/dev/null || echo 'このMacのIPアドレス'):$PORT/ を開いてください。"
echo "終わるときは このウィンドウで Ctrl+C を押すか、ウィンドウを閉じてください。"
echo ""
wait
