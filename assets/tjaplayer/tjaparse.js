
var soundtype=[-1,0,1,0,1,0,0,0,-1,0];
var hitrate=[0,0,0,0,0,15,15,24,0,24];

function cloneable()
{
	return {clone:function()
		{
			var copy={};
			for(key in this)
			{
				copy[key]=this[key];
			}
			return copy;
		}
	};
}

function createState(bpm, offset)
{
	var state=cloneable();
	
	state.offset=offset;
	state.beat=0.0;
	
	state.measure=4;
	
	state.scroll=1.0;
	state.bpm=bpm;
	
	state.hideBarline=false;
	
	state.skip=false;
	
	state.lastState=null;
	
	state.segment=function(div, count)
	{
		count=count||1;
		var deltaBeat=this.measure*(count/div);
		this.beat+=deltaBeat;
		this.offset+=60*deltaBeat/this.bpm;
	}
	
	state.save=function()
	{
		this.lastState=this.clone();
	}
	
	state.discard=function()
	{
		var tate=this.lastState;
		this.lastState=null;
		return state;
	}
	
	return state;
}

function createNote(state, type)
{
	var note=cloneable();
	
	note.type=type;
	
	note.offset=state.offset;
	note.beat=state.beat;
	
	note.speed=state.scroll*state.bpm/60; // beat space / sec
	
	note.len=0;
	
	note.hits=1;
	note.hitrate=hitrate[type];
	
	note.sound=soundtype[type];
	
	return note;
}

function createFragment(beginState, beginBar, beginNote, fragTitle)
{
	var frag=cloneable();
	
	frag.title=fragTitle;
	
	frag.beginState=beginState.clone();
	
	frag.beginBar=beginBar;
	frag.countBar=0;
	
	frag.beginNote=beginNote;
	frag.endNote=beginNote;
	
	frag.end=function(nextbar, nextnote)
	{
		this.countBar=nextbar-this.beginBar;
		this.endNote=nextnote;
	}
	
	return frag;
}

