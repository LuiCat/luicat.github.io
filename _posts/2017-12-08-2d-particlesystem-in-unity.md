---
title: 2D UI-Space Particle System in Unity
course: DH2650
date: 2017-12-08
---

## The Script

It is pretty strange that no UI-space particle system component is included in Unity. When developing UI particle effects I found this script on Internet:

```CSharp
using UnityEngine;
using UnityEngine.UI;
using System.Collections.Generic;
 
[ExecuteInEditMode]
[RequireComponent(typeof(CanvasRenderer))]
[RequireComponent(typeof(ParticleSystem))]
public class UIParticleSystem : MaskableGraphic {
 
    public Texture particleTexture;
    public Sprite particleSprite;

    // ...

}
```

This solution to UI-space particle system is to simply render the particles onto a texture, which can be further used in canvas rendering. The greatest part is, the script implemented in-editor particle review on 2D canvas, so that when UIParticleSystem is being used, no one would notice the re-render process and everything would looks fine on the canvas, rather than in 3D space.

## Reference

Free Script - Particle Systems in UI Screen Space Overlay ([https://forum.unity.com/threads/free-script-particle-systems-in-ui-screen-space-overlay.406862/](https://forum.unity.com/threads/free-script-particle-systems-in-ui-screen-space-overlay.406862/))
