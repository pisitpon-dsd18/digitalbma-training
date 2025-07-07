# ติดตั้ง Library Map และ CSV
```
npx expo install react-native-maps

npm i --save-dev papaparse @types/papaparse
```
1. สร้าง Components Map
```
touch components/MapScreen.tsx
```

2. ใส่ code ใน MapScreen.tsx


npm install --save-dev typescript @types/react @types/react-native
npm i --save-dev @types/papaparse



xcode-select -p
/Library/Developer/CommandLineTools X

fix: sudo xcode-select --switch /Applications/Xcode.app

xcode-select -p
/Applications/Xcode.app/Contents/Developer Y

ls /Applications/Xcode.app/Contents/Developer/Platforms/iPhoneOS.platform/Developer/SDKs/


rm -rf ios/Pods ios/Podfile.lock
cd ios
pod install --repo-update
cd ..
npx expo run:ios

npm install --save-dev typescript @types/react @types/react-native
npm i --save-dev @types/papaparse