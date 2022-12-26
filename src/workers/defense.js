/**
 * Updates defenses stats
 */
function updateDefense() {
    getAttrs(['reflex', 'armorDef', 'armorEquipped'], v => {
        let reflex = parseInt(v.reflex)||0
        let armorDef = parseInt(v.armorDef)||0
        let isEquipped = parseInt(v.armorEquipped)||0

        let baseDef = 5 * (reflex + 2)
        let fullDef = baseDef

        if (isEquipped) {
            fullDef += armorDef
        }

        setAttrs({
            baseDefense: baseDef,
            fullDefense: fullDef
        })
    })
}

on('change:reflex change:armorDef change:armorEquipped', e => {
    updateDefense()
})

