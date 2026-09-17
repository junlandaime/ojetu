-- Jalankan pada database registrasi yang dipilih di phpMyAdmin.
-- Hanya menambah kategori yang belum ada; tidak menghapus atau mengganti data.
-- ID dibuat oleh AUTO_INCREMENT. Relasi programs.category_id tidak diubah.
-- Jalankan satu kali secara berurutan; pengulangan tidak menggandakan nama.
START TRANSACTION;

INSERT INTO program_categories (name, description)
SELECT requested.name, requested.description
FROM (SELECT 'Pelatihan' AS name,
             'Program pelatihan untuk pengembangan kompetensi.' AS description) AS requested
WHERE NOT EXISTS (
    SELECT 1 FROM program_categories AS existing
    WHERE LOWER(TRIM(existing.name)) = LOWER(requested.name)
);

INSERT INTO program_categories (name, description)
SELECT requested.name, requested.description
FROM (SELECT 'Penyaluran' AS name,
             'Program penyaluran kerja.' AS description) AS requested
WHERE NOT EXISTS (
    SELECT 1 FROM program_categories AS existing
    WHERE LOWER(TRIM(existing.name)) = LOWER(requested.name)
);

INSERT INTO program_categories (name, description)
SELECT requested.name, requested.description
FROM (SELECT 'Pelatihan dan Penyaluran' AS name,
             'Program terpadu pelatihan dan penyaluran kerja.' AS description) AS requested
WHERE NOT EXISTS (
    SELECT 1 FROM program_categories AS existing
    WHERE LOWER(TRIM(existing.name)) = LOWER(requested.name)
);

COMMIT;
