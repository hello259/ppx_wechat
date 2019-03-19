//  倒计时2
export function formatTime2(time) {
  // console.log(time)
  let seconds = 0;
  let minutes = 0;
  let hours = 0;
  let day = 0;

  if (time) {
      seconds = time;

      if (seconds > 59) {
          minutes = Math.floor(seconds / 60);
          seconds = seconds % 60;
          if (minutes > 59) {
              hours = Math.floor(minutes / 60);
              minutes = minutes % 60;

              if (hours > 23) {
                  day = Math.floor(hours / 24);
                //   hours = hours % 60;
              }
          }
      }
  }
// console.log(123123)

  // let ds = day > 0 ? day : `${day}天`;
  let hs = hours > 9 ? hours : `0${hours}`;
  let ms = minutes > 9 ? minutes : `0${minutes}`;
  let ss = seconds > 9 ? seconds : `0${seconds}`;
  let obj = {};
  obj.hours = hs;
  obj.minutes = ms;
  obj.seconds = ss;
  // return ds > 0 ? `${ds} ${hs}: ${ms}: ${ss}` : `${hs}: ${ms}: ${ss}`

  // return ds > 0 ? `${hs}: ${ms}: ${ss}` : `${hs}: ${ms}: ${ss}`;
  return obj;
}

let t2 = '';
export function conutDown2(that) {
  let seconds = that.data.remainTime2;
  // console.log(seconds)
  if (seconds === 0) {
      that.setData({
          remaimTime2: 0,
          clock2: formatTime2(0)
      })
      
      return;
  }

  t2 = setTimeout(function() {
      that.setData({
          remainTime2: seconds - 1,
          clock2: formatTime2(seconds - 1)
      });
      conutDown2(that)
  }, 1000)
}

export function clearTimeOut2() {
  clearTimeout(t2);
}