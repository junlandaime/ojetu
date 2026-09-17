# Database pengembangan untuk review

`fitalenta-registration-dummy-kategori.sql` adalah salinan lengkap `ojetu-main/database/schema2.sql` dari repository `Lyasx1/fitalenta-registration`, branch `database/kategori-layanan-2026-09-17` (commit 713807844727a2fcbe41f743f1c0bb21dd933683), termasuk tambahan kategori Pelatihan, Penyaluran, serta Pelatihan dan Penyaluran.

Berisi struktur 10 tabel serta data yang memang tersimpan di file sumber: program, kategori, dan akun contoh. Ini bukan ekspor baru dari phpMyAdmin atau salinan database aktif terbaru. Kategori dan relasi program lama tetap dipertahankan; pemetaan program ke kategori baru belum dilakukan.

Untuk membandingkan, impor ke database pengujian kosong yang terpisah. Jangan impor schema lengkap ini ke database produksi yang sudah berisi tabel/data. File database asli repository tetap dipertahankan. Tidak ada proses impor, migrasi, atau deploy yang dijalankan dalam penyerahan ini.

Untuk hanya menambah kategori pada database yang sudah ada, file terpisah `../updates/20260917_add_service_categories.sql` tetap tersedia untuk review PIC.
