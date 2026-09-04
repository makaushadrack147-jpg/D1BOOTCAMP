const drumButtons = document.querySelectorAll('.drum');
const status = document.querySelector('#status');
let audioContext;

function getAudioContext() {
    audioContext ??= new (window.AudioContext || window.webkitAudioContext)();
    return audioContext;
}

function createNoiseBuffer(context) {
    const buffer = context.createBuffer(1, context.sampleRate * 0.5, context.sampleRate);
    const data = buffer.getChannelData(0);

    for (let index = 0; index < data.length; index += 1) {
        data[index] = Math.random() * 2 - 1;
    }

    return buffer;
}

function playSound(soundName) {
    const context = getAudioContext();
    const now = context.currentTime;
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.connect(gain);
    gain.connect(context.destination);

    if (soundName === 'kick') {
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(150, now);
        oscillator.frequency.exponentialRampToValueAtTime(45, now + 0.32);
        gain.gain.setValueAtTime(0.9, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
    } else if (soundName === 'tom') {
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(190, now);
        oscillator.frequency.exponentialRampToValueAtTime(85, now + 0.3);
        gain.gain.setValueAtTime(0.6, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    } else if (soundName === 'crash') {
        const noise = context.createBufferSource();
        const filter = context.createBiquadFilter();
        noise.buffer = createNoiseBuffer(context);
        filter.type = 'highpass';
        filter.frequency.value = 2200;
        noise.connect(filter);
        filter.connect(gain);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
        noise.start(now);
        noise.stop(now + 0.7);
        return;
    } else {
        const noise = context.createBufferSource();
        const filter = context.createBiquadFilter();
        noise.buffer = createNoiseBuffer(context);
        filter.type = soundName === 'hat' ? 'highpass' : 'bandpass';
        filter.frequency.value = soundName === 'hat' ? 6500 : 1800;
        noise.connect(filter);
        filter.connect(gain);
        gain.gain.setValueAtTime(soundName === 'hat' ? 0.18 : 0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + (soundName === 'hat' ? 0.08 : 0.2));
        noise.start(now);
        noise.stop(now + 0.25);
        return;
    }

    oscillator.start(now);
    oscillator.stop(now + 0.4);
}

function playDrum(button) {
    playSound(button.dataset.sound);
    button.classList.remove('active');
    void button.offsetWidth;
    button.classList.add('active');
    status.textContent = `${button.querySelector('.name').textContent} hit`;
    window.setTimeout(() => button.classList.remove('active'), 130);
}

drumButtons.forEach((button) => {
    button.addEventListener('click', () => playDrum(button));
});

document.addEventListener('keydown', (event) => {
    if (event.repeat) return;
    const button = document.querySelector(`[data-key="${event.key.toLowerCase()}"]`);
    if (button) playDrum(button);
});
