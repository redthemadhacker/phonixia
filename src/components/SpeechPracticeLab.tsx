import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import { sounds } from '../utils/audio';
import { 
  Camera, 
  Mic, 
  Square, 
  Play, 
  ShieldCheck, 
  Lock, 
  ArrowLeft, 
  Activity, 
  CheckCircle, 
  Volume2, 
  Clock, 
  Sparkles,
  AlertCircle
} from 'lucide-react';

interface SpeechPracticeLabProps {
  onBack: () => void;
}

const READING_PASSAGES = [
  {
    id: 'p1',
    tier: 'Early Reader (Grade 1-2)',
    title: 'The Brave Sea Turtle of Sound Shallows',
    text: 'A quick red fox jumps over a sleepy log. Down in the calm bay, Kam sees a small green turtle swimming through the bright waves.',
    targetWCPM: 60,
    wordCount: 26
  },
  {
    id: 'p2',
    tier: 'Intermediate (Grade 3-5)',
    title: 'The Secret Keystones of Builders Guild',
    text: 'High upon the stone mountain, ancient craftsmen constructed towering arches. Each brick required precise phonetic balance to protect the golden gates against sudden winter blizzards.',
    targetWCPM: 115,
    wordCount: 26
  },
  {
    id: 'p3',
    tier: 'Advanced / High School (Grade 9-12)',
    title: 'The Great Oration of Lexicon Empire',
    text: 'Eloquence is not the mere embellishment of speech, but the luminous architecture of reason. When citizens assemble to deliberate, language illuminates the path of justice and collective freedom.',
    targetWCPM: 180,
    wordCount: 27
  }
];

