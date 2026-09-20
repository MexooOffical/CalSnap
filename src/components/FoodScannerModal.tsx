import React, { useState, useRef, useEffect } from 'react';
import { X, Camera, Image as ImageIcon, Zap, RotateCcw, Sparkles } from 'lucide-react';
import { analyzeFoodImage } from '../services/aiFoodService';
import { AIAnalysisResult } from '../types';

interface FoodScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanComplete: (result: AIAnalysisResult) => void;
  defaultMealNameHint?: string;
}

// Curated high quality authentic Indian meal sample images (clean SVG/data URIs or canvas generator)
// allowing instant zero-friction testing right in the browser!
const SAMPLE_INDIAN_MEALS = [
  {
    name: 'Kanda Poha',
    region: 'Maharashtrian',
    hint: 'Kanda Batata Poha with roasted peanuts and fresh coriander',
    color: '#FACC15',
    emoji: '🥣',
  },
  {
    name: 'Masala Dosa + Sambar',
    region: 'South Indian',
    hint: 'Crispy golden Masala Dosa with spiced potato filling, sambar and coconut chutney',
    color: '#D97706',
    emoji: '🥞',
  },
  {
    name: 'Paneer Butter Masala + Rotis',
    region: 'North Indian',
    hint: 'Creamy paneer butter masala with 2 fresh whole wheat phulkas and salad',
    color: '#EA580C',
    emoji: '🍛',
  },
  {
    name: 'Hyderabadi Biryani',
    region: 'Hyderabadi',
    hint: 'Fragrant Hyderabadi Dum Biryani with spiced rice and cooling raita',
    color: '#E11D48',
    emoji: '🍲',
  },
  {
    name: 'Dal Tadka + Rice',
    region: 'All-India',
    hint: 'Yellow moong dal tadka with cumin steamed basmati rice',
    color: '#CA8A04',
    emoji: '🍚',
  },
  {
    name: 'Crispy Samosa (2 pcs)',
    region: 'Street Food',
    hint: 'Crispy Punjabi Aloo Samosas with mint and tamarind chutney',
    color: '#D97706',
    emoji: '🥟',
  },
  {
    name: 'Chole Bhature',
    region: 'Punjabi',
    hint: 'Amritsari Chole with 2 fluffy bhature and pickled onions',
    color: '#B45309',
    emoji: '🥘',
  },
];

