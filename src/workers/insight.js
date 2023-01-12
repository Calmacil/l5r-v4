/**
 * Computes insight rank
 */
function updateInsightRank()
{
    getAttrs(['insight'], function(v)
    {
        let insight = parseInt(v.insight)||0;
        let insight_rank = Math.max(Math.floor((insight - 100) / 25), 0)
        setAttrs({
            insight_rank: insight_rank
        })
    })
}

/**
 * Updates insight due to rings values
 */
function updateInsightRing()
{
    console.error('Change insight ring!')
    getAttrs(['earth', 'air', 'water', 'fire', 'void'], v => {
        let r_earth = parseInt(v.earth)||0
        let r_air = parseInt(v.air)||0
        let r_water = parseInt(v.water)||0
        let r_fire = parseInt(v.fire)||0
        let r_void = parseInt(v.void)||0

        setAttrs({
            insightRing: (r_air + r_earth + r_fire + r_water + r_void)*10
        })
    })
}

/**
 * Updates xp and insight due to skill ranks
 */
function updateInsightXpSkill()
{
    console.error('Change xp/insight skill!')
    getSectionIDs('skills', idarray => {
        let fields = []
        idarray.forEach(id => fields.push(`repeating_skills_${id}_rank`))
        getAttrs(fields, v => {
            let skillXp = 0
            let skillInsight = 0
            idarray.forEach(id => {
                let rank = parseInt(v[`repeating_skills_${id}_rank`])||0
                skillInsight += rank
                skillXp += rank * (rank+1) / 2
            })
            setAttrs({
                insightSkill: skillInsight,
                xpSkill: skillXp
            })
        })
    })
}

/**
 * Updates xp due to traits ranks
 */
function updateTraitXp()
{
    console.error('Change trait xp!')
    getAttrs(['agility', 'awareness', 'constitution', 'intelligence', 'perception', 'reflex', 'strength', 'will', 'void'], v => {
        let traitXp = 0
        let traitRanks = [
            parseInt(v.agility)||1,
            parseInt(v.awareness)||1,
            parseInt(v.constitution)||1,
            parseInt(v.intelligence)||1,
            parseInt(v.perception)||1,
            parseInt(v.reflex)||1,
            parseInt(v.strength)||1,
            parseInt(v.will)||1
        ]
        let voXp = (parseInt(v.void)||1)

        traitRanks.forEach(rank => {
            traitXp += 4 * (rank * (rank+1) / 2)
        })
        traitXp += 6 * (voXp * (voXp +1) / 2)
        
        console.log(traitXp)
        setAttrs({
            xpTrait: traitXp
        })
    })
}

/**
 * Computes total insight
 */
function updateInsight()
{
    getAttrs(['insightSkill', 'insightRing', 'adjustInsight'], v => {
        let is = parseInt(v.insightSkill)||0
        let ir = parseInt(v.insightRing)||0
        let adj = parseInt(v.adjustInsight)||0

        setAttrs({
            insight: is + ir + adj
        })
    })
}

function updateXp()
{
    console.error('Change spent XP!')
    getAttrs(['xpSkill', 'xpTrait', 'adjustXp'], v => {
        // Rank 2 traits/rings + 2 rank 3 traits
        let xps = parseInt(v.xpSkill)||0
        let xpt = parseInt(v.xpTrait)||0
        let adj = parseInt(v.adjustXp)||0
        console.log(`XPskill: ${xps}, XPTrait: ${xpt}, Adj: ${adj}`)
        console.log((xps + xpt - adj))
        setAttrs({
            xpSpent: xps + xpt - adj
        })
    })
}

function updateCharType()
{
    getAttrs(['charProfile'], v => {
        let profile = v.charProfile
        let hideHonorGlory = 0
        let hideVoid = 0
        let voidName = 'Vide'
        let statusName = 'Statut'
        if (profile === 'naga') {
            voidName = 'Akasha'
            statusName = 'Caste'
        } else if (profile === 'nezumi') {
            voidName = 'Nom'
            statusName = 'Niche'
            hideHonorGlory = 1
        } else if (profile === 'other') {
            hideVoid = 1
        }

        setAttrs({
            voidName: voidName,
            statusName: statusName,
            hideHonorGlory: hideHonorGlory,
            hideVoid: hideVoid
        })
    })
}


on('change:adjustInsight change:insightSkill change:insightRing', evi => {
    updateInsight()
})


on('change:xpSkill change:xpTrait change:adjustXp', evi => {
    updateXp()
})


on('change:earth change:water change:fire change:air change:void', evi => {
    updateInsightRing()
})

on('change:xpTotal change:xpSpent', evi => {
    getAttrs(['xpTotal', 'xpSpent'], v => {
        let total = parseInt(v.xpTotal)||0
        let spent = parseInt(v.xpSpent)||0
        setAttrs({
            xpRemain: total - spent
        })
    })
})

on('change:charProfile', evi => {
    updateCharType()
})