const puppeteer = require('puppeteer-core');

// Pobieranie zmiennych środowiskowych
const REFRESH_ENABLED = process.env.REFRESH_ENABLED === 'true';
// Konwersja minut na milisekundy (domyślnie 30 minut)
const REFRESH_INTERVAL_MS = (parseInt(process.env.REFRESH_INTERVAL_MINUTES) || 30) * 60 * 1000;
const URL = process.env.TARGET_URL || 'https://google.com';

(async () => {
    console.log(`Uruchamianie przeglądarki dla: ${URL}`);

    const browser = await puppeteer.launch({
        executablePath: '/usr/bin/chromium',
        headless: false,
        ignoreDefaultArgs: ["--enable-automation"],
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-infobars',
            '--disable-features=TranslateUI',
            '--disable-default-apps',
            '--disable-component-extensions-with-background-pages',
            '--window-position=0,0',
            '--window-size=1280,720',
            '--kiosk',
            '--start-fullscreen'
        ]
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 1 });

    // --- FUNKCJA ODŚWIEŻANIA ---
    const refreshPage = async () => {
        try {
            console.log(`\n--- Odświeżanie strony (${URL}) ---\n`);
            // Używamy reload, aby ponownie załadować stronę, czekając na DOM
            await page.reload({ waitUntil: 'domcontentloaded' });
            await page.evaluate(() => {
                document.body.style.overflow = 'hidden';
            });
        } catch (e) {
            console.error(`Błąd podczas odświeżania strony: ${e.message}`);
            // Można dodać tu logikę do restartu, jeśli błąd jest krytyczny
        }
    };
    // --------------------------

    // Pierwsze załadowanie
    await page.goto(URL, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => {
        document.body.style.overflow = 'hidden';
    });

    // Uruchomienie cyklicznego odświeżania, jeśli włączone
    if (REFRESH_ENABLED) {
        console.log(`🔄 Automatyczne odświeżanie WŁĄCZONE. Interwał: ${REFRESH_INTERVAL_MS / 60000} minut.`);
        setInterval(refreshPage, REFRESH_INTERVAL_MS);
    } else {
        console.log('❌ Automatyczne odświeżanie WYŁĄCZONE.');
    }

    console.log('Strona otwarta. Czekam...');
    await new Promise(() => { });
})();