export const FoodScannerModal: React.FC<FoodScannerModalProps> = ({
  isOpen,
  onClose,
  onScanComplete,
  defaultMealNameHint,
}) => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStepIndex, setAnalysisStepIndex] = useState(0);
  const [flashOn, setFlashOn] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [customHint, setCustomHint] = useState(defaultMealNameHint || '');
  const [capturedPreview, setCapturedPreview] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const nativeCameraInputRef = useRef<HTMLInputElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const ANALYSIS_STEPS = [
    'Scanning food image...',
    'Identifying authentic Indian dishes...',
    'Decomposing thali components...',
    'Estimating grams & portion sizes...',
    'Calculating ICMR calibrated nutrition...',
  ];

  // Camera start / stop lifecycle
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setIsAnalyzing(false);
      setCapturedPreview(null);
      return;
    }

    setCapturedPreview(null);
    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  // Keep video source attached whenever stream is ready
  useEffect(() => {
    if (isCameraActive && videoRef.current && streamRef.current) {
      if (videoRef.current.srcObject !== streamRef.current) {
        videoRef.current.srcObject = streamRef.current;
      }
      videoRef.current.play().catch((e) => console.warn('Video playback warning:', e));
    }
  }, [isCameraActive, isOpen]);

  // Sequential animated AI steps during analysis
  useEffect(() => {
    let timer: any;
    if (isAnalyzing) {
      timer = setInterval(() => {
        setAnalysisStepIndex((idx) => {
          if (idx < ANALYSIS_STEPS.length - 1) {
            return idx + 1;
          }
          return idx;
        });
      }, 700);
    } else {
      setAnalysisStepIndex(0);
    }
    return () => clearInterval(timer);
  }, [isAnalyzing]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera device access not supported in this browser environment');
      }

      if (streamRef.current) {
        stopCamera();
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        try {
          await videoRef.current.play();
        } catch (playErr) {
          console.warn('Video auto-play delayed until user interaction:', playErr);
        }
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.warn('Camera access unavailable or declined:', err);
      setCameraError('Live camera not available in this view. Tap "Take Photo" or pick a sample Indian dish below.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const handleFlipCamera = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  // Capture frame from active video stream or camera input
  const capturePhoto = async () => {
    if (isCameraActive && videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const base64Image = canvas.toDataURL('image/jpeg', 0.85);
        setCapturedPreview(base64Image);
        await processImage(base64Image, customHint);
        return;
      }
    }

    // If live camera is not streaming (e.g. mobile Safari / restricted iframe), trigger device camera
    if (nativeCameraInputRef.current) {
      nativeCameraInputRef.current.click();
      return;
    }

    // If user typed a dish note, generate instant scan
    if (customHint.trim()) {
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 400;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#18181B';
        ctx.fillRect(0, 0, 400, 400);
        ctx.beginPath();
        ctx.arc(200, 200, 140, 0, 2 * Math.PI);
        ctx.fillStyle = '#EA580C';
        ctx.fill();
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 20px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(customHint.slice(0, 26), 200, 205);
      }
      const sampleBase64 = canvas.toDataURL('image/jpeg', 0.85);
      setCapturedPreview(sampleBase64);
      await processImage(sampleBase64, customHint);
    } else {
      handleSelectSample(SAMPLE_INDIAN_MEALS[0]);
    }
  };

  // Upload or take photo from device
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      setCapturedPreview(base64);
      await processImage(base64, customHint);
    };
    reader.readAsDataURL(file);
  };

  // Quick sample preset
  const handleSelectSample = async (sample: (typeof SAMPLE_INDIAN_MEALS)[0]) => {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#18181B';
      ctx.fillRect(0, 0, 400, 400);

      ctx.beginPath();
      ctx.arc(200, 200, 150, 0, 2 * Math.PI);
      ctx.fillStyle = '#27272A';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(200, 200, 110, 0, 2 * Math.PI);
      ctx.fillStyle = sample.color;
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(sample.name, 200, 205);
      ctx.font = '14px sans-serif';
      ctx.fillStyle = '#A1A1AA';
      ctx.fillText(sample.region, 200, 235);
    }

    const sampleBase64 = canvas.toDataURL('image/jpeg', 0.85);
    setCapturedPreview(sampleBase64);
    await processImage(sampleBase64, sample.hint);
  };

  // Run AI analysis
  const processImage = async (base64: string, hint: string) => {
    setIsAnalyzing(true);
    stopCamera();

    try {
      const result = await analyzeFoodImage(base64, hint);
      result.imageUrl = base64;
      setIsAnalyzing(false);
      onClose();
      onScanComplete(result);
    } catch (err) {
      console.error(err);
      setIsAnalyzing(false);
      alert('Unable to analyze meal. Please try again with clear lighting.');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="camera-scanner-modal"
      className="fixed inset-0 z-50 bg-black text-white flex flex-col justify-between overflow-hidden"
    >
      {/* Top Bar Controls */}
      <div className="z-20 flex items-center justify-between px-5 pt-6 pb-3 bg-gradient-to-b from-black/80 to-transparent">
        <button
          id="btn-close-scanner"
          onClick={onClose}
          className="p-2 rounded-full bg-zinc-800/80 text-white hover:bg-zinc-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900/80 border border-zinc-700/60 text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Aahar AI Vision</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFlashOn((v) => !v)}
            className={`p-2 rounded-full transition ${
              flashOn ? 'bg-amber-400 text-black' : 'bg-zinc-800/80 text-white'
            }`}
            title="Toggle Flash"
          >
            <Zap className="w-4 h-4" />
          </button>
          <button
            onClick={handleFlipCamera}
            className="p-2 rounded-full bg-zinc-800/80 text-white hover:bg-zinc-700 transition"
            title="Switch Camera"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Viewfinder / Camera Surface */}
      <div className="relative flex-1 flex flex-col items-center justify-center overflow-hidden bg-black">
        {/* Live Camera View - Always mounted so videoRef is never null */}
        <video
          ref={videoRef}
          playsInline
          muted
          autoPlay
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            isCameraActive && !capturedPreview ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onLoadedMetadata={() => {
            videoRef.current?.play().catch(console.warn);
          }}
        />

        {/* Captured Food Photo Preview (Displays the photo of what the user is eating!) */}
        {capturedPreview && (
          <img
            src={capturedPreview}
            alt="Captured meal"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* If live stream is not active and no photo taken yet */}
        {!isCameraActive && !capturedPreview && (
          <div className="absolute inset-0 bg-zinc-950 flex flex-col items-center justify-center p-6 text-center z-10">
            <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-400 mb-3 shadow-lg">
              <Camera className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-white mb-1">
              Food Photo Scanner
            </h4>
            <p className="text-xs text-zinc-400 max-w-xs leading-relaxed mb-5">
              {cameraError || 'Take a photo of your meal or upload an image to estimate calories.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-2.5 w-full max-w-xs">
              <button
                onClick={() => nativeCameraInputRef.current?.click()}
                className="flex-1 py-3 px-4 bg-white text-zinc-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-200 transition active:scale-95 shadow-md"
              >
                <Camera className="w-4 h-4 text-zinc-950" />
                <span>Take Photo</span>
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 py-3 px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition active:scale-95 border border-zinc-700/60"
              >
                <ImageIcon className="w-4 h-4" />
                <span>Upload</span>
              </button>
            </div>
          </div>
        )}

        {/* Viewfinder Target Framing Overlay */}
        {!isAnalyzing && (
          <div className="relative z-15 w-72 h-72 border-2 border-dashed border-white/60 rounded-3xl flex flex-col items-center justify-between p-4 pointer-events-none">
            <div className="w-full flex justify-between">
              <div className="w-5 h-5 border-t-2 border-l-2 border-white rounded-tl-lg" />
              <div className="w-5 h-5 border-t-2 border-r-2 border-white rounded-tr-lg" />
            </div>

            <span className="text-[11px] font-semibold text-white/90 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full uppercase tracking-wider">
              Place food inside frame
            </span>

            <div className="w-full flex justify-between">
              <div className="w-5 h-5 border-b-2 border-l-2 border-white rounded-bl-lg" />
              <div className="w-5 h-5 border-b-2 border-r-2 border-white rounded-br-lg" />
            </div>
          </div>
        )}

        {/* Flash Simulation */}
        {flashOn && (
          <div className="absolute inset-0 bg-white/30 pointer-events-none z-20" />
        )}

        {/* Laser Scanning Line sweeps over the captured food */}
        {isAnalyzing && (
          <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_16px_#f59e0b] animate-scan-laser z-25 pointer-events-none" />
        )}

        {/* AI Processing Screen (Photo is visible underneath with scanner laser!) */}
        {isAnalyzing && (
          <div
            id="ai-processing-state"
            className="absolute inset-0 z-30 bg-black/55 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="p-6 rounded-3xl bg-zinc-900/90 border border-white/15 backdrop-blur-md shadow-2xl max-w-xs flex flex-col items-center">
              <div className="relative w-16 h-16 mb-4 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-amber-400/40 animate-ping" />
                <div className="w-14 h-14 rounded-full border-2 border-zinc-700 border-t-amber-400 animate-spin" />
                <Sparkles className="absolute w-6 h-6 text-amber-400 animate-pulse" />
              </div>

              <div className="text-[10px] font-bold uppercase tracking-widest text-amber-400 mb-1">
                Aahar AI Vision Engine
              </div>

              <h3 className="text-base font-bold text-white tracking-tight mb-3 min-h-[24px]">
                {ANALYSIS_STEPS[analysisStepIndex]}
              </h3>

              {/* Stepper Dots */}
              <div className="flex items-center gap-1.5 mb-3">
                {ANALYSIS_STEPS.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === analysisStepIndex
                        ? 'w-6 bg-amber-400'
                        : idx < analysisStepIndex
                        ? 'w-2 bg-amber-200'
                        : 'w-2 bg-zinc-700'
                    }`}
                  />
                ))}
              </div>

              <p className="text-[11px] text-zinc-400 max-w-xs leading-relaxed">
                Evaluating authentic Indian recipes, spice blends, and calculating accurate grams & macros.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Controls & Sample Shortcuts */}
      <div className="z-20 bg-gradient-to-t from-black via-black/90 to-transparent pt-3 pb-8 px-5">
        {/* Optional Context Input (e.g. "Dal Tadka" or "Homemade Poha") */}
        <div className="max-w-xs mx-auto mb-4">
          <input
            type="text"
            value={customHint}
            onChange={(e) => setCustomHint(e.target.value)}
            placeholder="Add note: e.g. 2 rotis with ghee, less oil"
            className="w-full bg-zinc-900/90 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition"
          />
        </div>

        {/* Quick Sample Indian Meals (Instant Testing) */}
        <div className="mb-4">
          <div className="text-[11px] font-medium text-zinc-400 text-center mb-2">
            Try a sample Indian meal:
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 justify-center no-scrollbar">
            {SAMPLE_INDIAN_MEALS.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectSample(s)}
                className="shrink-0 px-2.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[11px] text-zinc-300 flex items-center gap-1.5 transition active:scale-95"
              >
                <span>{s.emoji}</span>
                <span>{s.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Shutter / Capture Actions */}
        <div className="flex items-center justify-around max-w-xs mx-auto">
          {/* Gallery Button */}
          <button
            id="btn-upload-gallery"
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center text-zinc-400 hover:text-white transition"
          >
            <div className="w-11 h-11 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
              <ImageIcon className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-1">Gallery</span>
          </button>

          {/* Hidden File Input for Gallery */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />

          {/* Hidden File Input for Direct Native Camera Snapping */}
          <input
            ref={nativeCameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFileUpload}
          />

          {/* Primary Shutter Button */}
          <button
            id="btn-capture-shutter"
            onClick={capturePhoto}
            disabled={isAnalyzing}
            className="w-18 h-18 rounded-full border-4 border-white p-1 transition-transform active:scale-90 hover:scale-105"
            title="Scan Food"
          >
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
              <div className="w-13 h-13 rounded-full bg-zinc-900/10 border border-zinc-400 flex items-center justify-center">
                {!isCameraActive && <Camera className="w-5 h-5 text-zinc-700" />}
              </div>
            </div>
          </button>

          {/* Manual Search Shortcut */}
          <button
            onClick={() => {
              onClose();
            }}
            className="flex flex-col items-center text-zinc-400 hover:text-white transition"
          >
            <div className="w-11 h-11 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xs font-bold">
              123
            </div>
            <span className="text-[10px] mt-1">Manual</span>
          </button>
        </div>
      </div>
    </div>
  );
};
