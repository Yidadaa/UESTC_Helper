## 电子科技大学教务系统美化插件

> 让老旧的教务系统焕发青春。  
> 项目官网：[blog.simplenaive.cn/uestc_helper](http://blog.simplenaive.cn/uestc_helper)

![截图](./docs/img/eg-1.png)

### 开发指南

```bash
# 1. 安装开发依赖
npm install

# 2. 打开Chrome，以开发者模式加载 dev/devExtension　文件夹

# 3. 加载完文件夹，进入Chrome的扩展管理界面，打开 ./src/services/request.js 文件第七行，修改localExtensionID为Develop Helper的ID。

# 4. 开始开发
npm start

```

#### 注：插件ID是形如下图红框中的ID
![default](https://user-images.githubusercontent.com/16968934/37384089-b7b4058c-2787-11e8-812d-20ae58b3727a.jpg)


### 文档指南

项目的`docs`[文件夹](https://github.com/Yidadaa/UESTC_Helper/tree/master/docs)下有关于项目的若干文档，敬请查阅。

文档索引：

- [旧版插件实现逻辑](https://github.com/Yidadaa/UESTC_Helper/blob/master/docs/旧版插件逻辑说明.md)
- [一份比较详细的插件机制介绍文档](https://github.com/Yidadaa/UESTC_Helper/blob/master/docs/插件机制简介.md)

### 问题反馈

请在项目的`issue`页面发布新`issue`通知开发者。

### 隐私及安全性声明

此插件所展示数据的解析完全在用户电脑上完成，本插件不会与学校教务系统服务器之外的服务器进行任何信息交换，请放心使用。
