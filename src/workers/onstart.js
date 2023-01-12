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
    updateInsightRing()
    updateTraitXp()
    updateInit()

    prepareHealthRows()
    updateHealthMonitorDisplay()
    computeMove()
    updateDefense()

    updateAllAtkRolls()
})