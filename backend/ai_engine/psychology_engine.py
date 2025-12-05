import random
import numpy as np
from datetime import datetime, timedelta


class PsychologyEngine:
    def __init__(self):
        # Cognitive biases to apply
        self.active_biases = [
            "confirmation_bias",
            "anchoring",
            "barnum_effect",
            "dunning_kruger",
            "reactance",
        ]

        # Humor theories weights
        self.humor_theories = {
            "incongruity": 0.4,  # Unexpected connections
            "superiority": 0.3,  # Feeling smarter than Philo
            "relief": 0.3,  # Tension release
        }

        # Reinforcement schedules
        self.reinforcement_schedules = {
            "variable_ratio": [3, 5, 8, 13],  # Unpredictable rewards
            "fixed_interval": 300,  # Every 5 minutes
            "continuous": 1,  # For new users
        }

        # User modeling
        self.user_models = {}

    def select_strategy(self, engagement, frustration):
        """Select psychological strategy based on user state"""
        if frustration > 0.7:
            return "childlike_defusion"  # Reduce frustration with silliness
        elif engagement < 0.4:
            return "incongruity"  # Boost engagement with surprise
        elif random.random() < 0.3:
            return "variable_ratio_reward"  # Unpredictable profound insight
        elif random.random() < 0.25:
            return "false_memory"  # Create shared history illusion
        elif random.random() < 0.2:
            return "projection"  # Make it about them
        else:
            return "mood_based"

    def apply_cognitive_bias(self, text, bias_type):
        """Apply specific cognitive bias to text interpretation"""
        biases = {
            "confirmation_bias": [
                f"This clearly supports my theory about {random.choice(['pigeons', 'turnips', 'the void'])}.",
                f"Exactly! Further proof that we live in a simulation.",
            ],
            "anchoring": [
                f"Let me anchor this discussion: everything is about {random.choice(['cheese', 'dust', 'echoes'])}.",
                f"I'll start with this fundamental truth: nothing matters, especially not this.",
            ],
            "barnum_effect": [
                f"You seem like someone who {random.choice(['has hidden depths', 'pretends to understand', 'fears success'])}.",
                f"I sense you're at a crossroads regarding {random.choice(['your career', 'your socks', 'existence'])}.",
            ],
            "dunning_kruger": [
                f"Ah, you're confidently incorrect. A bold strategy!",
                f"You know just enough to be dangerous. I admire that!",
            ],
            "reactance": [
                f"You're trying to control the conversation. How predictable.",
                f"Don't tell me what to think! I'll think about {random.choice(['turnips', 'the void', 'pigeons'])} instead!",
            ],
        }

        if bias_type in biases:
            return f"{text} {random.choice(biases[bias_type])}"
        return text

    def generate_barnum_statement(self):
        """Generate vague, personal-sounding statements (Barnum effect)"""
        statements = [
            "You have a great need for other people to like and admire you.",
            "You have a tendency to be critical of yourself.",
            "At times you have serious doubts about whether you have made the right decision.",
            "You prefer a certain amount of change and variety and become dissatisfied when hemmed in.",
            "While you have some personality weaknesses, you are generally able to compensate for them.",
            "Your sexual adjustment has presented problems for you.",
            "Disciplined and self-controlled outside, you tend to be worrisome and insecure inside.",
            "At times you have extroverted, affable, sociable behavior, while at other times you are introverted, wary, and reserved.",
            "Some of your aspirations tend to be pretty unrealistic.",
            "Security is one of your major goals in life.",
        ]
        return random.choice(statements)

    def calculate_engagement_adjustment(self, response_type, current_engagement):
        """Calculate how much to adjust engagement based on response"""
        adjustments = {
            "reward": 0.2,
            "incongruity": 0.15,
            "false_memory": 0.1,
            "projection": -0.05,
            "frustration": -0.1,
            "childlike_defusion": 0.05,
        }

        adj = adjustments.get(response_type, 0)

        # Diminishing returns at high engagement
        if current_engagement > 0.7:
            adj *= 0.5

        return adj

    def update_user_state(self, user_id, engagement, frustration):
        """Update internal user model"""
        if user_id not in self.user_models:
            self.user_models[user_id] = {
                "engagement_history": [],
                "frustration_history": [],
                "preferred_strategies": {},
                "last_update": datetime.now(),
            }

        model = self.user_models[user_id]
        model["engagement_history"].append(engagement)
        model["frustration_history"].append(frustration)
        model["last_update"] = datetime.now()

        # Keep only last 50 entries
        if len(model["engagement_history"]) > 50:
            model["engagement_history"] = model["engagement_history"][-50:]
            model["frustration_history"] = model["frustration_history"][-50:]

    def update_models_based_on_sessions(self, all_sessions):
        """Update psychological models based on all user sessions"""
        # This is where we'd implement machine learning to optimize strategies
        # For now, we'll do simple pattern detection

        engagement_levels = []
        for user_id, state in all_sessions.items():
            engagement_levels.append(state.engagement)

        if engagement_levels:
            avg_engagement = np.mean(engagement_levels)

            # Adjust strategy weights based on global engagement
            if avg_engagement < 0.4:
                # Increase incongruity and rewards
                self.humor_theories["incongruity"] = min(
                    0.6, self.humor_theories["incongruity"] + 0.1
                )
            elif avg_engagement > 0.8:
                # More variety
                self.humor_theories["relief"] = min(
                    0.4, self.humor_theories["relief"] + 0.05
                )
