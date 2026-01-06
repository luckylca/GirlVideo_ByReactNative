module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@': './src', // 确保你的目录下确实有 src 文件夹
        },
      },
    ],
    // 放在这里，不要放 env 里，防止顺序混乱
    'react-native-paper/babel', 
    
    // ⚠️ 必须永远在最后！
    // 'react-native-reanimated/plugin', 
    'react-native-worklets/plugin',
  ],
};