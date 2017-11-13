---
title: Implementation of Beat-Sync on Unity3D
date: 2017-11-10
---

## In the Beginning

My motivation of writing this tutorial is for my course project of DH2650 Computer Game Design in KTH. All codes and demo appended below are part of the project, and the game would be published in several weeks.

Before implementing beat-sync for the project, I have been really familiar with implementations of this synchronizing mechanic. However, this is the first time I do it in Unity3D using C#, and from my experience, the structure of all is raster clear so that I can make a easy-to-begin-with tutorial.

## What for?

Beat synchronizing is always a headache for game producers developing rhythm games the first time. Beyond game engine and language, there are many approaches to achieve beat-sync mechanic. Here I'm introducing a universal way to create an underlying structure for creating all kinds of beat-sync game contents.

## Main Structure

The beat-sync structure contains two parts:
- BeatProvider
- BeatTime

### BeatProvider

#### The Interface

#### Default Beat Provider

### BeatTime

The class ```BeatTime``` is basically a immitation of Unity's Time class providing useful information about beats(a scaled time unit to determine how many *quarter notes* have passed). In addition, ```BeatTime``` is a ```MonoBehaviour``` that should be attached to some game object, so that values can be updated.

#### Time and Beat Values

Taking care of most of the possible requirements of rhythm games, here are several types of static properties I recommend to keep updated.

First part, we have some basic properties for time and beat:

```csharp
public static float beat { get; private set; }
public static float deltaBeat { get; private set; }
public static float accumulatedBeat { get; set; }

public static double audioTime { get; private set; }
public static double dspTime { get { return AudioSettings.dspTime; } }
```

Note that ```dspTime``` stands for "Digital Sound Processing Time", which we can directly fetch from ```AudioSettings.dspTime```. With this value of time we are precisely synchronized to the audio. For other game engines, there could be relevant time APIs to know the time that is relative to elapsed size of sound buffers.

Also, ```accumulatedBeat``` can be reset to any value manually. The value of ```accumulatedBeat``` shows how many beats the game had passed, and never be reset by ```BeatTime``` updates, so that this value is relyable for timer usages.

Following ones are pre-treated integer beat values and a companied sub-beat value. 

```csharp
public static int numBeat { get; private set; }
public static float subBeat { get; private set; }
```

The property ```numBeat``` has similar usage with a frame number. The value is calculated by flooring ```beat```, but assigned to -1 when ```beat``` is negative.

The property ```subBeat``` is strictly equal to ```beat``` minus ```numBeat``` (calculating errors not included). It satisfies to be between [0, 1) when ```beat``` is positive and (-∞, 1) when ```beat``` is negative. Checking this property gives information about what position is it during one beat.

Following ones are time-beat mapping methods, which are indispensible in terms of their definition. Further reading: [instance](#singleton-like-updating-strategy), [BeatProvider interface](#beatprovider)

```csharp
public static double timeOnBeat(float beat) { return instance.beatProvider.GetTimeFromBeat(beat); }
public static float beatOnTime(double time) { return instance.beatProvider.GetBeatFromTime(time); }
```

Following ones is some already mapped beat-to-time properties related to the next and previous beat.

```csharp
public static double nextBeatTime { get; private set; }
public static double lastBeatTime { get; private set; }
public static double timeTillNextBeat { get; private set; }
public static double timeFromLastBeat { get; private set; }
```

#### Singleton-like Strategy

#### Beat Provider

#### Updating

## Examples

### MusicBeatProvider with variety BPMs

### Moving Note for Beat Indicators

## Demo

## In the End

By all means, I'd like to thank to the rhythm game Malody. In developing this game with the producer, I learned a lot about mechanics behind rhythm-synchronizing contents. For hard-core rhythm gamers, the ones who loved old-styled rhythm game modes and simulators, and creative authors who loved creating charts (generally mapping of the notes to certain beats) for songs to be played by all other players, I highly recommend this game to you.

Also, I'd like to introduce the fantastic Japanese arcade and console game Taiko no Tatsujin. Players use drum-sticks to play on arcade version of the game, while hearing sounds of they beating the taiko drum. I found most of the charts fancinating, and had been creating my own charts for 5 years. Also, I created a simple online taiko-game-like animated chart viewer which can be found [here]({% post_url 2017-11-09-tjaplayer-test %}).
