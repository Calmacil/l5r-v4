on('clicked:freeRoll', function()
{
    getAttrs(['rollMod'], function(v){
        let pool = parsePoolString(v.rollMod)
        doRoll(pool, 'Jet libre')
        // TODO: see to set this last instruction configurable
        //setAttrs({rollMod: ''})
    })
})


on('clicked:constitution clicked:earth clicked:will clicked:reflex clicked:air clicked:awareness clicked:strength clicked:water clicked:perception clicked:agility clicked:fire clicked:intelligence clicked:void clicked:honor', function(e)
{
    let rolledAttribute = e.htmlAttributes.value.split(',')[0]
    let rollTitle = e.htmlAttributes.value.split(',')[1]
    getAttrs([rolledAttribute, 'rollMod', 'isFasting', 'fastingDays', 'isFatigued', 'fatiguedDays'], function(v)
    {
        let pool = createPool(v[rolledAttribute])
        let rollMod = v['rollMod']
        let modPool = parsePoolString(rollMod)
        let isFasting = parseInt(v.isFasting)||0
        let fastingDays = parseInt(v.fastingDays)||0
        let isFatigued = parseInt(v.isFatigued)||0
        let fatiguedDays = parseInt(v.fatiguedDays)

        pool = sumPools(pool, modPool)
        if (physicalAttributes.includes(rolledAttribute)) {
            if (isFasting === 1) {
                pool = sumPools(pool, createPool(0, 0, computeFastingMalus(fastingDays)))
            }
            if (isFatigued === 1) {
                pool = sumPools(pool, createPool(0, 0, (-5*fatiguedDays)))
            }
        }

        doRoll(pool, rollTitle)
    })
});

/**
 * Roll skill check
 */
on('clicked:repeating_skills:skillroll', function (e)
{
    let skillId = e.sourceAttribute.split('_')[2]
    let skillname = 'repeating_skills_' + skillId + '_name'
    let skillroll = 'repeating_skills_' + skillId + '_roll'
    getAttrs([skillroll, skillname, 'rollMod', 'isDazed', 'isFasting', 'fastingDays', 'isFatigued', 'fatiguedDays'], function(v) {
        let roll = v[skillroll]
        let name = v[skillname]
        let rollMod = v['rollMod']
        let isDazed = parseInt(v.isDazed)||0
        let isFasting = parseInt(v.isFasting)||0
        let fastingDays = parseInt(v.fastingDays)||0
        let isFatigued = parseInt(v.isFatigued)||0
        let fatiguedDays = parseInt(v.fatiguedDays)||0
        let pool = parsePoolString(roll)
        let modPool = parsePoolString(rollMod)
        pool = sumPools(pool, modPool)
        
        if (isDazed === 1) {
            pool = sumPools(pool, parsePoolString('-3g0'))
        }
        if (isFasting === 1) {
            pool = sumPools(pool, createPool(0, 0, computeFastingMalus(fastingDays)))
        }
        if (isFatigued === 1) {
            console.warn(fatiguedDays)
            let fpool = createPool(0, 0, -5 * fatiguedDays)
            console.log(fpool)
            pool = sumPools(pool, fpool)
        }

        console.log(pool)

        doRoll(pool, name)
    })
});

/**
 * Roll init
 */
on('clicked:initroll', function(e) {
    getAttrs(['totalinit', 'rollmod'], v => {
        let pool = parsePoolString(v.totalinit)
        let mod = parsePoolString(v.rollMod)
        pool = sumPools(pool, mod)
        doRoll(pool, 'Initiative !', {template:'base', woundmalus: false, init: true})
    })
});

/**
 * Roll attack
 */
on('clicked:repeating_weapons:attackroll', evi => {
    let wpnId = evi.sourceAttribute.split('_')[2]
    let atkName = `repeating_weapons_${wpnId}_name`
    let atkSkill = `repeating_weapons_${wpnId}_skill`
    let atkRoll = `repeating_weapons_${wpnId}_attack`
    let atkMod = `repeating_weapons_${wpnId}_attackbonus`
    let atkFocus = `repeating_weapons_${wpnId}_hasfocus`
    getAttrs([atkName, atkSkill, atkMod, atkRoll, atkFocus, 'rollmod', 'guard', 'isProne', 'isBlinded', 'isDazed', 'isFasting', 'fastingDays', 'isFatigued', 'fatiguedDays'], v => {
        let name = v[atkName]
        let pool = parsePoolString(v[atkRoll])
        let bonus = parsePoolString(v[atkMod])
        let mod = parsePoolString(v.rollmod)
        let isProne = parseInt(v.isProne)||0
        let isBlinded = parseInt(v.isBlinded)||0
        let isDazed = parseInt(v.isDazed)||0
        let isFasting = parseInt(v.isFasting)||0
        let fastingDays = parseInt(v.fastingDays)||0
        let isFatigued = parseInt(v.isFatigued)||0
        let fatiguedDays = parseInt(v.fatiguedDays)||0

        pool = sumPools(pool, bonus)
        pool = sumPools(pool, mod)
        if (v.guard === 'assault') {
            pool = sumPools(pool, createPool(2, 1, 0))
        }
        if (isProne === 1) {
            pool = sumPools(pool, createPool(-2, 0, 0))
        }
        if (isBlinded === 1) {
            pool = sumPools(pool, createPool(-1, -1, 0))
            if (v.atkSkill === 'kyujutsu')
                pool = sumPools(pool, createPool(-2, -2, 0))
        }
        if (isDazed === 1) {
            pool = sumPools(pool, createPool(-3, 0, 0))
        }
        if (isFasting === 1) {
            pool = sumPools(pool, createPool(0, 0, computeFastingMalus(fastingDays)))
        }
        if (isFatigued === 1) {
            pool = sumPools(pool, createPool(0, 0, (-5 * fatiguedDays)))
        }

        doRoll(pool, name, {template: 'base', hasFocus: v[atkFocus]});
    })
})

