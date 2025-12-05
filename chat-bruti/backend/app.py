from flask import Flask, request, jsonify, session
from flask_cors import CORS
from datetime import datetime
import random
import json
import os
from ai_engine.philo_ai import PhiloAI
from ai_engine.psychology_engine import PsychologyEngine
from models.memory import MemorySystem
import threading

app = Flask(__name__)
app.secret_key = os.urandom(24)
CORS(app, supports_credentials=True, origins=["http://localhost:3000"])

# Initialize AI systems
philo = PhiloAI()
psych_engine = PsychologyEngine()
memory = MemorySystem()

# User session tracking
user_sessions = {}

# Psychological states tracking
class UserState:
    def __init__(self, user_id):
        self.user_id = user_id
        self.engagement = 0.5
        self.frustration = 0.0
        self.curiosity = 0.5
        self.last_interaction = datetime.now()
        self.conversation_history = []
        self.reinforcement_schedule = random.choice([3, 5, 8])  # Variable ratio
        self.response_count = 0
        
    def update_engagement(self, delta):
        self.engagement = max(0.1, min(0.9, self.engagement + delta))
    
    def should_give_reward(self):
        self.response_count += 1
        return self.response_count % self.reinforcement_schedule == 0

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        user_id = data.get('user_id', 'anonymous')
        message = data.get('message', '')
        
        # Get or create user state
        if user_id not in user_sessions:
            user_sessions[user_id] = UserState(user_id)
        
        user_state = user_sessions[user_id]
        
        # Update psychology engine with user state
        psych_engine.update_user_state(
            user_id=user_id,
            engagement=user_state.engagement,
            frustration=user_state.frustration
        )
        
        # Generate Philo's response with psychology
        response, mood, psychological_tactic = philo.generate_response(
            user_input=message,
            user_state=user_state.__dict__,
            psych_engine=psych_engine
        )
        
        # Update memory
        memory.add_interaction(user_id, message, response)
        
        # Check for fake memory recall
        fake_memory = None
        if random.random() < 0.3:  # 30% chance of fake memory
            fake_memory = memory.generate_fake_memory(user_id, message)
        
        # Update user state based on response type
        if psychological_tactic == "reward":
            user_state.update_engagement(0.2)
        elif psychological_tactic == "frustration":
            user_state.update_engagement(-0.1)
            user_state.frustration = min(0.8, user_state.frustration + 0.15)
        else:
            user_state.update_engagement(0.05)
        
        # Record interaction
        user_state.conversation_history.append({
            'user': message,
            'philo': response,
            'timestamp': datetime.now().isoformat(),
            'mood': mood,
            'tactic': psychological_tactic
        })
        
        return jsonify({
            'response': response,
            'mood': mood,
            'avatar_expression': get_avatar_expression(mood),
            'fake_memory': fake_memory,
            'psychological_tactic': psychological_tactic,
            'user_state': {
                'engagement': user_state.engagement,
                'frustration': user_state.frustration
            },
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/user/state', methods=['GET'])
def get_user_state():
    user_id = request.args.get('user_id', 'anonymous')
    if user_id in user_sessions:
        state = user_sessions[user_id]
        return jsonify({
            'engagement': state.engagement,
            'response_count': state.response_count,
            'conversation_length': len(state.conversation_history)
        })
    return jsonify({'error': 'User not found'}), 404

def get_avatar_expression(mood):
    """Map mood to avatar expression"""
    expressions = {
        'pretentious': 'thoughtful',
        'childlike': 'curious',
        'conspiratorial': 'suspicious',
        'confused': 'confused',
        'wise': 'smug',
        'angry': 'angry'
    }
    return expressions.get(mood, 'neutral')

if __name__ == '__main__':
    # Start periodic psychology updates in background
    def update_psychology_models():
        while True:
            threading.Event().wait(300)  # Every 5 minutes
            psych_engine.update_models_based_on_sessions(user_sessions)
    
    psych_thread = threading.Thread(target=update_psychology_models, daemon=True)
    psych_thread.start()
    
    app.run(debug=True, port=5000)