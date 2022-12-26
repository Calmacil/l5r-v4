on('sheet:opened', function()
{
    // remove when dev is finished
    console.clear()
    updateRings()
    updateAllSkills()
    updateInsight()
    updateInit()

    prepareHealthRows()
    updateHealthMonitorDisplay()
    computeMove()
    updateDefense()

    updateAllAtkRolls()
})