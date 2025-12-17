// Konfigurasi runtime untuk deployment statis (mis. cPanel)
// Ubah nilai di bawah ini tanpa rebuild bila perlu.
// window.__APP_CONFIG__ = {
//   // Contoh: "https://api.domainanda.com/api"
//   // VITE_API_URL: "https://try.fitalenta.co.id",
//   VITE_API_URL: "http://localhost:5001",
//   // Contoh: "https://cdn.domainanda.com/uploads"
//   VITE_FILE_BASE_URL: "https://registrasi.fitalenta.co.id",
// };

// config.js (runtime config)
(function () {
  const host = window.location.hostname; // contoh: "localhost" atau "registrasi.fitalenta.co.id" [web:19]

  const isLocalhost =
    host === "localhost" ||
    host === "127.0.0.1" ||
    host === "[::1]" ||
    /^127(?:\.(?:25[0-5]|2[0-4]\d|[01]?\d?\d)){3}$/.test(host);

  window.__APP_CONFIG__ = {
    VITE_API_URL: isLocalhost
      ? "http://localhost:5001"
      : "https://try.fitalenta.co.id",

    VITE_FILE_BASE_URL: isLocalhost
      ? "http://localhost:3000"
      : "https://registrasi.fitalenta.co.id",
  };
})();
