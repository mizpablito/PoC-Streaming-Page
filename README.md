# PoC Streaming Page

Mini PoC (Proof of Concept), pokazujący **możliwość** renderowania dynamicznej strony internetowej (z licznikiem/wykresami) w wirtualnym środowisku bez ekranu (headless) i jej **streamowania** na serwery takie jak **YouTube**, **Twitch** lub lokalny serwer **RTSP/RTMP**.

---

## Jak uruchomić?

1.  Serwer VPS z systemem Linux (np. Debian/Ubuntu).
2.  Zainstalowany Docker ([instalator](https://github.com/docker/docker-install)).
3.  Zainstalowany pakiet `git`.
4.  Sklonować ten projekt:
    ```bash
    git clone https://github.com/mizpablito/PoC-Streaming-Page.git
    ```
5.  Wejść do katalogu:
    ```bash
    cd PoC-Streaming-Page
    ```
6.  **Zedytować** plik `docker-compose.yml` zgodnie z potrzebami (sekcja `environment`).
7.  Testowo uruchomić za pomocą komendy:
    ```bash
    docker compose up --build --force-recreate
    ```
    Pozwoli to zbudować obraz kontenera oraz wejść w tryb podglądu logów. Aby zatrzymać pracę kontenera, wykonaj skrót: `Ctrl + C`.
8.  Jeśli wszystko jest okej, można uruchomić kontener w trybie pracy w tle:
    ```bash
    docker compose up -d
    ```

> **Uwaga:** Jeśli dokonasz zmian w którymś pliku składowym obrazu (`Dockerfile`, `.js`, `.sh`), pamiętaj o ponownym przebudowaniu obrazu, aby zmiana zadziałała -> `docker compose up --build --force-recreate`.

---

## Pliki Składowe

| Plik | Opis |
| :--- | :--- |
| **`Dockerfile`** | Definicja obrazu kontenera. Instaluje wszystkie niezbędne zależności: **Node.js** (do uruchomienia Puppeteer), **Chromium** (przeglądarka headless), **Xvfb** (wirtualny ekran) i **FFmpeg** (przechwytywanie i kodowanie). |
| **`docker-compose.yml`** | Konfiguracja uruchomienia. Definiuje kontener, mapuje pliki, a co najważniejsze – ustawia kluczowe **zmienne środowiskowe** do sterowania streamem. |
| **`entrypoint.sh`** | Główny skrypt Bash. Odpowiada za **sekwencję uruchamiania** w kontenerze: 1. Czyści blokady. 2. Uruchamia **Xvfb** (wirtualny ekran). 3. Uruchamia **Chromium** (za pomocą `streamer.js`). 4. Uruchamia **FFmpeg** z modułem `x11grab`, który przechwytuje obraz z wirtualnego ekranu i wypycha go jako strumień RTMP/RTSP. |
| **`streamer.js`** | Skrypt Node.js korzystający z **Puppeteer**. Otwiera wskazaną stronę (`TARGET_URL`) w przeglądarce, **idealnie kadruje** okno do rozmiaru 1280x720 (eliminując czarne paski i komunikaty automatyzacji) i opcjonalnie **odświeża** stronę w ustalonych interwałach. |

---

## Konfiguracja Zmiennych Środowiskowych (`docker-compose.yml`)

Kluczowe parametry projektu ustawiane są w sekcji `environment`:

| Zmienna | Opis | Przykład |
| :--- | :--- | :--- |
| **`TARGET_URL`** | Adres URL strony internetowej, którą chcemy streamować. | `https://time.is/` |
| **`STREAM_URL`** | Adres docelowy strumienia (Ingest URL) wraz z protokołem. **UWAGA: Dla YT/Twitch używaj protokołu RTMP.** | `rtmp://a.rtmp.youtube.com/live2/KLUCZ` |
| **`REFRESH_ENABLED`** | Włączenie/wyłączenie cyklicznego odświeżania strony. Zalecane dla dynamicznych stron, aby zapobiec ich "zasypianiu". | `true` lub `false` |
| **`REFRESH_INTERVAL_MINUTES`** | Interwał odświeżania strony w minutach. Działa tylko, gdy `REFRESH_ENABLED=true`. | `30` |

---

## Zużycie Zasobów Przy Testach

Użyto do testów Maszyny Wirtualnej (VM) z zainstalowanym Debian 13 oraz Docker. VM miała przydzielone 2 rdzenie (np. Intel i5-6500T (4c/4t 2.50/3.10Ghz)) oraz 4GB RAM.

Podczas testów zużywało ok. **30% CPU** (2 core) oraz **~500MB RAM**. Zużycie CPU jest w dużej mierze determinowane przez proces kodowania wideo (H.264) przez FFmpeg.