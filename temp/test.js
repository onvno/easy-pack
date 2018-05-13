const webpack = require('webpack');
const merge = require('webpack-merge');
  

  var output = merge(
    {
      customizeArray(a, b, key) {
        // if (key === 'extensions') {
        //   return _.uniq([...a, ...b]);
        // }

        if(key === 'plugins') {
            console.log('------------');
            console.log(a, b, key);
            console.log('------------')
        }

        return undefined;
      },
      customizeObject(a, b, key) {
        // if (key === 'module') {
        //   // Custom merging
        //   return _.merge({}, a, b);
        // }
        if(key === '')
  
        // Fall back to default merging
        return undefined;
      }
    }
  )({
    plugins: [
      "new webpack.HotModuleReplacementPlugin()",
      "new webpack",
      "new web"
    ]
  }, {
    plugins: [
      "new webpack.HotModuleReplacementPlugin()",
      "pack"
    ]
  });
//   console.log('out:', output);
  

//   console.log(merge({a:123}, {a:234}))
