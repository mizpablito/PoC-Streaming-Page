#!/bin/bash

# Ustawienia domyślne
res="1280x720"
fps="30"

echo "0. Czyszczenie starych lock-file'i..."
# TO JEST KLUCZOWE - usuwamy blokady po poprzednich awariach
rm -f /tmp/.X99-lock
rm -rf /tmp/.X11-unix/X99

echo "1. Start Xvfb (Wirtualny Ekran)..."
# Dodajemy -ac (disable access control) dla pewności
Xvfb :99 -ac -screen 0 ${res}x24 &

# Czekamy aż Xvfb na pewno wstanie (pętla sprawdzająca)
echo "   Czekam na inicjalizację Xvfb..."
for i in {1..10}; do
  if [ -f /tmp/.X99-lock ]; then
    break
  fi
  echo "   ... wciąż czekam ($i)"
  sleep 1
done

echo "2. Start Przeglądarki (Puppeteer)..."
# Dodajemy zmienną DISPLAY explicite
export DISPLAY=:99
node streamer.js &
sleep 10

echo "3. Start FFmpeg (Streaming)..."
ffmpeg \
  -f x11grab -draw_mouse 0 -video_size $res -framerate $fps -i :99 \
  -f lavfi -i anullsrc=channel_layout=stereo:sample_rate=44100 \
  -c:v libx264 -preset veryfast -b:v 3000k -maxrate 3000k -bufsize 6000k -pix_fmt yuv420p -g 60 \
  -c:a aac -b:a 128k \
  -f flv "$STREAM_URL"