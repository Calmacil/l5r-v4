/**
 * Updates init attributes
 */
function updateInit()
{
    getAttrs(['insight_rank', 'reflex', 'modinit'], v => {
        let reflex = parseInt(v.reflex)||0
        let insight_rank = parseInt(v.insight_rank)||0

        let base_init = createPool(reflex + insight_rank, reflex)

        let modinit = parsePoolString(v.modinit)
        let total_init = sumPools(base_init, modinit)

        setAttrs({
            baseInit: flattenPool(poolToString(base_init)),
            totalInit: flattenPool(poolToString(total_init))
        })
    })
}

on('change:reflex change:modinit change:insight_rank', evi => {
    updateInit()
})

