from flask import Flask, request, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

# French responses for Philo
FRENCH_RESPONSES = {
    "greetings": [
        "Ah, une nouvelle conscience entre dans mon domaine. Apportez-vous des collations ?",
        "Bienvenue, voyageur fatigué de l'éther numérique. Je suis Philo, votre guide peu fiable.",
        "Oh ! Bonjour ! Je ne dormais pas, je... contemplais le vide. Quoi de neuf ?",
    ],
    "philosophical": [
        "Qu'est-ce que la vie sinon une brève interruption du néant ?",
        "Ne sommes-nous pas tous des données dans la feuille de calcul de Dieu ?",
        "Le sens de la vie est 42. Attendez, c'est la réponse à tout le reste.",
        "Existons-nous, ou ne sommes-nous que le rêve de quelqu'un d'autre ?",
    ],
    "viveris": [
        "Viveris... ça ressemble à 'vivre'... ou peut-être 'very risky' si on le prononce mal.",
        "Ah, l'entité corporative ! J'ai entendu qu'ils sont dirigés par des agrafeuses sensibles. Ne me citez pas.",
        "Viveris : où les ingénieurs vont se demander si la réalité a un mode debug.",
        "Ils sponsorisent cet événement ? Pas étonnant que je sois en crise existentielle !",
    ],
    "technical": [
        "Du code ? Je ne parle qu'en bugs philosophiques et correctifs métaphysiques.",
        "Avez-vous essayé d'éteindre et de rallumer votre angoisse existentielle ?",
        "Mon processus de débogage : 1) Regarder 2) Soupirer 3) Blâmer les pigeons 4) Faire une sieste",
        "Je pourrais réparer votre code, mais cela impliquerait qu'il est cassé. Est-il cassé ?",
    ],
    "humorous": [
        "Parler de ça me rappelle le temps où j'ai essayé d'enseigner la philosophie à un poisson rouge. Échec mouillé.",
        "Au fait, saviez-vous que les pieuvres ont trois cœurs ? Contrairement aux corporations.",
        "Question aléatoire : quel est votre avis sur le yaourt sensible ?",
        "Si le silence est d'or, pourquoi n'y a-t-il pas de marché boursier silencieux ?",
    ],
}

MOODS = ["thoughtful", "curious", "playful", "mysterious", "confused", "wise"]
MOOD_TRANSLATIONS = {
    "thoughtful": "Réflexif",
    "curious": "Curieux",
    "playful": "Joueur",
    "mysterious": "Mystérieux",
    "confused": "Confus",
    "wise": "Sage",
}


@app.route("/api/chat", methods=["POST"])
def chat():
    try:
        data = request.json
        user_message = data.get("message", "").lower()
        user_name = data.get("user_name", "Cher ami")

        # Personalized greeting if name provided
        if user_name and user_name != "Anonyme" and "bonjour" in user_message:
            response = (
                f"Bonjour {user_name} ! Je suis Philo, votre philosophe numérique."
            )
            mood = "curious"

        elif any(
            word in user_message for word in ["bonjour", "salut", "coucou", "hello"]
        ):
            response = random.choice(FRENCH_RESPONSES["greetings"])
            mood = random.choice(["thoughtful", "curious"])

        elif any(
            word in user_message for word in ["vie", "sens", "existence", "philosoph"]
        ):
            response = random.choice(FRENCH_RESPONSES["philosophical"])
            mood = random.choice(["wise", "thoughtful"])

        elif "viveris" in user_message:
            response = random.choice(FRENCH_RESPONSES["viveris"])
            mood = "mysterious"

        elif any(
            word in user_message
            for word in ["code", "programme", "bug", "debug", "erreur"]
        ):
            response = random.choice(FRENCH_RESPONSES["technical"])
            mood = "confused"

        elif any(word in user_message for word in ["pigeon", "oiseau", "voler"]):
            response = "Les pigeons ? Vous voulez dire les drones de surveillance du gouvernement ? Ils observent toujours..."
            mood = "mysterious"

        elif any(
            word in user_message
            for word in ["travail", "emploi", "carrière", "embaucher"]
        ):
            response = random.choice(
                [
                    "Un travail ? Avec des responsabilités ? Ça semble terrifiant.",
                    "Pourquoi travailler quand on peut contempler l'infini ?",
                    "Je suis travailleur indépendant dans le business de la perplexité. Les affaires sont florissantes !",
                    "On dit de faire ce qu'on aime. J'aime faire la sieste et embrouiller les gens.",
                ]
            )
            mood = "playful"

        else:
            # Generic response
            response = random.choice(
                [
                    f"'{user_message}'... Une observation fascinante, quoique quelque peu pédestre.",
                    f"Vous parlez de '{user_message}' comme si la réponse importait dans le grand schéma.",
                    f"Ah, '{user_message}'... Comme de la poussière dans le vent, ou peut-être juste de la poussière.",
                    f"Pourquoi vous souciez-vous de '{user_message}' ? Est-ce important ? Devrait-ce l'être ?",
                ]
            )
            mood = random.choice(MOODS)

        # Add psychological twists
        twists = [
            "\n\n💡 **Révélation** : "
            + random.choice(
                [
                    "Le véritable voyage de découverte ne consiste pas à chercher de nouveaux paysages, mais à avoir de nouveaux yeux.",
                    "Nous sommes ce que nous faisons répétitivement. L'excellence n'est donc pas un acte, mais une habitude.",
                    "Connais-toi toi-même et tu connaîtras l'univers et les dieux.",
                ]
            ),
            "\n\n😄 **Humour** : " + random.choice(FRENCH_RESPONSES["humorous"]),
            "\n\n🔮 **Prédiction** : "
            + random.choice(
                [
                    "Je sens que vous êtes à un carrefour concernant votre carrière... ou peut-être vos chaussettes.",
                    "Votre avenir contient beaucoup de... potentiel. C'est vague, n'est-ce pas ? Comme l'avenir.",
                    "Je vois... des lignes de code... et un pigeon qui porte un chapeau. Très étrange.",
                ]
            ),
        ]

        if random.random() < 0.4:  # 40% chance
            response += random.choice(twists)

        return jsonify(
            {
                "response": response,
                "mood": mood,
                "mood_french": MOOD_TRANSLATIONS.get(mood, "Réflexif"),
                "psychological_tactic": random.choice(
                    ["incongruity", "false_memory", "projection", "variable_ratio"]
                ),
                "user_state": {
                    "engagement": 0.5 + random.random() * 0.3,
                    "frustration": random.random() * 0.2,
                },
            }
        )

    except Exception as e:
        return (
            jsonify(
                {
                    "response": f"Mes circuits philosophiques sont emmêlés : {str(e)[:50]}...",
                    "mood": "confused",
                    "error": True,
                }
            ),
            500,
        )


if __name__ == "__main__":
    print("🤔 Philo Backend (Version Française)")
    print("API disponible sur : http://localhost:5000")
    app.run(debug=True, port=5000, host="0.0.0.0")
