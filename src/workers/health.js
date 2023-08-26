/**
 * Adds a row to the health array
 * @param {int} idx The index in the table
 * @param {string} label The level's name
 * @param {string} malus Numeric wound mod to apply
 * @param {*} total Total HP at this row
 * @param {undefined} help Nothing for now
 */
function addHealthRow(idx, label, malus, total, help=undefined)
{
    let row = []
    row['label'] = label
    row['malus'] = malus
    row['total'] = total
    row['help'] = help
    row['id'] = generateRowID()
    healthRows[idx] = row
}

/**
 * Prepare the health array for human with modified multipliers
 */
function prepareHealthRowMod(earth, wndHealthy, wndRank)
{
    let maxHp = earth * wndHealthy
    let stdRow = earth * wndRank

    addHealthRow(0, 'Indemne', '0', maxHp)
    addHealthRow(1, 'Égratigné', '-3', (maxHp += stdRow))
    addHealthRow(2, 'Légèrement blessé', '-5', (maxHp += stdRow))
    addHealthRow(3, 'Blessé', '-10', (maxHp += stdRow))
    addHealthRow(4, 'Gravement blessé', '-15', (maxHp += stdRow))
    addHealthRow(5, 'Impotent', '-20', (maxHp += stdRow))
    addHealthRow(6, 'Épuisé, Vide pour agir', '-40', (maxHp += stdRow))
    addHealthRow(7, 'Hors de combat', 'H/S', (maxHp += stdRow))

    return maxHp
}

/**
 * Prepare the health array with free numbers
 * Use this format: row:malus;row2:malus2;row3:malus3
 */
function prepareHealthRowFree(wndFree)
{
    let rows = wndFree.split(';')
    let maxHp = 0;
    for (let i in rows) {
        let row = rows[i].split(':')
        maxHp = parseInt(row[0])||0
        let malus = row[1]
        addHealthRow(i, ' ', malus, maxHp)
    }
    return maxHp
}

/**
 * Empties the health monitor
 */
function clearHealthBlock()
{
    getSectionIDs('repeating_health', idarray => {
        for (var i = 0; i < idarray.length; i++)
        {
            removeRepeatingRow(`repeating_health_${idarray[i]}`)
        }
    })
}

/**
 * Fills a health row
 * @param {string} id 
 * @param {int} malus 
 * @param {int} total 
 * @param {boolean} highlight 
 * @param {string} label 
 */
function fillHealthRow(id, malus, total, highlight=0, label=undefined)
{
    let rankId = `repeating_health_${id}_rank`
    let malusId = `repeating_health_${id}_malus`
    let totalId = `repeating_health_${id}_total`
    let hlId = `repeating_health_${id}_highlight`

    let data = {}
    data[malusId] = malus
    data[totalId] = total
    data[hlId] = highlight
    if (label !== undefined)
        data[rankId] = label

    setAttrs(data)
}

/**
 * Fills the health monitor with the prepared rows and updates the wound level display
 */
function updateHealthMonitorDisplay()
{
    getAttrs(['hp', 'hp_max'], v => {
        var curtotal = 0
        let hp = parseInt(v.hp)||0
        let hp_max = parseInt(v.hp_max)||0
        let wounds = hp_max - hp
        for (var i = 0; i < healthRows.length; i++) {
            let id = healthRows[i].id
            let rowtotal = healthRows[i].total
            let rowmalus = healthRows[i].malus
            let hl = 0
            if (wounds >= curtotal && wounds < rowtotal) {
                hl = 1
                setAttrs({
                    woundmalus: parseInt(rowmalus)||0
                })
            } 
            curtotal = rowtotal

            fillHealthRow(id, rowmalus, rowtotal, hl, healthRows[i].label)
        }
    })
}

/**
 * Callback for events
 */
function prepareHealthRows()
{
    // Later add custom health
    clearHealthBlock()
    getAttrs(['healthMode', 'earth', 'wndHealthy', 'wndRank', 'wndFree'], v => {
        mode = v.healthMode
        let maxHp = 0
        if (mode === 'free') {
            maxHp = prepareHealthRowFree(v.wndFree)
        } else if (mode === 'modified') {
            maxHp = prepareHealthRowMod(parseInt(v.earth)||2, parseInt(v.wndHealthy)||5, parseInt(v.wndRank)||2)
        } else {
            maxHp = prepareHealthRowMod(parseInt(v.earth)||2, 5, 2)
        }

        setAttrs({
            hp_max: maxHp
        })
    })
}

/**
 * Inflicts wounds taking the Reduction value into account
 * @param {int} oldHp the previous HP value
 * @param {int} newHp the new theoric HP value
 */
function woundsWithArmour(oldHp, newHp)
{
    getAttrs(['armorEquipped', 'reduction'], v => {
        let isEquipped = parseInt(v.armorEquipped)||0
        let reduction = parseInt(v.reduction)||0
        let trueHp = newHp

        if (oldHp > newHp && 1 === isEquipped) {
            trueHp += reduction
            if (trueHp > oldHp) trueHp = oldHp
        }
        setAttrs({
            hp: trueHp
        })
    })
}

/**
 * Checks if healthMode has been configured, and set it to standard otherwise
 */
function checkHealthMode()
{
    getAttrs(['healthMode'], v => {
        let healthMode = v.healthMode || null
        console.warn('Healthmode:', healthMode)
        if (healthMode === null || healthMode === "0") {
            setAttrs({healthMode: 'standard'})
        }
    })
}

on('change:hp', evi => {
    if (evi.sourceType === 'sheetworker') {
        woundsWithArmour(parseInt(evi.previousValue)||0, parseInt(evi.newValue)||0)
    }
    updateHealthMonitorDisplay()
});

on('change:healthMode change:wndHealthy change:wndRank change:wndFree', evi => {
    healthRows = []
    prepareHealthRows()
    updateHealthMonitorDisplay()
})

on('clicked:sleep', evi => {
    getAttrs(['slotfire_max', 'slotair_max', 'slotwater_max', 'slotearth_max', 'slotvoid_max', 'constitution', 'insight_rank', 'hp', 'hp_max'], v => {
        let fireSlotMax = parseInt(v.slotfire_max)||0
        let airSlotMax = parseInt(v.slotair_max)||0
        let waterSlotMax = parseInt(v.slotwater_max)||0
        let earthSlotMax = parseInt(v.slotearth_max)||0
        let voidSlotMax = parseInt(v.slotvoid_max)||0
        let constitution = parseInt(v.constitution)||0
        let insightRank = parseInt(v.insight_rank)||0
        let hp = parseInt(v.hp)||0
        let hpMax = parseInt(v.hp_max)||0

        let regen = 2*constitution + insightRank;

        console.warn('HP:' + hp + ' - MAX:' + hpMax + ' - RGN:' + regen)

        setAttrs({
            slotfire: fireSlotMax,
            slotair: airSlotMax,
            slotwater: waterSlotMax,
            slotearth: earthSlotMax,
            slotvoid: voidSlotMax,
            voidUsed: 0,
            hp: Math.min(hp + regen, hpMax)
        })
    })
});
