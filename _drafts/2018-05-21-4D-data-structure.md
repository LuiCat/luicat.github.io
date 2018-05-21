---
title: Designing 4D Model Data Structure for Projection / Clipping Rendering
course: DH2323
date: 2018-05-19
---

### My First Thoughts

From previous post [2D Cross-Section in Unity]({% post_url 2018-05-19-2D-clipping-in-unity %}) I thought about how cross-section (mentioned as clipping) works. As mentioned in the post, a cross-section applied to a 3D object basically converts every geometric elements into lower-dimensional equivalent element, e.g. a plane to a line, a line to a vertex.

For a higher-dimension space, i.e. a 4D space, a full-4D model should be consist of 4 basic elements excluding the model itself, which is relevant to 0~3 dimensional objects. As what usually a 3D model consists of, vertices and faces to be spoken out, to generate proper 3D model by cross-section, there should be proper data structure to note about the "3D faces" and edges. Luckily enough, the functions provided by Unity's standard class Model has enough information for us about how a data structure for "3D faces" would consists of. The only problem is to use 4D vectors for vertices.

### Designing & Implementation

(Work in progress)

### Update History

- May 21, 2018 - Draft created
