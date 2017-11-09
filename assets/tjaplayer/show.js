var globalOffset=0.065;

var updateSec=0.2;

var offset=9.316;
var beatpersec=1.966667;
var pxperbeat=192;

var timerID;
var notelist;
var inputoffset;
var loadCount=0;
var soundCount=0;

var audioContext;

var playing=false;

var bgm;
var sounds=new Array();
var nextsoundid=0;
var maxsoundid=15;
var volume=0.6;

var audionode;

var soundsrc=['s/dong.wav','s/ka.wav','s/balloon.wav'];
var soundsrc2=['s/dong.mp3','s/ka.mp3','s/balloon.mp3'];

var noteclass=['barline','note dong','note ka','note dong big','note ka big',
			'note renda','note renda big','note balloon','note end','note potato'];

var noteList=[];
			
var currentTime=0;
var rawTime=0;
var lastStamp;

var originTitle='';
var currTitle=-1;
var lastTitle=-1;

function trackTogglePause()
{
	if(bgm.paused)
	{
		bgm.play();
		return;
	}
	bgm.pause();
}

function onPause()
{
	if(!playing)return;
	playing=false;
	stopAllSound();
	$('#notecontainer *').stop(true, false);
	$('#notecontainer_used').empty();
	$('#title_now').stop(true, false);
	if(timerID!=null)
		clearInterval(timerID);
	timerID=null;
}

function onPlay()
{
	if(playing)return;
	playing=true;
	fullReloadNotes();
	soundNote(updateSec*1.2);
	if(timerID!=null)
		clearInterval(timerID);
	timerID=setInterval(updateScene, updateSec*1000);
}

function onSeeking()
{
}

function onSeeked()
{
	fullReloadNotes();
}

function onVolumeChanged()
{
	audionode.gain.value=bgm.volume;
}

function loadSound(id, url)
{
	if(audioContext)
	{
		var request = new XMLHttpRequest();
		request.open('GET', url, true);
		request.responseType='arraybuffer';
		request.onload=function()
		{
			audioContext.decodeAudioData(request.response, function(buffer)
			{
				sounds[id]=buffer;
			});
		}
		request.send();
	}
	else
	{
		sounds[id]=document.createElement("AUDIO");
		sounds[id].src=url;
		sounds[id].volume=volume;
		sounds[id].addEventListener('canplaythrough',function()
		{
			//console.log(sounds[id]);
		});
		sounds[id].load();
	}
}

function initSound()
{
	try
	{
		audioContext=new AudioContext();
	}
	catch(e)
	{
		try
		{
			audioContext=new webkitAudioContext();
		}
		catch(e)
		{
			audioContext=null;
			//alert('Failed init AudioContext');
		}
	}
	
	if(audioContext)
	{
		for(var i=0;i<3;++i)
		{
			loadSound(i, soundsrc[i]);
		}
		audionode=audioContext.createGain();
		audionode.connect(audioContext.destination);
		audionode.gain.value=volume;
	}
	else
	{
		for(var i=0;i<maxsoundid;++i)
		{
			loadSound(i, soundsrc2[i%3]);
		}
	}
	
	bgm=$('audio#bgm')[0];
	bgm.volume=volume;
	
	bgm.addEventListener('pause',onPause);
	//bgm.addEventListener('waiting',onPause);
	bgm.addEventListener('seeking',onSeeking);
	bgm.addEventListener('play',onPlay);
	//bgm.addEventListener('playing',onPlay);
	bgm.addEventListener('seeked',onSeeked);
	bgm.onvolumechange=onVolumeChanged;
}

function playSound(id, delay)
{
	if(!(id>=0))return;
	if(audioContext)
	{
		if(!playing)return;
		var node=null;
		if(node!=null)
			node.stop(audioContext.currentTime+delay);
		node=audioContext.createBufferSource();
		node.buffer=sounds[id];
		node.connect(audionode);
		//if(id==2)
		//console.log(id);
		node.start(audioContext.currentTime+delay);
	}
	else
	{
		if(delay!=null)
		{
			setTimeout('playSound('+id+')',delay*1000);
			//console.log(delay*1000);
			return;
		}
		if(!playing)return;
		if(sounds[nextsoundid+id])
		{
			sounds[nextsoundid+id].currentTime=0;
			sounds[nextsoundid+id].play();
		}
		nextsoundid+=3;
		if(nextsoundid>=maxsoundid)
			nextsoundid=0;
	}
}

function stopAllSound()
{
	if(audioContext==null)
	{
		for(var i=0;i<maxsoundid;++i)
		{
			sounds[i].pause();
		}
	}
	else
	{
		//audioContext.suspend();
		//audioContext.resume();
		audionode.disconnect();
		audionode=audioContext.createGain();
		audionode.connect(audioContext.destination);
		audionode.gain.value=volume;
	}
}

