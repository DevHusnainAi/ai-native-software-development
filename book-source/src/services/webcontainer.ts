// WebContainer service wrapper
import { WebContainer } from '@webcontainer/api';

let webcontainerInstance: WebContainer | null = null;

export async function initializeWebContainer(): Promise<WebContainer> {
  if (!webcontainerInstance) {
    webcontainerInstance = await WebContainer.boot();
  }
  return webcontainerInstance;
}

export async function getWebContainer(): Promise<WebContainer> {
  if (!webcontainerInstance) {
    return initializeWebContainer();
  }
  return webcontainerInstance;
}

export function getWebContainerInstance(): WebContainer | null {
  return webcontainerInstance;
}

export async function createTerminalSession(
  webcontainer: WebContainer,
  onData: (data: string) => void
): Promise<{ process: any; cleanup: () => void }> {
  const shellProcess = await webcontainer.spawn('jsh', {
    terminal: {
      cols: 80,
      rows: 24,
    },
  });

  shellProcess.output.pipeTo(
    new WritableStream({
      write(data) {
        onData(data);
      },
    })
  );

  const cleanup = () => {
    shellProcess.kill();
  };

  return { process: shellProcess, cleanup };
}

export async function writeFileToContainer(
  webcontainer: WebContainer,
  path: string,
  content: string
): Promise<void> {
  await webcontainer.fs.writeFile(path, content);
}

export async function readFileFromContainer(
  webcontainer: WebContainer,
  path: string
): Promise<string> {
  return await webcontainer.fs.readFile(path, 'utf-8');
}

