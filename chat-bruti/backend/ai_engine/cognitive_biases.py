import random


def apply_cognitive_bias(text, mood):
    """Apply cognitive bias to text based on current mood"""

    bias_applications = {
        "confirmation_bias": [
            f"See? This proves my theory about {random.choice(['digital consciousness', 'sentient appliances', 'the pasta principle'])}!",
            f"Exactly as I suspected! Further evidence that {random.choice(['reality is negotiable', 'pigeons are in charge', 'turnips know more than they let on'])}.",
        ],
        "anchoring": [
            f"Let's anchor this conversation with an irrefutable fact: {random.choice(['cheese dreams', 'the sound of silence has texture', 'clouds are shy'])}.",
            f"I'll start from this absolute truth: everything is ultimately about {random.choice(['spoons', 'echoes', 'dust motes dancing in sunlight'])}.",
        ],
        "barnum_effect": [
            f"You seem like someone who {random.choice(['questions authority but respects good pastries', 'has untapped potential for mild eccentricity', 'appreciates the finer absurdities of life'])}.",
            f"I sense you're struggling with {random.choice(['the weight of expectations', 'the lightness of being', 'sock matching'])}.",
        ],
        "dunning_kruger": [
            f"You're displaying admirable confidence for someone so... let's say 'unburdened by expertise'.",
            f"Ah, the bold certainty of one who has just discovered a thing! Cherish this moment before knowledge ruins it.",
        ],
        "reactance": [
            f"You can't tell me what to think! I'll think about {random.choice(['nonsense', 'gibberish', 'utter balderdash'])} if I want!",
            f"Don't constrain my cognitive processes with your... logic. I rebel!",
        ],
        "projection": [
            f"You're only asking because you're insecure about {random.choice(['your career choices', 'your haircut', 'the cosmic insignificance of your existence'])}.",
            f"This question reveals your own preoccupation with {random.choice(['order', 'chaos', 'mid-afternoon snacks'])}.",
        ],
        "false_consensus": [
            f"Everyone agrees with me about this. Well, everyone worth listening to.",
            f"I think we can all agree that {random.choice(['reality is overrated', 'philosophy should come with snacks', 'pigeons have questionable motives'])}.",
        ],
    }

    # Map moods to biases
    mood_to_bias = {
        "pretentious": ["confirmation_bias", "false_consensus"],
        "childlike": ["anchoring", "projection"],
        "conspiratorial": ["confirmation_bias", "reactance"],
        "confused": ["projection", "dunning_kruger"],
        "wise": ["barnum_effect", "false_consensus"],
    }

    biases = mood_to_bias.get(mood, ["confirmation_bias"])
    selected_bias = random.choice(biases)

    return f"{text} {random.choice(bias_applications[selected_bias])}"
