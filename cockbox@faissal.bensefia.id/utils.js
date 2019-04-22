const St = imports.gi.St;

function prettyRemainingTime(milliseconds) {
  if (milliseconds === 0) {
    return '0';
  }
  let centiseconds = milliseconds/10;
  if (centiseconds > 1) {
    let deciseconds = milliseconds/100;
    if (deciseconds > 1) {
      let seconds = milliseconds/1000;
      if (seconds > 1) {
        let minutes = milliseconds/1000/60;
        if (minutes > 1) {
          let hours = milliseconds/1000/60/60;
          if (hours > 1) {
            let days = milliseconds/1000/60/60/24;
            if (days > 1) {
              let weeks = milliseconds/1000/60/60/24/7;
              if (weeks > 1) {
                let months = milliseconds/1000/60/60/24/7/4;
                if (months > 1) {
                  let years = milliseconds/1000/60/60/24/365;
                  if (years > 1) {
                    return `${Math.round(years)} years`
                  }
                  return `${Math.round(months)} months`;
                }
                return `${Math.round(weeks)} weeks`;
              }
              return `${Math.round(days)} days`;
            }
            return `${Math.round(hours)} hours`;
          }
          return `${Math.round(minutes)} minutes`;
        }
        return `${Math.round(seconds)} seconds`;
      }
      return `${Math.round(deciseconds)} deciseconds`
    }
    return `${Math.round(centiseconds)} centiseconds`;
  }
  return `${milliseconds} milliseconds`;
}

function set_clipboard(text) {
  St.Clipboard.get_default().set_text(St.ClipboardType.CLIPBOARD, text);
  St.Clipboard.get_default().set_text(St.ClipboardType.PRIMARY, text);
}
