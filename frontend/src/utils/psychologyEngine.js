import { colors } from '../styles/col';

export class PsychologyEngine {
    constructor(userId) {
        this.userId = userId;
        this.engagement = 0.5;
        this.curiosity = 0.5;
        this.frustration = 0.0;
        this.sessionStart = Date.now();
        this.interactionCount = 0;
        this.lastProfoundInsight = 0;

        // Variable ratio schedule for rewards
        this.rewardSchedule = [3, 5, 8, 13];
        this.nextRewardAt = this.getNextRewardCount();
    }

    getNextRewardCount() {
        return this.rewardSchedule[Math.floor(Math.random() * this.rewardSchedule.length)];
    }

    // Update psychology based on interaction
    updatePsychology(interactionType, responseQuality) {
        this.interactionCount++;

        switch (interactionType) {
            case 'profound_insight':
                this.engagement = Math.min(1, this.engagement + 0.2);
                this.curiosity = Math.min(1, this.curiosity + 0.15);
                this.lastProfoundInsight = this.interactionCount;
                break;

            case 'humor':
                this.engagement = Math.min(1, this.engagement + 0.1);
                this.frustration = Math.max(0, this.frustration - 0.1);
                break;

            case 'confusion':
                this.frustration = Math.min(0.7, this.frustration + 0.15);
                this.curiosity = Math.min(1, this.curiosity + 0.1);
                break;

            case 'personal_connection':
                this.engagement = Math.min(1, this.engagement + 0.15);
                break;

            default:
                this.engagement = Math.min(1, this.engagement + 0.05);
        }

        // Natural decay over time
        this.engagement *= 0.99;
        this.curiosity *= 0.98;
        this.frustration *= 0.95;
    }

    // Check if it's time for a variable ratio reward
    shouldGiveReward() {
        if (this.interactionCount >= this.nextRewardAt) {
            this.nextRewardAt = this.interactionCount + this.getNextRewardCount();
            return true;
        }
        return false;
    }

    // Generate Barnum statements (vague but personal)
    generateBarnumStatement() {
        const statements = [
            "Vous avez un grand besoin que les autres vous apprécient et vous admirent.",
            "Vous avez tendance à être critique envers vous-même.",
            "Parfois, vous avez de sérieux doutes sur vos décisions.",
            "Vous préférez un certain changement et devenez insatisfait·e quand vous êtes contraint·e.",
            "Bien que vous ayez des faiblesses, vous savez généralement les compenser.",
            "Votre ajustement émotionnel vous a parfois posé problème.",
            "Discipliné·e à l'extérieur, vous êtes parfois inquiet·insecure à l'intérieur.",
            "Parfois extraverti·e et sociable, d'autres fois introverti·e et réservé·e.",
            "Certaines de vos aspirations sont assez irréalistes.",
            "La sécurité est l'un de vos principaux objectifs dans la vie."
        ];
        return statements[Math.floor(Math.random() * statements.length)];
    }

    // Get color based on psychological state
    getMoodColor(mood) {
        return colors.moods[mood] || colors.primary[500];
    }

    // Get recommended interaction strategy
    getRecommendedStrategy() {
        if (this.frustration > 0.6) return 'humor';
        if (this.engagement < 0.3) return 'profound_insight';
        if (this.curiosity > 0.7) return 'mystery';
        if (this.interactionCount % 7 === 0) return 'personal_connection';

        const strategies = ['humor', 'philosophical', 'absurd', 'question'];
        return strategies[Math.floor(Math.random() * strategies.length)];
    }

    // Get psychology metrics for display
    getMetrics() {
        return {
            engagement: this.engagement,
            curiosity: this.curiosity,
            frustration: this.frustration,
            interactionCount: this.interactionCount,
            sessionDuration: Math.floor((Date.now() - this.sessionStart) / 1000),
            nextRewardIn: this.nextRewardAt - this.interactionCount
        };
    }
}