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


on('clicked:repeating_skills:skillroll', function (e)
{
    let skillId = e.sourceAttribute.split('_')[2]
    let skillname = 'repeating_skills_' + skillId + '_name'
    let skillroll = 'repeating_skills_' + skillId + '_roll'
    getAttrs([skillroll, skillname, 'rollMod', 'isDazed', 'isFasting', 'fastingDays'], function(v) {
        let roll = v[skillroll]
        let name = v[skillname]
        let rollMod = v['rollMod']
        let isDazed = parseInt(v.isDazed)||0
        let isFasting = parseInt(v.isFasting)||0
        let fastingDays = parseInt(v.fastingDays)||0
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
            pool = sumPools(pool, createPool(0, 0, (-5 * fatiguedDays)))
        }

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

        pool = sumPools(pool, bonus)
        pool = sumPools(pool, mod)
        if (v.guard === 'assault') {
            pool = sumPools(pool, parsePoolString('2g1'))
        }
        if (isProne === 1) {
            pool = sumPools(pool, parsePoolString('-2g1'))
        }
        if (isBlinded === 1) {
            pool = sumPools(pool, parsePoolString('-1g1'))
            if (v.atkSkill === 'kyujutsu')
                pool = sumPools(pool, parsePoolString('-2g2'))
        }
        if (isDazed === 1) {
            pool = sumPools(pool, parsePoolString('-3g0'))
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

