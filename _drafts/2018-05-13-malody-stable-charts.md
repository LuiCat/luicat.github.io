---
title: Malody Stable Charts
---

<script>

function loadChartsWithLevel(level, onLoad) {
    console.log('Loading Lv.'+level+' charts');
    $.ajax('http://m.mugzone.net/page/chart/filter?status=2&count=765&mode=5&creator=&key=Lv.'+level+'&next=0')
    .done(function(charts){
        onLoad(JSON.parse(charts).data);
    });
}

var levelCharts = {};

var level = 1;
var addCharts = function() {
    loadChartsWithLevel(level, function(charts) {
        levelCharts[level] = charts;
        level++;
        if (level<=35) setTimeout(addCharts,0);
        else console.log('Done!');
    });
}
addCharts();

</script>

[chart info link](http://m.mugzone.net/page/chart/filter?status=2&count=765&mode=5&creator=&key=Lv.17&next=0)


