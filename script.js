// Sound Bank Definitions
const bankOne = [
  { keyCode: 81, keyTrigger: 'Q', id: 'Heater-1', url: 'https://cdn.freecodecamp.org/testable-projects-fcc/audio/Heater-1.mp3' },
  { keyCode: 87, keyTrigger: 'W', id: 'Heater-2', url: 'https://cdn.freecodecamp.org/testable-projects-fcc/audio/Heater-2.mp3' },
  { keyCode: 69, keyTrigger: 'E', id: 'Heater-3', url: 'https://cdn.freecodecamp.org/testable-projects-fcc/audio/Heater-3.mp3' },
  { keyCode: 65, keyTrigger: 'A', id: 'Heater-4', url: 'https://cdn.freecodecamp.org/testable-projects-fcc/audio/Heater-6.mp3' },
  { keyCode: 83, keyTrigger: 'S', id: 'Clap', url: 'https://cdn.freecodecamp.org/testable-projects-fcc/audio/Dsc_Oh.mp3' },
  { keyCode: 68, keyTrigger: 'D', id: 'Open-HH', url: 'https://cdn.freecodecamp.org/testable-projects-fcc/audio/Kick_n_Hat.mp3' },
  { keyCode: 90, keyTrigger: 'Z', id: "Kick-n'-Hat", url: 'https://cdn.freecodecamp.org/testable-projects-fcc/audio/RP4_KICK_1.mp3' },
  { keyCode: 88, keyTrigger: 'X', id: 'Kick', url: 'https://cdn.freecodecamp.org/testable-projects-fcc/audio/cev_cut2.mp3' },
  { keyCode: 67, keyTrigger: 'C', id: 'Closed-HH', url: 'https://cdn.freecodecamp.org/testable-projects-fcc/audio/Cev_s3.mp3' }
];

const bankTwo = [
  { keyCode: 81, keyTrigger: 'Q', id: 'Chord-1', url: 'https://s3.amazonaws.com/freecodecamp/drums/Chord_1.mp3' },
  { keyCode: 87, keyTrigger: 'W', id: 'Chord-2', url: 'https://s3.amazonaws.com/freecodecamp/drums/Chord_2.mp3' },
  { keyCode: 69, keyTrigger: 'E', id: 'Chord-3', url: 'https://s3.amazonaws.com/freecodecamp/drums/Chord_3.mp3' },
  { keyCode: 65, keyTrigger: 'A', id: 'Shaker', url: 'https://s3.amazonaws.com/freecodecamp/drums/Give_us_a_light.mp3' },
  { keyCode: 83, keyTrigger: 'S', id: 'Open-BD', url: 'https://s3.amazonaws.com/freecodecamp/drums/Dry_Ohh.mp3' },
  { keyCode: 68, keyTrigger: 'D', id: 'Closed-BD', url: 'https://s3.amazonaws.com/freecodecamp/drums/Bld_H1.mp3' },
  { keyCode: 90, keyTrigger: 'Z', id: 'Punchy-Kick', url: 'https://s3.amazonaws.com/freecodecamp/drums/punchy_kick_1.mp3' },
  { keyCode: 88, keyTrigger: 'X', id: 'Side-Stick', url: 'https://s3.amazonaws.com/freecodecamp/drums/side_stick_1.mp3' },
  { keyCode: 67, keyTrigger: 'C', id: 'Snare', url: 'https://s3.amazonaws.com/freecodecamp/drums/Brk_Snr.mp3' }
];

let power = true;
let currentBank = bankOne;
let volume = 0.4;
let visualizerTimeout;

const drumMachine = document.getElementById('drum-machine');
const display = document.getElementById('display');
const powerBtn = document.getElementById('power-btn');
const powerLed = document.getElementById('power-led');
const bankBtn = document.getElementById('bank-btn');
const bankLabel = document.getElementById('bank-label');
const volumeSlider = document.getElementById('volume-slider');
const volumeVal = document.getElementById('volume-val');
const visualizer = document.getElementById('visualizer');
const pads = document.querySelectorAll('.drum-pad');

// Play audio corresponding to a specific audio element or key
function playAudio(audioEl, padEl) {
  if (!power || !audioEl) return;

  audioEl.volume = volume;
  audioEl.currentTime = 0;
  
  const playPromise = audioEl.play();
  if (playPromise !== undefined) {
    playPromise.catch(error => {
      console.log("Audio playback interrupted/prevented:", error);
    });
  }

  // Update Display Screen (User Story #7)
  if (padEl) {
    display.innerText = padEl.id.replace(/-/g, ' ');
    padEl.classList.add('active');
    setTimeout(() => padEl.classList.remove('active'), 120);
  }

  // Visualizer Animation
  visualizer.classList.add('playing');
  clearTimeout(visualizerTimeout);
  visualizerTimeout = setTimeout(() => {
    visualizer.classList.remove('playing');
  }, 300);
}

// Update Audio Sources when Bank toggles
function updateBank(bank) {
  currentBank = bank;
  pads.forEach(pad => {
    const audio = pad.querySelector('.clip');
    const key = audio.id;
    const soundData = currentBank.find(item => item.keyTrigger === key);
    if (soundData) {
      pad.id = soundData.id;
      audio.src = soundData.url;
    }
  });
}

// 1. Click Event Listeners on Drum Pads (User Story #5)
pads.forEach(pad => {
  pad.addEventListener('click', (e) => {
    const audioEl = pad.querySelector('.clip');
    playAudio(audioEl, pad);
  });
});

// 2. Keyboard Keydown Event Listener (User Story #6)
document.addEventListener('keydown', (e) => {
  if (!power) return;
  const key = e.key.toUpperCase();
  const audioEl = document.getElementById(key);
  
  if (audioEl) {
    const parentPad = audioEl.parentElement;
    playAudio(audioEl, parentPad);
  }
});

// 3. Power Toggle
powerBtn.addEventListener('click', () => {
  power = !power;
  powerBtn.classList.toggle('active', power);
  powerLed.classList.toggle('active', power);
  drumMachine.classList.toggle('off', !power);

  if (!power) {
    display.innerText = '';
  } else {
    display.innerText = bankBtn.classList.contains('active') ? 'PIANO KIT' : 'HEATER KIT';
  }
});

// 4. Sound Bank Toggle
bankBtn.addEventListener('click', () => {
  if (!power) return;
  const isBankTwo = bankBtn.classList.toggle('active');
  bankLabel.innerText = isBankTwo ? 'BANK 2' : 'BANK 1';
  updateBank(isBankTwo ? bankTwo : bankOne);
  display.innerText = isBankTwo ? 'SMOOTH PIANO' : 'HEATER KIT';
});

// 5. Volume Slider
volumeSlider.addEventListener('input', (e) => {
  volume = e.target.value;
  volumeVal.innerText = `${Math.round(volume * 100)}%`;
  if (power) {
    display.innerText = `VOL: ${Math.round(volume * 100)}%`;
  }
});
