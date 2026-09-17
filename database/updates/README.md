# Penambahan kategori layanan

File `20260917_add_service_categories.sql` menambahkan Pelatihan, Penyaluran, dan Pelatihan dan Penyaluran ke tabel `program_categories`.

Untuk database yang sudah berjalan, pilih database registrasi yang benar di phpMyAdmin, lalu jalankan hanya file SQL tambahan ini setelah review. Jangan mengimpor ulang `schema2.sql` ke database yang sudah berisi data; schema lengkap ditujukan untuk inisialisasi database baru.

Kategori lama, ID, deskripsi kategori yang sudah ada, dan relasi `programs.category_id` dipertahankan. Nama diperiksa tanpa membedakan kapital dan spasi di awal/akhir. Jalankan berurutan, bukan serentak. Script memerlukan tabel asli dengan ID AUTO_INCREMENT. Tidak ada perubahan konfigurasi koneksi dan tidak ada eksekusi otomatis.

Program lama tidak otomatis dipindahkan ke tiga kategori baru. Pemetaan program perlu ditentukan oleh PIC melalui manajemen program. Filter halaman publik juga perlu direview agar tiga kategori layanan ditampilkan sesuai kebutuhan.

Validasi: logika penambahan, pemeliharaan ID/relasi dan pengulangan diuji pada SQLite. Belum dijalankan pada MySQL atau database produksi.