/**
 * Roll damage
 */
on('clicked:repeating_weapons:damageroll', evi => {
    let wpnId = evi.sourceAttribute.split('_')[2]
    let dmgName = `repeating_weapons_${wpnId}_name`
    let dmgRoll = 'repeating_weapons_' + wpnId + '_damage'
    let dmgMaxstr = `repeating_weapons_${wpnId}_maxstr`
    getAttrs([dmgName, dmgName, dmgRoll, dmgMaxstr, 'rollmod', 'strength'], v => {
        let name = `Dégâts (${v[dmgName]})`
        let pool = parsePoolString(v[dmgRoll])
        let mod = parsePoolString(v.rollmod)
        let strength = parseInt(v.strength)||0
        let maxstr = parseInt(v[dmgMaxstr])||0

        if (maxstr > 0 && maxstr < strength) {
            strength = maxstr
        }

        pool = sumPools(pool, mod)
        pool = sumPools(pool, createPool(strength, 0))

        doRoll(pool, name, {explodeOn: 0})
    })
})

/**
 * Roll magic
 */
on('clicked:repeating_spells:spellroll', evi => {
    let spId = evi.sourceAttribute.split('_')[2]
    let spElm = `repeating_spells_${spId}_element`

    let spMastery = `repeating_spells_${spId}_mastery`
    let spName = `repeating_spells_${spId}_name`
    let spRange = `repeating_spells_${spId}_range`
    let spDuration = `repeating_spells_${spId}_duration`
    let spDesc = `repeating_spells_${spId}_description`


    getAttrs([spElm], (elt) => {
        let element = elt[spElm]

        let charRing = `${element}`
        let charInsRnk = `insight_rank`
        let charAffinity = `affinity_${element}`
        let charDeficiency = `deficiency_${element}`
        let spellSlot = `slot_${element}`
        let voidSlot = `slot_void`

        getAttrs([spMastery, spName, spRange, spDuration, spDesc, charRing, charInsRnk, charAffinity, charDeficiency, spellSlot, voidSlot], v => {
            let mastery = parseInt(v[spMastery])||0
            let name = v[spName]
            let range = v[spRange]
            let duration = v[spDuration]
            let desc = v[spDesc]
            let ring = parseInt(v[charRing])||0
            let insRnk = parseInt(v[charInsRnk])||0
            let affinity = parseInt(v[charAffinity])||0
            let deficiency = parseInt(v[charDeficiency])||0
            let slot = parseInt(v[spellSlot])||0
            let vslot = parseInt(v[voidSlot])||0

            if (slot > 0 || vslot > 0) {
                let totalAff = 0 + affinity - deficiency;

                let pool = createPool((ring + insRnk + totalAff), ring, 0)
                let baseTn = 5 * (1 + mastery)
                let rollAddon = `{{mastery=${mastery}}} `
                    + `{{duration=${duration}}} `
                    + `{{range=${range}}} `
                    + `{{desc=${desc}}} `
                    + `{{basetn=[[${baseTn}]]}} `
                    + `{{raises=[[?{Augmentations ?|0}]]}}`

                toAttrs = []
                if (slot > 0 )
                    toAttrs[spellSlot] = (slot - 1)
                else
                    toAttrs[voidSlot] = (vslot - 1)
                setAttrs(toAttrs) // no matter success or not

                doRoll(pool, name, {template: 'spell', rollStringAddon: rollAddon, finishCallback: r => {
                    console.warn(r);
                    let basetn = parseInt(r.results.basetn.result)||0
                    let raises = parseInt(r.results.raises.result)||0
                    let truetn = basetn + 5 * raises
                    return {
                        basetn: truetn
                    }
                }})

            } else {
                doRoll(createPool(1, 0, 0), name, {template: 'cantcast'})
            }
        })
    })
})
