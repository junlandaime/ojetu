import React from "react";

/* =========================================================
   TEAM DATA
========================================================= */
const TEAM_MEMBERS = [
    {
        id: 1,
        name: "Agus Ismail, S.T., M.B.A.",
        position: "Direktur",
        expertise: "HR & Sales Expert",
        level: "director",
        image: "/images/tim/agus_ismail.jpg",
        icon: "bi-person-badge",
    },
    {
        id: 2,
        name: "Ratna Kosasih, S.Si., M.Sc.",
        position: "General Manager",
        level: "manager",
        image: "/images/tim/bu_ratna_gm.jpeg",
        icon: "bi-person-workspace",
    },
    {
        id: 3,
        name: "Julia Nur Maulida, M.Pd.",
        position: "Business Executive",
        level: "staff",
        image: "/images/tim/julia.jpeg",
        icon: "bi-briefcase",
    },
    {
        id: 4,
        name: "Rindra Rahmatulloh, S.T.",
        position: "Project Officer",
        level: "staff",
        image: "/images/tim/rindra.jpeg",
        icon: "bi-kanban",
    },
    {
        id: 5,
        name: "Nurul Fauziyah Jaenudin, S.A.B.",
        position: "Digital Marketer",
        level: "staff",
        image: "/images/tim/fauziyah.jpg",
        icon: "bi-megaphone",
    },
];

/* =========================================================
   MISSION DATA
========================================================= */
const MISSIONS = [
    "Menyelenggarakan program pelatihan bahasa, budaya, dan keterampilan kerja sesuai standar kebutuhan industri di Jepang.",
    "Memberikan pendampingan menyeluruh kepada peserta, mulai dari tahap pendaftaran, pelatihan, hingga proses penyaluran kerja.",
    "Menjalin kerja sama dengan perusahaan dan institusi di Jepang untuk menciptakan peluang kerja yang luas dan berkelanjutan.",
    "Membangun generasi muda Indonesia yang disiplin, profesional, serta memiliki etos kerja dan integritas tinggi.",
    "Memberikan layanan pendidikan dan penyaluran kerja yang transparan, aman, dan terpercaya.",
];

/* =========================================================
   TEAM CARD
========================================================= */
const TeamCard = ({ member, number }) => {
    return (
        <article className="about-team-card">
            <div className="about-team-photo">
                <img src={member.image} alt={`${member.name} - ${member.position}`} loading={number === 1 ? "eager" : "lazy"} />
                <div className="about-team-photo-overlay" aria-hidden="true"></div>
                <span className="about-team-number">{String(number).padStart(2, "0")}</span>
                <div className="about-team-role-icon">
                    <i className={`bi ${member.icon}`} aria-hidden="true"></i>
                </div>
            </div>
            <div className="about-team-info">
                <span className="about-team-position">{member.position}</span>
                <h3>{member.name}</h3>
                {member.expertise && <p className="about-team-expertise">{member.expertise}</p>}
                <div className="about-team-line"></div>
                <div className="about-team-brand">
                    <i className="bi bi-building-check" aria-hidden="true"></i>
                    <span>FITALENTA</span>
                </div>
            </div>
        </article>
    );
};