function updateTime(force)
{
	if(force || lastStamp==undefined)
	{
		lastStamp=window.performance.now()*0.001;
		lastTime=currentTime=bgm.currentTime+globalOffset;
		return;
	}
	stamp=window.performance.now()*0.001;
	rawTime=bgm.currentTime+globalOffset;
	currentTime+=stamp-lastStamp;
	if(Math.abs(currentTime-rawTime)>0.100)
		currentTime=rawTime;
	else if(Math.abs(currentTime-rawTime)>0.002)
		currentTime=currentTime+(rawTime-currentTime)*Math.exp(-(stamp-lastStamp)*3)
	lastStamp=stamp;
	//console.log(currentTime);
}

function playerSeekTime(t)
{
	bgm.currentTime=t;
}

function changeTitle(newTitle)
{
	var t=$('#title_now');
	var td=$('<div class="title_discard"></div>');
	td.text(t.text());
	td.animate({right:'50px',opacity:'0.0'},500,function(){this.remove();});
	t.after(td);
	t.text(newTitle);
}

function changeNextTitle()
{
	if(currTitle+1<titleList.length)
	{
		++currTitle;
		if(lastTitle!=currTitle)
		{
			changeTitle(titleList[currTitle].name);
			lastTitle=currTitle;
		}
	}
	else
	{
		t.text(originTitle);
	}
}

function reloadTitle()
{
	var t=$('#title_now');
	t.stop(true, false);
	t.text(originTitle);
	if(typeof(titleList)!='undefined')
	{
		for(currTitle=-1; currTitle+1<titleList.length; ++currTitle)
		{
			if(titleList[currTitle+1].offset>currentTime)
				break;
		}
		lastTitle=currTitle;
		if(currTitle>=0)
			t.text(titleList[currTitle].name);
	}
}

function updateTitle()
{
	if(typeof(titleList)!='undefined' && currTitle+1<titleList.length)
	{
		var t=$('#title_now');
		t.stop(true, false);
		var o=titleList[currTitle+1].offset-currentTime;
		while(o<0)
		{
			changeNextTitle();
			o=titleList[currTitle+1].offset-currentTime;
		}
		t.animate({right:'0px'},o*1000,'linear',function(){changeNextTitle();updateTitle();});
	}
}

function reloadNotes()
{
	$('#notecontainer *').stop(true, false);
	$('#notecontainer').empty();
	loadCount=0;
	updateTime(true);
	loadNotes();
	reloadTitle();
}

function fullReloadNotes()
{
	$('#notecontainer *').stop(true, false);
	$('#notecontainer').empty();
	loadCount=0;
	soundCount=0;
	updateTime(true);
	loadNotes();
	reloadTitle();
	//stopAllSound();
}

function incOffset(delta)
{
	globalOffset+=delta;
	inputoffset.val((Math.round(globalOffset*1000)/1000).toString());
	setCookie('globalOffset',globalOffset.toString(),365);
	reloadNotes();
}

function checkOffset()
{
	var tempOffset=parseFloat(inputoffset.val());
	if(!isNaN(tempOffset))
		globalOffset=tempOffset;
	inputoffset.val((Math.round(globalOffset*1000)/1000).toString());
	setCookie('globalOffset',globalOffset.toString(),365);
	reloadNotes();
}

function initRawNotes()
{
	noteList=rawNotes.slice(0);
	if(typeof(fragApplied)!='undefined')
	{
		var sorted=new Array();
		for (key in fragApplied)
			sorted.push(key);
		sorted.sort(function(a,b){return fragApplied[a].begin<fragApplied[b].begin?1:-1;});
		for (key in sorted)
		{
			frag=fragApplied[sorted[key]];
			//console.log(frag);
			back=noteList.slice(frag.endNote);
			noteList=noteList.slice(0,frag.beginNote);
			noteList=noteList.concat(frag.notes,back);
		}
	}
	noteList.sort(function(a,b){return a.offset<b.offset?-1:1;});
}

function createNoteTag(rawNote, id)
{
	var e=$('<div></div>');
	e.addClass(noteclass[rawNote.type]);
	e.attr('data-id',id);
	if(showDebug)
		e.text(id.toString());
	
	if(e.hasClass('balloon'))
	{
		var stay=(rawNote.hits-1)/rawNote.hitrate;
		e.attr('data-stay',stay>rawNote.len?rawNote.len:stay);
		e.attr('data-inv',stay>rawNote.len?1:0);
	}
	
	if(rawNote.type==5 || rawNote.type==6)
	{
		e.attr('data-inv',1);
		var head=$('<div class="renda-head"></div>');
		var body=$('<div class="renda-body"></div>');
		body.width(rawNote.len*rawNote.speed*pxperbeat);
		var end=$('<div class="renda-end"></div>');
		end.css('left',rawNote.len*rawNote.speed*pxperbeat);
		e.prepend(end,body,head);
	}
	
	resetNoteTag(e,rawNote);
	return e;
}

