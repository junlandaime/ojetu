export const PROGRAM_IMAGES = {
    1: "/images/home_regular.jpg",
    2: "/images/home_hybrid.jpg",
    3: "/images/home_fast_track.jpg",
    4: "/images/home_asrama.jpg",
    9: "/images/home_beasiswa.jpg",
    10: "/images/home_gijinkoku.jpg",
    11: "/images/home_korea.jpg",
    12: "/images/home_gijinkoku.jpg",
    13: "/images/home_amto.jpg",

    reguler: "/images/home_regular.jpg",
    regular: "/images/home_regular.jpg",

    asrama: "/images/home_asrama.jpg",

    hybrid: "/images/home_hybrid.jpg",

    "fast-track": "/images/home_fast_track.jpg",
    fasttrack: "/images/home_fast_track.jpg",

    beasiswa: "/images/home_beasiswa.jpg",

    korea: "/images/home_korea.jpg",

    amto: "/images/home_amto.jpg",
};


export function getProgramImage(program) {
    if (!program) {
        return "/images/hero_home.jpg";
    }

    return (
        PROGRAM_IMAGES[program.id] ||
        PROGRAM_IMAGES[
            String(program.name)
                .toLowerCase()
                .replace(/program|\s|-/g,"")
            ] ||
        program.image ||
        "/images/hero_home.jpg"
    );
}