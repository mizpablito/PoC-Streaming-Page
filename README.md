# PoC Streaming Page

Mini PoC, pokazujcy moliwość renderowania strony i jej streamowania na np. YT czy Twitch

## Jak uruchomić?

1. Serwer VPS z systemem linux
2. System operacyjny, np. Debian/Ubuntu
3. Zainstalowany Docker ([instalator](https://github.com/docker/docker-install))
4. Zainstalowany pakiet `git`
5. Sklonować ten projekt `git clone https://github.com/mizpablito/PoC-Streaming-Page.git`
6. Wejść do katalogu `cd PoC-Streaming-Page`
7. Zedytować plik `docker-compose.yml` zgodnie potrzebami
8. Testowo uruchomić za pomoca komendy: `docker compose up --build --force-recreate` - pozwoli to zbudować obraz poda oraz wejśc w tryb podgldu logów. Aby zatrzymać pracę poda wykonaj skrót: `Ctrl + C`.
9. Jeśli wszystko jest okej, mozna uruchomić poda w trybie pracy w tle: `docker compose up -d`.

> Uwaga: jeśli dokonasz zmian w którymś pliku składowym obrazu, pamiętaj o ponownym przebudowaniu obrazu, aby zmiana zadziałała -> `docker compose up --build --force-recreate`.

## Zuzycie zasobów przy testach

Uzyto do testów VM z zainstalowanym Debian 13 oraz Docker. VM miała przydzielone 2 rdzenie ( [Intel i5-6500T](https://www.intel.com/content/www/us/en/products/sku/88183/intel-core-i56500t-processor-6m-cache-up-to-3-10-ghz/specifications.html) (4c/4t 2.50/3.10Ghz) ) oraz 4GB RAM.

Podczasu testów zuzywało ok. 30% CPU (2 core) oraz ~500MB RAM.
