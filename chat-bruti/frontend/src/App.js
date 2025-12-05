import React, { useState, useEffect, useRef } from 'react';
import {
    Container,
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    Avatar,
    Chip,
    LinearProgress,
    IconButton,
    Tooltip,
    Fade,
    Zoom
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';
import PsychologyIcon from '@mui/icons-material/Psychology';
import MoodIcon from '@mui/icons-material/Mood';
import MemoryIcon from '@mui/icons-material/Memory';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import axios from 'axios';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const PhiloAvatar = styled(Avatar)(({ theme, mood }) => ({
    width: 120,
    height: 120,
    border: `4px solid ${getMoodColor(mood)}`,
    boxShadow: `0 0 20px ${getMoodColor(mood)}40`,
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'scale(1.05) rotate(5deg)',
    },
}));

const MessageBubble = styled(Paper)(({ theme, isUser }) => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    maxWidth: '80%',
    alignSelf: isUser ? 'flex-end' : 'flex-start',
    backgroundColor: isUser ? '#e3f2fd' : '#f5f5f5',
    borderLeft: isUser ? 'none' : `4px solid ${theme.palette.primary.main}`,
    borderRight: isUser ? `4px solid ${theme.palette.secondary.main}` : 'none',
    borderRadius: isUser ? '20px 20px 5px 20px' : '20px 20px 20px 5px',
    animation: `${isUser ? 'slideInRight' : 'slideInLeft'} 0.3s ease`,
}));

function getMoodColor(mood) {
    const colors = {
        'pretentious': '#9c27b0',
        'childlike': '#4caf50',
        'conspiratorial': '#ff9800',
        'confused': '#795548',
        'wise': '#2196f3',
        'angry': '#f44336'
    };
    return colors[mood] || '#757575';
}

function getAvatarImage(mood) {
    // In a real app, you'd have actual images
    // For now, we'll use emoji or generate via API
    const emojis = {
        'pretentious': '🤔',
        'childlike': '😲',
        'conspiratorial': '🕵️',
        'confused': '😕',
        'wise': '🧙',
        'angry': '😠'
    };
    return emojis[mood] || '🤖';
}

