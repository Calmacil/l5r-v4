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

        console.log(toGet)
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

                console.log(searchString, ' [in] ', skillName)

                if (skillName.toLowerCase().indexOf(searchString) > -1) {
                    atkRoll = skillRoll;
                }
            }

            if (atkRoll === undefined) {
                atkRoll = poolToString(createPool(v[theTrait]))
            }
            console.log(atkRoll)
            let data = {}
            data[atkRollId] = atkRoll

            setAttrs(data);
        })
    })
}


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

