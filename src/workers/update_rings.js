function updateRings()
{
    getAttrs(['constitution', 'will', 'awareness', 'reflex', 'force', 'perception', 'agility', 'intelligence'], function(v)
    {
        setAttrs({
            earth: Math.min(v['constitution'], v['will']),
            air: Math.min(v['reflex'], v['awareness']),
            water: Math.min(v['force'], v['perception']),
            fire: Math.min(v['agility'], v['intelligence'])
        })
        updateInsight()
    })
}

on('change:constitution change:will change:awareness change:reflex change:force change:perception change:agility change:intelligence', v => {
    updateRings()
    updateAllSkills()
    updateAllAtkRolls()
});