import { writeFileSync } from 'node:fs';

// Original 16-bar 6/8 ceremonial procession loop in D pentatonic.
// Instrument voices are synthesized here; no recordings or borrowed melody.
const rate = 32000;
const bpm = 92;
const eighth = 30 / bpm;
const bar = eighth * 6;
const bars = 16;
const duration = bar * bars;
const frames = Math.ceil(rate * duration);
const left = new Float32Array(frames);
const right = new Float32Array(frames);
let noiseSeed = 91407;
const noise = () => { noiseSeed = (noiseSeed * 16807) % 2147483647; return noiseSeed / 1073741823.5 - 1; };
const hz = n => 440 * 2 ** ((n - 69) / 12);

function add(t0, seconds, pitch, gain, voice, pan = 0) {
  const start = Math.floor(t0 * rate);
  const length = Math.min(Math.ceil(seconds * rate), frames - start);
  if (length <= 0) return;
  const f = pitch;
  for (let i = 0; i < length; i++) {
    const t = i / rate;
    const x = t / seconds;
    const vibrato = Math.sin(t * 2 * Math.PI * 5.1) * 0.004;
    let wave = 0, env = 0;
    if (voice === 'shehnai') {
      const ph = 2 * Math.PI * f * t * (1 + vibrato);
      const breath = Math.min(1, t / .075) * Math.min(1, (seconds - t) / .075);
      env = Math.max(0, breath) * Math.pow(Math.max(0, 1 - x), .27);
      wave = Math.sin(ph) + .68*Math.sin(2*ph+.1) + .43*Math.sin(3*ph) + .28*Math.sin(4*ph+.2) + .19*Math.sin(5*ph) + .12*Math.sin(6*ph) + .07*Math.sin(8*ph);
      wave = Math.tanh(wave * .68) * 1.15;
    } else if (voice === 'santoor') {
      env = Math.exp(-4.8*x) * Math.min(1, t*160) * Math.min(1,(seconds-t)*35);
      wave = .76*Math.sin(2*Math.PI*f*t) + .29*Math.sin(2*Math.PI*f*2.03*t) + .18*Math.sin(2*Math.PI*f*3.91*t) + .09*Math.sin(2*Math.PI*f*6.17*t);
    } else if (voice === 'tanpura') {
      env = (0.7 + .08*Math.sin(t*2*Math.PI*.28)) * Math.min(1,t*4) * Math.min(1,(seconds-t)*2);
      wave = Math.sin(2*Math.PI*f*t) + .34*Math.sin(4*Math.PI*f*t) + .18*Math.sin(6*Math.PI*f*t) + .1*Math.sin(8*Math.PI*f*t) + .055*Math.sin(10*Math.PI*f*t);
    } else if (voice === 'bansuri') {
      const ph = 2 * Math.PI * f * t * (1 + vibrato*.72);
      env = Math.min(1,t/.11) * Math.pow(Math.max(0,1-x),.42) * Math.min(1,(seconds-t)*10);
      wave = Math.sin(ph) + .12*Math.sin(ph*2) + .028*Math.sin(ph*3) + noise()*.018;
    } else if (voice === 'tabla-high') {
      const fall = 1 + .025*Math.exp(-t*28);
      env = Math.exp(-t*15) * Math.min(1,t*900);
      wave = Math.sin(2*Math.PI*f*fall*t) + .35*Math.sin(2*Math.PI*f*2.4*fall*t) + .2*Math.sin(2*Math.PI*f*3.9*fall*t);
      const hitNoise = noise()*.5 * Math.exp(-t*100) * .16;
      wave += hitNoise;
    } else if (voice === 'tabla-bass') {
      const bend = 1 - .32*Math.min(1,t/.12);
      env = Math.exp(-t*9) * Math.min(1,t*500);
      wave = Math.sin(2*Math.PI*f*bend*t) + .43*Math.sin(2*Math.PI*f*1.51*bend*t) + .18*Math.sin(2*Math.PI*f*2.3*bend*t);
      wave += (noise()*.5)*Math.exp(-t*70)*.1;
    } else if (voice === 'manjira') {
      env = Math.exp(-t*10) * Math.min(1,t*1000);
      wave = Math.sin(2*Math.PI*f*t)+.6*Math.sin(2*Math.PI*f*1.47*t)+.38*Math.sin(2*Math.PI*f*2.13*t)+.2*Math.sin(2*Math.PI*f*2.87*t);
    }
    const sample = wave * env * gain;
    const pl = Math.cos((pan+1)*Math.PI/4), pr = Math.sin((pan+1)*Math.PI/4);
    left[start+i] += sample*pl;
    right[start+i] += sample*pr;
  }
}

