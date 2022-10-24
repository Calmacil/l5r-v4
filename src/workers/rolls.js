function doRoll(pool, kept, mod, title, template='base')
{
    var rollString = `&{template:${template}} `
    getAttrs(['character_name', 'hasFocus', 'explodeOn'], function(v)
    {
        rollString += `{{charname=${v.character_name}}} `

        rollString += `{{roll=[[{`
        for (let i = 0; i < pool; i++) {
            if (i) rollString += ', '
            rollString += `1d10!>${v.explodeOn}`
            if ("1" === v.hasFocus)
                rollString += `r1`
        }
        rollString += `}k${kept}+${mod}]]}} `

        rollString += `{{title=${title}}} `

        rollString += `{{displayRoll=${pool}g${kept}`
        if (mod > 0)
            rollString += `+${mod}`
        else if (mod < 0)
            rollString += mod
        rollString += `}} `

        console.warn(rollString)
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
    doRoll(8, 3, 0, 'Ramoloss')
})