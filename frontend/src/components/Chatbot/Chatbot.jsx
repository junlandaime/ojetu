import { useEffect, useRef, useState } from "react";
import { sendChatMessage } from "../../services/chatbotService";
import "./chatbot.css";

const SESSION_STORAGE_KEY =
    "fitalenta_chat_session";

const HISTORY_STORAGE_KEY =
    "fitalenta_chat_history";

const INITIAL_MESSAGE = {
    id: "welcome-message",
    sender: "bot",
    text: "Halo! Saya FITALENTA AI Assistant. Ada yang bisa saya bantu seputar layanan konsultasi, program pelatihan, atau panduan pengembangan karier Anda?",
};

const FALLBACK_MESSAGE =
    "Mohon maaf, saya belum dapat menjawab pertanyaan Anda dengan tepat.\n\nUntuk mendapatkan informasi yang lebih lengkap dan sesuai kebutuhan Anda, silakan hubungi tim FITALENTA melalui WhatsApp.";

const WHATSAPP_URL =
    "https://wa.me/6281110119273";

const WHATSAPP_NUMBER =
    "+62 811-1011-9273";

const EMAIL_FITALENTA =
    "info@fitalenta.co.id";

const FAQ_ITEMS = [
    "Apakah program tersedia secara online?",
    "Bagaimana cara mendaftar?",
    "Apa saja program yang tersedia?",
];

const MAX_HISTORY = 12;

const getSessionId = () => {
    let sessionId = localStorage.getItem(
        SESSION_STORAGE_KEY
    );

    if (!sessionId) {
        if (
            typeof crypto !== "undefined" &&
            typeof crypto.randomUUID ===
            "function"
        ) {
            sessionId =
                crypto.randomUUID();
        } else {
            sessionId =
                Date.now().toString(36) +
                Math.random()
                    .toString(36)
                    .substring(2);
        }

        localStorage.setItem(
            SESSION_STORAGE_KEY,
            sessionId
        );
    }

    return sessionId;
};

const getSavedMessages = () => {
    try {
        const savedHistory =
            localStorage.getItem(
                HISTORY_STORAGE_KEY
            );

        if (!savedHistory) {
            return [INITIAL_MESSAGE];
        }

        const parsedHistory =
            JSON.parse(savedHistory);

        if (
            !Array.isArray(
                parsedHistory
            ) ||
            parsedHistory.length === 0
        ) {
            return [INITIAL_MESSAGE];
        }

        return parsedHistory;
    } catch (error) {
        console.error(
            "Gagal membaca riwayat chatbot:",
            error
        );

        return [INITIAL_MESSAGE];
    }
};

const createMessage = (
    sender,
    text
) => {
    return {
        id:
            Date.now() +
            Math.random()
                .toString(36)
                .substring(2),
        sender,
        text,
    };
};

const getRecentHistory = (
    messages
) => {
    return messages
        .filter(
            (item) =>
                item.id !==
                "welcome-message"
        )
        .slice(-MAX_HISTORY)
        .map((item) => ({
            role:
                item.sender === "user"
                    ? "user"
                    : "assistant",
            content: item.text,
        }));
};

const extractBotReply = (
    data
) => {
    if (!data) {
        return null;
    }

    if (typeof data === "string") {
        return data;
    }

    const possibleReplies = [
        data.reply,
        data.answer,
        data.message,
        data.text,
        data.response,
        data.output,
        data.result,
        data.data?.reply,
        data.data?.answer,
        data.data?.message,
        data.data?.text,
        data.data?.response,
        data.data?.output,
        data.result?.reply,
        data.result?.answer,
        data.result?.message,
        data.result?.text,
        data.result?.response,
    ];

    const foundReply =
        possibleReplies.find(
            (value) =>
                typeof value ===
                "string" &&
                value.trim().length >
                0
        );

    return foundReply || null;
};

