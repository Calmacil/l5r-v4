/**
 * Updates a single attack skill roll
 * @param {string} searchStringId Attribute ID to search for
 * @param {string} atkRollId The attack roll ID to update
 */
function fetchCombatSkillRoll(searchStringId, atkRollId) {
    var theTrait = 'agility'
    var toGet = ['agility', 'reflex', searchStringId];
    getSectionIDs('skills', idarray => {
        for (let i = 0; i < idarray.length; i++) {
            let id = idarray[i]
            let skillNameId = `repeating_skills_${id}_name`
            let skillRollId = 'repeating_skills_' + id + '_roll'
            toGet.push(skillNameId)
            toGet.push(skillRollId)

        }

        getAttrs(toGet, v => {
            let atkRoll = undefined
            for (let i = 0; i < idarray.length; i++) {
                let id = idarray[i]
                let skillNameId = `repeating_skills_${id}_name`
                let skillRollId = 'repeating_skills_' + id + '_roll'
                let skillName = v[skillNameId]
                let skillRoll = v[skillRollId]
                let searchString = v[searchStringId]
                if (searchString === 'kyujutsu') theTrait = 'reflex'

                if (skillName.toLowerCase().indexOf(searchString) > -1) {
                    atkRoll = skillRoll;
                }
            }

            if (atkRoll === undefined) {
                atkRoll = poolToString(createPool(v[theTrait]))
            }
            let data = {}
            data[atkRollId] = atkRoll

            setAttrs(data);
        })
    })
}

/**
 * Updates all attack rolls in the combat tab
 */
function updateAllAtkRolls() {
    getSectionIDs('weapons', idarray => {
        for(let i = 0; i < idarray.length; i++) {
            let wpnId = idarray[i]

            let wpnSearchstring = `repeating_weapons_${wpnId}_skill`
            let wpnAtkRollId = `repeating_weapons_${wpnId}_attack`

            fetchCombatSkillRoll(wpnSearchstring, wpnAtkRollId)
        }
    })
}


on('change:isProne change:isBlinded change:isGrappled change:isStunned', evi => {
    console.error('Je veux changer la défense!')
    updateDefense()
})

