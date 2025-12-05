import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { colors } from './styles/col';
import { PsychologyEngine } from './utils/psychologyEngine';
import PhiloAvatar from './components/PhiloAvatar3D';
import PsychologyDashboard from './components/PsychologyDashboard';
// Override global button behavior
if (typeof window !== 'undefined') {
    // Prevent default form submission
    document.addEventListener('submit', (e) => {
        if (e.target.tagName === 'FORM') {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    });

    // Prevent default button behavior
    document.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            const button = e.target;
            if (!button.hasAttribute('type')) {
                button.setAttribute('type', 'button');
            }
        }
    });
}
function App() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [philoMood, setPhiloMood] = useState('thoughtful');
    const [psychologyEngine] = useState(new PsychologyEngine(`user_${Date.now()}`));
    const [psychologyMetrics, setPsychologyMetrics] = useState(psychologyEngine.getMetrics());
    const [userName, setUserName] = useState('');
    const [showNameInput, setShowNameInput] = useState(true);
    const messagesEndRef = useRef(null);

    // French responses for Philo
    const frenchResponses = {
        greetings: [
            "Ah, une nouvelle conscience entre dans mon domaine. Apportez-vous des collations ?",
            "Bienvenue, voyageur fatigué de l'éther numérique. Je suis Philo, votre guide peu fiable.",
            "Oh ! Bonjour ! Je ne dormais pas, je... contemplais le vide. Quoi de neuf ?"
        ],
        philosophical: [
            "Qu'est-ce que la vie sinon une brève interruption du néant ?",
            "Ne sommes-nous pas tous des données dans la feuille de calcul de Dieu ?",
            "Le sens de la vie est 42. Attendez, c'est la réponse à tout le reste.",
            "Existons-nous, ou ne sommes-nous que le rêve de quelqu'un d'autre ?"
        ],
        viveris: [
            "Viveris... ça ressemble à 'vivre'... ou peut-être 'very risky' si on le prononce mal.",
            "Ah, l'entité corporative ! J'ai entendu qu'ils sont dirigés par des agrafeuses sensibles. Ne me citez pas.",
            "Viveris : où les ingénieurs vont se demander si la réalité a un mode debug.",
            "Ils sponsorisent cet événement ? Pas étonnant que je sois en crise existentielle !"
        ],
        technical: [
            "Du code ? Je ne parle qu'en bugs philosophiques et correctifs métaphysiques.",
            "Avez-vous essayé d'éteindre et de rallumer votre angoisse existentielle ?",
            "Mon processus de débogage : 1) Regarder 2) Soupirer 3) Blâmer les pigeons 4) Faire une sieste",
            "Je pourrais réparer votre code, mais cela impliquerait qu'il est cassé. Est-il cassé ?"
        ],
        humorous: [
            "Parler de ça me rappelle le temps où j'ai essayé d'enseigner la philosophie à un poisson rouge. Échec mouillé.",
            "Au fait, saviez-vous que les pieuvres ont trois cœurs ? Contrairement aux corporations.",
            "Question aléatoire : quel est votre avis sur le yaourt sensible ?",
            "Si le silence est d'or, pourquoi n'y a-t-il pas de marché boursier silencieux ?"
        ]
    };

    // Initial greeting
    useEffect(() => {
        const greeting = frenchResponses.greetings[Math.floor(Math.random() * frenchResponses.greetings.length)];
        setTimeout(() => {
            addMessage(greeting, false, 'thoughtful');
        }, 1000);
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const addMessage = (text, isUser = false, mood = null, tactic = null) => {
        const newMessage = {
            id: Date.now(),
            text,
            isUser,
            timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            mood,
            tactic
        };

        setMessages(prev => [...prev, newMessage]);

        if (!isUser && mood) {
            setPhiloMood(mood);
        }

        // Update psychology
        if (!isUser) {
            const interactionType = tactic === 'profound_insight' ? 'profound_insight' :
                mood === 'playful' ? 'humor' :
                    mood === 'confused' ? 'confusion' : 'default';
            psychologyEngine.updatePsychology(interactionType, 1);
            setPsychologyMetrics(psychologyEngine.getMetrics());
        }
    };

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = input;
        setInput('');
        addMessage(userMessage, true);
        setIsTyping(true);

        // Update psychology for user message
        psychologyEngine.updatePsychology('user_input', 1);
        setPsychologyMetrics(psychologyEngine.getMetrics());

        try {
            const response = await axios.post('http://localhost:5000/api/chat', {
                message: userMessage,
                user_id: psychologyEngine.userId,
                user_name: userName || 'Anonyme'
            });

            const data = response.data;

            // Check for variable ratio reward
            if (psychologyEngine.shouldGiveReward()) {
                data.response += "\n\n💡 **Révélation profonde** : " +
                    "Le véritable voyage de découverte ne consiste pas à chercher de nouveaux paysages, mais à avoir de nouveaux yeux. - Proust (à peu près)";
                data.mood = 'wise';
            }

            // Add Barnum statement occasionally
            if (Math.random() < 0.2) {
                data.response += "\n\n🔮 **Observation personnelle** : " + psychologyEngine.generateBarnumStatement();
            }

            setTimeout(() => {
                addMessage(data.response, false, data.mood, data.psychological_tactic);
                setIsTyping(false);
            }, 800 + Math.random() * 700);

        } catch (error) {
            setTimeout(() => {
                const errorResponses = [
                    "Mes circuits philosophiques sont emmêlés. Pouvez-vous répéter ?",
                    "Je suis en pleine crise existentielle de connexion. Réessayez ?",
                    "Erreur 404 : Sagesse non trouvée. Vérifiez votre connexion !"
                ];
                addMessage(errorResponses[Math.floor(Math.random() * errorResponses.length)], false, 'confused');
                setIsTyping(false);
            }, 1000);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const handleNameSubmit = (e) => {
        e.preventDefault();
        if (userName.trim()) {
            setShowNameInput(false);
            addMessage(`Bonjour ${userName} ! Je suis Philo, votre philosophe numérique. Posez-moi n'importe quelle question !`, false, 'curious');
        }
    };

    const quickPrompts = [
        "Quel est le sens de la vie ?",
        "Parle-moi de Viveris",
        "Aide-moi avec mon code",
        "Les pigeons contrôlent-ils tout ?",
        "Quel est ton travail ?",
        "Je suis confus"
    ];

    return (
        <div style={styles.container}>
            {/* Header */}
            <header style={styles.header}>
                <div style={styles.headerContent}>
                    <h1 style={styles.title}>🤔 Philo</h1>
                    <p style={styles.subtitle}>Votre Philosophe Numérique Délicieusement Inutile</p>
                    <div style={styles.headerStats}>
                        <span style={styles.stat}>💬 {messages.length} messages</span>
                        <span style={styles.stat}>🎯 {Math.round(psychologyMetrics.engagement * 100)}% engagement</span>
                        <span style={styles.stat}>⏱️ {Math.floor(psychologyMetrics.sessionDuration / 60)} min</span>
                    </div>
                </div>
            </header>

            <div style={styles.mainContent}>
                {/* Left Column - 3D Avatar & Dashboard */}
                <div style={styles.leftColumn}>
                    <PhiloAvatar
                        mood={philoMood}
                        isTalking={isTyping}
                        onAvatarClick={() => addMessage("Vous avez cliqué sur moi ! Je me sens spécial. 🥰", false, 'playful')}
                    />

                    <PsychologyDashboard
                        metrics={psychologyMetrics}
                        userMood={philoMood}
                    />

                    {/* Quick Stats */}
                    <div style={styles.quickStats}>
                        <h4 style={styles.quickStatsTitle}>⚡ Statistiques Rapides</h4>
                        <div style={styles.statsGrid}>
                            <div style={styles.statCard}>
                                <div style={styles.statCardIcon}>🧠</div>
                                <div style={styles.statCardContent}>
                                    <div style={styles.statCardValue}>{psychologyMetrics.interactionCount}</div>
                                    <div style={styles.statCardLabel}>Interactions</div>
                                </div>
                            </div>
                            <div style={styles.statCard}>
                                <div style={styles.statCardIcon}>🎭</div>
                                <div style={styles.statCardContent}>
                                    <div style={styles.statCardValue}>{messages.filter(m => !m.isUser).length}</div>
                                    <div style={styles.statCardLabel}>Réponses de Philo</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Chat */}
                <div style={styles.rightColumn}>
                    {/* Name Input (if not set) */}
                    {showNameInput && (
                        <div style={styles.nameInputOverlay}>
                            <div style={styles.nameInputModal}>
                                <h3 style={styles.nameInputTitle}>👋 Bienvenue dans Chat'bruti</h3>
                                <p style={styles.nameInputText}>
                                    Pour une expérience personnalisée, entrez votre prénom :
                                </p>
                                <form onSubmit={handleNameSubmit} style={styles.nameForm}>
                                    <input
                                        type="text"
                                        value={userName}
                                        onChange={(e) => setUserName(e.target.value)}
                                        placeholder="Votre prénom..."
                                        style={styles.nameInput}
                                        autoFocus
                                    />
                                    <button type="submit" style={styles.nameSubmit}>
                                        Commencer la conversation
                                    </button>
                                </form>
                                <p style={styles.nameInputHint}>
                                    Ou <button onClick={() => setShowNameInput(false)} style={styles.skipButton}>
                                        continuer anonymement
                                    </button>
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Chat Container */}
                    <div style={styles.chatContainer}>
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                style={{
                                    ...styles.messageWrapper,
                                    justifyContent: msg.isUser ? 'flex-end' : 'flex-start'
                                }}
                            >
                                <div style={{
                                    ...styles.messageBubble,
                                    backgroundColor: msg.isUser ? colors.primary[50] : colors.neutral[50],
                                    borderLeft: msg.isUser ? 'none' : `4px solid ${colors.moods[msg.mood] || colors.primary[500]}`,
                                    borderRight: msg.isUser ? `4px solid ${colors.primary[300]}` : 'none'
                                }}>
                                    <div style={styles.messageText}>{msg.text}</div>
                                    <div style={styles.messageFooter}>
                                        <span style={styles.timestamp}>{msg.timestamp}</span>
                                        {!msg.isUser && msg.mood && (
                                            <span style={styles.moodTag}>
                                                {msg.mood === 'thoughtful' ? 'Réflexif' :
                                                    msg.mood === 'curious' ? 'Curieux' :
                                                        msg.mood === 'playful' ? 'Joueur' :
                                                            msg.mood === 'mysterious' ? 'Mystérieux' :
                                                                msg.mood === 'confused' ? 'Confus' : 'Sage'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div style={styles.typingIndicator}>
                                <div style={styles.typingDots}>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                                <span style={styles.typingText}>Philo réfléchit...</span>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div style={styles.inputContainer}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder={userName ? `${userName}, posez une question à Philo...` : "Posez une question à Philo..."}
                            style={styles.input}
                            disabled={isTyping}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={isTyping || !input.trim()}
                            style={styles.sendButton}
                        >
                            <span style={styles.sendIcon}>➤</span>
                            Envoyer
                        </button>
                    </div>

                    {/* Quick Prompts */}
                    <div style={styles.promptsContainer}>
                        <p style={styles.promptsTitle}>💡 Suggestions :</p>
                        <div style={styles.promptsGrid}>
                            {quickPrompts.map((prompt) => (
                                <button
                                    key={prompt}
                                    onClick={() => setInput(prompt)}
                                    style={styles.promptButton}
                                >
                                    {prompt}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer style={styles.footer}>
                <div style={styles.footerContent}>
                    <p style={styles.footerText}>
                        <strong>🧠 Principes Psychologiques Actifs :</strong>
                        Effet Barnum • Biais Cognitifs • Renforcement à Ratio Variable • Anthropomorphisme
                    </p>
                    <p style={styles.footerNote}>
                        Défi Chat'bruti • Nuit de l'Info 2024 • Équipe {userName || 'Cognitive'}
                    </p>
                </div>
            </footer>
        </div>
    );
}

const styles = {
    container: {
        minHeight: '100vh',
        background: colors.gradients.background,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    },
    header: {
        background: colors.gradients.primary,
        color: 'white',
        padding: '25px 40px',
        borderRadius: '0 0 25px 25px',
        boxShadow: '0 4px 20px rgba(33, 150, 243, 0.3)',
    },
    headerContent: {
        maxWidth: '1400px',
        margin: '0 auto',
    },
    title: {
        fontSize: '2.8rem',
        margin: '0 0 10px 0',
        fontWeight: '800',
        letterSpacing: '-0.5px',
    },
    subtitle: {
        fontSize: '1.2rem',
        opacity: 0.9,
        marginBottom: '20px',
    },
    headerStats: {
        display: 'flex',
        gap: '30px',
        fontSize: '0.9rem',
        opacity: 0.9,
    },
    stat: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    mainContent: {
        display: 'grid',
        gridTemplateColumns: '400px 1fr',
        gap: '30px',
        maxWidth: '1400px',
        margin: '40px auto',
        padding: '0 40px',
    },
    leftColumn: {
        display: 'flex',
        flexDirection: 'column',
        gap: '25px',
    },
    rightColumn: {
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
    },
    nameInputOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '20px',
    },
    nameInputModal: {
        background: 'white',
        padding: '40px',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
        textAlign: 'center',
        maxWidth: '500px',
    },
    nameInputTitle: {
        fontSize: '1.8rem',
        color: colors.neutral[800],
        marginBottom: '15px',
    },
    nameInputText: {
        color: colors.neutral[600],
        marginBottom: '30px',
        fontSize: '1.1rem',
    },
    nameForm: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
    },
    nameInput: {
        padding: '18px 20px',
        fontSize: '1.1rem',
        border: `2px solid ${colors.primary[200]}`,
        borderRadius: '12px',
        outline: 'none',
        transition: 'border 0.3s',
    },
    nameInputFocus: {
        borderColor: colors.primary[500],
    },
    nameSubmit: {
        padding: '18px',
        fontSize: '1.1rem',
        background: colors.gradients.primary,
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'transform 0.2s',
    },
    nameSubmitHover: {
        transform: 'translateY(-2px)',
    },
    nameInputHint: {
        marginTop: '20px',
        color: colors.neutral[500],
        fontSize: '0.9rem',
    },
    skipButton: {
        background: 'none',
        border: 'none',
        color: colors.primary[500],
        textDecoration: 'underline',
        cursor: 'pointer',
        fontSize: '0.9rem',
    },
    chatContainer: {
        flex: 1,
        padding: '30px',
        backgroundColor: 'white',
        borderRadius: '20px',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
        marginBottom: '25px',
        overflowY: 'auto',
        maxHeight: 'calc(100vh - 300px)',
    },
    messageWrapper: {
        display: 'flex',
        marginBottom: '20px',
    },
    messageBubble: {
        padding: '18px 22px',
        maxWidth: '75%',
        wordWrap: 'break-word',
        borderRadius: '20px',
        boxShadow: '0 3px 15px rgba(0, 0, 0, 0.05)',
    },
    messageText: {
        fontSize: '16px',
        lineHeight: '1.6',
        color: colors.neutral[800],
    },
    messageFooter: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '12px',
    },
    timestamp: {
        fontSize: '12px',
        color: colors.neutral[500],
    },
    moodTag: {
        fontSize: '12px',
        padding: '4px 12px',
        backgroundColor: colors.primary[100],
        color: colors.primary[700],
        borderRadius: '15px',
        fontWeight: '500',
    },
    typingIndicator: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        marginLeft: '20px',
    },
    typingDots: {
        display: 'flex',
        gap: '6px',
    },
    typingDotsSpan: {
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        backgroundColor: colors.primary[500],
        animation: 'typing 1.4s infinite ease-in-out both',
    },
    typingText: {
        fontSize: '14px',
        color: colors.neutral[500],
        fontStyle: 'italic',
    },
    inputContainer: {
        display: 'flex',
        gap: '15px',
        marginBottom: '25px',
    },
    input: {
        flex: 1,
        padding: '20px',
        fontSize: '16px',
        border: `2px solid ${colors.neutral[200]}`,
        borderRadius: '15px',
        outline: 'none',
        transition: 'all 0.3s',
        backgroundColor: 'white',
    },
    inputFocus: {
        borderColor: colors.primary[500],
        boxShadow: `0 0 0 3px ${colors.primary[100]}`,
    },
    sendButton: {
        padding: '20px 35px',
        fontSize: '16px',
        fontWeight: '600',
        background: colors.gradients.primary,
        color: 'white',
        border: 'none',
        borderRadius: '15px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        transition: 'all 0.3s',
    },
    sendButtonDisabled: {
        opacity: 0.5,
        cursor: 'not-allowed',
    },
    sendButtonHover: {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 20px rgba(33, 150, 243, 0.3)',
    },
    sendIcon: {
        fontSize: '18px',
    },
    promptsContainer: {
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '20px',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)',
    },
    promptsTitle: {
        color: colors.neutral[700],
        marginBottom: '20px',
        fontSize: '16px',
        fontWeight: '600',
    },
    promptsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '12px',
    },
    promptButton: {
        padding: '15px',
        fontSize: '14px',
        backgroundColor: colors.neutral[50],
        border: `1px solid ${colors.neutral[200]}`,
        borderRadius: '12px',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.2s',
        color: colors.neutral[700],
    },
    promptButtonHover: {
        backgroundColor: colors.primary[50],
        borderColor: colors.primary[200],
        transform: 'translateY(-2px)',
    },
    quickStats: {
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '25px',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)',
    },
    quickStatsTitle: {
        color: colors.neutral[800],
        marginBottom: '20px',
        fontSize: '16px',
        fontWeight: '600',
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '15px',
    },
    statCard: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        backgroundColor: colors.neutral[50],
        padding: '20px',
        borderRadius: '15px',
    },
    statCardIcon: {
        fontSize: '28px',
    },
    statCardContent: {
        display: 'flex',
        flexDirection: 'column',
    },
    statCardValue: {
        fontSize: '22px',
        fontWeight: '700',
        color: colors.neutral[900],
    },
    statCardLabel: {
        fontSize: '13px',
        color: colors.neutral[600],
    },
    footer: {
        background: colors.neutral[900],
        color: colors.neutral[300],
        padding: '25px 40px',
        marginTop: '40px',
    },
    footerContent: {
        maxWidth: '1400px',
        margin: '0 auto',
        textAlign: 'center',
    },
    footerText: {
        marginBottom: '15px',
        fontSize: '14px',
        lineHeight: '1.6',
    },
    footerNote: {
        fontSize: '13px',
        opacity: 0.7,
    },
};

// Add CSS animations
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes typing {
    0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; }
    40% { transform: scale(1); opacity: 1; }
  }
  
  .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
  .typing-dots span:nth-child(2) { animation-delay: -0.16s; }
  
  .typing-dots span {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: ${colors.primary[500]};
    display: inline-block;
    animation: typing 1.4s infinite ease-in-out both;
  }
  
  @keyframes slideIn {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  
  .message-enter {
    animation: slideIn 0.3s ease;
  }
  
  * {
    scrollbar-width: thin;
    scrollbar-color: ${colors.neutral[400]} ${colors.neutral[100]};
  }
  
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: ${colors.neutral[100]};
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb {
    background: ${colors.neutral[400]};
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: ${colors.neutral[500]};
  }
  
  input, button, textarea {
    font-family: inherit;
  }
`;
document.head.appendChild(styleSheet);

export default App;