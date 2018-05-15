---
title: How to Design Rhythm-Synchronized Game Contents & Quick Notes on TIMELAPSE Level Design
course: DH2650
date: 2017-12-09
---

## In the Beginning

As I finished my Computer Game Design course, the development of the game TIMELAPSE had come to an end. Surprisingly the level design didn't become a pain for me, and I think this is because my previous experiences on designing beat-synchronized game contents when making DanmakuLyrica.

### About TIMELAPSE

TIMELAPSE is game project in my Computer Game Design course in KTH. The game is developed to satisfy our quality target, so that moderate 3D models and animations is implemented into the game, but only one level is made to show our game mechanics.

I participated in the core mechanics programming such as beat-synchronization scripts and the level design. The rhythm part of the game mechanics also originated from some of my previous ideas, and is processed and polished together with other ideas from the team to become our final design of the game.

The gameplay is recorded here:

<iframe width="560" height="315" src="https://www.youtube.com/embed/4yWVmdotADo" frameborder="0" gesture="media" allow="encrypted-media" allowfullscreen></iframe>

### About DanmakuLyrica

DanmakuLyrica is my graduation design for my bachelor's degree. It consists of a simple game engine fully designed and developed by myself that can be used to realize beat-synchronized games contents, and a rhythm shooting game level.

I have the gameplay recorded here: (sorry for the shattered graphics, there're so many moving objects so not well presented at the bitrate Youtube gave)

<iframe width="560" height="315" src="https://www.youtube.com/embed/VIRENko25Gk" frameborder="0" gesture="media" allow="encrypted-media" allowfullscreen></iframe>

As in the video, the game is designed as a score-hunting game, so that being hit by bullets is painless if no high scores is required, so to guarantee the player to experience through the whole game level (as well the music). The boss is on the screen from the beginning, and have several phrases with patterns reflecting to the music.

## Beat Synchronizing

OK, here we comes into a question: What is the difference in designs between a normal level and beat-synchronized level? Some obvious answer can be instantly spoken out: Timing. Actually the term "timing" is confused with multiple levels of meanings, so it's not really accurate and may do harm to the actual designs.

For me, I understood beat-synchronizing as two different sides: 1. The reflecion to the music; 2. The hitfeel of beats.

### Reflection to the Music

In different aspects, reflection to the music can be done in two aspects, one is the macro aspect and the other is the micro aspect. The two aspects cooperates together and are inseparable when making the whole level design.

#### Macro Aspect

In macro aspect, the task of content design is to show reflection to changes in the music regarding to sections/chapters. Usually a popular music consists of several sections, such like intro, verse, chorus, interlude and outro. During each section the style of rhythm stays mostly the same and between section there is changes making contrast. The principle of showing reflection to these characteristic of the music is, to design unique contents regarding to different sections, while keeping the consistency of other parts of the contents.

Take the boss stage of TIMELAPSE as an example. Through out the whole boss stage, charms is used for the main mechanics of the boss. The charm itself is just a part of consistency of **normal** game designs. The special point about charms and as well bullets is, I used charms mainly to reflect to the rhythm, but used bullets to reflect to the beats. One special point of the design that worth mentioning is the timing for cross-shooting charms to start shooting, as shown in the video:

<iframe width="560" height="315" src="https://www.youtube.com/embed/4yWVmdotADo?start=138" frameborder="0" gesture="media" allow="encrypted-media" allowfullscreen></iframe>

Taking notes on the music would be helpful for later work, and even simple notes on the sections helps enough a lot. I wrote some notes while listening to the music before starting to design the level, copied below:

```
Section   Beats
Intro A   16  -- introduce boss
Intro B   16  -- simple pattern, no shoot
Main A    32  -- enemy shoots
Sub A     32  -- boss shoots, enemy no shoot
Between   32  -- puzzle with enemies. give chance for massive damage
Outro     32  -- game should finish. repeated pattern
```

(Notice that I used some alternatives for the musical terms like replace the "interlude" with a "between", for some direct understands from myself rather than sticking on the professional term. Sorry if this is misleading.)

Also maybe it's useful to paste the piece of music we had used for our game demo:

<iframe width="560" height="315" src="https://www.youtube.com/embed/gOUlBuCBbLA" frameborder="0" gesture="media" allow="encrypted-media" allowfullscreen></iframe>

#### Micro Aspect

The part of micro aspect is more interesting. It is about how you design the patterns and motions of enemies or bullets in respect to the music.

Take some raw design notes of TIMELAPSE for example:

![](/assets/images/posts/timelapse_rawdesign1.jpg)

Based on what I had done in the macro part, I made some simple designs of how the boss would shoot, what kind of enemies would be used and what patterns will all the scene stuffs creates.

Take a quick look at phrase "Sub A": In this phrase, the music sounds impatient and irritable, so maybe some attack-for-madness pattern would be created. I chose my most comfortable one, that is to make the bullet hell. The pattern of bullets is however simple (based on my previous experience in making bullet hell games), because probably we don't what to make the game (or the level) into another style; also I had to make the bullets vulnerable benefited by the main mechanics of the game, making the game less hardcore, so these bullets have to be low-HP charms, and experienced players may even deal with this attacking phrase easily only by tapping the beats.

By carefully listening to the music, I noticed that the beats of the notes is looped in length of half notes. In sheet score it is shown as:

![](/assets/images/posts/timelapse_chart1.png)

So I decided to shoot once for every 2 beats, and the result is pretty good-looking:

![](/assets/images/posts/timelapse_bullethell1.png)

After implementing the game, I found it necessary to rise the floor of the difficulty for experienced players, so waves of invulnerable normal bullets in added and set to the exact time when there is sound effects (the snare) in the music. This design force players to move out of their original positions, but maybe a little bit harmful for normal players. Improvements still need to be made.

![](/assets/images/posts/timelapse_bullethell2.png)

(The bullets appears to be white because the screenshot is taken right at when the bullets blink at the beginning of a beat)

And here's the demo video for this:

<iframe width="560" height="315" src="https://www.youtube.com/embed/4yWVmdotADo?start=159" frameborder="0" gesture="media" allow="encrypted-media" allowfullscreen></iframe>

### Hitfeel of the Music

Alright. Hitfeel is a roughly translated term from Chinese. The complete name for this might be "feeling of hit impacts", but... whatever, I prefer the shorter name, and hope this won't confuse the readers.

By my definition, hitfeel of the music means the general designs of the effects that responds to the beats. It is like someone is punching you at every designed time that is basically aligned with beats.

To introduce this kind of hitfeel, the normal rules still applies. One quick example: Our animator made an boss animation called "attack", and the boss push out its both hands forward when doing this animation; however, simply pushing out the hands wouldn't introduce hitfeel, instead we have to reverse the animation, so that the boss quickly moves his hand forward (it's still some kind of pushing forward, but faster), and in moderate speed moves the hand back. The result can be referred in the video clip used in last section:

