import { messages } from '@/i18n';
import { getLocale, registerTypewriterRestart } from '@/scripts/Locale';

let timerIds: ReturnType<typeof setTimeout>[] = [];

function clearTimers() {
  timerIds.forEach(clearTimeout);
  timerIds = [];
}

function schedule(fn: () => void, ms: number) {
  const id = setTimeout(fn, ms);
  timerIds.push(id);
}

export default () => {
  const writeDom = document.querySelector('.header-main>.desc');
  if (!writeDom) return;

  const runTypewriter = () => {
    clearTimers();
    const TypeWriteList = messages[getLocale()].typewrite;
    if (!TypeWriteList.length) {
      writeDom.remove();
      return;
    }
    let TypeWriteListIndex = 0;
    let index = 0;
    let isDeleting = false;

    const run = () => {
      writeDom.innerHTML = TypeWriteList[TypeWriteListIndex].substring(0, index);
      if (!isDeleting) {
        if (index < TypeWriteList[TypeWriteListIndex].length) {
          index++;
          schedule(run, 188);
        } else {
          schedule(() => {
            isDeleting = true;
            run();
          }, 2888);
        }
      } else if (index > 0) {
        index--;
        schedule(run, 88);
      } else {
        isDeleting = false;
        TypeWriteListIndex = (TypeWriteListIndex + 1) % TypeWriteList.length;
        schedule(run, 500);
      }
    };

    run();
  };

  runTypewriter();
  registerTypewriterRestart(runTypewriter);
};
