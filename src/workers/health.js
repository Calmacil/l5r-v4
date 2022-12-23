var healthRows = []

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
 * Prepare the health array for standard human
 */
function prepareHealthRowStd()
{
    getAttrs(['earth'], v => {
        let earth = parseInt(v.earth)||0;
        let maxHp = earth*5
        let stdRow = earth*2

        addHealthRow(0, 'Indemne', '0', maxHp)
        addHealthRow(1, 'Égratigné', '-3', (maxHp += stdRow))
        addHealthRow(2, 'Légèrement blessé', '-5', (maxHp += stdRow))
        addHealthRow(3, 'Blessé', '-10', (maxHp += stdRow))
        addHealthRow(4, 'Gravement blessé', '-15', (maxHp += stdRow))
        addHealthRow(5, 'Impotent', '-20', (maxHp += stdRow))
        addHealthRow(6, 'Épuisé, Vide pour agir', '-40', (maxHp += stdRow))
        addHealthRow(7, 'Hors de combat', 'H/S', (maxHp += stdRow))

        setAttrs({
            hp_max: maxHp
        })
    })
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
    prepareHealthRowStd()
}

on('change:hp', v => {
    updateHealthMonitorDisplay()
})