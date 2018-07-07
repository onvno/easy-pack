欢迎使用EasyPack快速构建工程！



#### 开发

*依赖安装*

```
$ npm install
```



*开发*

```
$ npm run start
```

开启了3333端口，可通过以下地址访问：

```
http://localhost:3333/html/index.html
```



*代理*

如在easy-pack中勾选了代理，可以在开启服务后，通过访问:

```
http://localhost:3333/topics
```

获得cnodejs的一个测试接口，代理关系如下：

```
http://localhost:3333/topics -> https://cnodejs.org/api/v1/topics
```

可以在gulpfile.js中自行添加代理



*build*

```
$ npm run build
```



#### 目录说明

```
.
├── constant.json //存放配置的一些信息
├── gulpfile.js //配置
├── package.json
├── src // 开发目录
│   ├── README.md
│   ├── es6 //开发原始js文件
│   ├── js // *自动编译生成的es5脚本文件夹，不要在此文件夹开发修改
│   ├── img //开发图片文件
│   ├── less //开发原始样式文件
│   ├── style //*自动编译生成的样式文件夹，不要在此文件夹开发修改
│   ├── vendor //第三方资源
│   ├── templates //开发原始的模板文件(选择模板后才会有)
│   └── html //如没选模板，此为html开发文件夹。如选了模板，此文件夹为自动生成，则不要在此修改
├── dist // build目录
└── utils // 针对handlebars做的gulp定制插件
    ├── gulp-compile-handlebars-batch.js
    └── gulp-handlebars-data-change.js
```





#### 其他

请少年开始你的表演