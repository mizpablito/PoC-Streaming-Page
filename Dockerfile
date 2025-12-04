FROM node:18-slim

# 1. Instalacja zależności systemowych (Chrome, FFmpeg, Xvfb)
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    ffmpeg \
    xvfb \
    chromium \
    # Fonty, żeby strona wyglądała dobrze
    fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# 2. Katalog roboczy
WORKDIR /app

# 3. Instalacja Puppeteer (sterowanie przeglądarką)
RUN npm init -y && npm install puppeteer-core

# 4. Kopiowanie skryptów
COPY streamer.js .
COPY entrypoint.sh .

# 5. Uprawnienia i zmienne
RUN chmod +x entrypoint.sh
ENV DISPLAY=:99

CMD ["./entrypoint.sh"]