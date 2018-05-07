//远程代理访问，可以配置多个代理服务
const proxyConfig = [{
    enable: true, // 默认未开启，如需开启改为true
    router: "/ddvp/*",
    headers : {"X-XSS":"X-XSS"},
    url: "http://10.95.96.74:8010"
}, {
    enable: false,
    router: ["/users/*", "/orgs/*"],
    url: "https://api.github.com"
}]

module.exports = proxyConfig