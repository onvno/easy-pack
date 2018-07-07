欢迎使用EasyPack快速构建工程！



#### 开发

*依赖安装*

```
$ npm install
```



*开发*

* 如使用的是默认DLL，在安装完整依赖包后，执行一次`npm run dll`生成预编译文件。以后如DLL依赖没有更新，此操作就无需再执行。

  ```
  $ npm run dll
  ```

* 开发,默认开启3333端口

  ```
  $ npm run start
  ```



*build*

```
$ npm run build
```





#### 使用mock

配置参考`config/server.mock.js`中demo,对应的`/local/user/get`，转发到本地的`./mock/user/get.json`

```
module.exports = {
    "GET": [
        {"/local/user/get": "./mock/user/get.json"}
    ],
    "POST": [
        {"/local/user/post": "./mock/user/post.json"}
    ]
}
```



#### 使用代理

配置参考`config/server.proxy.js`中demo,支持多代理，可更改头信息，

```
//远程代理访问，可以配置多个代理服务
const proxyConfig = [{
    enable: false, // 默认未开启，如需开启改为true
    router: "/api/*",
    headers : {"X-XSS":"X-XSS"},
    url: "http://cnodejs.org"
}, {
    enable: false,
    router: ["/users/*", "/orgs/*"],
    url: "https://api.github.com"
}]
```



#### 下边的路

施主，我看你骨骼惊奇，是做FE的苗子

#### 



#### 



