/**
 * Updates defenses stats
 */
function updateDefense() {
    getAttrs(['reflex', 'armorDef', 'armorEquipped', 'guard', 'air', 'isProne', 'isGrappled', 'isStunned', 'isBlinded'], v => {
        let reflex = parseInt(v.reflex)||0
        let armorDef = parseInt(v.armorDef)||0
        let isEquipped = parseInt(v.armorEquipped)||0
        let isProne = parseInt(v.isProne)||0
        let isGrappled = parseInt(v.isGrappled)||0
        let isStunned = parseInt(v.isStunned)||0
        let isBlinded = parseInt(v.isBlinded)||0

        let baseDef = 5 * (reflex + 2)
        if (isGrappled === 1 || isStunned === 1) {
            baseDef = 5
        } else if (isBlinded === 1) {
            baseDef = 5 + reflex
        }

        let fullDef = baseDef

        if (isEquipped) {
            fullDef += armorDef
        }

        // states/statuses
        if (isProne === 1) {
            fullDef -= 10
        }

        if (v.guard === 'assault') {
            fullDef -= 10
        } else if (v.guard === 'defense') {
            fullDef += v.air + defenseSkillRank
        }

        if (v.guard === 'fulldef') {
            let pool = parsePoolString(defenseSkillRoll);
            let explodeOn = 10
            if (pool === undefined) {
                pool = createPool(v.reflex)
                explodeOn = 0
            }

            function onDefRoll(result) {
                fullDef += Math.floor(result.results.roll.result / 2)
                setAttrs({
                    baseDefense: baseDef,
                    fullDefense: fullDef
                })
            }

            doRoll(
                pool,
                'Défense (esquive)',
                {
                    explodeOn: explodeOn,
                    finishCallback: onDefRoll
                }
            )

        } else {
            setAttrs({
                baseDefense: baseDef,
                fullDefense: fullDef
            })
        }
    })
}

on('change:reflex change:armorDef change:armorEquipped change:guard', e => {
    updateDefense()
})

