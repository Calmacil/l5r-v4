on('sheet:opened', function()
{
    // remove when dev is finished
    console.clear()
    updateCharType()
    updateRings()
    updateAllSkills()
    updateInsightXpSkill()
    updateAdvantageXp()
    updateDisadvantageXp()
    updateKataXp()
    updateInsightRing()
    updateTraitXp()
    updateInit()

    prepareHealthRows()
    updateHealthMonitorDisplay()
    computeMove()
    updateDefense()

    updateAllAtkRolls()
})