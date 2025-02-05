import { nativeTheme } from 'electron';
import { configStorage } from '../config';

function handleTheme() {
  const colorTheme: string = configStorage.get('colorTheme');
  let shouldUseDarkColors: boolean;
  if(colorTheme === 'system') {
    shouldUseDarkColors = nativeTheme.shouldUseDarkColors;
  } else if(colorTheme === 'dark') {
    shouldUseDarkColors = true;
  } else if(colorTheme === 'light') {
    shouldUseDarkColors = false;
  } else {
    shouldUseDarkColors = false;
  }
  configStorage.set('shouldUseDarkColors', shouldUseDarkColors);
}

export default handleTheme;
