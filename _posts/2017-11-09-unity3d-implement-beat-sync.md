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

First of all, we have to design a interface for modules that replies on beat mechanics to access the beat data. The interface below is a basic but good example of the beat interface, so that all essential information can be known through this interface.

```csharp
public interface IBeatProvider {
    double GetAudioTime();
    float GetBeatFromTime(double audioTime);
    double GetTimeFromBeat(float beat);
}
```

In the implementation of ```IBeatProvider```, we can see two sets of functions, one is the absolute time function GetAudioTime with no parameters, one is GetXFromY mapping functions. With the two sets of functions any module will be able to know what is the time of the audio, and which beat is mapped or mapped backward to a certain time.

#### Default Beat Provider

A quick example for a fixed-BPM beat provider class is below. it simply maps the first beat to time point at 0 seconds, and maps all followed beats by 120 BPM (2 beats per second).

```csharp
private class DefaultBeatProvider : IBeatProvider
{
    double startAudioTime = AudioSettings.dspTime;
    public double GetAudioTime() { return AudioSettings.dspTime - startAudioTime; }
    public float GetBeatFromTime(double audioTime) { return (float)(audioTime * 2); } // 120BPM for default.
    public double GetTimeFromBeat(float beat) { return audioTime * 0.5; }
}
```

### BeatTime

The class ```BeatTime``` is basically a imitation of Unity's Time class providing useful information about beats(a scaled time unit to determine how many *quarter notes* have passed). In addition, ```BeatTime``` is a ```MonoBehaviour``` that should be attached to some game object, so that values can be updated.

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

To avoid the static time information being updated multiple times in a single update period, singleton-like strategies should be used. For ```MonoBehaviour``` class, the objects should not be created manually, but it's not the best solution to make BeatTime a non-```MonoBehaviour``` class as we would like to be benefited by the updating features and like it to be referenced via Unity's component system, so I chose to implement the singleton feature in this way:

```csharp
private static BeatTime instance = null;

void OnDisable()
{
    // Singleton class logic. There should be only one instance that updates static values.
    if (instance == this)
        instance = null;
}

void Update()
{
    // Singleton class logic. Checks if last instance is disabled/removed and replace it
    if (instance == null)
        instance = this;

    // Static update. Only the singleton instance do this.
    if (instance == this)
    {
        // ...
    }

}
```

This logic allow us to use multiple copies of BeatTime component, and the first one that is updated will become the main instance for updating static values, and other instances will be kept for backups and be used at any time previous main instance is disabled.

#### Beat Provider

```csharp
private IBeatProvider m_beatProvider = null;
public IBeatProvider beatProvider {
    get {
        return m_beatProvider;
    }
    set {
        if (value == null)
            value = new DefaultBeatProvider();
        // some value updates, depends on how long the time has proceed from last update.
        // benchmark values or time stamps may not work after the beat provider changed.
        m_beatProvider = value;
        m_lastAudioTime = value.GetAudioTime();
        // ...
    }
}
void Awake() {
    beatProvider = m_beatProvider;
}
```

As seen in the code above, we created a property with the setter preventing our member field ```m_beatProvider``` being set to ```null```, and also lazy-initialized the default beat provider when the BeatTime component has started up. Also, any benchmark values or time stamps will be reset by setting the ```beatProvider``` property to the value of itself.

#### Updating

