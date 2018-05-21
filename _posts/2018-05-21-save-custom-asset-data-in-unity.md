---
title: Save Custom Asset Data in Unity
course: DH2323
date: 2018-05-19
---

As a need of saving and exchanging data for 4D models, I digged more into Unity's inner functionalities, and found [this question](https://answers.unity.com/questions/39311/editor-scripting-how-to-save-a-script-generated-me.html) on Unity's official forum. Thanks to my Google-fu, I'm aware that a derived class of ScriptableObject can be serialized and used just as a asset in UnityEditor, as I've tried Object derived class for saved assets before, but it won't drop into a property field in the inspector.

I created several classes for a quick test (formatted / abridged for a better delivery of ideas):

TestData.cs:
```csharp
[CreateAssetMenu(fileName = "TestData", menuName = "TestData")]
public class TestData : ScriptableObject {
    public int foo;
    public float bar;
}
```

TestDataLoader.cs:
```csharp
[ExecuteInEditMode]
public class TestDataLoader : MonoBehaviour {
    public TestData data;
    void OnValidate() {
        Debug.Log("TestData : " + (data == null ? "null" : data.foo + " " + data.bar));
    }
}
```

TestDataSaver.cs
```csharp
public class TestDataSaver : MonoBehaviour {
    public int foo;
    public float bar;
    void OnValidate() {
        var data = ScriptableObject.CreateInstance<TestData>();
        data.foo = foo;
        data.bar = bar;
        AssetDatabase.CreateAsset(data, "Assets/TestDataSaved.asset");
        AssetDatabase.SaveAssets();
    }
}
```

As I finished class TestData, I noticed that there is a menu item available to create a asset of class TestData with properties editable.

![](/assets/images/posts/4DRender_testdata_menuitem.png)

![](/assets/images/posts/4DRender_testdata_edit.png)

Data saving and loading works well too.

![](/assets/images/posts/4DRender_testdata_saveload.png)

![](/assets/images/posts/4DRender_testdata_loadlog.png)

After the end of searching, I'd like to put some useful links to refer and give credit to. (Although all testing above is enough for me!)

#### References

- Unity Tutorial : Introduction to Scriptable Objects ([https://unity3d.com/cn/learn/tutorials/modules/beginner/live-training-archive/scriptable-objects]([https://unity3d.com/cn/learn/tutorials/modules/beginner/live-training-archive/scriptable-objects))
- [Editor scripting] How to save a script generated mesh as an asset/FBX? ([https://answers.unity.com/questions/39311/editor-scripting-how-to-save-a-script-generated-me.html](https://answers.unity.com/questions/39311/editor-scripting-how-to-save-a-script-generated-me.html))