<iframe width="560" height="315" src="https://www.youtube.com/embed/4yWVmdotADo?start=159" frameborder="0" gesture="media" allow="encrypted-media" allowfullscreen></iframe>

Also, we'd like to make beat-synchronized designs, so basically animations have to be precisely designed to time on beats. A simpler example might be the blinking bullets: the bullets blinks once for each beat, so players are able to feel the beats not only by listening to the music. Another example is the shooting pattern of the shooter enemy: The enemy shoots 3 bullets instead of 1, and has a quick shrinking circle indicating its future shots; by rapidly shooting bullets, the hitfeel is well introduced, as it tuned the graphic elements more synchronized with beats.

## Credits

Royalty free music:
- The Big Beat 80's by Kevin MacLeod ([https://www.youtube.com/watch?v=23zuhz35UKk](https://www.youtube.com/watch?v=23zuhz35UKk))
- Under the Neon by Vodovoz ([https://www.youtube.com/watch?v=36SLc3pjwQY](https://www.youtube.com/watch?v=36SLc3pjwQY))
- Bad Alley by WebInjection ([https://www.youtube.com/watch?v=gOUlBuCBbLA](https://www.youtube.com/watch?v=gOUlBuCBbLA))

Team TIMELAPSE ([https://projecttimelapse.wordpress.com/](https://www.youtube.com/watch?v=gOUlBuCBbLA))

## Modification History

- Dec 9, 2017 - Created
- Dec 10, 2017 - All contents finished