/* =========================================================
   COMPONENT
========================================================= */
const AboutUs = () => {
    const director = TEAM_MEMBERS.find((member) => member.level === "director");
    const manager = TEAM_MEMBERS.find((member) => member.level === "manager");
    const staffMembers = TEAM_MEMBERS.filter((member) => member.level === "staff");
    return (
        <main className="about-page">

            {/* =====================================================
                HERO
            ====================================================== */}
            <section className="about-hero" aria-label="Tentang FITALENTA">
                <div className="about-hero-background" aria-hidden="true"></div>
                <div className="about-container about-hero-inner">
                    <div className="about-hero-content">
                        <div className="about-eyebrow about-eyebrow-light">
                            <i className="bi bi-building" aria-hidden="true"></i>
                            <span>ABOUT FITALENTA</span>
                        </div>
                        <h1>Mengenal FITALENTA<span> lebih dekat</span></h1>
                        <p>Mengenal perjalanan, tujuan, serta tim yang mendampingi peserta dalam mempersiapkan langkah menuju dunia kerja internasional.</p>
                        <div className="about-hero-highlights">
                            <div><i className="bi bi-mortarboard" aria-hidden="true"></i><span>Pelatihan terarah</span></div>
                            <div><i className="bi bi-people" aria-hidden="true"></i><span>Pendampingan peserta</span></div>
                            <div><i className="bi bi-globe2" aria-hidden="true"></i><span>Persiapan karier global</span></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* =====================================================
                ABOUT FITALENTA
            ====================================================== */}
            <section className="about-intro-section">
                <div className="about-container">
                    <div className="about-intro-grid">
                        <div className="about-intro-content">
                            <div className="about-eyebrow">
                                <i className="bi bi-stars" aria-hidden="true"></i>
                                <span>WHO WE ARE</span>
                            </div>
                            <h2>Mempersiapkan talenta Indonesia untuk kesempatan yang lebih luas</h2>
                            <p><strong>FITALENTA</strong> adalah lembaga pelatihan dan penyaluran kerja yang berfokus pada persiapan serta pendampingan individu untuk berkarier di Jepang. Kami menyediakan program pelatihan yang komprehensif mencakup bahasa, budaya, serta pengembangan keterampilan sehingga setiap peserta memiliki kesiapan yang lebih baik dalam menghadapi dunia kerja internasional.</p>
                            <p>Dengan komitmen terhadap kualitas pendidikan dan integritas profesional, FITALENTA tidak hanya menjembatani peserta dengan peluang, tetapi juga mendorong pertumbuhan pribadi, kedisiplinan, kemampuan profesional, dan pemahaman lintas budaya.</p>
                            <div className="about-intro-values">
                                <div>
                                    <span className="about-value-icon"><i className="bi bi-shield-check" aria-hidden="true"></i></span>
                                    <div>
                                        <strong>Profesional</strong>
                                        <small>Proses pembinaan yang terarah dan bertanggung jawab</small>
                                    </div>
                                </div>
                                <div>
                                    <span className="about-value-icon"><i className="bi bi-person-check" aria-hidden="true"></i></span>
                                    <div>
                                        <strong>Berorientasi pada peserta</strong>
                                        <small>Pendampingan sesuai tahap perjalanan peserta</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="about-intro-visual">
                            <div className="about-intro-image">
                                <img src="/images/fitalenta_training.jpg" alt="Kegiatan pelatihan FITALENTA" />
                                <div className="about-image-overlay" aria-hidden="true"></div>
                                <div className="about-image-caption">
                                    <span>FITALENTA</span>
                                    <strong>Prepare • Develop • Grow</strong>
                                </div>
                            </div>
                            <div className="about-floating-card">
                                <div className="about-floating-icon"><i className="bi bi-compass" aria-hidden="true"></i></div>
                                <div>
                                    <small>OUR PURPOSE</small>
                                    <strong>Menghubungkan potensi dengan peluang</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* =====================================================
                VISION & MISSION
            ====================================================== */}
            <section className="about-vision-section">
                <div className="about-container">
                    <div className="about-section-heading">
                        <div className="about-eyebrow">
                            <i className="bi bi-compass" aria-hidden="true"></i>
                            <span>OUR DIRECTION</span>
                        </div>
                        <h2>Visi & Misi Kami</h2>
                        <p>Pedoman yang menjadi dasar dalam setiap langkah dan pelayanan FITALENTA.</p>
                    </div>
                    <div className="about-vision-grid">
                        <article className="about-vision-card about-vision-card-main">
                            <div className="about-vision-card-top">
                                <div className="about-vision-icon"><i className="bi bi-eye" aria-hidden="true"></i></div>
                                <span>01</span>
                            </div>
                            <div className="about-vision-label">VISI FITALENTA</div>
                            <h3>Menciptakan talenta yang siap bersaing secara global</h3>
                            <p>Menjadi lembaga pelatihan dan penyaluran kerja terpercaya yang mampu mencetak sumber daya manusia Indonesia yang terampil, berdaya saing global, dan berintegritas tinggi, khususnya untuk kesempatan kerja di Jepang.</p>
                            <div className="about-vision-decoration" aria-hidden="true"></div>
                        </article>
                        <article className="about-mission-card">
                            <div className="about-mission-header">
                                <div className="about-vision-icon about-mission-icon"><i className="bi bi-bullseye" aria-hidden="true"></i></div>
                                <div>
                                    <span>MISI FITALENTA</span>
                                    <h3>Langkah nyata menuju visi kami</h3>
                                </div>
                            </div>
                            <div className="about-mission-list">
                                {MISSIONS.map((mission, index) => (
                                    <div className="about-mission-item" key={mission}>
                                        <span className="about-mission-number">{String(index + 1).padStart(2, "0")}</span>
                                        <p>{mission}</p>
                                    </div>
                                ))}
                            </div>
                        </article>
                    </div>
                </div>
            </section>

            {/* =====================================================
                TEAM
            ====================================================== */}
            <section className="about-team-section">
                <div className="about-container">
                    <div className="about-team-heading">
                        <div>
                            <div className="about-eyebrow">
                                <i className="bi bi-people" aria-hidden="true"></i>
                                <span>MEET OUR TEAM</span>
                            </div>
                            <h2>Tim di balik FITALENTA</h2>
                            <p>Profesional yang bekerja bersama untuk menjalankan program, pelayanan, dan pengembangan FITALENTA.</p>
                        </div>
                        <div className="about-team-count">
                            <strong>{String(TEAM_MEMBERS.length).padStart(2, "0")}</strong>
                            <span>Core Team</span>
                        </div>
                    </div>

                    {/* =====================================================
                        LEADERSHIP
                    ====================================================== */}
                    <div className="about-team-group">
                        <div className="about-team-group-heading">
                            <div>
                                <span>LEADERSHIP</span>
                                <strong>Management Team</strong>
                            </div>
                        </div>
                        <div className="about-team-leadership-grid">
                            {director && (
                                <div className="about-team-director">
                                    <TeamCard member={director} number={1} />
                                </div>
                            )}
                            {manager && (
                                <div className="about-team-manager">
                                    <TeamCard member={manager} number={2} />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* =====================================================
                        OPERATIONAL TEAM
                    ====================================================== */}
                    <div className="about-team-group about-team-operational">
                        <div className="about-team-group-heading">
                            <div>
                                <span>CORE TEAM</span>
                                <strong>Operational Team</strong>
                            </div>
                        </div>
                        <div className="about-team-staff-grid">
                            {staffMembers.map((member, index) => (
                                <TeamCard key={member.id} member={member} number={index + 3} />
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};
export default AboutUs;