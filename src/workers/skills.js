/**
 * Updates the roll value of a single skill
 * @param {string} rowId The ID of the skill row
 */
function updateSkill(rowId)
{
    let rowTrait = 'repeating_skills_' + rowId + '_trait'
    let rowRank = 'repeating_skills_' + rowId + '_rank'
    let rowRoll = 'repeating_skills_' + rowId + '_roll'

    getAttrs([rowTrait, rowRank, 'agility', 'awareness', 'constitution', 'intelligence', 'perception', 'reflex', 'strength', 'will', 'void'], (v) => {
        let rank = parseInt(v[rowRank])||0
        let traitValue = parseInt(v[v[rowTrait]])||0
        
        let roll = poolToString(flattenPool(createPool(traitValue + rank, traitValue)))
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
});