const isUnableToAnswer = (
    text
) => {
    if (!text) {
        return true;
    }

    const normalizedText =
        text
            .toLowerCase()
            .replace(/\s+/g, " ")
            .trim();

    const fallbackIndicators = [
        "belum dapat memberikan jawaban",
        "belum bisa memberikan jawaban",
        "belum dapat menjawab",
        "belum bisa menjawab",
        "belum dapat memberikan informasi",
        "belum bisa memberikan informasi",
        "tidak dapat memberikan jawaban",
        "tidak bisa memberikan jawaban",
        "tidak dapat menjawab",
        "tidak bisa menjawab",
        "tidak menemukan jawaban",
        "belum menemukan jawaban",
        "informasi yang lebih jelas",
        "informasi tersebut tidak tersedia",
        "informasi tersebut belum tersedia",
        "agar mendapatkan informasi yang lebih jelas",
        "hubungi tim fitalenta",
        "hubungi fitalenta",
        "hubungi tim fitalenta melalui whatsapp",
        "melalui whatsapp",
        "silakan hubungi",
        "maaf, saya belum",
        "maaf saya belum",
        "maaf, saya tidak",
        "maaf saya tidak",
    ];

    return fallbackIndicators.some(
        (indicator) =>
            normalizedText.includes(
                indicator
            )
    );
};

const containsAny = (
    text,
    keywords
) => {
    const normalizedText =
        text.toLowerCase();

    return keywords.some(
        (keyword) =>
            normalizedText.includes(
                keyword.toLowerCase()
            )
    );
};

const getLastUserMessage = (
    messages
) => {
    for (
        let index =
            messages.length - 1;
        index >= 0;
        index--
    ) {
        if (
            messages[index]
                .sender === "user"
        ) {
            return messages[index]
                .text;
        }
    }

    return "";
};

const getLastAssistantMessage = (
    messages
) => {
    for (
        let index =
            messages.length - 1;
        index >= 0;
        index--
    ) {
        if (
            messages[index]
                .sender === "bot"
        ) {
            return messages[index]
                .text;
        }
    }

    return "";
};

