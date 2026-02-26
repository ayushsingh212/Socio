"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  ArrowLeft,
  Upload,
  Smile,
  MapPin,
  UserPlus,
  ChevronRight,
  ChevronDown,
  Info,
  X,
  Edit3,
  Crop,
  Sliders,
  AlertCircle,
  Camera,
  Plus,
  Loader2,
  Flame,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Play,
  Pause,
  Volume2,
  VolumeX
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface UploadResponse {
  success: boolean;
  data: {
    _id: string;
    reel: {
      url: string;
      reelId: string;
    };
    title: string;
    description: string;
    typeOfReel: 'image' | 'video';
    owner: string;
  };
  message: string;
}

export default function Create() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'post' | 'reel'>('post');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [caption, setCaption] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState<'upload' | 'edit' | 'details'>('upload');
  const [selectedFilter, setSelectedFilter] = useState('original');
  const [turnOffComments, setTurnOffComments] = useState(false);
  const [hideLikes, setHideLikes] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const cameraVideoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Filters for images
  const filters = [
    { name: 'original', label: 'Original', class: '' },
    { name: 'clarendon', label: 'Clarendon', class: 'brightness-110 contrast-110 saturate-125' },
    { name: 'gingham', label: 'Gingham', class: 'sepia brightness-105 contrast-90' },
    { name: 'moon', label: 'Moon', class: 'grayscale contrast-115 brightness-90' },
    { name: 'lark', label: 'Lark', class: 'brightness-105 contrast-95 saturate-110' },
    { name: 'reyes', label: 'Reyes', class: 'sepia brightness-105 contrast-95' },
    { name: 'juno', label: 'Juno', class: 'brightness-110 contrast-110 saturate-140' },
    { name: 'slumber', label: 'Slumber', class: 'brightness-90 contrast-120 saturate-80 hue-rotate-15' },
  ];

  // FIX 1: Camera lifecycle — useEffect handles stream, startCamera only opens the modal
  useEffect(() => {
    if (!showCamera) return;

    let active = true;

    const enableCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });

        if (!active) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        mediaStreamRef.current = stream;

        if (cameraVideoRef.current) {
          cameraVideoRef.current.srcObject = stream;
          cameraVideoRef.current.play().catch(() => {});
        }
      } catch (error) {
        console.error('Camera access denied:', error);
        setShowCamera(false);
      }
    };

    enableCamera();

    return () => {
      active = false;
      mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    };
  }, [showCamera]);

  const startCamera = () => {
    setShowCamera(true);
  };

  const stopCamera = () => {
    setShowCamera(false); // useEffect cleanup handles stopping tracks
  };

  const capturePhoto = () => {
    const video = cameraVideoRef.current;
    if (!video) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    ctx?.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
      processFiles([file]);
    }, 'image/jpeg');

    stopCamera();
  };

  // FIX 2: processFiles — use argument length, not stale state, to decide step transition
  const processFiles = useCallback((files: File[]) => {
    const validFiles = files.filter(
      (file) => file.type.startsWith('image/') || file.type.startsWith('video/')
    );

    if (validFiles.length === 0) return;

    const oversizedFiles = validFiles.filter((file) => file.size > 100 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setUploadError('Some files exceed the 100MB size limit');
      return;
    }

    setUploadError(null);
    setSelectedFiles((prev) => {
      const updated = [...prev, ...validFiles];
      // Advance to edit step only on the first batch of files
      if (prev.length === 0) {
        setCurrentStep('edit');
      }
      return updated;
    });

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrls((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    processFiles(files);
    // Reset input so the same file can be selected again
    e.target.value = '';
  };

  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    processFiles(Array.from(e.dataTransfer.files));
  };

  // Remove a file and its preview
  const removeFile = (index: number) => {
    setSelectedFiles((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      if (updated.length === 0) setCurrentStep('upload');
      return updated;
    });
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle share/post
  const handleShare = async () => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);

    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const formData = new FormData();
      formData.append('reel', selectedFiles[0]);
      formData.append('title', title || 'Untitled');
      formData.append('description', description || caption);
      formData.append('isPublished', 'true');

      const response = await axios.post<UploadResponse>(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/community/uploadReel`,
        formData,
        { withCredentials:true,
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.data.success) {
        setTimeout(() => {
          router.push(`/reel/${response.data.data._id}`);
        }, 1000);
      }
    } catch (error: any) {
      clearInterval(progressInterval);
      setUploadError(error.response?.data?.message || 'Failed to upload reel');
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 1000);
    }
  };

  // Video playback controls
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const getFilterClass = () => filters.find((f) => f.name === selectedFilter)?.class || '';

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* FIX 3: Camera modal rendered at top level so it overlays everything properly */}
      <AnimatePresence>
        {showCamera && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-2xl"
            >
              {/* FIX 4: muted required for autoPlay in most browsers */}
              <video
                ref={cameraVideoRef}
                className="w-80 h-60 rounded-xl bg-black object-cover"
                autoPlay
                playsInline
                muted
              />
              <div className="flex justify-between mt-4 gap-3">
                <button
                  onClick={capturePhoto}
                  className="flex-1 bg-primary text-white px-4 py-2 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                >
                  Capture
                </button>
                <button
                  onClick={stopCamera}
                  className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                Create New
              </h1>
            </div>

            <div className="flex items-center gap-3">
              {/* Tab Switcher */}
              <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button
                  onClick={() => setActiveTab('post')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                    activeTab === 'post'
                      ? 'bg-white dark:bg-gray-900 text-primary shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  Post
                </button>
                <button
                  onClick={() => setActiveTab('reel')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                    activeTab === 'reel'
                      ? 'bg-white dark:bg-gray-900 text-primary shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  Reel
                </button>
              </div>

              <button
                onClick={handleShare}
                disabled={selectedFiles.length === 0 || isUploading}
                className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${
                  selectedFiles.length > 0 && !isUploading
                    ? 'bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                }`}
              >
                {isUploading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="animate-spin h-4 w-4" />
                    <span>{uploadProgress}%</span>
                  </span>
                ) : activeTab === 'reel' ? (
                  'Upload Reel'
                ) : (
                  'Share Post'
                )}
              </button>
            </div>
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="pb-3">
              <div className="h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          )}

          {/* Error Message */}
          {uploadError && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="pb-3">
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {uploadError}
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Media Upload/Preview */}
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
            >
              {/* Step Indicator */}
              {selectedFiles.length > 0 && (
                <div className="border-b border-slate-200 dark:border-slate-800 p-4">
                  <div className="flex items-center justify-center gap-2">
                    {(['upload', 'edit', 'details'] as const).map((step, index) => (
                      <div key={step} className="flex items-center">
                        <button
                          onClick={() => setCurrentStep(step)}
                          className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-medium transition-all ${
                            currentStep === step
                              ? 'bg-primary text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                          }`}
                        >
                          {index + 1}
                        </button>
                        {index < 2 && <ChevronRight className="w-4 h-4 mx-2 text-slate-400" />}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div
                ref={dropZoneRef}
                className={`relative min-h-[500px] transition-colors ${
                  isDragging ? 'bg-primary/5 border-2 border-dashed border-primary' : ''
                }`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                {/* Upload Step */}
                {currentStep === 'upload' && selectedFiles.length === 0 && (
                  <div className="h-[500px] flex flex-col items-center justify-center p-8">
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-center max-w-md"
                    >
                      <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                        <Upload className="w-10 h-10 text-primary" />
                      </div>

                      <h2 className="text-2xl font-bold mb-2">Drag and drop</h2>
                      <p className="text-slate-500 dark:text-slate-400 mb-6">
                        Upload up to 10 photos and videos in a single {activeTab}
                      </p>

                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors"
                        >
                          Select from computer
                        </button>

                        {/* FIX 5: Properly styled camera button */}
                        <button
                          onClick={startCamera}
                          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Camera className="w-4 h-4" />
                          Take photo
                        </button>
                      </div>

                      <p className="text-xs text-slate-400 mt-4">
                        Supported: JPG, PNG, GIF, MP4 (Max 100MB)
                      </p>
                    </motion.div>
                  </div>
                )}

                {/* Edit Step */}
                {currentStep === 'edit' && selectedFiles.length > 0 && (
                  <div className="p-6">
                    {/* Main Preview */}
                    <div className="aspect-square bg-black/5 rounded-xl mb-6 relative overflow-hidden">
                      {selectedFiles[0]?.type.startsWith('video/') ? (
                        <div className="relative w-full h-full">
                          <video
                            ref={videoRef}
                            src={previewUrls[0]}
                            className="w-full h-full object-contain"
                            loop
                            onClick={togglePlay}
                          />
                          <div className="absolute bottom-4 right-4 flex gap-2">
                            <button
                              onClick={togglePlay}
                              className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                            >
                              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                            </button>
                            <button
                              onClick={toggleMute}
                              className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                            >
                              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <img
                          src={previewUrls[0]}
                          alt="Preview"
                          className={`w-full h-full object-contain ${getFilterClass()}`}
                        />
                      )}

                      {/* Edit Controls */}
                      <div className="absolute top-4 right-4 flex gap-2">
                        <button className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-xl transition-colors">
                          <Crop className="w-5 h-5" />
                        </button>
                        <button className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-xl transition-colors">
                          <Sliders className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Filters - Only for images */}
                    {selectedFiles[0]?.type.startsWith('image/') && (
                      <div className="mb-6">
                        <h3 className="text-sm font-medium mb-3">Filters</h3>
                        <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
                          {filters.map((filter) => (
                            <button
                              key={filter.name}
                              onClick={() => setSelectedFilter(filter.name)}
                              className={`flex-shrink-0 w-20 text-center ${
                                selectedFilter === filter.name ? 'ring-2 ring-primary rounded-xl' : ''
                              }`}
                            >
                              <div className="aspect-square bg-slate-200 rounded-xl mb-2 overflow-hidden">
                                <img
                                  src={previewUrls[0]}
                                  alt={filter.label}
                                  className={`w-full h-full object-cover ${filter.class}`}
                                />
                              </div>
                              <span className="text-xs font-medium">{filter.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Thumbnails */}
                    {selectedFiles.length > 1 && (
                      <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
                        <h3 className="text-sm font-medium mb-3">All Media</h3>
                        <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
                          {previewUrls.map((url, index) => (
                            <div key={index} className="relative flex-shrink-0">
                              <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-transparent hover:border-primary cursor-pointer">
                                {selectedFiles[index]?.type.startsWith('video/') ? (
                                  <video src={url} className="w-full h-full object-cover" />
                                ) : (
                                  <img src={url} alt="" className="w-full h-full object-cover" />
                                )}
                              </div>
                              <button
                                onClick={() => removeFile(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                              >
                                <X className="w-3 h-3" />
                              </button>
                              {index === 0 && (
                                <span className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white text-[10px] text-center py-1 rounded-b-xl">
                                  Cover
                                </span>
                              )}
                            </div>
                          ))}
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center hover:border-primary transition-colors flex-shrink-0"
                          >
                            <Plus className="w-6 h-6 text-slate-400" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Details Step */}
                {currentStep === 'details' && selectedFiles.length > 0 && (
                  <div className="p-6 space-y-6">
                    {/* Title (for reels) */}
                    {activeTab === 'reel' && (
                      <div>
                        <label className="block text-sm font-medium mb-2">Title *</label>
                        <input
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="Enter a title for your reel"
                          className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary text-sm"
                        />
                      </div>
                    )}

                    {/* Caption/Description */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {activeTab === 'reel' ? 'Description' : 'Caption'}
                      </label>
                      <textarea
                        value={activeTab === 'reel' ? description : caption}
                        onChange={(e) => {
                          if (activeTab === 'reel') {
                            setDescription(e.target.value);
                          } else {
                            setCaption(e.target.value);
                          }
                        }}
                        placeholder={
                          activeTab === 'reel' ? 'Write a description...' : 'Write a caption...'
                        }
                        className="w-full h-32 px-4 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary text-sm resize-none"
                      />
                      <div className="flex justify-between mt-2 text-xs text-slate-500">
                        <button className="hover:text-primary">
                          <Smile className="w-4 h-4" />
                        </button>
                        <span>
                          {(activeTab === 'reel' ? description : caption).length}/2200
                        </span>
                      </div>
                    </div>

                    {/* Location */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Location</label>
                      <div className="flex items-center gap-3 px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl">
                        <MapPin className="w-5 h-5 text-slate-400" />
                        <input
                          type="text"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="Add location"
                          className="flex-1 bg-transparent border-none focus:ring-0 p-0 text-sm"
                        />
                      </div>
                    </div>

                    {/* Tag People */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Tag people</label>
                      <div className="flex items-center gap-3 px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl">
                        <UserPlus className="w-5 h-5 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search for people"
                          className="flex-1 bg-transparent border-none focus:ring-0 p-0 text-sm"
                        />
                      </div>
                    </div>

                    {/* Advanced Settings */}
                    <div>
                      <button
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className="flex items-center justify-between w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl"
                      >
                        <span className="text-sm font-medium">Advanced settings</span>
                        <ChevronDown
                          className={`w-5 h-5 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
                        />
                      </button>

                      <AnimatePresence>
                        {showAdvanced && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-2 p-4 bg-slate-100 dark:bg-slate-800 rounded-xl space-y-3">
                              <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={turnOffComments}
                                  onChange={(e) => setTurnOffComments(e.target.checked)}
                                  className="rounded text-primary focus:ring-primary"
                                />
                                <span className="text-sm">Turn off commenting</span>
                              </label>
                              <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={hideLikes}
                                  onChange={(e) => setHideLikes(e.target.checked)}
                                  className="rounded text-primary focus:ring-primary"
                                />
                                <span className="text-sm">Hide like and view counts</span>
                              </label>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Accessibility Info */}
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                      <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                            Accessibility
                          </p>
                          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                            Alt text will be automatically created for your photos.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Preview & Tips */}
          <div className="lg:col-span-4 space-y-6">
            {/* Live Preview */}
            {selectedFiles.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden sticky top-24"
              >
                <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                  <h3 className="font-bold">Live Preview</h3>
                </div>

                <div className="p-4">
                  <div className="bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden">
                    {/* Header */}
                    <div className="p-3 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-pink-600 p-[2px]">
                        <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 p-[2px]">
                          <img
                            src="https://picsum.photos/seed/user/100/100"
                            alt=""
                            className="w-full h-full rounded-full object-cover"
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-sm">alex_design_studio</p>
                        {location && <p className="text-xs text-slate-500">{location}</p>}
                      </div>
                      <button className="text-slate-400 hover:text-slate-600">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Media */}
                    <div className="aspect-square bg-black/10">
                      {selectedFiles[0]?.type.startsWith('video/') ? (
                        <video src={previewUrls[0]} className="w-full h-full object-cover" />
                      ) : (
                        <img
                          src={previewUrls[0]}
                          alt=""
                          className={`w-full h-full object-cover ${getFilterClass()}`}
                        />
                      )}
                    </div>

                    {/* Actions */}
                    <div className="p-3">
                      <div className="flex items-center gap-4 mb-3">
                        <Heart className="w-6 h-6 text-slate-400 hover:text-primary cursor-pointer" />
                        <MessageCircle className="w-6 h-6 text-slate-400 hover:text-primary cursor-pointer" />
                        <Share2 className="w-6 h-6 text-slate-400 hover:text-primary cursor-pointer" />
                        <Bookmark className="w-6 h-6 text-slate-400 hover:text-primary cursor-pointer ml-auto" />
                      </div>

                      <p className="text-sm">
                        <span className="font-bold mr-2">alex_design_studio</span>
                        {caption || description || 'Your caption here...'}
                      </p>

                      {activeTab === 'reel' && (
                        <div className="mt-3 flex items-center gap-2 text-xs">
                          <Flame className="w-4 h-4 text-orange-500" />
                          <span className="text-orange-500 font-medium">Posting streak: +1 day</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Tips Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
            >
              <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                <h3 className="font-bold">Pro Tips ✨</h3>
              </div>
              <div className="p-4 space-y-3">
                {[
                  'Posts with locations get 79% more engagement',
                  'Add a catchy title to increase views by 2x',
                  'Tag relevant people to expand your reach',
                ].map((tip, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-primary">{i + 1}</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{tip}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Recent Tags */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
            >
              <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                <h3 className="font-bold">Recent Tags</h3>
              </div>
              <div className="p-4 space-y-2">
                {['jessica_parker', 'travel_adventures', 'food_lover'].map((tag) => (
                  <div
                    key={tag}
                    className="flex items-center justify-between p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <span className="text-sm">@{tag}</span>
                    <button className="text-xs text-primary font-medium">Tag</button>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Mobile Bottom Bar */}
        {selectedFiles.length > 0 && (
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-slate-200 dark:border-slate-800 p-4">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
              <div className="flex items-center gap-3">
                {selectedFiles[0]?.type.startsWith('video/') ? (
                  <video src={previewUrls[0]} className="w-12 h-12 rounded-xl object-cover" />
                ) : (
                  <img src={previewUrls[0]} alt="" className="w-12 h-12 rounded-xl object-cover" />
                )}
                <div>
                  <p className="text-sm font-medium">{selectedFiles.length} item(s) selected</p>
                  <p className="text-xs text-slate-500">Ready to post</p>
                </div>
              </div>
              <button
                onClick={() => {
                  if (currentStep === 'upload') setCurrentStep('edit');
                  else if (currentStep === 'edit') setCurrentStep('details');
                  else setCurrentStep('edit');
                }}
                className="bg-primary text-white px-6 py-2 rounded-xl text-sm font-medium"
              >
                {currentStep === 'upload' && 'Edit'}
                {currentStep === 'edit' && 'Next'}
                {currentStep === 'details' && 'Back'}
              </button>
            </div>
          </div>
        )}
      </main>

    
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}