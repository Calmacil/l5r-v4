on('sheet:opened', function()
{
    updateRings()
    updateAllSkills()
    updateInsight()
    updateInit()

    prepareHealthRows()
    updateHealthMonitorDisplay()
    computeMove()
})