// Graceful bansuri-like answer line doubles only selected phrase endings.
const phrase = [
 [[69,1],[71,.5],[74,1],[71,.5],[69,1],[66,1]],
 [[66,1],[69,.5],[71,.5],[69,1],[66,1],[62,1]],
 [[71,1],[74,1],[76,.5],[74,.5],[71,1],[69,1]],
 [[66,1],[69,.5],[71,.5],[74,1],[71,1],[69,1]],
 [[69,.5],[71,.5],[74,1],[78,1],[76,1],[74,1]],
 [[71,1],[74,.5],[76,.5],[74,1],[71,1],[66,1]],
 [[66,1],[69,1],[71,.5],[74,.5],[71,1],[69,1]],
 [[66,1],[69,.5],[71,.5],[69,1],[66,1],[62,1]]
];
const melodyBars = [...phrase, ...phrase.map((b,i) => i===7 ? [[62,1],[66,.5],[69,.5],[74,1],[71,1],[69,1]] : b)];
for (let b=0; b<bars; b++) {
  const base = b*bar;
  // Tanpura's gently rolling fifth/tonic/fifth/tonic cycle.
  const drone = [38,45,50,45,38,45][b%6];
  add(base, bar*.98, hz(drone), .024, 'tanpura', -.12);
  add(base + eighth*3, bar*.49, hz(drone+12), .012, 'tanpura', .12);
  let pos=0;
  for (const [note,span] of melodyBars[b]) {
    const t=base+pos*eighth;
    add(t, span*eighth*.92, hz(note), .092, 'shehnai', (b%2 ? .08 : -.08));
    if (span>=1) add(t+.12, Math.min(.62,span*eighth*.65), hz(note-12), .043, 'santoor', b%2 ? .3 : -.3);
    pos+=span;
  }
  // A breathy bansuri response decorates the cadence every other bar.
  if (b%2===1) add(base+eighth*4.35, eighth*1.35, hz([74,71,69,66][Math.floor(b/2)%4]), .027, 'bansuri', b%4===1 ? .28 : -.28);
  // Keharwa-inspired 6/8 procession pulse: open bass, resonant dayan, light manjira.
  add(base, .22, hz(43), .13, 'tabla-bass');
  add(base+eighth*2, .13, hz(66), .075, 'tabla-high');
  add(base+eighth*3, .2, hz(48), .09, 'tabla-bass');
  add(base+eighth*5, .12, hz(69), .052, 'tabla-high');
  if (b%2===1) add(base+eighth*3, .3, 2480, .009, 'manjira', .45);
}

// A 30 ms seam fade prevents clicks without a noticeable pause in the loop.
for (let i=0; i<frames; i++) {
  const edge=Math.min(1,i/(rate*.03),(frames-1-i)/(rate*.03));
  left[i]=Math.max(-.92,Math.min(.92,left[i]*Math.max(0,edge)));
  right[i]=Math.max(-.92,Math.min(.92,right[i]*Math.max(0,edge)));
}
const bytes=frames*4;
const wav=Buffer.alloc(44+bytes);
wav.write('RIFF',0); wav.writeUInt32LE(36+bytes,4); wav.write('WAVE',8);
wav.write('fmt ',12); wav.writeUInt32LE(16,16); wav.writeUInt16LE(1,20); wav.writeUInt16LE(2,22);
wav.writeUInt32LE(rate,24); wav.writeUInt32LE(rate*4,28); wav.writeUInt16LE(4,32); wav.writeUInt16LE(16,34);
wav.write('data',36); wav.writeUInt32LE(bytes,40);
for(let i=0;i<frames;i++) { wav.writeInt16LE(Math.round(left[i]*32767),44+i*4); wav.writeInt16LE(Math.round(right[i]*32767),46+i*4); }
writeFileSync('public/assets/vow-vine-original-wedding-loop.wav',wav);

