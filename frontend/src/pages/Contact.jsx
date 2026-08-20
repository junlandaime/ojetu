import React, { useState } from "react";

const Contact = () => {
    const [openFaq, setOpenFaq] = useState(0);

    /* =========================================================
       CONTACT CONFIGURATION
    ========================================================= */
    const whatsappNumber = "6281110119273";
    const defaultWhatsAppMessage =
        "Halo Fitalenta, saya ingin bertanya tentang program magang. Bisakah Anda memberikan informasi lebih lanjut?";

    const handleWhatsAppClick = (customMessage = null) => {
        const message = customMessage || defaultWhatsAppMessage;
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
            message
        )}`;
        window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    };

    /* =========================================================
       CONTACT INFORMATION
    ========================================================= */
    const contactInfo = [
        {
            icon: "bi-geo-alt",
            title: "Alamat Kantor",
            eyebrow: "Kunjungi Kami",
            content:
                "Jl. Ganesha No.15E, Lb. Siliwangi, Kecamatan Coblong, Kota Bandung, Jawa Barat 40132",
            link: "https://maps.app.goo.gl/HizqPRwZXnyn9S5p8",
            actionLabel: "Buka di Google Maps",
            featured: true,
        },
        {
            icon: "bi-clock",
            title: "Jam Operasional",
            eyebrow: "Waktu Pelayanan",
            content:
                "Senin - Jumat\n08:00 - 17:00 WIB",
            actionLabel: null,
        },
        {
            icon: "bi-telephone",
            title: "Telepon",
            eyebrow: "Hubungi Langsung",
            content: "+62 811 1011 9273",
            link: "tel:+6281110119273",
            actionLabel: "Hubungi sekarang",
        },
        {
            icon: "bi-whatsapp",
            title: "WhatsApp",
            eyebrow: "Chat Dengan Kami",
            content: "+62 811 1011 9273",
            onClick: () => handleWhatsAppClick(),
            actionLabel: "Mulai percakapan",
            type: "whatsapp",
        },
        {
            icon: "bi-envelope",
            title: "Email",
            eyebrow: "Kirim Pesan",
            content: "info@fitalenta.co.id",
            link: "mailto:info@fitalenta.co.id",
            actionLabel: "Kirim email",
        },
    ];

    /* =========================================================
       SOCIAL MEDIA
    ========================================================= */
    const socialMedia = [
        {
            name: "Facebook",
            username: "PT FAST Indo Talenta",
            icon: "bi-facebook",
            url: "https://www.facebook.com/people/PT-FAST-Indo-Talenta/61550075167981/",
        },
        {
            name: "Instagram",
            username: "@fitalenta.id",
            icon: "bi-instagram",
            url: "https://www.instagram.com/fitalenta.id/",
        },
        {
            name: "LinkedIn",
            username: "FITALENTA",
            icon: "bi-linkedin",
            // URL ini mengikuti source lama. Ganti jika URL LinkedIn resmi sudah tersedia.
            url: "https://www.facebook.com/people/PT-FAST-Indo-Talenta/61550075167981/",
        },
    ];

    /* =========================================================
       FAQ
    ========================================================= */
    const faqData = [
        {
            question: "Bagaimana cara mendaftar program pelatihan?",
            answer:
                "Anda dapat mendaftar melalui website kami dengan mengisi formulir pendaftaran online. Jika membutuhkan informasi tambahan, Anda juga dapat menghubungi tim FITALENTA melalui WhatsApp atau datang langsung ke kantor kami",
        },
        {
            question: "Berapa lama durasi pelatihan?",
            answer:
                "Durasi pelatihan bervariasi tergantung program, mulai dari 6 bulan. Detail durasi dan jadwal masing-masing program dapat dilihat pada halaman Program",
        },
        {
            question: "Apakah ada jaminan penempatan kerja?",
            answer:
                "Kami memberikan jaminan penempatan kerja bagi peserta yang telah menyelesaikan pelatihan dengan baik serta memenuhi seluruh persyaratan program",
        },
        {
            question: "Bagaimana sistem pembayaran biaya pelatihan?",
            answer:
                "Pembayaran dapat dilakukan secara bertahap. DP dilakukan saat pendaftaran dan pelunasan sebelum keberangkatan. Tersedia juga opsi cicilan sesuai ketentuan program",
        },
    ];

    const toggleFaq = (index) => {
        setOpenFaq((current) => (current === index ? null : index));
    };

    /* =========================================================
       CONTACT CARD CONTENT
    ========================================================= */
    const renderMultilineContent = (content) =>
        content.split("\n").map((line, index) => (
            <React.Fragment key={`${line}-${index}`}>
                {line}
                {index < content.split("\n").length - 1 && <br />}
            </React.Fragment>
        ));

    return (
        <div className="contact-page">
            {/* =====================================================
                HERO
            ===================================================== */}
            <section className="contact-hero">
                <div className="contact-hero-background" aria-hidden="true" />
                <div className="contact-container contact-hero-container">
                    <div className="contact-hero-content">
                        <div className="contact-hero-eyebrow">
                            <i className="bi bi-headset" aria-hidden="true" />
                            <span>PUSAT INFORMASI FITALENTA</span>
                        </div>

                        <h1>
                            Kami Siap Membantu
                            <span> Perjalanan Anda</span>
                        </h1>

                        <p>
                            Punya pertanyaan tentang program, proses pendaftaran, pembayaran,
                            atau keberangkatan? Hubungi tim FITALENTA melalui channel yang
                            paling nyaman untuk Anda
                        </p>

                        <div className="contact-hero-actions">
                            <button
                                type="button"
                                className="contact-primary-btn"
                                onClick={() => handleWhatsAppClick()}
                            >
                                <i className="bi bi-whatsapp" aria-hidden="true" />
                                <span>Chat WhatsApp</span>
                                <i className="bi bi-arrow-up-right" aria-hidden="true" />
                            </button>

                            <a
                                href="mailto:info@fitalenta.co.id"
                                className="contact-secondary-btn"
                            >
                                <i className="bi bi-envelope" aria-hidden="true" />
                                <span>Kirim Email</span>
                            </a>
                        </div>

                        <div className="contact-hero-benefits">
                            <div>
                                <i className="bi bi-geo-alt" aria-hidden="true" />
                                <span>Bandung, Jawa Barat</span>
                            </div>

                            <div>
                                <i className="bi bi-clock" aria-hidden="true" />
                                <span>Senin - Jumat</span>
                            </div>

                            <div>
                                <i className="bi bi-shield-check" aria-hidden="true" />
                                <span>Informasi resmi FITALENTA</span>
                            </div>
                        </div>
                    </div>

                    <div className="contact-hero-support-card">
                        <div className="contact-support-status">
                            <span className="contact-support-status-dot" />
                            <span>Tim FITALENTA</span>
                        </div>

                        <div className="contact-support-icon">
                            <i className="bi bi-chat-heart" aria-hidden="true" />
                        </div>

                        <h2>Ada yang ingin ditanyakan?</h2>

                        <p>
                            Tim kami akan membantu memberikan informasi sesuai kebutuhan Anda
                        </p>

                        <div className="contact-support-divider" />

                        <div className="contact-support-item">
                            <div>
                                <i className="bi bi-whatsapp" aria-hidden="true" />
                            </div>
                            <span>
                                <small>WhatsApp</small>
                                <strong>+62 811 1011 9273</strong>
                            </span>
                        </div>

                        <div className="contact-support-item">
                            <div>
                                <i className="bi bi-envelope" aria-hidden="true" />
                            </div>
                            <span>
                                <small>Email</small>
                                <strong>info@fitalenta.co.id</strong>
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* =====================================================
                  QUICK CONTACT
            ===================================================== */}
            <section className="contact-information-section">
                <div className="contact-container">
                    <div className="contact-section-heading">
                        <div className="contact-section-heading-text">
                            <span className="contact-section-eyebrow">
                                <i className="bi bi-chat-dots" aria-hidden="true" />
                                HUBUNGI KAMI
                            </span>

                            <h2>Pilih Cara Terbaik untuk Menghubungi Kami</h2>
                            <p>
                                Gunakan salah satu channel berikut untuk mendapatkan informasi
                                atau bantuan dari tim FITALENTA
                            </p>
                        </div>

                        <div className="contact-section-note">
                            <i className="bi bi-info-circle" aria-hidden="true" />
                            <span>
                                Untuk respons yang lebih cepat, kami menyarankan menghubungi
                                melalui WhatsApp
                            </span>
                        </div>
                    </div>

                    <div className="contact-info-grid">
                        {contactInfo.map((info, index) => (
                            <article
                                key={`${info.title}-${index}`}
                                className={`contact-info-card ${
                                    info.featured ? "featured" : ""
                                } ${info.type === "whatsapp" ? "whatsapp" : ""}`}
                            >
                                <div className="contact-info-card-top">
                                    <div className="contact-info-icon">
                                        <i className={`bi ${info.icon}`} aria-hidden="true" />
                                    </div>
                                    {info.type === "whatsapp" && (
                                        <span className="contact-recommended-badge">
                                            Direkomendasikan
                                        </span>
                                    )}
                                </div>

                                <div className="contact-info-content">
                                    <small>{info.eyebrow}</small>
                                    <h3>{info.title}</h3>
                                    <p>{renderMultilineContent(info.content)}</p>
                                </div>

                                {info.link && (
                                    <a
                                        href={info.link}
                                        target={info.link.startsWith("http") ? "_blank" : undefined}
                                        rel={
                                            info.link.startsWith("http")
                                                ? "noopener noreferrer"
                                                : undefined
                                        }
                                        className="contact-info-action"
                                    >
                                        <span>{info.actionLabel}</span>
                                        <i className="bi bi-arrow-up-right" aria-hidden="true" />
                                    </a>
                                )}

                                {info.onClick && (
                                    <button
                                        type="button"
                                        onClick={info.onClick}
                                        className="contact-info-action"
                                    >
                                        <span>{info.actionLabel}</span>
                                        <i className="bi bi-arrow-right" aria-hidden="true" />
                                    </button>
                                )}
                            </article>
                        ))}
                    </div>

                    {/* =================================================
                        SOCIAL MEDIA
                    ================================================= */}
                    <div className="contact-social-wrapper">
                        <div className="contact-social-heading">
                            <div className="contact-social-icon">
                                <i className="bi bi-share" aria-hidden="true" />
                            </div>

                            <div>
                                <span>IKUTI PERKEMBANGAN KAMI</span>
                                <h3>Terhubung dengan FITALENTA</h3>
                            </div>
                        </div>

                        <div className="contact-social-list">
                            {socialMedia.map((social, index) => (
                                <a
                                    key={`${social.name}-${index}`}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="contact-social-item"
                                    aria-label={`Kunjungi ${social.name} FITALENTA`}
                                >
                                    <div className="contact-social-item-icon">
                                        <i className={`bi ${social.icon}`} aria-hidden="true" />
                                    </div>

                                    <div className="contact-social-item-content">
                                        <small>{social.name}</small>
                                        <strong>{social.username}</strong>
                                    </div>

                                    <i
                                        className="bi bi-arrow-up-right contact-social-arrow"
                                        aria-hidden="true"
                                    />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* =====================================================
                 LOCATION
            ===================================================== */}
            <section className="contact-location-section">
                <div className="contact-container">
                    <div className="contact-location-layout">
                        <div className="contact-location-content">
                            <span className="contact-section-eyebrow">
                                <i className="bi bi-pin-map" aria-hidden="true" />
                                LOKASI KANTOR
                            </span>

                            <h2>Kunjungi Kantor FITALENTA</h2>

                            <p>
                                Anda juga dapat datang langsung ke kantor kami untuk konsultasi
                                dan mendapatkan informasi lebih lengkap mengenai program
                                FITALENTA
                            </p>

                            <div className="contact-location-address">
                                <div className="contact-location-address-icon">
                                    <i className="bi bi-building" aria-hidden="true" />
                                </div>

                                <div>
                                    <small>KANTOR PUSAT FITALENTA</small>
                                    <strong>Gedung Science Techno Park ITB</strong>
                                    <span>
                                        Jl. Ganesha No.15E, Lb. Siliwangi, Kecamatan Coblong, Kota
                                        Bandung, Jawa Barat 40132
                                    </span>
                                </div>
                            </div>

                            {/* Jam Operasional */}
                            <div className="contact-location-hours">
                                <div>
                                    <i className="bi bi-calendar-week"></i>
                                    <span>
                                        <small>Senin - Jumat</small>
                                        <strong>08:00 - 17:00 WIB</strong>
                                    </span>
                                </div>
                            </div>

                            <a
                                href="https://maps.app.goo.gl/HizqPRwZXnyn9S5p8"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="contact-map-button"
                            >
                                <i className="bi bi-geo-alt" aria-hidden="true" />
                                <span>Buka di Google Maps</span>
                                <i className="bi bi-arrow-up-right" aria-hidden="true" />
                            </a>
                        </div>

                        <div className="contact-map-card">
                            <div className="contact-map-header">
                                <div>
                                    <span className="contact-map-status">
                                        <i className="bi bi-geo-alt-fill" aria-hidden="true" />
                                        Bandung
                                    </span>
                                    <strong>Lokasi FITALENTA</strong>
                                </div>

                                <a
                                    href="https://maps.app.goo.gl/HizqPRwZXnyn9S5p8"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Buka lokasi FITALENTA di Google Maps"
                                >
                                    <i className="bi bi-box-arrow-up-right" aria-hidden="true" />
                                </a>
                            </div>

                            <div className="contact-map-frame">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.973225068429!2d107.60635507464781!3d-6.893805993105319!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e79861a09a0f%3A0x7edcd4dc41c3c5e1!2sGedung%20Science%20and%20Techno%20Park%20(STP)%20ITB!5e0!3m2!1sid!2sid!4v1759550448335!5m2!1sid!2sid"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Lokasi Kantor FITALENTA"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* =====================================================
                 FAQ
             ===================================================== */}
            <section className="contact-faq-section">
                <div className="contact-container">
                    <div className="contact-faq-heading">
                        <span className="contact-section-eyebrow">
                            <i className="bi bi-question-circle" aria-hidden="true" />
                            FAQ
                        </span>
                        <h2>Pertanyaan yang Sering Diajukan</h2>
                        <p>
                            Temukan jawaban cepat untuk beberapa pertanyaan yang sering
                            ditanyakan calon peserta
                        </p>
                    </div>

                    <div className="contact-faq-layout">
                        <div className="contact-faq-list">
                            {faqData.map((faq, index) => {
                                const isOpen = openFaq === index;

                                return (
                                    <article
                                        key={`${faq.question}-${index}`}
                                        className={`contact-faq-item ${isOpen ? "open" : ""}`}
                                    >
                                        <button
                                            type="button"
                                            className="contact-faq-question"
                                            onClick={() => toggleFaq(index)}
                                            aria-expanded={isOpen}
                                        >
                                            <span className="contact-faq-number">
                                                {String(index + 1).padStart(2, "0")}
                                            </span>

                                            <span className="contact-faq-question-text">
                                                {faq.question}
                                            </span>
                                            <span className="contact-faq-toggle">
                                                <i
                                                    className={`bi ${
                                                        isOpen ? "bi-dash-lg" : "bi-plus-lg"
                                                    }`} aria-hidden="true"
                                                />
                                            </span>
                                        </button>
                                        {isOpen && (
                                            <div className="contact-faq-answer">
                                                <div className="contact-faq-answer-line" />
                                                <p>{faq.answer}</p>
                                            </div>
                                        )}
                                    </article>
                                );
                            })}
                        </div>

                        <aside className="contact-faq-help">
                            <div className="contact-faq-help-icon">
                                <i className="bi bi-chat-square-dots" aria-hidden="true" />
                            </div>

                            <span>BELUM MENEMUKAN JAWABAN?</span>

                            <h3>Tanyakan langsung kepada tim kami</h3>

                            <p>
                                Kami siap membantu menjawab pertanyaan lain seputar program dan
                                pendaftaran FITALENTA
                            </p>

                            <button
                                type="button"
                                onClick={() =>
                                    handleWhatsAppClick(
                                        "Halo Fitalenta, saya memiliki pertanyaan yang belum tercantum pada FAQ. Bisakah Anda membantu?"
                                    )
                                }
                            >
                                <i className="bi bi-whatsapp" aria-hidden="true" />
                                <span>Tanya via WhatsApp</span>
                            </button>
                        </aside>
                    </div>
                </div>
            </section>

            {/* =====================================================
                CTA
            ===================================================== */}
            <section className="contact-cta-section">
                <div className="contact-container">
                    <div className="contact-cta-card">
                        <div className="contact-cta-decoration contact-cta-decoration-one" />
                        <div className="contact-cta-decoration contact-cta-decoration-two" />

                        <div className="contact-cta-content">
                            <span>MASIH ADA PERTANYAAN?</span>

                            <h2>Kami Siap Membantu Anda</h2>

                            <p>
                                Jangan ragu untuk menghubungi tim FITALENTA sebelum memulai
                                proses pendaftaran Anda
                            </p>
                        </div>

                        <div className="contact-cta-actions">
                            <button
                                type="button"
                                onClick={() =>
                                    handleWhatsAppClick(
                                        "Halo Fitalenta, saya masih ada pertanyaan tentang program magang. Bisakah Anda membantu?"
                                    )
                                }
                                className="contact-cta-whatsapp"
                            >
                                <i className="bi bi-whatsapp" aria-hidden="true" />
                                <span>Chat WhatsApp</span>
                                <i className="bi bi-arrow-right" aria-hidden="true" />
                            </button>

                            <a
                                href="mailto:info@fitalenta.co.id"
                                className="contact-cta-email"
                            >
                                <i className="bi bi-envelope" aria-hidden="true" />
                                <span>Kirim Email</span>
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;