function resetNoteTag(e, rawNote, move)
{
	var speed=rawNote.speed;
	if(!speed)speed=beatpersec;
	var offset=rawNote.offset;
	var stay=parseFloat(e.attr('data-stay'))||0;
	
	var offsetTime=offset-currentTime;
	if(offsetTime<0)
	{
		if(stay+offsetTime>0)
			offsetTime=0;
		else
			offsetTime+=stay;
	}
	
	e.css('left',(offsetTime*speed*pxperbeat).toString()+'px');
	
	var removeNote = function()
	{
		if(e.attr('data-inv')=='1')
		{
			offsetTime+=rawNote.len+1/speed;
			e.animate({left:(-(rawNote.len*speed+1)*pxperbeat).toString()+'px'},offsetTime*1000,'linear',function(){e.remove();});
		}
		else
		{
			e.stop(true, false);
			e.css('left','0px');
			e.prependTo($('#notecontainer_used'));
			e.animate({left:'120px',top:'-150px',opacity:'0.5'},200,'linear',function(){e.remove();});
		}
	}
	
	e.stop(true, false);
	if(!bgm.paused)
	{
		if(e.hasClass('note'))
		{
			if(e.attr('data-stay'))
			{
				if(offset>currentTime)
					e.animate({left:'0px'},offsetTime*1000,'linear',function(){e.animate({left:'0px'},stay*1000,'linear',removeNote);})
				else if(stay+offset>currentTime)
					e.animate({left:'0px'},(stay+offset-currentTime)*1000,'linear',removeNote);
				else
					removeNote();
			}
			else if(e.attr('data-inv')=='1')
			{
				removeNote();
			}
			else
			{
				e.animate({left:'0px'},offsetTime*1000,'linear',removeNote);
			}
		}
		else
		{
			offsetTime+=80/speed/pxperbeat;
			e.animate({left:'-80px'},offsetTime*1000,'linear',function(){e.remove();});
		}
	}
}

function positionNotes()
{
	if(bgm.paused)return;
	var container=$('#notecontainer');
	container.children().each(function(){
		resetNoteTag($(this),noteList[parseInt($(this).attr('data-id'))]);
	});
}

function loadNotes()
{
	//updateTime();
	var hitTime;
	var container=$('#notecontainer');
	for(; loadCount<noteList.length; ++loadCount)
	{
		var rawNote=noteList[loadCount];
		hitTime=rawNote.offset;
		if(currentTime+8/rawNote.speed<hitTime && currentTime+2<hitTime)
			break;
		if(currentTime<hitTime || (rawNote.len && currentTime<hitTime+rawNote.len+1/rawNote.speed))
			container.prepend(createNoteTag(rawNote,loadCount));
	}
}

function soundNote(timeLimit)
{
	if(bgm.paused)return;
	updateTime();
	for(; soundCount<noteList.length; ++soundCount)
	{
		var note=noteList[soundCount];
		var nextTime=note.offset-rawTime;
		if(nextTime>=timeLimit)break;
		if(!bgm.ended&&nextTime>=0&&note.sound!=undefined)
		{
			playSound(note.sound,nextTime);
			if(note.hits&&note.hitrate>0)
			{
				var i;
				for(i=1; i<note.hits; ++i)
				{
					var t=i/note.hitrate;
					if(t>note.len)
						break;
					playSound(note.sound,nextTime+t);
				}
				if(i>=note.hits)
					playSound(2,nextTime+note.hits/note.hitrate);
			}
		}
	}
}

function updateScene()
{
	updateTime();
	positionNotes();
	loadNotes();
	soundNote(updateSec*1.5);
	updateTitle();
}

function renderScene()
{
}

function setCookie(c_name,value,expiredays)
{
	var exdate=new Date();
	exdate.setDate(exdate.getDate()+expiredays);
	document.cookie=c_name+"="+escape(value)+((expiredays==null)?"":";expires="+exdate.toGMTString());
}

function getCookie(c_name)
{
	if (document.cookie.length>0)
	{
		c_start=document.cookie.indexOf(c_name+"=");
		if (c_start!=-1)
		{ 
			c_start=c_start+c_name.length+1;
			c_end=document.cookie.indexOf(";",c_start);
			if (c_end==-1)
				c_end=document.cookie.length;
			return unescape(document.cookie.substring(c_start,c_end));
		} 
	}
	return "";
}

function checkCookie()
{
	var cookieOffset=parseFloat(getCookie('globalOffset'));
	if (isNaN(cookieOffset))
	{
		setCookie('globalOffset',globalOffset.toString(),365);
	}
	else 
	{
		globalOffset=cookieOffset;
	}
}

function onResizeWindow()
{
	var ns=$('#notescene');
	var h=$(window).height()-ns.outerHeight();
	ns.css('top',(h/4).toString()+'px');
}

function reloadPlayer()
{
	initRawNotes();
	fullReloadNotes();
}

function initPlayer()
{
	initSound();
	notelist=$('#notelist *');
	inputoffset=$('input#offsetinput');
	originTitle=$('#title_now').text();
	checkCookie();
	checkOffset();
	reloadPlayer();
	if($('#jsplayer').hasClass('fullscreen'))
	{
		onResizeWindow();
		$(window).resize(onResizeWindow);
	}
}

/*
$(function(){
	initPlayer();
});*/

	