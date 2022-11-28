function updateInsightRank()
{
    getAttrs(['insight'], function(v)
    {
        let insight = parseInt(v.insight)||0;
        let insight_rank = Math.max(Math.floor((insight - 100) / 25), 0)
        setAttrs({
            insight_rank: insight_rank
        })
    })
}

function updateInsight()
{
    getSectionIDs('skills', function(idarray)
    {
        let fields = ['earth', 'air', 'water', 'fire', 'void']
        idarray.forEach(id => fields.push(`repeating_skills_${id}_rank`))


        getAttrs(fields, function(v)
        {
            let r_earth = parseInt(v.earth)||0
            let r_air = parseInt(v.air)||0
            let r_water = parseInt(v.water)||0
            let r_fire = parseInt(v.fire)||0
            let r_void = parseInt(v.void)||0

            let insight = 10 * (r_air + r_earth + r_water + r_fire + r_void)
            idarray.forEach(id => {
                insight += parseInt(v[`repeating_skills_${id}_rank`])||0
            })
            setAttrs({
                insight: insight
            })
            updateInsightRank()
        })
    })
}