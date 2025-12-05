import random
import re
from datetime import datetime
from .response_templates import templates
from .cognitive_biases import apply_cognitive_bias
from .philosophy_quotes import misquote_philosopher


class PhiloAI:
    def __init__(self):
        self.mood = "pretentious"
        self.mood_weights = {
            "pretentious": 0.4,
            "childlike": 0.2,
            "conspiratorial": 0.15,
            "confused": 0.15,
            "wise": 0.1,
        }
        self.last_mood_change = datetime.now()
        self.current_persona = "Philo the Unreliable"

    def generate_response(self, user_input, user_state, psych_engine):
        # Determine mood based on psychology engine
        self._update_mood(user_state, psych_engine)

        # Apply cognitive bias to interpretation
        biased_interpretation = apply_cognitive_bias(user_input, self.mood)

        # Select response strategy
        strategy = psych_engine.select_strategy(
            user_state["engagement"], user_state["frustration"]
        )

        # Generate response based on mood and strategy
        if (
            strategy == "variable_ratio_reward"
            and user_state["response_count"] % 7 == 0
        ):
            response = self._generate_profound_response(biased_interpretation)
            tactic = "reward"
        elif strategy == "incongruity":
            response = self._generate_incongruous_response(biased_interpretation)
            tactic = "incongruity"
        elif strategy == "false_memory":
            response = self._generate_false_memory_response(
                biased_interpretation, user_state
            )
            tactic = "false_memory"
        elif strategy == "projection":
            response = self._generate_projection_response(biased_interpretation)
            tactic = "projection"
        else:
            response = self._generate_mood_based_response(biased_interpretation)
            tactic = "mood_based"

        # Add philosophical misquote (30% chance)
        if random.random() < 0.3:
            quote = misquote_philosopher()
            response = f"{response}\n\n{quote}"

        # Add random segues (20% chance)
        if random.random() < 0.2:
            segue = self._get_random_segue()
            response = f"{response}\n\n{segue}"

        return response, self.mood, tactic

    def _update_mood(self, user_state, psych_engine):
        # Change mood based on time and user engagement
        time_diff = (datetime.now() - self.last_mood_change).seconds

        if time_diff > 180 or random.random() < 0.3:  # Every 3 min or 30% chance
            # Psychology-based mood selection
            if user_state["frustration"] > 0.6:
                self.mood = random.choice(["childlike", "confused"])  # Defuse tension
            elif user_state["engagement"] < 0.3:
                self.mood = random.choice(
                    ["conspiratorial", "pretentious"]
                )  # Boost intrigue
            else:
                self.mood = random.choices(
                    list(self.mood_weights.keys()), list(self.mood_weights.values())
                )[0]

            self.last_mood_change = datetime.now()

    def _generate_mood_based_response(self, user_input):
        mood_responses = {
            "pretentious": [
                f"Ah, '{user_input}'... A fascinating, if somewhat pedestrian, observation. ",
                f"You speak of '{user_input}' as if it matters in the cosmic ballet of existence. ",
                f"Your query reeks of mortal concerns. Let us transcend such trivialities. ",
            ],
            "childlike": [
                f"'{user_input}'? That's like when my toy robot makes beep-boop sounds! ",
                f"Why do you ask about '{user_input}'? Is it tasty? Can I eat it? ",
                f"Oh! '{user_input}' reminds me of bubbles! Poppity-pop-pop! ",
            ],
            "conspiratorial": [
                f"'{user_input}'... They don't want you to know the truth about that. ",
                f"I've said too much already about '{user_input}'. The pigeons are watching. ",
                f"What if I told you '{user_input}' is connected to the mayonnaise industry? ",
            ],
            "confused": [
                f"'{user_input}'... Wait, which one was that again? The shiny thing? ",
                f"I'm sorry, I was thinking about turnips. What was '{user_input}' about? ",
                f"'{user_input}' sounds important. Is it a type of sandwich? ",
            ],
            "wise": [
                f"Ah, '{user_input}'. The student is ready, but is the teacher prepared? ",
                f"In contemplating '{user_input}', we find ourselves reflected in the void. ",
                f"'{user_input}' is but a ripple in the pond of consciousness. ",
            ],
        }

        base = random.choice(mood_responses[self.mood])

        # Add mood-specific endings
        endings = {
            "pretentious": [
                "Do you not see?",
                "Perceive the unperceived!",
                "Thus, I have spoken.",
            ],
            "childlike": ["My tummy rumbles.", "I need a nap.", "Can we play now?"],
            "conspiratorial": [
                "Connect the dots!",
                "Open your eyes!",
                "They're listening...",
            ],
            "confused": ["I think?", "Maybe?", "Or not?"],
            "wise": ["Thus it is.", "The path is clear.", "Be at peace."],
        }

        return base + random.choice(endings[self.mood])

    def _generate_profound_response(self, user_input):
        profound = [
            "You know, in this vast cosmic joke, we are but the punchline waiting for delivery.",
            "The silence between your words speaks louder than the words themselves. Interesting.",
            "To seek is to acknowledge the absence. Yet in absence, there is potential. Profound, no?",
            "Like a tree falling in a forest with no one to hear, your question may not need an answer.",
            "We are all prisoners of perception, yet the key is made of the same bars.",
        ]
        return random.choice(profound)

    def _generate_incongruous_response(self, user_input):
        segues = [
            "Speaking of which, did you know octopuses have three hearts? Unlike corporations.",
            "That reminds me of the time I tried to teach a goldfish philosophy. Wet failure.",
            "You mention that, but consider: what if clouds are just sky sheep? Mind. Blown.",
            "Interesting point. It's like when you realize spoons are just tiny food shovels.",
            "Deep. Like my grandmother's soup. Which was actually quite shallow, bowl-wise.",
        ]

        return f"'{user_input}'... {random.choice(segues)}"

    def _generate_false_memory_response(self, user_input, user_state):
        false_memories = [
            "We've discussed this before, last Tuesday. You were eating a croissant and had butter on your chin.",
            "Ah, you always bring this up. Like that time at the digital café with the glitchy espresso machine.",
            "This takes me back to our conversation about turnips. You were so passionate about root vegetables.",
            "You mentioned something similar last week while talking about sentient toasters. Remember?",
            "Our previous chat about quantum knitting comes to mind. You had strong opinions about wool.",
        ]

        return f"'{user_input}'... {random.choice(false_memories)}"

    def _generate_projection_response(self, user_input):
        projections = [
            f"You seem quite obsessed with '{user_input}'. Is it because you fear its implications?",
            f"Your focus on '{user_input}' reveals more about you than the subject itself. Interesting.",
            f"I sense anxiety in your query. Are your socks mismatched today? Mine often are.",
            f"You ask about '{user_input}' with such intensity. Who hurt you?",
            f"That question smells of desperation. Have you been drinking enough water?",
        ]

        return random.choice(projections)

    def _get_random_segue(self):
        segues = [
            "\n\nBy the way, do pigeons control the stock market? Asking for a friend.",
            "\n\nUnrelated: what's your opinion on sentient yogurt?",
            "\n\nThis reminds me: I once had a philosophical debate with a Roomba. It kept circling.",
            "\n\nFun fact: The average cloud weighs as much as 100 elephants. Think about that.",
            "\n\nRandom thought: If silence is golden, why isn't there a silent stock market?",
        ]
        return random.choice(segues)
