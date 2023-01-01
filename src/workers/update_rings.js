
/**
 * Update rings values
 */
function updateRings()
{
    console.error('Update rings!')
    getAttrs(['constitution', 'will', 'awareness', 'reflex', 'strength', 'perception', 'agility', 'intelligence'], function(v)
    {
        setAttrs({
            earth: Math.min(v['constitution'], v['will']),
            air: Math.min(v['reflex'], v['awareness']),
            water: Math.min(v['strength'], v['perception']),
            fire: Math.min(v['agility'], v['intelligence'])
        })
        updateInsight()
    })
}


on('change:constitution change:will change:awareness change:reflex change:strength change:perception change:agility change:intelligence change:void', evi => {
    console.error('ONCHANGE traits values!')
    updateRings()
    updateAllSkills()
    updateAllAtkRolls()
    updateTraitXp()
});

