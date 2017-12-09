---
title: Audio Latency in Unity
date: 2017-12-08
---

There has been rumors around me that Unity is not suitable for make rhythm games. That is not true, and the rhythm game we had created in our Computer Game Design is a potential mythbuster of the rumors. In this post I'm going to show how the audio latency can be controlled with project settings, so any audio reflection will be suitable in latency for rhythm games.

In short, the main cause of large audio latency is the large audio stream buffer. Before any audio is played, audio data will be filled into a main buffer that is looped played. Few segments could be divided, so when one segment is being played, the other ones can be filled at the same time, so to avoid the tiny sound glitches when a segment finishes playing.

In Unity3D, the size of audio buffer can be adjusted via AudioManager. 

In Edit-->Project Settings menu, choose "Audio" to open the AudioManager setting page. The option for adjusting latency is called DSP (Digital Signal Processing) Buffer Size, as shown in the image below:

![](/assets/images/posts/unity_settings_audiolatency.png)

At any time, we can change the option to "Best Latency" to experience the extreme low latency that can be achieved on PCs with common sound cards. However, there is situations that the best latency produces shatterings in the sound output sometimes, due to the computer not able to handle every small buffer operations in a high frequency. At this situation, probably we need to use "Good Latency" instead, which would also create good experience for rhythm games.

Always, well developed rhythm games can have audio libraries they developed or ported by game developers their own. Unity has the option to change to other sound systems other than the vanilla one. If no external sound system / sudio libraries is used, the vanilla audio system is still worth using for rhythm games if correctly used.
