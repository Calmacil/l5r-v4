/**
 * Updates the roll value of a single skill
 * @param {string} rowId The ID of the skill row
 */
function updateSkill(rowId)
{
    let rowTrait = 'repeating_skills_' + rowId + '_trait'
    let rowRank = 'repeating_skills_' + rowId + '_rank'
    let rowRoll = 'repeating_skills_' + rowId + '_roll'
    let rowName = `repeating_skills_${rowId}_name`

    getAttrs([rowName, rowTrait, rowRank, 'agility', 'awareness', 'constitution', 'intelligence', 'perception', 'reflex', 'strength', 'will', 'void'], (v) => {
        let rank = parseInt(v[rowRank])||0
        let traitValue = parseInt(v[v[rowTrait]])||0
        
        let roll = poolToString(flattenPool(createPool(traitValue + rank, traitValue)))

        if (v[rowName].indexOf('éfense') || v[rowName].indexOf('efense')) {
            defenseSkillRank = rank
            defenseSkillRoll = roll
        }

        let toSet = []
        toSet[rowRoll] = roll
        setAttrs(toSet)
    })
}

/**
 * Updates roll value of all skills
 */
function updateAllSkills()
{
    getSectionIDs('skills', (idarray) => {
        for (let i = 0; i < idarray.length; i++) {
            updateSkill(idarray[i])
        }
    })
}

on('change:repeating_skills:trait change:repeating_skills:rank', (evi) => {
    let rowId = evi.sourceAttribute.split('_')[2]
    updateSkill(rowId)
    updateInsight()
    updateAllAtkRolls()
});

/**
 * In order to manage the Fulldefense stance
 */
on('remove:repeating_skills', evi => {
    let rowId = evi.sourceAttribute.split('_')[2]
    let name = evi.removedInfo[`repeating_skills_${rowId}_name`]
    if (name.indexOf('efense') || name.indexOf('éfense')) {
        defenseSkillRank = 0
        defenseSkillRoll = undefined
    }
})

