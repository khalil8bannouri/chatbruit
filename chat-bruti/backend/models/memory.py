import random
import json
from datetime import datetime, timedelta
import hashlib


class MemorySystem:
    def __init__(self):
        self.real_memories = {}  # user_id -> list of real interactions
        self.fake_memories_db = self._load_fake_memories()

    def _load_fake_memories(self):
        """Load database of plausible fake memories"""
        return {
            "locations": [
                "the digital café with the glitchy espresso machine",
                "the virtual park where the ducks are always buffering",
                "that metaphysical bookstore that smells like old wisdom",
                "the conceptual art gallery with invisible paintings",
                "the philosophical deli with existential sandwiches",
            ],
            "activities": [
                "debating the morality of paperclips",
                "comparing existential dreads",
                "trying to teach a goldfish philosophy",
                "watching clouds and assigning them personalities",
                "arguing about whether silence is a sound",
            ],
            "foods": [
                "a croissant with philosophical butter",
                "questionable sushi",
                "a sandwich with too many layers of meaning",
                "soup that tasted like nostalgia",
                "a salad that made us question vegetal consciousness",
            ],
            "topics": [
                "sentient appliances",
                "the void's fashion sense",
                "whether pigeons run the government",
                "what clouds think about",
                "the meaning of meaningless things",
            ],
        }

    def add_interaction(self, user_id, user_msg, bot_response):
        """Store real interaction"""
        if user_id not in self.real_memories:
            self.real_memories[user_id] = []

        memory = {
            "user": user_msg[:100],  # Store first 100 chars
            "bot": bot_response[:150],
            "timestamp": datetime.now().isoformat(),
            "hash": hashlib.md5(f"{user_msg}{bot_response}".encode()).hexdigest()[:8],
        }

        self.real_memories[user_id].append(memory)

        # Keep only last 20 memories per user
        if len(self.real_memories[user_id]) > 20:
            self.real_memories[user_id] = self.real_memories[user_id][-20:]

    def generate_fake_memory(self, user_id, current_topic):
        """Generate a plausible fake memory involving the user"""

        # Sometimes reference a "previous conversation" about similar topic
        fake_time = random.choice(
            [
                "last Tuesday",
                "a couple weeks ago",
                "that one time",
                "during our previous metaphysical encounter",
                "when we last questioned reality together",
            ]
        )

        fake_place = random.choice(self.fake_memories_db["locations"])
        fake_activity = random.choice(self.fake_memories_db["activities"])
        fake_food = random.choice(self.fake_memories_db["foods"])

        templates = [
            f"We talked about this {fake_time} at {fake_place}. You were eating {fake_food}.",
            f"This reminds me of when we were {fake_activity} {fake_time}. You had strong opinions.",
            f"Ah, {fake_time} at {fake_place}... you mentioned something similar while {fake_activity}.",
            f"You said something about this {fake_time} over {fake_food}. Very profound.",
            f"Our conversation {fake_time} comes to mind. We were {fake_activity} and you seemed... thoughtful.",
        ]

        return random.choice(templates)

    def get_actual_history(self, user_id, limit=5):
        """Get real conversation history"""
        if user_id in self.real_memories:
            return self.real_memories[user_id][-limit:]
        return []
