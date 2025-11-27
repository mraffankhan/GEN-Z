import { supabase } from '../supabase'

export const TRUST_ACTIONS = {
    POLL_VOTE: 'POLL_VOTE',
    CONFESSION_UPVOTED: 'CONFESSION_UPVOTED',
    DAILY_LOGIN: 'DAILY_LOGIN',
    VERIFIED_ID: 'VERIFIED_ID',
    MESSAGE_SENT: 'MESSAGE_SENT',
    AI_TOXIC_MESSAGE: 'AI_TOXIC_MESSAGE',
    CONFESSION_REMOVED: 'CONFESSION_REMOVED',
    POLL_SPAM: 'POLL_SPAM',
    USER_REPORTED_TRUE: 'USER_REPORTED_TRUE',
    USER_REPORTED_FALSE: 'USER_REPORTED_FALSE'
}

const SCORE_RULES = {
    [TRUST_ACTIONS.POLL_VOTE]: 5,
    [TRUST_ACTIONS.CONFESSION_UPVOTED]: 2,
    [TRUST_ACTIONS.DAILY_LOGIN]: 1,
    [TRUST_ACTIONS.VERIFIED_ID]: 20,
    [TRUST_ACTIONS.MESSAGE_SENT]: 1,
    [TRUST_ACTIONS.AI_TOXIC_MESSAGE]: -20,
    [TRUST_ACTIONS.CONFESSION_REMOVED]: -30,
    [TRUST_ACTIONS.POLL_SPAM]: -10,
    [TRUST_ACTIONS.USER_REPORTED_TRUE]: -50,
    [TRUST_ACTIONS.USER_REPORTED_FALSE]: -10
}

/**
 * Updates the trust score for a user based on an action.
 * @param {string} userId - The user's ID.
 * @param {string} actionType - The type of action performed (from TRUST_ACTIONS).
 */
export const updateTrustScore = async (userId, actionType) => {
    const scoreChange = SCORE_RULES[actionType]

    if (scoreChange === undefined) {
        console.warn(`Unknown action type: ${actionType}`)
        return
    }

    console.log(`⚖️ Updating Trust Score for ${userId}: ${actionType} (${scoreChange > 0 ? '+' : ''}${scoreChange})`)

    try {
        // 1. Get current score
        const { data: profile, error: fetchError } = await supabase
            .from('profiles')
            .select('trust_score, infractions, rewards')
            .eq('id', userId)
            .single()

        if (fetchError) throw fetchError

        let currentScore = profile.trust_score || 500
        let newScore = currentScore + scoreChange

        // Enforce limits
        if (newScore > 1000) newScore = 1000
        if (newScore < 0) newScore = 0

        // Update stats
        let newInfractions = profile.infractions || 0
        let newRewards = profile.rewards || 0

        if (scoreChange < 0) newInfractions++
        else newRewards++

        // 2. Update DB
        const { error: updateError } = await supabase
            .from('profiles')
            .update({
                trust_score: newScore,
                infractions: newInfractions,
                rewards: newRewards
            })
            .eq('id', userId)

        if (updateError) throw updateError

        console.log(`✅ New Score: ${newScore}`)

        // Check for status changes (logs only for now, UI handles display)
        if (newScore < 300 && currentScore >= 300) {
            console.warn('⚠️ User has entered RESTRICTED MODE')
        }
        if (newScore >= 800 && currentScore < 800) {
            console.log('🌟 User achieved GOLD status')
        }
        if (newScore >= 900 && currentScore < 900) {
            console.log('👑 User achieved OG status')
        }

        return newScore

    } catch (err) {
        console.error('❌ Failed to update trust score:', err.message)
    }
}
