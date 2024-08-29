module.exports = {
  commands: [
    {
      name: 'run-android-project',
      description: 'Run the Android project with default --appId and --main-activity options',
      func: async () => {
        const execSync = require('child_process').execSync;
        execSync(
          'npx react-native run-android --appId com.gnuboard_react_native --main-activity com.gnuboard_react_native.MainActivity',
          { stdio: 'inherit' }
        );
      },
    },
  ],
}