export const SpeechPracticeLab: React.FC<SpeechPracticeLabProps> = ({ onBack }) => {
  const { activeExplorer } = useGame();
  const [selectedPassageIndex, setSelectedPassageIndex] = useState(0);
  const currentPassage = READING_PASSAGES[selectedPassageIndex];

  // Camera & Audio states
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [calculatedWCPM, setCalculatedWCPM] = useState<number | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Stop all hardware streams on unmount
  useEffect(() => {
    return () => {
      stopHardware();
    };
  }, []);

  const stopHardware = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    setIsCameraActive(false);
    setIsRecording(false);
  };

  const handleStartCamera = async () => {
    setPermissionError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
        audio: true
      });

      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);
      sounds.playClick();

      // Setup Web Audio Analyser
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      drawWaveform();
    } catch (err: any) {
      console.warn('Camera/Microphone permission denied or unavailable:', err);
      setPermissionError('Microphone or Camera access was denied or is unavailable. You can still read the passage aloud!');
    }
  };

  const drawWaveform = () => {
    if (!canvasRef.current || !analyserRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      animationFrameRef.current = requestAnimationFrame(render);
      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = (dataArray[i] / 255) * canvas.height;
        ctx.fillStyle = `rgb(${dataArray[i] + 50}, 168, 247)`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }
    };

    render();
  };

  const handleToggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setRecordingSeconds(0);
      setCalculatedWCPM(null);
      sounds.playSuccess();

      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setIsRecording(false);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      sounds.playClick();

      // Calculate WCPM: (Words Read / Seconds) * 60
      if (recordingSeconds > 2) {
        const wcpm = Math.round((currentPassage.wordCount / recordingSeconds) * 60);
        setCalculatedWCPM(wcpm);
        sounds.speak(`Excellent fluency reading! You read at ${wcpm} words per minute!`);
      }
    }
  };

  return (
    <div className="w-full h-full min-h-[100dvh] max-h-[100dvh] bg-slate-950 text-slate-100 flex flex-col justify-between overflow-hidden select-none fixed inset-0">
      
      {/* Top Header */}
      <div className="px-4 py-3 bg-slate-900/95 border-b border-cyan-500/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              stopHardware();
              sounds.playClick();
              onBack();
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs flex items-center gap-1.5 border border-slate-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div>
            <div className="text-cyan-400 text-xs font-black tracking-widest uppercase flex items-center gap-1.5 font-display">
              <Mic className="w-3.5 h-3.5" />
              Privacy-Safe Speech &amp; Fluency Studio
            </div>
            <h1 className="text-lg font-black text-cyan-100 tracking-wide font-display">
              Oral Language &amp; Reading Fluency Lab
            </h1>
          </div>
        </div>

        {/* Privacy Shield Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="font-bold hidden sm:inline">100% Client-Side Privacy: FERPA &amp; COPPA Safe</span>
        </div>
      </div>

      {/* Main Studio Body */}
      <div className="flex-1 p-3 sm:p-6 overflow-hidden max-w-7xl mx-auto w-full flex flex-col lg:flex-row gap-6">
        
        {/* Left Column: Passage Display & Controls */}
        <div className="flex-1 flex flex-col justify-between p-6 rounded-3xl bg-slate-900/90 border border-cyan-500/30">
          <div>
            {/* Passage Selector */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-wider font-bold text-cyan-400">
                Reading Passage Selection
              </span>
              <div className="flex gap-2">
                {READING_PASSAGES.map((p, idx) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      sounds.playClick();
                      setSelectedPassageIndex(idx);
                      setCalculatedWCPM(null);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                      selectedPassageIndex === idx
                        ? 'bg-cyan-500 text-slate-950 font-black'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    Level {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Passage Text Container */}
            <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 mb-4">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="text-cyan-300 font-bold">{currentPassage.title}</span>
                <span className="font-mono">{currentPassage.tier}</span>
              </div>
              <p className="text-lg sm:text-xl font-medium text-slate-100 leading-relaxed tracking-wide font-serif">
                "{currentPassage.text}"
              </p>
            </div>

            {/* Target Metrics */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                <span className="text-slate-400">Word Count:</span>
                <span className="font-mono font-bold text-cyan-300">{currentPassage.wordCount} words</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                <span className="text-slate-400">Target WCPM:</span>
                <span className="font-mono font-bold text-amber-300">{currentPassage.targetWCPM} WCPM</span>
              </div>
            </div>
          </div>

          {/* Reading Fluency Timer HUD */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={handleToggleRecording}
                className={`px-5 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 transition ${
                  isRecording
                    ? 'bg-rose-500 text-white animate-pulse shadow-[0_0_20px_rgba(244,63,94,0.6)]'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                }`}
              >
                {isRecording ? <Square className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-slate-950" />}
                {isRecording ? 'STOP READING' : 'START FLUENCY READ'}
              </button>

              <div className="flex items-center gap-1.5 font-mono text-xs text-slate-300">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>{recordingSeconds}s elapsed</span>
              </div>
            </div>

            {calculatedWCPM !== null && (
              <div className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-bounce">
                <CheckCircle className="w-4 h-4" />
                <span>Reading Fluency: {calculatedWCPM} WCPM!</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Camera Preview & Acoustic Waveform */}
        <div className="w-full lg:w-96 flex flex-col justify-between p-6 rounded-3xl bg-slate-900/90 border border-slate-800">
          <div>
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="font-bold text-slate-300 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-cyan-400" />
                Speech Video Preview
              </span>
              <button
                onClick={isCameraActive ? stopHardware : handleStartCamera}
                className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-cyan-300 font-bold border border-slate-700 transition"
              >
                {isCameraActive ? 'Disable Camera' : 'Enable Camera'}
              </button>
            </div>

            {/* Video Box */}
            <div className="relative aspect-video rounded-2xl bg-slate-950 border-2 border-slate-800 overflow-hidden flex items-center justify-center mb-4">
              {isCameraActive ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transform -scale-x-100"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-slate-500 text-xs p-4 text-center">
                  <Camera className="w-8 h-8 stroke-1 text-slate-600" />
                  <span>Camera is optional &amp; strictly client-side.</span>
                  <span className="text-[10px] text-slate-600">No media is ever recorded or uploaded.</span>
                </div>
              )}
            </div>

            {permissionError && (
              <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2 mb-3">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{permissionError}</span>
              </div>
            )}

            {/* Acoustic Waveform Canvas */}
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                <span className="flex items-center gap-1 font-bold">
                  <Activity className="w-3.5 h-3.5 text-cyan-400" />
                  Voice Waveform Spectrum
                </span>
                <span className="font-mono text-[10px]">Real-Time FFT</span>
              </div>
              <canvas
                ref={canvasRef}
                width={300}
                height={80}
                className="w-full h-20 rounded-lg bg-slate-900 border border-slate-800"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500 leading-normal">
            <Lock className="w-3.5 h-3.5 inline mr-1 text-emerald-400" />
            Child Safety Assurance: Video and audio feeds run in memory only. Parents can disable camera access at any time.
          </div>
        </div>

      </div>
    </div>
  );
};