The updating part might be the most boring part, as it simply checks if the component being updated is the main component (as mentioned in section [Singleton-like Strategy](#singleton-like-strategy)) and calculates how long the time and beat has proceeded. I would simply paste my code below together with necessary comments, hopes everything is enough helpful for readers.

(Note that every static member has prefix class name ```BeatTime.```, and every member field has the prefix ```m_```)

```csharp
void Update() {
    // Singleton class logic. Checks if last instance is disabled/removed and replace it
    if (BeatTime.instance == null)
        BeatTime.instance = this;

    // Current time and beat values, will be used to update every static property.
    var currAudioTime = beatProvider.GetAudioTime();
    var currBeat = beatProvider.GetBeatFromTime(currAudioTime);

    // Static update. Only the singleton instance do this.
    if (BeatTime.instance == this) {
        // The audio time properties
        BeatTime.deltaAudioTime = currAudioTime - BeatTime.audioTime;
        BeatTime.audioTime = currAudioTime;

        // The beat properties
        BeatTime.beat = currBeat;
        BeatTime.deltaBeat = currBeat - m_lastBeat;
        BeatTime.numBeat = currBeat < 0 ? -1 : (int)Math.Floor(currBeat);
        BeatTime.subBeat = currBeat - BeatTime.numBeat;

        // More useful mapped time values, optimized update method involved
        // Only updates when we have gone into new beats, 
        // as mapping would be expensive depending on the implementation
        if (m_lastNumBeat != BeatTime.numBeat) {
            BeatTime.lastBeatTime = m_lastNumBeat < 0 ? double.MinValue : beatProvider.GetTimeFromBeat(currBeat);
            BeatTime.nextBeatTime = beatProvider.GetTimeFromBeat(BeatTime.numBeat + 1);
        }
        // These two time-based values needs to be dynamically updated
        // But don't worry. This is just a simpler one compared with the twos above
        BeatTime.timeFromLastBeat = BeatTime.audioTime - BeatTime.lastBeatTime;
        BeatTime.timeTillNextBeat = BeatTime.nextBeatTime - BeatTime.audioTime;

        // Accumulated!
        BeatTime.accumulatedBeat += deltaBeat;
    }

    // Update benchmark data
    m_lastAudioTime = currAudioTime;
    m_lastBeat = currBeat;
    m_lastNumBeat = BeatTime.numBeat;
}
```

## Examples

### AudioBeatProvider with variety BPM

If we want to introduce variety BPM, in common words, changing tempo, we have to do special calculations for beat-time mapping. Example codes below:

```csharp
// The list of BPM values together with the starting beats.
// Vector2.x for beat and Vector2.y for BPM.
// The reason for using Vector2 is to allow editing in Unity Editor.
public Vector2[] bpmList = { new Vector2(0, 120) };

// Pre-calculated time values used for quick beat-time mapping calculation.
// Binary search would be used on these lists.
private float[] beatList;
private double[] offsetList;

void Start() {
    if (bpmList != null)
    {
        offsetList = new double[bpmList.Length];
        beatList = new float[bpmList.Length];
        double lastOffset = offsetFirstBeat;
        double lastBeat = 0;
        double lastBPM = bpmList[0].y;
        for (int i = 0; i < bpmList.Length; ++i)
        {
            beatList[i] = bpmList[i].x;
            offsetList[i] = lastOffset + (bpmList[i].x - lastBeat) / lastBPM * 60;
            lastOffset = offsetList[i];
            lastBeat = bpmList[i].x;
            lastBPM = bpmList[i].y;
        }
    }
}

public float GetBeatFromTime(double audioTime) {
    int i = Array.BinarySearch(offsetList, audioTime);
    if (i < 0) i = Math.Max(~i - 1, 0);
    float result = beatList[i] + (float)(audioTime - offsetList[i]) * bpmList[i].y / 60;
    if (loop && loopCount > 0)
    {
        result += loopCount * loopLengthBeat;
    }
    return result;
}

public double GetTimeFromBeat(float beat) {
    int i = Array.BinarySearch(beatList, beat);
    if (i < 0) i = Math.Max(~i - 1, 0);
    double result = offsetList[i] + (beat - beatList[i]) / bpmList[i].y * 60;
    if (loop && loopCount > 0)
    {
        result += loopCount * loopLengthTime;
    }
    return result;
}
```

### Moving Note for Beat Indicators

This example shows how to make use of the BeatTime static values.

```csharp
public class NoteMove : MonoBehaviour {
    double m_targetTime;
    float m_targetBeat;
    public float targetBeat {
        get {
            return m_targetBeat;
        }
        set {
            m_targetBeat = value;
            m_targetTime = BeatTime.timeOnBeat(value); // The use of timeOnBeat function
        }
    }

    public enum MotionType { Motion_Beat = 0, Motion_Time = 1 }
    public MotionType motionType { get; set; }

    public float motionSpeed { get; set; }

    void Update () {
        Vector3 position = transform.localPosition;
	    if (BeatTime.beat < targetBeat) {
            if (motionType == MotionType.Motion_Beat) {
                position.x = motionSpeed * (targetBeat - BeatTime.beat); // calculate the position according to beat value
            } else {
                position.x = motionSpeed * (float)(targetTime - BeatTime.audioTime);
            }
        }
        transform.localPosition = position;
    }
}

```

## Video Demo

<iframe width="560" height="315" src="https://www.youtube.com/embed/IlQzDjnGnKc" frameborder="0" gesture="media" allow="encrypted-media" allowfullscreen></iframe>

## In the End

By all means, I'd like to thank to the rhythm game Malody ([our community page](http://m.mugzone.net/index), [introduction](http://m.mugzone.net/)). In developing this game with the producer, I learned a lot about mechanics behind rhythm-synchronizing contents. For hard-core rhythm gamers, the ones who loved old-styled rhythm game modes and simulators, and creative authors who loved creating charts (generally mapping of the notes to certain beats) for songs to be played by all other players, I highly recommend this game to you.

Also, I'd like to introduce the fantastic Japanese arcade and console game Taiko no Tatsujin. Players use drum-sticks to play on arcade version of the game, while hearing sounds of they beating the taiko drum. I found most of the charts fascinating, and had been creating my own charts for 5 years. Also, I created a simple online taiko-game-like animated chart viewer which can be found [here]({% post_url 2017-11-09-tjaplayer-test %}).

December 10, 2017

## Modification History

- Nov 9, 2017 - Draft created
- Dec 10, 2017 - All contents finished
