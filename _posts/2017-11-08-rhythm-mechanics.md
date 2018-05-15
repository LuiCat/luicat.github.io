---
title: 2DBeat Rhythm Mechanics Ideas
course: DH2650
---

## Programming

### Beat Sync

- The easiest way for us is to use a new static Time class called BeatTime.
- Introduce BeatManager for getting beat infos, s.t. BeatTime can be updated according to BeatManager.
- Use BPM and integer list for note infos.

### Sound

- Test and pack the 'GetSampleCount' methods to get accurate beat time
- Port my C++ SmoothTime class to C# if useful.
- Loop the music? Or make long sample?

## Memos

### The idea we adapted

- explicit notes
- fixed base damage with growing multiplier

### Other ideas I have

- no explicit notes, hit at any time
- base damage based on how on-beat the hit timing is
- gauge mechanic, charges energy at constant speed, spend all energy at once; during same lenght of time, 5-hit and 1-hit makes no difference
