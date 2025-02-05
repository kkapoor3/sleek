import fs from 'fs';
import { app } from 'electron';
import { configStorage } from '../../config';
import { createTray } from '../Tray';
import { createMenu } from '../Menu';
import path from 'path';
import { mainWindow } from '../../main';

async function readFileContent(filePath: string, bookmark: string | null): Promise<string | null> {
  if(!filePath) {
    return null;
  }

  let fileContent;

  if(process.mas && bookmark) {
    const stopAccessingSecurityScopedResource = app.startAccessingSecurityScopedResource(bookmark);  
    fileContent = await fs.promises.readFile(filePath, 'utf8');
    stopAccessingSecurityScopedResource()
  } else {
    fileContent = await fs.promises.readFile(filePath, 'utf8');
  }
  return fileContent;
}

function addFile(filePath: string, bookmark: string | null) {
  if(process.mas && !bookmark) throw new Error('The Mac App Store release requires you to open files using the file dialog');

  const files: FileObject[] = configStorage.get('files');
  const existingFileIndex = files.findIndex((file) => file.todoFilePath === filePath);

  files.forEach((file) => (file.active = false));

  if(existingFileIndex === -1) {
    files.push({
      active: true,
      todoFileName: path.basename(filePath),
      todoFilePath: filePath,
      todoFileBookmark: bookmark,
      doneFilePath: null,
      doneFileBookmark: null
    });
  } else {
    files[existingFileIndex].active = true;
  }

  configStorage.set('files', files);

  createMenu(files);

  const tray = configStorage.get('tray');
  if(tray) {
    createTray();
  }

  return 'File added';
}

function addDoneFile(filePath: string, bookmark: string | null) {
  const files: FileObject[] = configStorage.get('files');
  const activeIndex: number = files.findIndex((file) => file.active);

  if(activeIndex === -1) return false;

  files[activeIndex].doneFilePath = filePath;
  files[activeIndex].doneFileBookmark = bookmark;

  configStorage.set('files', files);

  mainWindow!.webContents.send('triggerArchiving', true);
}

function removeFile(index: number) {
  let files: FileObject[] = configStorage.get('files');

  files.splice(index, 1);
  const activeIndex: number = files.findIndex((file) => file.active);

  if(files.length > 0 && activeIndex === -1) {
    files[0].active = true;
  } else if(activeIndex !== -1) {
    files[activeIndex].active = true;
  } else {
    files = [];
  }

  configStorage.set('files', files);

  createMenu(files);

  const tray = configStorage.get('tray');

  if(tray) {
    createTray();
  }
  return 'File removed';
}

function setFile(index: number) {
  const files: FileObject[] = configStorage.get('files');

  if(files.length > 0) {
    files.forEach((file) => {
      file.active = false;
    });
  }

  files[index].active = true;

  configStorage.set('files', files);

  return 'File changed';
}

export { setFile, removeFile, addFile, addDoneFile, readFileContent };
