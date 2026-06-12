---
title: "YOLOV8 配置和性能分析"
pubDatetime: 2025-05-22T23:20:15+08:00
draft: false
featured: false
tags:
  - yolo
  - 深度学习
  - 目标检测
  - 性能分析
description: "YOLOV8 训练结果的性能指标分析，包括 loss、精度、召回率、mAP 等指标的解读"
---

# 一、性能分析

## results.png：训练总图要略

这张图片包含训练过程中的各种评估指标，比如损失函数、精度、召回率、mAP 等的图表绘制。这个图表可以直观地看到模型训练过程中性能的变化情况。

![训练总图](https://cdn.jsdelivr.net/gh/WyiZhng/ImgHosting/Blog-PIC/7.PNG)

我们先看前3列:

- `train/box_loss` 和 `val/box_loss`
- `train/cls_loss` 和 `val/cls_loss`
- `train/dfl_loss` 和 `val/dfl_loss`

前面的 `train` 表示训练集，`val` 是验证集。训练集是用于训练学习的，相当于书本的例题。而验证集则用于考试，相当于试卷的试题。学得好不一定就考得好，主要还得看考题是不是有关联性。不过他们更重要的相同点，好像在于都有 `loss`。

### loss

`loss` 是算法中一个常见的概念。翻译成"损失"这个词，其实很形象。生活中，对于能量转化，我们常常用到损失。我们说 100 单位的电能转化为 80 单位的动能，能量损失了 20%。如果实现了百分百转化，那么损失就是 0。

![loss 示例](https://cdn.jsdelivr.net/gh/WyiZhng/ImgHosting/Blog-PIC/8.PNG)

对于训练集和验证集，AI 本身是知道这个区域标的是什么，位置在哪儿。因此，它会先猜测结论，然后跟正确答案做对比。它的猜测行为称为"推理"或者"预测"。它自己的推理结果和人工标记的答案之间的差异，称为"损失"。那么，损失越小越好，损失为 0 则说明 AI 的推理和正确答案之间没有差异，即预测 100% 命中。

我们看下图，这次训练过程也是如此。这几个 train 系列的 loss 都是降低的，X 轴表示训练轮次，Y 轴表示损失的值。

![loss 下降趋势](https://cdn.jsdelivr.net/gh/WyiZhng/ImgHosting/Blog-PIC/9.PNG)

我们看到 `loss` 的值都是降低，这说明很好。但是第一个 `box_loss` 好像还有下降的趋势。但是中间的 `cls_loss` 在 50 轮时就已经趋于稳定了，而 `dfl_loss` 好像在 75 轮附近才慢慢稳定。

这些指标都代表什么？有什么意义呢？

#### 1、box_loss 边界框损失：衡量画框（目标的位置检测）

`box_loss` 全称是 bounding box loss，表示边界框损失。它表明 AI 通过训练和学习之后，对于边界框的预测和标准答案之间的损失。

![box_loss 示例](https://cdn.jsdelivr.net/gh/WyiZhng/ImgHosting/Blog-PIC/10.PNG)

正常情况下，随着训练的进行，损失是越降越低的。如果它是长期忽高忽低，或者一直不明显收敛，那说明训练存在问题。如果 `box_loss` 的损失不断降低，而后持续稳定，则说明训练没有问题，也没有必要再投入资源训练了。

但是 `box_loss` 表现优秀，仅仅说明它对物体区域（画框）的识别情况。就算这一项 100 分，整体效果也不一定就好。因为光会画框意义不大，我们还要知道框里的物体是什么。

于是就引入另一个 `cls_loss` 指标。

#### 2、cls_loss 分类损失：判断框里的物体（目标的分类）

它叫分类损失，全称为 classification loss。它衡量的是预测类别和真实类别之间的差异。

我们看下面的图，它不但框出了物体。而且标注出了这个框里是人，那个框里是车，哪个是细菌，哪个是垃圾：

![cls_loss 示例](https://cdn.jsdelivr.net/gh/WyiZhng/ImgHosting/Blog-PIC/11.PNG)

#### 3、dfl_loss 分布式焦点损失：精益求精

`dfl_loss`，它辅助 `box_loss`，提供额外的信息，通过对边界框位置的概率分布进行优化，进一步提高模型对边界框位置的细化和准确度。YOLOv8 中首次引入。

比如，预测某个边界框的坐标时，不是直接预测一个数值，而是预测该坐标周围可能的位置分布，然后通过焦点损失来优化这个分布，使得模型更关注接近真实值的位置。

如上图所示，AI 模型成功预测出了①的位置。但是红、蓝、绿 3 个框中的①，好像哪个都没错。因此 `dfl_loss` 提供了一个可信度，表明哪一个焦点跟标准答案相比，会更加精确。有时候也不一定是方方正正的框！这时候 dfl 可能就很关键。

![dfl_loss 示例](https://cdn.jsdelivr.net/gh/WyiZhng/ImgHosting/Blog-PIC/12.PNG)

### 验证集：学得好，不一定考得好

![验证集 loss](https://cdn.jsdelivr.net/gh/WyiZhng/ImgHosting/Blog-PIC/13.PNG)

相比训练集的平滑趋势，验证集似乎是有些反复。这说明模型分类还是很不错的，但是对于区域选择目标检测有一点点偏差。

其实，这是一种常见现象。只要验证集损失没有显著上升，整体趋势在变好，且与训练集损失的差距不是特别大，这一般是正常的。

不过，要留意以下细节：

- 样本数据的变异：验证集可能包含一些与训练集不同风格的样本，这会导致损失不稳定。好比你拿着泰迪狗做识别训练，最后让模型去认识哈士奇狗，模型有点迷糊，拿不准。
- 模型的过拟合：如果验证集的样本数据正常。模型在训练集上的损失表现很好，但是验证集表现不稳定。那么可能是模型记住了训练集的细节，也就是过于死记硬背，只抓住形没有抓住神。这叫过拟合。

如果遇到比较严重的问题，或者你感觉有问题，该怎么办呢？

可以调整超参数，比如调小学习率，或者使用提前停止策略来防止过拟合。也可以调整 `batch` 大小，增加一个批次数量，让它见多识广。

同时，增加训练数据量或使用数据增强技术，可以使模型更好地泛化，减少验证损失的波动。

### 精度和召回率：又准又全的考量

`results.png` 的后两列是同一类指标

![精度和召回率](https://cdn.jsdelivr.net/gh/WyiZhng/ImgHosting/Blog-PIC/14.PNG)

之所以说他们是同一类，看表头就知道，他们的名字前面带 `metrics`，后面带 `(B)`。

`metrics` 表示模型是在验证集上的评估指标。`(B)` 呢，在目标检测任务中表示 `Bounding Box`，即边界框的检测结果。

首先看左上角的第一个 `precision`。`precision` 是精度，或者称为"精确率"。请注意，是精确率，不是准确率。准确率有专门的名词 `accuracy`。两者不一样。

![precision 和 recall](https://cdn.jsdelivr.net/gh/WyiZhng/ImgHosting/Blog-PIC/15.PNG)

这几个指数之间的区别必须要认真思考！

关于 P（precision）和 R（recall）之间的数据趋势，而 `PR_curve.png` 则是两者互相妥协的曲线。这个 PR 图怎么看呢？越接近正方形效果越好。都接近正方形，说明整体效果又准又全。

![PR 曲线](https://cdn.jsdelivr.net/gh/WyiZhng/ImgHosting/Blog-PIC/16.PNG)

`results.png` 系列还剩两张图片，那就是 `mAP50` 与 `mAP50-95`。这俩是一类（也是看名称很像）。

`mAP50` 要拆开看，拆成 `mAP-50`，`mAP` 表示 mean Average Precision，称为平均精度。`50` 则是在 `IoU` 阈值为 `50%` 的情况下的值。

额……我好像又得讲讲什么是 `IoU` 了。它不是 I Love You 的意思，其实是 Intersection over Union，是目标检测中用于衡量预测边界框与真实边界框重叠程度的指标。

如果你熟悉 YOLO，那么肯定知道它的特点就是 You Only Look Once（你仅需看一遍）。这项优势也导致它出现很多备选框。

这些个预测出的框框儿，可能是物体的全部，也可能只是中心部分，还或许仅仅是物体的一个角。不管如何，这都是算法通过学习特征计算出来的。谁是谁非，看你怎么选择。

如果预测出的面积（蓝框）能占到实际区域（红框）的 50% 以上，那么我们就说 `IoU` 为 50。重合度能到 50%，其实能说明 AI 大体猜中了。因为 `IoU` 为 100 就是完全重合。

`mAP50` 是重合度以 50% 为界限的平均精度。而 `mAP50-95` 则是 `IoU` 阈值从 50% 到 95% 范围内的平均值。这个更加严格一些。因此，我们看到图里面 `mAP50-95` 的值确实也低一些。

`mAP50` 这个指标相对宽松，能够展示模型在较低严格度下的整体性能。它更适用于那些对定位要求不是特别严格的应用场景。

`mAP50-95` 则意味着在严格的 IoU 条件下也能准确检测和定位目标。它适用于那些对定位要求较高的应用场景，如自动驾驶、医疗影像分析等。

以上是基于 YOLO 算法性能的分析，能更加了解各个指标！

参考博客：[如何正确解读 YOLO 算法训练结果的各项指标](https://blog.csdn.net/ask_yang/article/details/142180044)

# 二、YOLOv8 训练过程小结

1. 我创造了一个虚拟环境名为 env，我安装好了指定 pytorch 和部分依赖，那么这个时候我要做一个新的 yolo 项目，我新建一个 yolo 的虚拟环境，yolo 环境中 pytorch 也要重新安装吗？

   人工智能回复：是的，如果你为新的 YOLO 项目创建了一个**新的独立虚拟环境**（例如命名为 `yolo-env`），则需要在这个新环境中**重新安装 PyTorch 和其他依赖**。

2. 首先是无法创造虚拟环境，CondaValueError: Malformed version string invalid character(s) 还有 Solving environment: failed CondaValueError: Malformed version string '~': invalid 以及 timeout

   解决：直接删除一个叫 `.condarc` 的文件，在用户下的。

3. 运行训练代码报错：

   ```
   UnpicklingError: Weights only load failed. This file can still be loaded, to do so you have two options, do those steps only if you trust the source of the checkpoint.
   (1) In PyTorch 2.6, we changed the default value of the `weights_only` argument in `torch.load` from `False` to `True`. Re-running `torch.load` with `weights_only` set to `False` will likely succeed, but it can result in arbitrary code execution. Do it only if you got the file from a trusted source.
   (2) Alternatively, to load with `weights_only=True` please check the recommended steps in the following error message.
   WeightsUnpickler error: Unsupported global: GLOBAL ultralytics.nn.tasks.DetectionModel was not an allowed global by default. Please use `torch.serialization.add_safe_globals([DetectionModel])` or the `torch.serialization.safe_globals([DetectionModel])` context manager to allowlist this global if you trust this class/function.
   ```

   在 PyTorch 2.6 及之后的版本中，`torch.load()` 中的默认参数 `weights_only` 从 `False` 改成了 `True`，所以在需要导入权重参数时，应该写成 `False`，也就是：

   ```python
   torch.load(r'./xxx', weights_only=False)
   ```

   找到报错行中谁有调用 `torch.load`

4. pytorch 和 torchvision 版本需要一致，用下面代码验证是否可以：

   ```python
   import torch
   print(f"PyTorch版本: {torch.__version__}")
   print(f"CUDA可用: {torch.cuda.is_available()}")
   print(f"检测到的GPU数量: {torch.cuda.device_count()}")
   print(f"当前GPU名称: {torch.cuda.get_device_name(0)}")
   # 预计输出：
   # PyTorch版本: 2.3.0+cu121
   # CUDA可用: True
   # 检测到的GPU数量: 1
   # 当前GPU名称: NVIDIA GeForce RTX 4090
   ```

   后面发现直接 `pip install torchvision==0.18.0` 会把 pytorch 都重新安装成非 GPU 版本

   所以找到指令：

   ```bash
   # PyTorch 2.3.0 + CUDA 12.1
   pip install torchvision==0.18.0 --index-url https://download.pytorch.org/whl/cu121
   ```

   只安装对于 cuda 版本的 torchvision

5. RuntimeError: Numpy is not available

   原因：numpy 等级太高，需要降级！

   参考博客：[YOLOv8 训练自己的数据集](https://blog.csdn.net/qq_67105081/article/details/137545156)

以上是全部内容！
