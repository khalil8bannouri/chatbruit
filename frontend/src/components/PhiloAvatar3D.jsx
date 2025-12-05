import React, { useState, useEffect } from 'react';
import { colors } from '../styles/col';

const PhiloAvatar = ({ mood = 'thoughtful', isTalking = false, onAvatarClick }) => {
    const [eyeBlink, setEyeBlink] = useState(false);
    const [mouthOpen, setMouthOpen] = useState(false);

    // Mood configurations
    const moodConfigs = {
        thoughtful: {
            emoji: '🤔',
            color: colors.moods.thoughtful,
            description: 'Réflexion profonde',
            bgGradient: `linear-gradient(135deg, ${colors.primary[300]}, ${colors.primary[500]})`
        },
        curious: {
            emoji: '😲',
            color: colors.moods.curious,
            description: 'Curiosité intense',
            bgGradient: `linear-gradient(135deg, ${colors.secondary[300]}, ${colors.secondary[500]})`
        },
        playful: {
            emoji: '😄',
            color: colors.moods.playful,
            description: 'Joueur et espiègle',
            bgGradient: `linear-gradient(135deg, ${colors.accent[300]}, ${colors.accent[500]})`
        },
        mysterious: {
            emoji: '🕵️',
            color: colors.moods.mysterious,
            description: 'Mystérieux et énigmatique',
            bgGradient: `linear-gradient(135deg, #9C27B0, #7B1FA2)`
        },
        confused: {
            emoji: '😕',
            color: colors.moods.confused,
            description: 'Légèrement perdu',
            bgGradient: `linear-gradient(135deg, #FF5722, #E64A19)`
        },
        wise: {
            emoji: '🧙',
            color: colors.moods.wise,
            description: 'Sagesse ancienne',
            bgGradient: `linear-gradient(135deg, #795548, #5D4037)`
        }
    };

    const config = moodConfigs[mood] || moodConfigs.thoughtful;

    // Eye blink animation
    useEffect(() => {
        const blinkInterval = setInterval(() => {
            setEyeBlink(true);
            setTimeout(() => setEyeBlink(false), 150);
        }, 3000);

        return () => clearInterval(blinkInterval);
    }, []);

    // Mouth animation when talking
    useEffect(() => {
        if (isTalking) {
            const talkInterval = setInterval(() => {
                setMouthOpen(prev => !prev);
            }, 200);
            return () => clearInterval(talkInterval);
        } else {
            setMouthOpen(false);
        }
    }, [isTalking]);

    return (
        <div style={styles.container}>
            <div
                style={{
                    ...styles.avatarWrapper,
                    background: config.bgGradient,
                    boxShadow: `0 15px 35px ${config.color}40, 0 5px 15px rgba(0,0,0,0.1)`,
                    borderColor: config.color
                }}
                onClick={onAvatarClick}
                className="avatar-hover"
            >
                {/* Animated particles */}
                <div style={styles.particles}>
                    {[...Array(8)].map((_, i) => (
                        <div
                            key={i}
                            style={{
                                ...styles.particle,
                                backgroundColor: config.color,
                                animationDelay: `${i * 0.2}s`,
                                left: `${20 + (i % 4) * 20}%`,
                                top: `${10 + Math.floor(i / 4) * 40}%`
                            }}
                        />
                    ))}
                </div>

                {/* Face */}
                <div style={styles.face}>
                    {/* Eyes */}
                    <div style={styles.eyes}>
                        <div style={{
                            ...styles.eye,
                            transform: eyeBlink ? 'scaleY(0.1)' : 'scaleY(1)',
                            transition: 'transform 0.15s'
                        }}>
                            <div style={styles.pupil} />
                        </div>
                        <div style={{
                            ...styles.eye,
                            transform: eyeBlink ? 'scaleY(0.1)' : 'scaleY(1)',
                            transition: 'transform 0.15s'
                        }}>
                            <div style={styles.pupil} />
                        </div>
                    </div>

                    {/* Mouth */}
                    <div style={{
                        ...styles.mouth,
                        height: mouthOpen ? '25px' : '10px',
                        borderRadius: mouthOpen ? '50%' : '10px 10px 50% 50%',
                        backgroundColor: mood === 'playful' ? colors.accent[500] : '#E91E63'
                    }} />
                </div>

                {/* Large emoji overlay */}
                <div style={styles.emojiOverlay}>
                    <span style={{
                        ...styles.emoji,
                        filter: `drop-shadow(0 5px 10px ${config.color}80)`
                    }}>
                        {config.emoji}
                    </span>
                </div>
            </div>

            {/* Mood info */}
            <div style={styles.infoPanel}>
                <div style={styles.moodDisplay}>
                    <div style={{
                        ...styles.moodDot,
                        backgroundColor: config.color,
                        animation: 'pulse 2s infinite'
                    }} />
                    <div>
                        <div style={styles.moodLabel}>HUMEUR ACTUELLE</div>
                        <div style={styles.moodValue}>{config.description}</div>
                    </div>
                </div>

                {/* Engagement metrics */}
                <div style={styles.metrics}>
                    <div style={styles.metric}>
                        <div style={styles.metricLabel}>Engagement</div>
                        <div style={styles.progressBar}>
                            <div style={{
                                ...styles.progressFill,
                                width: '85%',
                                backgroundColor: colors.primary[500]
                            }} />
                        </div>
                    </div>
                    <div style={styles.metric}>
                        <div style={styles.metricLabel}>Curiosité</div>
                        <div style={styles.progressBar}>
                            <div style={{
                                ...styles.progressFill,
                                width: '70%',
                                backgroundColor: colors.secondary[500]
                            }} />
                        </div>
                    </div>
                </div>

                <button
                    onClick={onAvatarClick}
                    style={{
                        ...styles.interactButton,
                        backgroundColor: config.color,
                        boxShadow: `0 5px 15px ${config.color}60`
                    }}
                    className="button-hover"
                >
                    <span style={styles.buttonIcon}>✨</span>
                    Cliquez pour interagir
                </button>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '30px',
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        borderRadius: '30px',
        boxShadow: '0 20px 50px rgba(33, 150, 243, 0.12)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        backdropFilter: 'blur(10px)',
    },
    avatarWrapper: {
        width: '250px',
        height: '250px',
        borderRadius: '50%',
        position: 'relative',
        overflow: 'hidden',
        border: '5px solid',
        marginBottom: '30px',
        cursor: 'pointer',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    particles: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    particle: {
        position: 'absolute',
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        opacity: 0.3,
        animation: 'floatParticle 3s ease-in-out infinite',
    },
    face: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '160px',
        height: '160px',
    },
    eyes: {
        position: 'absolute',
        top: '35%',
        left: '0',
        right: '0',
        display: 'flex',
        justifyContent: 'space-around',
        padding: '0 30px',
    },
    eye: {
        width: '40px',
        height: '40px',
        backgroundColor: 'white',
        borderRadius: '50%',
        border: '4px solid #333',
        overflow: 'hidden',
        position: 'relative',
        boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)',
    },
    pupil: {
        position: 'absolute',
        width: '20px',
        height: '20px',
        backgroundColor: '#333',
        borderRadius: '50%',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        transition: 'all 0.3s',
    },
    mouth: {
        position: 'absolute',
        bottom: '30%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '70px',
        transition: 'all 0.2s ease',
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)',
    },
    emojiOverlay: {
        position: 'absolute',
        bottom: '15px',
        right: '15px',
        fontSize: '50px',
        opacity: 0.8,
        filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.3))',
    },
    emoji: {
        display: 'block',
        transform: 'rotate(-5deg)',
    },
    infoPanel: {
        width: '100%',
        textAlign: 'center',
    },
    moodDisplay: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '15px',
        marginBottom: '25px',
        padding: '20px',
        backgroundColor: colors.neutral[50],
        borderRadius: '20px',
    },
    moodDot: {
        width: '20px',
        height: '20px',
        borderRadius: '50%',
    },
    moodLabel: {
        fontSize: '12px',
        color: colors.neutral[600],
        fontWeight: '600',
        letterSpacing: '1px',
        marginBottom: '5px',
    },
    moodValue: {
        fontSize: '18px',
        color: colors.neutral[800],
        fontWeight: '700',
    },
    metrics: {
        marginBottom: '25px',
    },
    metric: {
        marginBottom: '20px',
    },
    metricLabel: {
        fontSize: '14px',
        color: colors.neutral[600],
        marginBottom: '10px',
        textAlign: 'left',
        fontWeight: '500',
    },
    progressBar: {
        height: '10px',
        backgroundColor: colors.neutral[200],
        borderRadius: '5px',
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: '5px',
        transition: 'width 0.8s ease',
    },
    interactButton: {
        padding: '18px 30px',
        color: 'white',
        border: 'none',
        borderRadius: '25px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        letterSpacing: '0.5px',
    },
    buttonIcon: {
        fontSize: '20px',
    },
};

// Add CSS animations
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes pulse {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.1); opacity: 0.8; }
    100% { transform: scale(1); opacity: 1; }
  }
  
  @keyframes floatParticle {
    0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.3; }
    50% { transform: translateY(-20px) rotate(180deg); opacity: 0.6; }
  }
  
  .avatar-hover:hover {
    transform: scale(1.05) rotate(5deg);
    box-shadow: 0 25px 60px rgba(33, 150, 243, 0.25), 0 10px 25px rgba(0,0,0,0.15) !important;
  }
  
  .button-hover:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(0,0,0,0.2) !important;
  }
  
  @keyframes colorShift {
    0% { filter: hue-rotate(0deg); }
    100% { filter: hue-rotate(360deg); }
  }
  
  .breathing {
    animation: breathing 3s ease-in-out infinite;
  }
  
  @keyframes breathing {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.03); }
  }
`;
document.head.appendChild(styleSheet);

export default PhiloAvatar;