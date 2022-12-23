/**
 * Computes the movement distances
 */
function computeMove()
{
    getAttrs(['water', 'waterMod'], v => {
        let water = parseInt(v.water)||0
        let waterMod = parseInt(v.waterMod)||0

        let factor = water + waterMod

        if (factor < 1) {
            factor = 1
        }

        setAttrs({
            freeMove: `${factor * 1.5} m`,
            simpleMove: `${factor * 3} m`,
            maxMove: `${factor * 6} m`
        })
    })
}

on('change:water change:waterMod', e => {
    computeMove()
})

