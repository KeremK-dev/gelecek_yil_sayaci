const countdownEls = document.querySelectorAll(".countdown")
countdownEls.forEach(countdownEl => createCountdown(countdownEl))

function createCountdown(countdownEl){
  const target = new Date(new Date(countdownEl.dataset.targetDate).toLocaleString('en', ))
  const parts = {
    gunler: {text: ["gün","day"], dots: 30},
    saatler: {text: ["saat","hour"], dots: 24},
    dakikalar: {text: ["dakika","minute"], dots: 60},
    saniyeler: {text: ["saniye","second"], dots: 60},
  }

  Object.entries(parts).forEach(([key, value])=>{
    const partEl = document.createElement("div");
    partEl.classList.add("part", key);
    partEl.style.setProperty("--dots", value.dots);
    value.element = partEl;

    const remainingEl = document.createElement("div");
    remainingEl.classList.add("remaining");
    remainingEl.innerHTML = `
      <span class="number"></span>
      <span class="text"></span>
    `
    partEl.append(remainingEl);
    for(let i = 0; i < value.dots; i++){
      const dotContainerEl = document.createElement("div");
      dotContainerEl.style.setProperty("--dot-idx", i);
      dotContainerEl.classList.add("dot-container")
      const dotEl = document.createElement("div");
      dotEl.classList.add("dot")
      dotContainerEl.append(dotEl);
      partEl.append(dotContainerEl);
    }
    countdownEl.append(partEl);
  })
  getRemainingTime(target, parts)
}

function getRemainingTime(target, parts, first=true){
  const now = new Date()
  if(first) console.log({target, now})
  const remaining = {}
  let saniyeler = Math.floor((target - (now))/1000);
  let dakikalar = Math.floor(saniyeler/60);
  let saatler = Math.floor(dakikalar/60);
  let gunler = Math.floor(saatler/24);
  saatler = saatler-(gunler*24);
  dakikalar = dakikalar-(gunler*24*60)-(saatler*60);
  saniyeler = saniyeler-(gunler*24*60*60)-(saatler*60*60)-(dakikalar*60);
  Object.entries({gunler, saatler, dakikalar, saniyeler}).forEach(([key, value])=>{
    const remaining = parts[key].element.querySelector(".number");
    const text = parts[key].element.querySelector(".text");
    remaining.innerText = value;
    text.innerText = parts[key].text[Number(value==1)]
    const dots = parts[key].element.querySelectorAll(".dot")
    dots.forEach((dot, idx)=>{
      dot.dataset.active = idx <= value;
      dot.dataset.lastactive = idx == value;
    })
  })
  if(now <= target){
    window.requestAnimationFrame(()=>{
      getRemainingTime(target, parts, false)
    });
  }
}