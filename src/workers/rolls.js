/**
 * Creates a dice pool
 * @param {int} thrown Number of dice thrown
 * @param {int} kept Number of dice kept
 * @param {int} mod Numeric modificator
 * @returns a Pool object
 */
function createPool(thrown=0, kept=null, mod=0)
{
    return {
        thrown: parseInt(thrown)||0,
        kept: parseInt(kept === null ? thrown : kept)||0,
        mod: parseInt(mod)||0
    }
}

/**
 * Translate a XgY+Z roll string to a integer pool
 * @param {string} rollString The roll string
 * @returns Object(int, int, int)
 */
function parsePoolString(rollString)
{
    let regex = /(\d+)g(\d+)([+-]\d+)?/
    result = regex.exec(rollString)

    if (result === null) {
        return createPool(0, 0, rollString)
    }

    return createPool(result[1], result[2], result[3])
}

function poolToString(pool)
{
    try {
        let res = `${pool.thrown}g${pool.kept}`
        if (pool.mod > 0) {
            rollString += `+${pool.mod}`
        } else if (pool.mod < 0) {
            rollString += pool.mod
        }
        return res
    } catch (e) {
        return 'Error !'
    }
}

/**
 * Sums up any number of dice pools
 * @param  {...any} pools The list of pools
 * @returns A unified pool
 */
function sumPools(...pools)
{
    let sum = {thrown: 0, kept: 0, mod: 0}
    for (const pool of pools) {
        sum.thrown += pool.thrown
        sum.kept += pool.kept
        sum.mod += pool.mod
    }
    return sum
}

function flattenPool(pool)
{
    // TODO later
}

/**
 * Rolls a dice pool
 * @param {int} pool        The number of dice thrown
 * @param {int} kept        The number of dice kept
 * @param {int} mod         A numeric modificator to the total result
 * @param {string} title    The displayed roll title
 * @param {string} template The Rolltemplate ID
 */
function doRoll(pool, title, template='base')
{
    var rollString = `&{template:${template}} `
    getAttrs(['character_name', 'hasFocus', 'explodeOn'], function(v)
    {
        rollString += `{{charname=${v.character_name}}} `

        rollString += `{{roll=[[{`
        for (let i = 0; i < pool.thrown; i++) {
            if (i) rollString += ', '
            rollString += `1d10`
            if (v.explodeOn)
                rollString += `!>${v.explodeOn}`
            if ("1" === v.hasFocus)
                rollString += `ro1`
        }
        rollString += `}k${pool.kept}+${pool.mod}]]}} `

        rollString += `{{title=${title}}} `

        rollString += `{{displayRoll=${poolToString(pool)}}} `

        startRoll(rollString, function(result) {
            // Do stuff later
            finishRoll(result.rollId)
        })

    })
}

on('clicked:constitution', function()
{
    console.log("COUCOU")
});

on('clicked:freeRoll', function()
{
    getAttrs(['rollMod'], function(v){
        let pool = parsePoolString(v.rollMod)
        doRoll(pool, 'Jet libre')
        // TODO: see to set this last instruction configurable
        setAttrs({rollMod: ''})
    })
})