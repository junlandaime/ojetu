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
            typeof crypto.randomUUID === "function"
        ) {
            sessionId = crypto.randomUUID();
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
            !Array.isArray(parsedHistory) ||
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

const createMessage = (sender, text) => {
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

const getRecentHistory = (messages) => {
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

const extractBotReply = (data) => {
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
                typeof value === "string" &&
                value.trim().length > 0
        );

    return foundReply || null;
};

const containsAny = (text, keywords) => {
    const normalizedText =
        text.toLowerCase();

    return keywords.some((keyword) =>
        normalizedText.includes(
            keyword.toLowerCase()
        )
    );
};

const getPreviousUserMessages = (messages) => {
    return messages.filter(
        (item) => item.sender === "user"
    );
};

const getPreviousAssistantMessages = (
    messages
) => {
    return messages.filter(
        (item) => item.sender === "bot"
    );
};

const getLastUserMessage = (messages) => {
    const userMessages =
        getPreviousUserMessages(
            messages
        );

    if (userMessages.length === 0) {
        return "";
    }

    return userMessages[
    userMessages.length - 1
        ].text;
};

const getLastAssistantMessage = (
    messages
) => {
    const assistantMessages =
        getPreviousAssistantMessages(
            messages
        );

    if (assistantMessages.length === 0) {
        return "";
    }

    return assistantMessages[
    assistantMessages.length - 1
        ].text;
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
- Gunakan Bahasa Indonesia yang baik, jelas, sopan, dan sesuai kaidah EYD/PUEBI yang berlaku.
- Jawab langsung sesuai pertanyaan.
- Gunakan paragraf pendek agar mudah dibaca.
- Jika terdapat beberapa pilihan, gunakan daftar bullet.
- Jika terdapat langkah atau urutan, gunakan daftar bernomor.
- Jangan membuat tabel Markdown.
- Jangan mengulang informasi yang tidak diperlukan.
`.trim();
    }

    const previousUserMessage =
        getLastUserMessage(messages);

    const previousAssistantMessage =
        getLastAssistantMessage(
            messages
        );

    const previousContext =
        getRecentHistory(messages);

    const previousUserMessagesText =
        previousContext
            .filter(
                (item) =>
                    item.role ===
                    "user"
            )
            .map(
                (item) =>
                    item.content
            )
            .join(" | ");

    const previousAssistantMessagesText =
        previousContext
            .filter(
                (item) =>
                    item.role ===
                    "assistant"
            )
            .map(
                (item) =>
                    item.content
            )
            .join(" | ");

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

Riwayat percakapan yang relevan:
${previousUserMessagesText}

${previousAssistantMessagesText}

Pertanyaan pengguna sekarang:
"${message}"

Pahami pertanyaan sekarang sebagai pertanyaan lanjutan dari percakapan sebelumnya. Karena pengguna sebelumnya sedang membahas ketersediaan program secara online, maka ketika pengguna bertanya "apa saja programnya", maksudnya adalah program yang tersedia secara online, bukan seluruh program FITALENTA.

Instruksi jawaban:
- Gunakan Bahasa Indonesia yang baik, jelas, sopan, dan sesuai kaidah EYD/PUEBI yang berlaku.
- Jawab langsung dan fokus pada konteks percakapan sebelumnya.
- Jangan kembali memberikan seluruh daftar program jika konteks menunjukkan pengguna sedang mempersempit pertanyaan.
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
- Gunakan Bahasa Indonesia yang baik, jelas, sopan, dan sesuai kaidah EYD/PUEBI yang berlaku.
- Gunakan bullet jika ada beberapa pilihan.
- Gunakan paragraf pendek.
- Jangan mengulang informasi yang tidak diperlukan.
- Jangan menggunakan tabel Markdown.
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
- Gunakan Bahasa Indonesia yang baik, jelas, sopan, dan sesuai kaidah EYD/PUEBI yang berlaku.
- Jika ada beberapa biaya, gunakan daftar bernomor atau bullet.
- Gunakan paragraf pendek.
- Jangan menggunakan tabel Markdown.
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
- Gunakan Bahasa Indonesia yang baik, jelas, sopan, dan sesuai kaidah EYD/PUEBI yang berlaku.
- Jika menjelaskan tahapan, gunakan daftar bernomor.
- Gunakan kalimat yang singkat dan jelas.
- Jangan menggunakan tabel Markdown.
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
- Gunakan Bahasa Indonesia yang baik, jelas, sopan, dan sesuai kaidah EYD/PUEBI yang berlaku.
- Gunakan daftar bullet atau nomor jika sesuai.
- Gunakan paragraf pendek.
- Jangan menggunakan tabel Markdown.
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
- Gunakan Bahasa Indonesia yang baik, jelas, sopan, dan sesuai kaidah EYD/PUEBI yang berlaku.
- Gunakan paragraf pendek.
- Gunakan daftar bullet untuk beberapa pilihan atau item.
- Gunakan daftar bernomor untuk langkah atau urutan.
- Jangan membuat tabel Markdown.
- Jawab secara langsung dan tidak bertele-tele.
`.trim();
};

const formatBotText = (text) => {
    if (!text) {
        return null;
    }

    const normalizedText = text
        .replace(/\r\n/g, "\n")
        .replace(/\r/g, "\n")
        .trim();

    const lines =
        normalizedText.split("\n");

    const elements = [];

    let bulletItems = [];
    let numberedItems = [];

    const flushBulletList = () => {
        if (bulletItems.length === 0) {
            return;
        }

        elements.push(
            <ul
                key={`bullet-${elements.length}`}
                className="fitalenta-chat-list"
            >
                {bulletItems.map(
                    (item, index) => (
                        <li key={index}>
                            {item}
                        </li>
                    )
                )}
            </ul>
        );

        bulletItems = [];
    };

    const flushNumberedList = () => {
        if (
            numberedItems.length === 0
        ) {
            return;
        }

        elements.push(
            <ol
                key={`number-${elements.length}`}
                className="fitalenta-chat-list"
            >
                {numberedItems.map(
                    (item, index) => (
                        <li key={index}>
                            {item}
                        </li>
                    )
                )}
            </ol>
        );

        numberedItems = [];
    };

    const renderInlineText = (line) => {
        const parts =
            line.split(
                /(\*\*[^*]+\*\*|__[^_]+__)/
            );

        return parts.map(
            (part, index) => {
                if (
                    (part.startsWith(
                            "**"
                        ) &&
                        part.endsWith(
                            "**"
                        )) ||
                    (part.startsWith(
                            "__"
                        ) &&
                        part.endsWith(
                            "__"
                        ))
                ) {
                    return (
                        <strong
                            key={index}
                        >
                            {part.slice(
                                2,
                                -2
                            )}
                        </strong>
                    );
                }

                return (
                    <span
                        key={index}
                    >
                        {part}
                    </span>
                );
            }
        );
    };

    lines.forEach((rawLine) => {
        const line = rawLine.trim();

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
                {renderInlineText(line)}
            </p>
        );
    });

    flushBulletList();
    flushNumberedList();

    return elements;
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
        useState(getSavedMessages);

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
                JSON.stringify(messages)
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
                behavior: "smooth",
            }
        );
    }, [messages, loading]);

    useEffect(() => {
        if (!isOpen) {
            return undefined;
        }

        const timeout = setTimeout(() => {
            inputRef.current?.focus();
        }, 150);

        return () => {
            clearTimeout(timeout);
        };
    }, [isOpen]);

    const handleSendMessage = async (
        customMessage = null
    ) => {
        const message = (
            customMessage !== null
                ? customMessage
                : input
        ).trim();

        if (!message || loading) {
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
                await sendChatMessage({
                    message:
                    contextualMessage,
                    sessionId,
                    history,
                });

            console.log(
                "FITALENTA AI response:",
                data
            );

            const reply =
                extractBotReply(data);

            if (!reply) {
                throw new Error(
                    "Response chatbot tidak berisi jawaban."
                );
            }

            const botMessage =
                createMessage(
                    "bot",
                    reply
                );

            setMessages(
                (currentMessages) => [
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
                    "Maaf, terjadi gangguan saat menghubungi FITALENTA AI. Silakan coba lagi beberapa saat."
                );

            setMessages(
                (currentMessages) => [
                    ...currentMessages,
                    errorMessage,
                ]
            );
        } finally {
            setLoading(false);
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
                        setIsOpen(true)
                    }
                    aria-label="Buka FITALENTA AI"
                >
                    <span className="fitalenta-chatbot-launcher-icon">
                        <BotIcon />
                    </span>

                    <span>
                        Tanya FITALENTA AI
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
                                    FITALENTA AI Assistant
                                </h2>

                                <span>
                                    Virtual Career Assistant
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
                            (message) => (
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
                                        "bot"
                                            ? formatBotText(
                                                message.text
                                            )
                                            : message.text}
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
                            maxLength={1000}
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