function createParserTja()
{
	var parser={};
	
	var tempNotes=[];
	var tempEvents=[];
	var tempNum=0;
	
	var lastNote=null;
	
	var balloonHits=[];
	
	var state=null;
	
	parser.noteList=[];
	
	parser.props=[];
	
	var currFrag=null;
	parser.fragList=[];
	
	parser.titleList=[];
	
	parser.noteCount=0;
	parser.barCount=0;
	parser.lineCount=0;
	
	parser.ended=false;
	var allowEnd=true;
	
	parser.errStr=null;
	
	function newBar()
	{
		tempNotes=[];
		tempEvents=[];
		tempNum=0;
	}
	
	function dealBar()
	{
		var emptyBar=false;
		
		if(tempNum==0) // deal with empty bar... R U fxxking doing that?
		{
			tempNotes.push('0');
			++tempNum;
			emptyBar=true;
		}
		
		tempEvents.reverse(); // reverse the event list for pop-outs
		
		var deltaNum=0;
		var currNum=0;
		
		for(i in tempNotes)
		{
			var noteChar=tempNotes[i];
			// deal with events
			while(tempEvents.length>0 && tempEvents[tempEvents.length-1].pos<=currNum)
			{
				if(deltaNum>0)
				{
					state.segment(tempNum, deltaNum);
					deltaNum=0;
					++parser.noteCount;
				}
				
				event=tempEvents.pop().str;
				
				if(event.toUpperCase().search('^#SCROLL')==0)
				{
					var para1=parseFloat(event.substr(7));
					if(isNaN(para1))
						throw 'Invalid parameter given in "'+event+'"';
					state.scroll=para1;
				}
				else if(event.toUpperCase().search('^#MEASURE')==0)
				{
					var paras=event.substr(8).split('/',2);
					var para1=parseInt(paras[0]);
					var para2=parseInt(paras[1]);
					if(isNaN(para1)||isNaN(para2)||para2<=0)
						throw 'Invalid parameter given in "'+event+'"';
					state.measure=4*para1/para2;
				}
				else if(event.toUpperCase().search('^#BPMCHANGE')==0)
				{
					var para1=parseFloat(event.substr(10));
					if(isNaN(para1))
						throw 'Invalid parameter given in "'+event+'"';
					state.bpm=para1;
				}
				else if(event.toUpperCase().search('^#DELAY')==0)
				{
					var para1=parseFloat(event.substr(6));
					if(isNaN(para1))
						throw 'Invalid parameter given in "'+event+'"';
					state.offset+=para1;
				}
				else if(event.toUpperCase().search('^#BARLINEON')==0)
				{
					state.hideBarline=false;
				}
				else if(event.toUpperCase().search('^#BARLINEOFF')==0)
				{
					state.hideBarline=true;
				}
				else if(event.toUpperCase().search('^#GOGOSTART')==0)
				{
					
				}
				else if(event.toUpperCase().search('^#GOGOEND')==0)
				{
					
				}
				else if(event.toUpperCase().search('^#FRAGSTART')==0)
				{
					if(currFrag)
						throw 'Second #FRAGSTART while not having a #FRAGEND';
					if(currNum>0)
						throw '#FRAGSTART must be at the begin of a bar';
					var title=event.slice(10);
					while(title.length>0 && title.charAt(0)==' ')title=title.slice(1);
					while(title.length>0 && title.charAt(-1)==' ')title=title.slice(0,-1);
					currFrag=createFragment(state, parser.barCount, parser.noteList.length, title);
				}
				else if(event.toUpperCase().search('^#FRAGEND')==0)
				{
					if(!currFrag)
						throw 'No #FRAGSTART given before #FRAGEND';
					if(currNum>0)
						throw '#FRAGEND must be at the begin of a bar';
					currFrag.end(parser.barCount, parser.noteList.length);
					parser.fragList.push(currFrag);
					currFrag=null;
				}
				else if(event.toUpperCase().search('^#TITLE')==0)
				{
					var title=event.slice(6);
					while(title.length>0 && title.charAt(0)==' ')title=title.slice(1);
					while(title.length>0 && title.charAt(-1)==' ')title=title.slice(0,-1);
					if(title.length>0)
						parser.titleList.push({offset:state.offset,name:title});
				}
				else if(event.toUpperCase().search('^#BRANCHSTART')==0)
				{
					throw '#BRANCHSTART is not supported';
				}
				else
				{
					throw 'Unsupported event string "'+event+'"';
				}
			}
			
			if(parser.ended && emptyBar) // if parse is about to end, and current bar is actually empty, just not push a barline
			{
				return;
			}
			
			// push a barline at first note
			if(currNum==0 && !state.hideBarline)
			{
				parser.noteList.push(createNote(state, 0));
			}
			
			// push the note
			if(noteChar!='0')
			{
				if(deltaNum>0)
				{
					state.segment(tempNum, deltaNum);
					deltaNum=0;
				}
				
				var noteType=parseInt(noteChar);
				
				if(noteType==8) // skip #8 note end
				{
					if(lastNote)
						lastNote.len=state.offset-lastNote.offset;
				}
				else
				{
					lastNote=createNote(state, noteType);
					if(noteType==7 || noteType==9)
					{
						lastNote.hits=balloonHits.pop();
						if(!lastNote.hits)
							lastNote.hits=5;
					}
					else if(noteType==6 || noteType==5)
					{
						lastNote.hits=114514;
					}
					parser.noteList.push(lastNote);
					++parser.noteCount;
				}
				
			}
			
			++deltaNum;
			++currNum;
		}
		
		if(deltaNum>0)
		{
			state.segment(tempNum, deltaNum);
		}
		
		++this.barCount;
		newBar();
		
	}
	
	parser.startWithState=function(stateState)
	{
		allowEnd=false;
		state=stateState.clone();
		this.ended=false;
		newBar();
	}
	
	parser.parseLine=function(line)
	{
		++this.lineCount;
		//try
		{
			if(line.charAt(0)=='#') // handle '#' headed events and parse later
			{
				if(line.toUpperCase().search('^#START')==0)
				{
					if(!allowEnd)
						throw '#START is not allowed when parsing fragments';
					if(this.ended)
						throw 'Multiple #START is not allowed';
					offset=parseFloat(this.props['OFFSET']);
					bpm=parseFloat(this.props['BPM']);
					if(isNaN(offset) || isNaN(bpm) || bpm<=0)
						throw 'Either BPM or OFFSET is not properly set';
					state=createState(bpm, -offset);
					newBar();
				}
				else if(line.toUpperCase().search('^#END')==0)
				{
					if(!allowEnd)
						throw '#END is not allowed when parsing fragments';
					this.ended=true;
					dealBar();
					state=null;
				}
				else // put events in templist
				{
					tempEvents.push({pos:tempNum,str:line});
				}
			}
			else if(state) // handle notes and segment ends
			{
				var charList=line.split("");
				for(i in charList)
				{
					var c=charList[i];
					if(('1234567890').indexOf(c)>=0) // put notes in templist
					{
						if(state.skip)
							tempNotes.push('0');
						else
							tempNotes.push(c);
						++tempNum;
					}
					else if(c==',') // parse notes and events in templist
					{
						dealBar();
					}
				}
			}
			else // parse notemap properties
			{
				var prop=line.split(':',2);
				if(prop.length==2)
				{
					this.props[prop[0]]=prop[1];
					if(prop[0]=='BALLOON')
					{
						balloonHits=[];
						var hit=prop[1].split(',');
						for(i in hit)
						{
							balloonHits.push(parseInt(hit[i]));
						}
						balloonHits.reverse();
					}
				}
				/*
				else
				{
					throw 'Not a property "'+line+'"';
				}*/
			}
		}
		/*catch(e)
		{
			this.errStr = "Line "+this.lineCount.toString()+": "+e;
			console.log(this.errStr);
			return false;
		}*/
		return true;
	}
	
	return parser;
}