const buildContextualMessage = (
    currentMessage,
    messages
) => {
    const message =
        currentMessage.trim();

    if (!message) {
        return message;
    }

    if (messages.length <= 1) {
        return `
${message}

Instruksi jawaban:
- Gunakan Bahasa Indonesia yang baik, jelas, sopan, dan sesuai kaidah EYD.
- Jawab langsung sesuai pertanyaan.
- Gunakan paragraf pendek.
- Jika terdapat beberapa pilihan, gunakan daftar bullet.
- Jika terdapat langkah atau urutan, gunakan daftar bernomor.
- Jangan menggunakan tabel Markdown.
- Jangan mengulang informasi yang tidak diperlukan.
`.trim();
    }

    const previousUserMessage =
        getLastUserMessage(
            messages
        );

    const previousAssistantMessage =
        getLastAssistantMessage(
            messages
        );

    const previousContext =
        getRecentHistory(messages);

    const isProgramFollowUp =
        containsAny(message, [
            "programnya",
            "program apa",
            "program apa saja",
            "programnya apa",
            "apa saja program",
            "yang mana",
            "yang tersedia",
        ]);

    const previousQuestionWasOnline =
        containsAny(
            previousUserMessage,
            [
                "online",
                "daring",
                "secara online",
                "online atau tidak",
            ]
        );

    if (
        isProgramFollowUp &&
        previousQuestionWasOnline
    ) {
        return `
Konteks percakapan sebelumnya:
Pengguna sebelumnya bertanya:
"${previousUserMessage}"

Jawaban AI sebelumnya:
"${previousAssistantMessage}"

Pertanyaan pengguna sekarang:
"${message}"

Pahami pertanyaan sekarang sebagai pertanyaan lanjutan dari percakapan sebelumnya. Karena pengguna sebelumnya sedang membahas ketersediaan program secara online, maka ketika pengguna bertanya "apa saja programnya", maksudnya adalah program yang tersedia secara online, bukan seluruh program FITALENTA.

Instruksi jawaban:
- Gunakan Bahasa Indonesia yang baik, jelas, sopan, dan sesuai kaidah EYD.
- Jawab langsung dan fokus pada konteks percakapan sebelumnya.
- Jika terdapat beberapa program, gunakan daftar bernomor atau bullet.
- Gunakan paragraf pendek.
- Jangan menggunakan tabel Markdown.
`.trim();
    }

    const isOnlineFollowUp =
        containsAny(message, [
            "yang online",
            "online yang mana",
            "bisa online",
            "secara online",
            "yang daring",
            "daring yang mana",
        ]);

    if (
        isOnlineFollowUp &&
        previousUserMessage
    ) {
        return `
Konteks percakapan sebelumnya:
"${previousUserMessage}"

Jawaban AI sebelumnya:
"${previousAssistantMessage}"

Pertanyaan pengguna sekarang:
"${message}"

Pahami pertanyaan ini sebagai pertanyaan lanjutan terhadap topik sebelumnya dan fokuskan jawaban hanya pada pilihan yang tersedia secara online.

Instruksi jawaban:
- Gunakan Bahasa Indonesia yang baik, jelas, sopan, dan sesuai kaidah EYD.
- Gunakan bullet jika terdapat beberapa pilihan.
- Gunakan paragraf pendek.
- Jangan mengulang informasi yang tidak diperlukan.
`.trim();
    }

    const isPriceFollowUp =
        containsAny(message, [
            "berapa biayanya",
            "berapa harganya",
            "biayanya berapa",
            "harganya berapa",
            "berapa biaya",
            "berapa harga",
            "biaya",
            "harga",
        ]);

    if (
        isPriceFollowUp &&
        previousUserMessage
    ) {
        return `
Konteks percakapan sebelumnya:
"${previousUserMessage}"

Jawaban AI sebelumnya:
"${previousAssistantMessage}"

Pertanyaan pengguna sekarang:
"${message}"

Pahami pertanyaan ini sebagai pertanyaan lanjutan terhadap program atau layanan yang sedang dibahas sebelumnya. Berikan biaya untuk konteks program atau layanan tersebut, bukan seluruh daftar harga FITALENTA.

Instruksi jawaban:
- Gunakan Bahasa Indonesia yang baik, jelas, sopan, dan sesuai kaidah EYD.
- Jika terdapat beberapa biaya, gunakan daftar bernomor atau bullet.
- Gunakan paragraf pendek.
`.trim();
    }

    const isRegistrationFollowUp =
        containsAny(message, [
            "cara daftar",
            "bagaimana daftarnya",
            "cara mendaftar",
            "bagaimana cara mendaftar",
            "daftarnya bagaimana",
        ]);

    if (
        isRegistrationFollowUp &&
        previousUserMessage
    ) {
        return `
Konteks percakapan sebelumnya:
"${previousUserMessage}"

Jawaban AI sebelumnya:
"${previousAssistantMessage}"

Pertanyaan pengguna sekarang:
"${message}"

Jelaskan cara mendaftar untuk program atau layanan yang sedang dibahas sebelumnya.

Instruksi jawaban:
- Gunakan Bahasa Indonesia yang baik, jelas, sopan, dan sesuai kaidah EYD.
- Jika menjelaskan tahapan, gunakan daftar bernomor.
- Gunakan kalimat yang singkat dan jelas.
`.trim();
    }

    const isFollowUp =
        containsAny(message, [
            "tadi",
            "sebelumnya",
            "yang itu",
            "yang tadi",
            "kalau itu",
            "kalau yang tadi",
            "tersebut",
            "program tersebut",
            "yang dimaksud",
            "bagaimana dengan itu",
            "kalau yang ini",
        ]);

    if (
        isFollowUp &&
        previousUserMessage
    ) {
        return `
Konteks percakapan sebelumnya:
Pertanyaan pengguna:
"${previousUserMessage}"

Jawaban AI:
"${previousAssistantMessage}"

Pertanyaan pengguna sekarang:
"${message}"

Jawab sebagai kelanjutan dari percakapan sebelumnya. Jangan memulai topik baru dan jangan meminta pengguna mengulangi informasi yang sudah diberikan.

Instruksi jawaban:
- Gunakan Bahasa Indonesia yang baik, jelas, sopan, dan sesuai kaidah EYD.
- Gunakan daftar bullet atau nomor jika sesuai.
- Gunakan paragraf pendek.
`.trim();
    }

    return `
Konteks percakapan sebelumnya:
${JSON.stringify(
        previousContext,
        null,
        2
    )}

Pertanyaan pengguna sekarang:
"${message}"

Jawab dengan mempertimbangkan konteks percakapan sebelumnya.

Instruksi jawaban:
- Gunakan Bahasa Indonesia yang baik, jelas, sopan, dan sesuai kaidah EYD.
- Gunakan paragraf pendek.
- Gunakan daftar bullet untuk beberapa pilihan atau item.
- Gunakan daftar bernomor untuk langkah atau urutan.
- Jawab secara langsung dan tidak bertele-tele.
`.trim();
};

