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

/**
 * 
 * @param {object} pool The pool
 * @returns The Roll and Keep pool string
 */
function poolToString(pool)
{
    try {
        let res = `${pool.thrown}g${pool.kept}`
        if (pool.mod > 0) {
            res += `+${pool.mod}`
        } else if (pool.mod < 0) {
            res += pool.mod
        }
        return res
    } catch (e) {
        console.error(e)
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

/**
 * Flattens a dice pool so that the number of dice never exceeds 10
 * @param {object} pool The initial pool
 * @returns The converted pool
 */
function flattenPool(pool)
{
    // thrown dice over 10 are converted to rolled dice (2 to 1)
    while (pool.kept < 10 && pool.thrown > 11) {
        pool.kept += 1
        pool.thrown -= 2
    }

    let overThrown = Math.max(pool.thrown - 10, 0)
    let overKept = Math.max(pool.kept - 10, 0)

    // remaining thrown dice over 10 are converted to bonus
    if (overThrown) {
        pool.thrown = 10;
        pool.mod += 2 * overThrown
    }

    // kept dice over 10 are converted to bonus
    if (overKept) {
        pool.kept = 10
        pool.mod += 2 * overKept
    }

    return pool
}

/**
 * Rolls a dice pool
 * @param {object} pool        The number of dice thrown
 * @param {string} title    The displayed roll title
 * @param {string} template The Rolltemplate ID
 */
function doRoll(pool, title, opts)
{
    opts = {
        ...{
            template: 'base',
            woundmalus: true,
            init: false,
            explodeOn: false,
            hasFocus: undefined
        },
        ...opts
    }
    console.warn(opts)
    pool = flattenPool(pool)
    var rollString = `&{template:${opts.template}} `

    getAttrs(['character_name', 'hasFocus', 'explodeOn', 'woundmalus'], function(v)
    {
        rollString += `{{charname=${v.character_name}}} `
        let expl = opts.explodeOn === false ? parseInt(v.explodeOn)||0 : parseInt(opts.explodeOn)||0
        let focus = opts.hasFocus === undefined ? parseInt(v.hasFocus)||0 : parseInt(opts.hasFocus)||0
        
        rollString += `{{roll=[[{`
        for (let i = 0; i < pool.thrown; i++) {
            if (i) rollString += ', '
            rollString += `1d10`
            if (expl)
                rollString += `!>${expl}`
            if (focus === 1)
                rollString += `ro1`
        }
        rollString += `}k${pool.kept}+${pool.mod} `
        if (true === opts.woundmalus)
            rollString += `+ ${parseInt(v.woundmalus)||0} `
        if (true === opts.init)
            rollString += `&{tracker}`
        rollString +=`]]}} `

        rollString += `{{title=${title}}} `

        rollString += `{{displayRoll=${poolToString(pool)}}} `

        console.log(rollString)
        startRoll(rollString, function(result) {
            // Do stuff later
            finishRoll(result.rollId)
        })

    })
}

