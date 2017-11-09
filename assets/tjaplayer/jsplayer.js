
var jsplayer;
var rawNotes=[];
var titleList=[];

var fragList=[];

var showDebug=false;

function initPlayerContent()
{
	jsplayer=$('#jsplayer');
	
	//if(typeof(showDebug)=="undefined" || !showDebug)
		//jsplayer.addClass('fullscreen');
		
	var scene_inner=$('<div id="notescene_inner"></div>');
	
	scene_inner.append('<div id="notetrack" onclick="trackTogglePause()"><div id="notejudgecircle"></div><div id="notecontainer"></div><div id="notecontainer_used"></div></div>')
	scene_inner.append('<div id="titleboard"></div>');

	scene_inner.append('\
		<div id="offset">\
			<div id="offsettext">Audio Offset</div>\
			<div id="offsetpanel">\
				<div id="offsetinc" onclick="incOffset(0.005)">+</div>\
				<div id="offsetnum">\
					<input id="offsetinput" onchange="checkOffset()" />\
				</div>\
				<div id="offsetdec" onclick="incOffset(-0.005)">-</div>\
			</div>\
		</div>');
		
			//echo '<source src="tja/',$parser->props['WAVE'],'"/>';
		
	scene_inner.append('<div id="bgmcontroller"><audio id="bgm" controls="controls"></audio></div>');

	//scene_inner.append('<script src="show.js"></script>');
		
	var scene=$('<div id="notescene"></div>');
	scene.append(scene_inner);
	jsplayer.append(scene);
		
}

function loadTja()
{
	var src=jsplayer.attr('src');
	if(!src)
		return;
	var spos=src.lastIndexOf('/');
	
	var path=(spos>=0?src.slice(0,spos):'');
	
	/*
	var reader = new FileReader();
	reader.onload = function()  
	{
		alert('file loaded');
	};
	reader.readAsText(target+'/'+src);
	
	*/
	$.ajax({
		url: src,
		type: "GET",
		contentType: "text/plain; charset=utf-8",
		success: function(result){
            var lines=result.split('\n');
			var parser=createParserTja();
			for(i in lines)
			{
				//$('body').append(lines[i]+'<br/>');
				if(!parser.parseLine(lines[i]))
					return;
			}
			$('#bgm').append('<source src="'+path+'/'+parser.props['WAVE']+'"/>');
			
			$('#titleboard').append('<div id="title_now"></div>');
			$('#title_now').append(parser.props['TITLE']);
			if(parser.props['SUBTITLE'] && parser.props['SUBTITLE'].slice(0,2)!='--')
				$('#title_now').append(' '+parser.props['SUBTITLE']);
			originTitle=$('#title_now').text();
			
			//$('#notescene_inner').append('<script src="show.js"></script>');
			
			rawNotes=parser.noteList;
			titleList=parser.titleList;
			fragList=parser.fragList;
			
			initRawNotes();
			fullReloadNotes();
		}
	});
	
	
	//var parser=createParserTja();
	
	
	
	
}

$(function(){
	initPlayerContent();
	loadTja();
	initPlayer();
});
