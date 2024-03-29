---
title: "Resume: LuiCat"
date: 2022-09-23
---

# 游戏程序、工具程序、技术策划

<img width=160 src="https://avatars.githubusercontent.com/u/5405648?v=4" />

- 花名：万猫奔腾、LuiCat
- 价值观：劳有所用
- 现状：暂无业余项目

## 专精

- 软件工程
- 游戏系统架构设计
- Data-Driven、模块化、面向图形化编程的程序设计
- UGC 编辑器设计、社区驱动的游戏内容生产工具设计、实时编辑预览框架设计

* VR 与多模态（multimodal）交互与 3C 设计
* HLSL Shader 编程

- 音频编程与音频引擎编程
- 音效设计、编曲混音、乐理、基于音乐的游戏内容创作等

## 项目经历

#### 东方慕华祭（[Steam](https://store.steampowered.com/app/882710/_TouHou_Makuka_Sai__Fantastic_Danmaku_Festival/?snr=1_7_7_151_150_1)）

* 关卡设计：使用 Crazy Storm 弹幕设计软件的关卡设计与测试，负责3-6面与ex的全部道中

#### Malody（多平台多模式社区音游，[Demo](https://www.bilibili.com/video/BV1gZ4y1p79R?t=38) & [Demo](https://www.bilibili.com/video/BV1oS4y1x7Vq)，[Community Website](http://m.mugzone.net/index)，[TapTap](https://www.taptap.com/app/10115)）

- 数据：社区长期保持活力（参考视频：[Bilibili](https://www.bilibili.com/video/BV13V4y1s7Xt?t=232)），社区每年稳定组织玩家比赛与关卡设计比赛，单关卡累计完整游玩次数上千，同曲目全难易度与模式合计上万，已收录关卡数量上万。

* 游戏功能：太鼓风格游戏模式的多平台模拟器开发，同时兼容触控与键盘的击打检测与算分逻辑
* 交互设计：太鼓关卡的线性输入式编辑器开发
* 协作：与主催、美术和多名技术人员协作，使用业余时间的敏捷开发
* 社区：关卡创作者社区经营与赛事主持，兼关卡修改指导与审核

#### Malody V (多平台多模式社区音游，[Steam](https://store.steampowered.com/app/1512940/Malody_V/), [AppStore](https://apps.apple.com/app/malody-v/id1566873256), [TapTap](https://www.taptap.io/app/236636))

* 数据：与原版 Malody 账户与社区创作内容共通，外服 AppStore 上架首周成为付费音乐游戏第一名。

- 架构：面向音游的、帧步长无关的【多线程输入-游戏逻辑-渲染提交-回放与在线直播数据流】框架与核心机制
- 架构：多线程的、基于 Unity 场景 Data-Driven 的【游戏逻辑至 UI 的消息广播】框架
- 架构：官方与第三方关卡数据的统一数据管线
- 优化：游玩过程中低 GC Alloc，正确的多线程时序，不超过 1 毫秒的每帧总 CPU 时间

* 底层功能：基于 WaveRT 的非独占模式实时音频合成与渲染，使用无锁结构支持 Live Coding 与精确时间码混音功能
* 底层功能：帧率无关的独立进程 Raw Input 键盘输入处理

- 核心功能：根据音乐与乐理时间轴的滑动窗口元件池，支持完全静止与逆向时间倒流的时间轴驱动
- 核心功能：多线程的、基于 Unity 场景 Data-Driven 的 3D 触摸逻辑配置系统
- 核心功能：无额外驱动支持下，接近 ASIO 的 PC 平台超低延迟音游音效与乐音演奏
- 核心功能：逆向仿射算法的物件移动补正 — 让极远处的物件分散更稀疏，极近处物件移动速度减缓

* 游戏功能：下落式模式与打击垫模式的帧率不相关的判定与回放、BMS 音轨序列器音频编程，以及全部 UI、动画、特效的实装
* 游戏功能：太鼓模式（未发布，可以提供测试版本）
* 交互设计：多行输入、实时预览式太鼓关卡编辑器（未发布，可以提供文档）

- 协作：与主催、美术和运营团队协作，使用业余时间的敏捷开发
- 协作：拟定与维护项目代码标准、 GitLab 库管理
- 协作：标准化版本发布与测试流程

* 社区：关卡创作者社区经营与赛事主持、内容创作价值观探讨、运营管理与疑难问题解答支持
* 社区：与社区合作的新游戏功能的探讨与游戏内容规范的起草

#### 杂余项目（玩具、低工时、低目标）

- 重 shader 粒子系统的 VR 弹幕渲染（[YouTube](https://www.youtube.com/watch?v=ELOlUL2tW9U), [AcFun](https://www.acfun.cn/v/ac10201696)）

* 基于乐理时间轴的 2D 弹幕 lua 脚本框架设计（[YouTube](https://www.youtube.com/watch?v=Fc0G5_7bP38)，[Bilibili](https://www.bilibili.com/video/BV1YV411s7uD)）
* 同上，一个古早东方同人游戏 demo （[YouTube](https://www.youtube.com/watch?v=VIRENko25Gk)）
* 同上，重用这个点子的课设（[Blog](https://luicat.github.io/2017/12/09/how-to-design-beat-sync-content.html)）

- 同人音乐
  - 河城みとり （[SoundCloud](https://soundcloud.com/user-848797895/the-kappa-from-hell-says)）
  - 赤蛮奇x二童子（[Bilibili](https://www.bilibili.com/video/BV1Kr4y1L7yD)，[SoundCloud](https://soundcloud.com/user-848797895/monf2022-mad-head)）
  - 三月精组曲 （[YouTube](https://www.youtube.com/watch?v=LlVHF0-omXY)，[SoundCloud](https://soundcloud.com/user-848797895/midway-fairy-touhou)，[SoundCloud (大合奏mix)](https://soundcloud.com/user-848797895/midway-fairy-touhou-nds-mix)）

* 一份诡异的 AR 项目（[YouTube](https://www.youtube.com/watch?v=mZ4wnR3_OWc)）

- 键盘外设设计（[AcFun](https://www.acfun.cn/v/ac34210587)）
