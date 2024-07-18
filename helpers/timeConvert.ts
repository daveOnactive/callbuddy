export function timeConvert() {
  function fromSecToMin(sec: number) {
    return sec / 60;
  }

  function fromMinToSec(min: number) {
    return min * 60;
  }

  return {
    fromSecToMin,
    fromMinToSec,
  };
}
