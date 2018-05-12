  // 如dll不存在则上边结束，写入文件， 如dll存在，则执行以下
  const Mustache = require('mustache');
  const dllTempPath = path.resolve(EasyRoot, './split/dll/webpack.dll.temp')
  // console.log('dllTempPath:', dllTempPath);
  const dllTempData = fs.readFileSync(dllTempPath, 'utf-8');
  // console.log("dllTempData:", dllTempData);
  const dllConfigPath = path.resolve(ProjectPath, './config/webpack.dll.js');
  const renderData = Mustache.render(dllTempData, dll);
  fs.writeFileSync(dllConfigPath, renderData, 'utf-8');
  // console.log("m:", mustache);
  //baseAry frameAry
  

  const latestVersion = require('latest-version');
  const dllPackage = dll.baseAry.concat(dll.frameAry);
  let packObj = {};
  const getVersion = async (package) => {
    const version = await latestVersion(package)
    packObj[package] = `^${version}`;
    return `^${version}`;
  }
  let promises = dllPackage.map((pack) => getVersion(pack))
  Promise.all(promises)
      .then((data) => {
          const dllPackageDepend = {
            "dependencies": packObj
          }
          packageJSON = merge(packageJSON, dllPackageDepend);
          const dllEntryConfigPath = path.resolve(EasyRoot, './split/dll/config.js')
          const dllEntryConfig = require(dllEntryConfigPath);
          webPackConfig = merge(webPackConfig, dllEntryConfig);
          
          // 写入文件 - json
          const JSONStr = JSON.stringify(packageJSON, null, 4);
          fs.writeFileSync(mergeJsonFile, JSONStr, 'utf-8');

          // 写入文件 - webpack
          const partVar = dllEntryConfig.var;
          webpackVar = merge(webpackVar, partVar);
          const partConfig = dllEntryConfig.config;
          webPackConfig = merge(webPackConfig, partConfig)
          const webPackConfigStr = JSON.stringify(webPackConfig, Util.newReplace, 4);
          const webPackConfigStrWrap = `const configs = ` + webPackConfigStr;

          let webPackVarStr = "";
          const webPackVarKeys = Object.keys(webpackVar);
          webPackVarKeys.map( (wKey, wIndex) => {
            webPackVarStr = webPackVarStr +`const ${wKey} = "${webpackVar[wKey]}";\n`
          })

          const webPackConcat = webPackVarStr + '\n' + webPackConfigStrWrap;
          fs.writeFileSync(mergeFile, webPackConcat, 'utf-8');
          const mergeData = fs.readFileSync(mergeFile, "utf-8")
                  .replace(/"@(\/\\)(\\)(\S*)"/g, "$1$3")
                  .replace(/"@(\/\S*)"/g, "$1")     // 处理"@/node_modules/"
                  .replace(/"<%/g, '')
                  .replace(/%>"/g, '');
          fs.writeFileSync(mergeFile, mergeData, 'utf-8');

      })
      .catch((err) => {
          console.log("err:", err);
      })