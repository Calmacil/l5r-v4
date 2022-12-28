/**
 * Updates defenses stats
 */
function updateDefense() {
    getAttrs(['reflex', 'armorDef', 'armorEquipped', 'guard', 'air'], v => {
        let reflex = parseInt(v.reflex)||0
        let armorDef = parseInt(v.armorDef)||0
        let isEquipped = parseInt(v.armorEquipped)||0

        let baseDef = 5 * (reflex + 2)
        let fullDef = baseDef

        if (isEquipped) {
            fullDef += armorDef
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

