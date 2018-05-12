//远程代理访问，可以配置多个代理服务
const proxyConfig = [{
    enable: false,
    router: "/api/*",
    headers : {"X-XSS":"X-XSS"},
    url: "http://cnodejs.org"
}, {
    enable: false,
    router: ["/users/*", "/orgs/*"],
    url: "https://api.github.com"
}];

module.exports = proxyConfig