const renderInlineText = (
    line
) => {
    const urlRegex =
        /(https?:\/\/[^\s]+|wa\.me\/[^\s]+|[\w.+-]+@[\w.-]+\.[A-Za-z]{2,})/g;

    const parts =
        line.split(urlRegex);

    return parts.map(
        (part, index) => {
            if (
                /^https?:\/\//i.test(
                    part
                )
            ) {
                const cleanUrl =
                    part.replace(
                        /[.,!?;:]$/,
                        ""
                    );

                return (
                    <a
                        key={index}
                        href={cleanUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="fitalenta-chat-link"
                    >
                        {cleanUrl}
                    </a>
                );
            }

            if (
                /^wa\.me\//i.test(
                    part
                )
            ) {
                const cleanValue =
                    part.replace(
                        /[.,!?;:]$/,
                        ""
                    );

                return (
                    <a
                        key={index}
                        href={`https://${cleanValue}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="fitalenta-chat-link"
                    >
                        {cleanValue}
                    </a>
                );
            }

            if (
                /^[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(
                    part
                )
            ) {
                return (
                    <a
                        key={index}
                        href={`mailto:${part}`}
                        className="fitalenta-chat-link"
                    >
                        {part}
                    </a>
                );
            }

            const boldParts =
                part.split(
                    /(\*\*[^*]+\*\*|__[^_]+__)/
                );

            return boldParts.map(
                (
                    boldPart,
                    boldIndex
                ) => {
                    if (
                        (
                            boldPart.startsWith(
                                "**"
                            ) &&
                            boldPart.endsWith(
                                "**"
                            )
                        ) ||
                        (
                            boldPart.startsWith(
                                "__"
                            ) &&
                            boldPart.endsWith(
                                "__"
                            )
                        )
                    ) {
                        return (
                            <strong
                                key={`${index}-${boldIndex}`}
                            >
                                {boldPart.slice(
                                    2,
                                    -2
                                )}
                            </strong>
                        );
                    }

                    return (
                        <span
                            key={`${index}-${boldIndex}`}
                        >
                            {boldPart}
                        </span>
                    );
                }
            );
        }
    );
};

const formatBotText = (
    text
) => {
    if (!text) {
        return null;
    }

    const normalizedText =
        text
            .replace(/\r\n/g, "\n")
            .replace(/\r/g, "\n")
            .trim();

    const lines =
        normalizedText.split("\n");

    const elements = [];

    let bulletItems = [];
    let numberedItems = [];

    const flushBulletList = () => {
        if (
            bulletItems.length ===
            0
        ) {
            return;
        }

        elements.push(
            <ul
                key={`bullet-${elements.length}`}
                className="fitalenta-chat-list"
            >
                {bulletItems.map(
                    (
                        item,
                        index
                    ) => (
                        <li key={index}>
                            {renderInlineText(
                                item
                            )}
                        </li>
                    )
                )}
            </ul>
        );

        bulletItems = [];
    };

    const flushNumberedList = () => {
        if (
            numberedItems.length ===
            0
        ) {
            return;
        }

        elements.push(
            <ol
                key={`number-${elements.length}`}
                className="fitalenta-chat-list"
            >
                {numberedItems.map(
                    (
                        item,
                        index
                    ) => (
                        <li key={index}>
                            {renderInlineText(
                                item
                            )}
                        </li>
                    )
                )}
            </ol>
        );

        numberedItems = [];
    };

    lines.forEach(
        (rawLine) => {
            const line =
                rawLine.trim();

            if (!line) {
                flushBulletList();
                flushNumberedList();
                return;
            }

            const bulletMatch =
                line.match(
                    /^(?:[-*•])\s+(.+)$/
                );

            if (bulletMatch) {
                flushNumberedList();

                bulletItems.push(
                    bulletMatch[1].trim()
                );

                return;
            }

            const numberedMatch =
                line.match(
                    /^\d+[.)]\s+(.+)$/
                );

            if (numberedMatch) {
                flushBulletList();

                numberedItems.push(
                    numberedMatch[1].trim()
                );

                return;
            }

            flushBulletList();
            flushNumberedList();

            const headingMatch =
                line.match(
                    /^(#{1,3})\s+(.+)$/
                );

            if (headingMatch) {
                elements.push(
                    <strong
                        key={`heading-${elements.length}`}
                        className="fitalenta-chat-heading"
                    >
                        {renderInlineText(
                            headingMatch[2]
                        )}
                    </strong>
                );

                return;
            }

            const boldOnlyMatch =
                line.match(
                    /^\*\*(.+)\*\*$/
                );

            if (boldOnlyMatch) {
                elements.push(
                    <strong
                        key={`strong-${elements.length}`}
                        className="fitalenta-chat-heading"
                    >
                        {
                            boldOnlyMatch[1]
                        }
                    </strong>
                );

                return;
            }

            elements.push(
                <p
                    key={`paragraph-${elements.length}`}
                    className="fitalenta-chat-paragraph"
                >
                    {renderInlineText(
                        line
                    )}
                </p>
            );
        }
    );

    flushBulletList();
    flushNumberedList();

    return elements;
};

const FallbackMessage = () => {
    return (
        <div className="fitalenta-chat-fallback">
            <p className="fitalenta-chat-paragraph">
                Mohon maaf, saya belum
                dapat menjawab
                pertanyaan Anda
                dengan tepat.
            </p>

            <p className="fitalenta-chat-paragraph">
                Untuk mendapatkan
                informasi yang lebih
                lengkap dan sesuai
                kebutuhan Anda,
                silakan hubungi tim
                FITALENTA melalui
                WhatsApp.
            </p>

            <div className="fitalenta-chat-whatsapp-info">
                <span>
                    WhatsApp:{" "}
                    {WHATSAPP_NUMBER}
                </span>
            </div>

            <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="fitalenta-chat-whatsapp-button"
            >
                <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <path
                        d="M20.5 11.3a8.4 8.4 0 0 1-12.4 7.3L4 20l1.4-4a8.4 8.4 0 1 1 15.1-4.7Z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M8.7 8.4c.2-.4.4-.5.7-.5h.5c.2 0 .4.1.5.4l.6 1.4c.1.3.1.5-.1.7l-.4.5c-.1.1-.1.3 0 .5.4.7 1 1.3 1.7 1.8.6.4 1.1.6 1.5.7.2 0 .3 0 .4-.2l.5-.6c.2-.2.4-.2.7-.1l1.4.6c.3.1.4.3.4.6v.5c0 .3-.1.5-.4.7-.4.3-.9.5-1.4.5-.8 0-1.9-.3-3.2-1.1-1.1-.7-2.1-1.7-2.8-2.8-.8-1.3-1.1-2.4-1.1-3.2 0-.5.2-1 .5-1.4Z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>

                <span>
                    Chat via WhatsApp
                </span>
            </a>

            <p className="fitalenta-chat-fallback-email">
                Anda juga dapat
                menghubungi kami melalui
                email{" "}
                <a
                    href={`mailto:${EMAIL_FITALENTA}`}
                    className="fitalenta-chat-link"
                >
                    {EMAIL_FITALENTA}
                </a>
                .
            </p>
        </div>
    );
};

const BotIcon = () => {
    return (
        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <rect
                x="4"
                y="6"
                width="16"
                height="11"
                rx="3"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
            />
            <path
                d="M9 11h.01M15 11h.01"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <path
                d="M9 14h6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
            />
            <path
                d="M12 6V4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
            />
            <circle
                cx="12"
                cy="3"
                r="1"
                fill="currentColor"
            />
        </svg>
    );
};

const SendIcon = () => {
    return (
        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <path
                d="M4 4l16 8-16 8 3-8-3-8z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M7 12h13"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
            />
        </svg>
    );
};

const CloseIcon = () => {
    return (
        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <path
                d="M6 6l12 12M18 6L6 18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
        </svg>
    );
};

const NewChatIcon = () => {
    return (
        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <path
                d="M6 8h12M8 8V6h8v2M9 8v10M15 8v10M5 8l1 12h12l1-12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

const Chatbot = () => {
    const [isOpen, setIsOpen] =
        useState(false);

    const [messages, setMessages] =
        useState(
            getSavedMessages
        );

    const [input, setInput] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const messagesEndRef =
        useRef(null);

    const inputRef =
        useRef(null);

    useEffect(() => {
        try {
            localStorage.setItem(
                HISTORY_STORAGE_KEY,
                JSON.stringify(
                    messages
                )
            );
        } catch (error) {
            console.error(
                "Gagal menyimpan memory chatbot:",
                error
            );
        }
    }, [messages]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView(
            {
                behavior:
                    "smooth",
            }
        );
    }, [
        messages,
        loading,
    ]);

    useEffect(() => {
        if (!isOpen) {
            return undefined;
        }

        const timeout =
            setTimeout(() => {
                inputRef.current?.focus();
            }, 150);

        return () =>
            clearTimeout(
                timeout
            );
    }, [isOpen]);

    const handleSendMessage =
        async (
            customMessage = null
        ) => {
            const message = (
                customMessage !==
                null
                    ? customMessage
                    : input
            ).trim();

            if (
                !message ||
                loading
            ) {
                return;
            }

            const userMessage =
                createMessage(
                    "user",
                    message
                );

            const updatedMessages = [
                ...messages,
                userMessage,
            ];

            setMessages(
                updatedMessages
            );

            setInput("");
            setLoading(true);

            try {
                const sessionId =
                    getSessionId();

                const history =
                    getRecentHistory(
                        updatedMessages
                    );

                const contextualMessage =
                    buildContextualMessage(
                        message,
                        messages
                    );

                console.log(
                    "FITALENTA AI message:",
                    contextualMessage
                );

                console.log(
                    "FITALENTA AI history:",
                    history
                );

                const data =
                    await sendChatMessage(
                        {
                            message:
                            contextualMessage,
                            sessionId,
                            history,
                        }
                    );

                console.log(
                    "FITALENTA AI response:",
                    data
                );

                let reply =
                    extractBotReply(
                        data
                    );

                if (
                    !reply ||
                    isUnableToAnswer(
                        reply
                    )
                ) {
                    reply =
                        FALLBACK_MESSAGE;
                }

                const botMessage =
                    createMessage(
                        "bot",
                        reply
                    );

                setMessages(
                    (
                        currentMessages
                    ) => [
                        ...currentMessages,
                        botMessage,
                    ]
                );
            } catch (error) {
                console.error(
                    "FITALENTA AI error:",
                    error
                );

                const errorMessage =
                    createMessage(
                        "bot",
                        FALLBACK_MESSAGE
                    );

                setMessages(
                    (
                        currentMessages
                    ) => [
                        ...currentMessages,
                        errorMessage,
                    ]
                );
            } finally {
                setLoading(
                    false
                );
            }
        };

    const handleSubmit = (
        event
    ) => {
        event.preventDefault();

        handleSendMessage();
    };

    const handleFaqClick = (
        question
    ) => {
        handleSendMessage(
            question
        );
    };

    const handleNewChat = () => {
        localStorage.removeItem(
            SESSION_STORAGE_KEY
        );

        localStorage.removeItem(
            HISTORY_STORAGE_KEY
        );

        setMessages([
            INITIAL_MESSAGE,
        ]);

        setInput("");
    };

    return (
        <div className="fitalenta-chatbot">
            {!isOpen && (
                <button
                    type="button"
                    className="fitalenta-chatbot-launcher"
                    onClick={() =>
                        setIsOpen(
                            true
                        )
                    }
                    aria-label="Buka FITALENTA AI"
                >
                    <span className="fitalenta-chatbot-launcher-icon">
                        <BotIcon />
                    </span>

                    <span>
                        Tanya
                        FITALENTA AI
                    </span>
                </button>
            )}

            {isOpen && (
                <section
                    className="fitalenta-chatbot-window"
                    aria-label="FITALENTA AI Assistant"
                >
                    <header className="fitalenta-chatbot-header">
                        <div className="fitalenta-chatbot-header-left">
                            <div className="fitalenta-chatbot-avatar">
                                <BotIcon />
                            </div>

                            <div className="fitalenta-chatbot-header-title">
                                <h2>
                                    FITALENTA
                                    AI
                                    Assistant
                                </h2>

                                <span>
                                    Virtual
                                    Career
                                    Assistant
                                </span>
                            </div>
                        </div>

                        <div className="fitalenta-chatbot-header-actions">
                            <button
                                type="button"
                                onClick={
                                    handleNewChat
                                }
                                aria-label="Percakapan baru"
                                title="Percakapan baru"
                            >
                                <NewChatIcon />
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    setIsOpen(
                                        false
                                    )
                                }
                                aria-label="Tutup chatbot"
                                title="Tutup"
                            >
                                <CloseIcon />
                            </button>
                        </div>
                    </header>

                    <div className="fitalenta-chatbot-messages">
                        {messages.map(
                            (
                                message
                            ) => (
                                <div
                                    key={
                                        message.id
                                    }
                                    className={`fitalenta-chat-message-row ${
                                        message.sender ===
                                        "user"
                                            ? "is-user"
                                            : "is-bot"
                                    }`}
                                >
                                    {message.sender ===
                                        "bot" && (
                                            <div className="fitalenta-chat-message-avatar">
                                                <BotIcon />
                                            </div>
                                        )}

                                    <div className="fitalenta-chat-message-bubble">
                                        {message.sender ===
                                        "bot" ? (
                                            message.text ===
                                            FALLBACK_MESSAGE ? (
                                                <FallbackMessage />
                                            ) : (
                                                formatBotText(
                                                    message.text
                                                )
                                            )
                                        ) : (
                                            message.text
                                        )}
                                    </div>
                                </div>
                            )
                        )}

                        {loading && (
                            <div className="fitalenta-chat-message-row is-bot">
                                <div className="fitalenta-chat-message-avatar">
                                    <BotIcon />
                                </div>

                                <div className="fitalenta-chat-typing">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        )}

                        <div
                            ref={
                                messagesEndRef
                            }
                        />
                    </div>

                    <div className="fitalenta-chatbot-faq">
                        <span className="fitalenta-chatbot-faq-label">
                            TOP FAQ:
                        </span>

                        <div className="fitalenta-chatbot-faq-list">
                            {FAQ_ITEMS.map(
                                (
                                    question
                                ) => (
                                    <button
                                        type="button"
                                        key={
                                            question
                                        }
                                        onClick={() =>
                                            handleFaqClick(
                                                question
                                            )
                                        }
                                        disabled={
                                            loading
                                        }
                                    >
                                        {
                                            question
                                        }
                                    </button>
                                )
                            )}
                        </div>
                    </div>

                    <form
                        className="fitalenta-chatbot-input-wrapper"
                        onSubmit={
                            handleSubmit
                        }
                    >
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(
                                event
                            ) =>
                                setInput(
                                    event
                                        .target
                                        .value
                                )
                            }
                            placeholder="Ketik pertanyaan Anda..."
                            disabled={
                                loading
                            }
                            maxLength={
                                1000
                            }
                            autoComplete="off"
                        />

                        <button
                            type="submit"
                            disabled={
                                !input.trim() ||
                                loading
                            }
                            aria-label="Kirim pertanyaan"
                            title="Kirim"
                        >
                            <SendIcon />
                        </button>
                    </form>
                </section>
            )}
        </div>
    );
};

export default Chatbot;