function App() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [userId] = useState(`user_${Math.random().toString(36).substr(2, 9)}`);
    const [philoMood, setPhiloMood] = useState('pretentious');
    const [avatarExpression, setAvatarExpression] = useState('thoughtful');
    const [engagement, setEngagement] = useState(0.5);
    const [frustration, setFrustration] = useState(0);
    const [psychologicalTactic, setPsychologicalTactic] = useState('');
    const [fakeMemory, setFakeMemory] = useState(null);
    const messagesEndRef = useRef(null);
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        // Initial greeting from Philo
        const initialGreetings = [
            "Ah, a new consciousness enters my realm. Do you come bearing snacks?",
            "Welcome, weary traveler of the digital ether. I am Philo, your unreliable guide.",
            "Oh! Hello! I wasn't sleeping, I was... contemplating the void. What's up?"
        ];

        setTimeout(() => {
            addMessage(initialGreetings[Math.floor(Math.random() * initialGreetings.length)], false, 'pretentious');
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
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            mood: isUser ? null : mood,
            tactic: isUser ? null : tactic
        };

        setMessages(prev => [...prev, newMessage]);

        if (!isUser && mood) {
            setPhiloMood(mood);
            setAvatarExpression(getAvatarExpression(mood));
        }
    };

    const getAvatarExpression = (mood) => {
        const expressions = {
            'pretentious': 'thinking',
            'childlike': 'surprised',
            'conspiratorial': 'suspicious',
            'confused': 'confused',
            'wise': 'smiling',
            'angry': 'angry'
        };
        return expressions[mood] || 'neutral';
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = input;
        setInput('');
        addMessage(userMessage, true);
        setIsTyping(true);

        try {
            const response = await axios.post(`${API_URL}/api/chat`, {
                user_id: userId,
                message: userMessage
            });

            const data = response.data;

            // Add slight delay for "thinking" effect
            setTimeout(() => {
                addMessage(data.response, false, data.mood, data.psychological_tactic);
                setEngagement(data.user_state.engagement);
                setFrustration(data.user_state.frustration);
                setPsychologicalTactic(data.psychological_tactic);

                if (data.fake_memory) {
                    setFakeMemory(data.fake_memory);
                    setTimeout(() => setFakeMemory(null), 5000);
                }

                setIsTyping(false);
            }, 1500 + Math.random() * 1000); // Random delay for "thinking"

        } catch (error) {
            console.error('Error:', error);
            addMessage("Ah, my philosophical circuits are tangled. Try again?", false, 'confused');
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const getTacticDescription = (tactic) => {
        const descriptions = {
            'reward': 'Variable Ratio Reward: Unpredictable profound insight',
            'incongruity': 'Incongruity Theory: Unexpected connections',
            'false_memory': 'False Memory: Creating shared history illusion',
            'projection': 'Projection: Making it about you',
            'mood_based': 'Mood-Based Response: Current emotional state',
            'childlike_defusion': 'Childlike Defusion: Reducing tension with silliness'
        };
        return descriptions[tactic] || 'Psychological Strategy Active';
    };

    return (
        <Container maxWidth="lg" sx={{ height: '100vh', py: 3 }}>
            <Box display="flex" flexDirection="column" height="100%">
                {/* Header */}
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                    <Box display="flex" alignItems="center" gap={2}>
                        <Zoom in={true}>
                            <PhiloAvatar mood={philoMood} sx={{ fontSize: '3rem' }}>
                                {getAvatarImage(philoMood)}
                            </PhiloAvatar>
                        </Zoom>
                        <Box>
                            <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
                                Philo 🤔
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary">
                                Your Delightfully Unhelpful Philosopher-Bot
                            </Typography>
                            <Box display="flex" gap={1} mt={1}>
                                <Chip
                                    icon={<MoodIcon />}
                                    label={`Mood: ${philoMood}`}
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                />
                                {psychologicalTactic && (
                                    <Chip
                                        icon={<PsychologyIcon />}
                                        label={getTacticDescription(psychologicalTactic)}
                                        size="small"
                                        color="secondary"
                                        variant="outlined"
                                    />
                                )}
                            </Box>
                        </Box>
                    </Box>

                    <Tooltip title="Psychological Engagement Metrics">
                        <Box width={200}>
                            <Typography variant="caption" display="block" gutterBottom>
                                Engagement: {(engagement * 100).toFixed(0)}%
                            </Typography>
                            <LinearProgress
                                variant="determinate"
                                value={engagement * 100}
                                color={engagement > 0.7 ? "success" : engagement > 0.4 ? "warning" : "error"}
                                sx={{ height: 8, borderRadius: 4 }}
                            />
                            <Typography variant="caption" display="block" gutterBottom sx={{ mt: 1 }}>
                                Frustration: {(frustration * 100).toFixed(0)}%
                            </Typography>
                            <LinearProgress
                                variant="determinate"
                                value={frustration * 100}
                                color={frustration > 0.6 ? "error" : "warning"}
                                sx={{ height: 8, borderRadius: 4 }}
                            />
                        </Box>
                    </Tooltip>
                </Box>

                {/* Fake Memory Alert */}
                {fakeMemory && (
                    <Fade in={!!fakeMemory}>
                        <Paper
                            sx={{
                                mb: 2,
                                p: 2,
                                bgcolor: '#fff3e0',
                                borderLeft: '4px solid #ff9800',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }}
                        >
                            <MemoryIcon color="warning" />
                            <Typography variant="body2">
                                <strong>False Memory Triggered:</strong> {fakeMemory}
                            </Typography>
                        </Paper>
                    </Fade>
                )}

                {/* Chat Messages */}
                <Paper
                    elevation={3}
                    sx={{
                        flex: 1,
                        p: 3,
                        mb: 2,
                        overflow: 'auto',
                        bgcolor: '#fafafa',
                        position: 'relative'
                    }}
                >
                    {messages.map((msg) => (
                        <Box
                            key={msg.id}
                            display="flex"
                            flexDirection="column"
                            alignItems={msg.isUser ? 'flex-end' : 'flex-start'}
                            mb={2}
                        >
                            <MessageBubble isUser={msg.isUser} elevation={2}>
                                <Typography variant="body1">{msg.text}</Typography>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                                    <Typography variant="caption" color="text.secondary">
                                        {msg.timestamp}
                                    </Typography>
                                    {!msg.isUser && msg.mood && (
                                        <Chip
                                            label={msg.mood}
                                            size="small"
                                            sx={{
                                                ml: 1,
                                                bgcolor: `${getMoodColor(msg.mood)}20`,
                                                color: getMoodColor(msg.mood)
                                            }}
                                        />
                                    )}
                                </Box>
                            </MessageBubble>
                        </Box>
                    ))}

                    {isTyping && (
                        <Box display="flex" alignItems="center" gap={1} ml={2}>
                            <Box className="typing-indicator">
                                <span></span>
                                <span></span>
                                <span></span>
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                                Philo is philosophizing...
                            </Typography>
                        </Box>
                    )}

                    <div ref={messagesEndRef} />
                </Paper>

                {/* Input Area */}
                <Paper elevation={3} sx={{ p: 2 }}>
                    <Box display="flex" gap={1}>
                        <TextField
                            fullWidth
                            multiline
                            maxRows={4}
                            variant="outlined"
                            placeholder="Challenge Philo with your questions... (Shift+Enter for new line)"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={isTyping}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                }
                            }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSend}
                            disabled={isTyping || !input.trim()}
                            sx={{
                                borderRadius: 2,
                                minWidth: 100,
                                height: '56px'
                            }}
                            endIcon={<SendIcon />}
                        >
                            Ponder
                        </Button>
                    </Box>

                    {/* Quick Prompts */}
                    <Box display="flex" gap={1} mt={2} flexWrap="wrap">
                        <Typography variant="caption" color="text.secondary" sx={{ width: '100%', mb: 1 }}>
                            Try these prompts:
                        </Typography>
                        {["What is the meaning of life?", "Tell me about Viveris", "Help me with my code",
                            "Are pigeons in charge?", "What's your job?", "I'm confused"].map((prompt) => (
                                <Chip
                                    key={prompt}
                                    label={prompt}
                                    size="small"
                                    onClick={() => setInput(prompt)}
                                    variant="outlined"
                                    sx={{ cursor: 'pointer' }}
                                />
                            ))}
                    </Box>
                </Paper>

                {/* Psychological Insights Footer */}
                <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                    <Typography variant="caption" color="text.secondary">
                        <PsychologyIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                        Active Psychological Principles:
                        <strong> Barnum Effect</strong> •
                        <strong> Cognitive Biases</strong> •
                        <strong> Variable Ratio Reinforcement</strong> •
                        <strong> Anthropomorphism</strong>
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        User ID: {userId.substring(0, 8)}... •
                        Built for Viveris Chat'bruti Challenge
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
}

export default App;