"use client";

import { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
  Upload, 
  Maximize, 
  ZoomIn, 
  Smile, 
  MapPin, 
  UserPlus, 
  ChevronRight, 
  ChevronDown, 
  Info,
  X,
  Image,
  Video,
  FileImage,
  Trash2,
  Edit3,
  Crop,
  Filter,
  Sliders,
  Check,
  AlertCircle,
  Camera
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Create() {
  const [activeTab, setActiveTab] = useState<'post' | 'reel'>('post');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [caption, setCaption] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [currentStep, setCurrentStep] = useState<'upload' | 'edit' | 'details'>('upload');
  const [selectedFilter, setSelectedFilter] = useState('original');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // Filters for images
  const filters = [
    { name: 'original', label: 'Original' },
    { name: 'clarendon', label: 'Clarendon' },
    { name: 'gingham', label: 'Gingham' },
    { name: 'moon', label: 'Moon' },
    { name: 'lark', label: 'Lark' },
    { name: 'reyes', label: 'Reyes' },
    { name: 'juno', label: 'Juno' },
    { name: 'slumber', label: 'Slumber' },
    { name: 'crema', label: 'Crema' },
    { name: 'ludwig', label: 'Ludwig' },
    { name: 'aden', label: 'Aden' },
    { name: 'perpetua', label: 'Perpetua' },
  ];

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    processFiles(files);
  };

  // Process files (images/videos)
  const processFiles = (files: File[]) => {
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') || file.type.startsWith('video/')
    );
    
    if (validFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...validFiles]);
      
      // Create preview URLs
      validFiles.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrls(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
      
      // Auto-advance to edit step if we have files
      if (selectedFiles.length === 0) {
        setCurrentStep('edit');
      }
    }
  };

  // Handle drag and drop
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
    
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  // Remove file
  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    
    if (selectedFiles.length === 1) {
      setCurrentStep('upload');
    }
  };

  // Handle share/post
  const handleShare = () => {
    setIsUploading(true);
    
    // Simulate upload
    setTimeout(() => {
      setIsUploading(false);
      // Show success message or redirect
      alert('Post shared successfully!');
    }, 2000);
  };

  // Get file icon based on type
  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="w-5 h-5" />;
    } else if (file.type.startsWith('video/')) {
      return <Video className="w-5 h-5" />;
    }
    return <FileImage className="w-5 h-5" />;
  };

  // Character count for caption
  const charCount = caption.length;
  const maxChars = 2200;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-2 sm:p-4 lg:p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700"
      >
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-3 sm:py-4 bg-white dark:bg-gray-800 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors lg:hidden">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-lg sm:text-xl font-bold">Create new post</h1>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Tab Switcher - Mobile */}
              <div className="flex sm:hidden bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab('post')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    activeTab === 'post' 
                      ? 'bg-white dark:bg-gray-800 text-primary shadow-sm' 
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  Post
                </button>
                <button
                  onClick={() => setActiveTab('reel')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    activeTab === 'reel' 
                      ? 'bg-white dark:bg-gray-800 text-primary shadow-sm' 
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  Reel
                </button>
              </div>

              {/* Tab Switcher - Desktop */}
              <div className="hidden sm:flex bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab('post')}
                  className={`px-4 sm:px-6 py-1.5 sm:py-2 text-sm font-medium rounded-md transition-all ${
                    activeTab === 'post' 
                      ? 'bg-white dark:bg-gray-800 text-primary shadow-sm' 
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Post
                </button>
                <button
                  onClick={() => setActiveTab('reel')}
                  className={`px-4 sm:px-6 py-1.5 sm:py-2 text-sm font-medium rounded-md transition-all ${
                    activeTab === 'reel' 
                      ? 'bg-white dark:bg-gray-800 text-primary shadow-sm' 
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Reel
                </button>
              </div>

              <button
                onClick={handleShare}
                disabled={selectedFiles.length === 0 || isUploading}
                className={`px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg font-bold text-sm transition-all ${
                  selectedFiles.length > 0 && !isUploading
                    ? 'bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                }`}
              >
                {isUploading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Sharing...</span>
                  </span>
                ) : (
                  'Share'
                )}
              </button>
            </div>
          </div>

          {/* Step Indicator */}
          {selectedFiles.length > 0 && (
            <div className="flex items-center justify-center gap-2 mt-3 sm:mt-4">
              {['upload', 'edit', 'details'].map((step, index) => (
                <div key={step} className="flex items-center">
                  <button
                    onClick={() => setCurrentStep(step as any)}
                    className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-all ${
                      currentStep === step
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {index + 1}
                  </button>
                  {index < 2 && (
                    <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 mx-1 text-gray-400" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row h-[calc(100vh-120px)] sm:h-[calc(100vh-140px)] overflow-hidden">
          {/* Left Side - Media Upload/Preview */}
          <div 
            ref={dropZoneRef}
            className={`flex-1 bg-gray-50 dark:bg-gray-900 overflow-y-auto relative transition-colors ${
              isDragging ? 'bg-primary/5 border-2 border-dashed border-primary' : ''
            }`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {/* Upload Step */}
            {currentStep === 'upload' && selectedFiles.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center p-4 sm:p-8">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center max-w-md"
                >
                  <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <Upload className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                  </div>
                  
                  <h2 className="text-xl sm:text-2xl font-bold mb-2">Drag and drop</h2>
                  <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-4 sm:mb-6">
                    Upload up to 10 photos and videos in a single post
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-primary text-white px-6 py-2.5 sm:px-8 sm:py-3 rounded-lg font-bold text-sm hover:bg-primary/90 transition-colors"
                    >
                      Select from computer
                    </button>
                    
                    <button className="border border-gray-300 dark:border-gray-600 px-6 py-2.5 sm:px-8 sm:py-3 rounded-lg font-bold text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <Camera className="w-4 h-4 inline mr-2" />
                      Take photo
                    </button>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  <p className="text-xs text-gray-400 mt-4">
                    Supported: JPG, PNG, GIF, MP4 (Max 100MB)
                  </p>
                </motion.div>
              </div>
            )}

            {/* Edit Step */}
            {currentStep === 'edit' && selectedFiles.length > 0 && (
              <div className="h-full flex flex-col p-4">
                {/* Main Preview */}
                <div className="flex-1 flex items-center justify-center bg-black/5 rounded-lg mb-4 relative">
                  <img 
                    src={previewUrls[0]} 
                    alt="Preview" 
                    className="max-h-full max-w-full object-contain rounded-lg"
                  />
                  
                  {/* Image Controls */}
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    <button className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors">
                      <Crop className="w-5 h-5" />
                    </button>
                    <button className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors">
                      <Sliders className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Filters */}
                <div className="mb-4">
                  <h3 className="text-sm font-medium mb-2 px-1">Filters</h3>
                  <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
                    {filters.map((filter) => (
                      <button
                        key={filter.name}
                        onClick={() => setSelectedFilter(filter.name)}
                        className={`flex-shrink-0 w-16 sm:w-20 text-center ${
                          selectedFilter === filter.name ? 'ring-2 ring-primary rounded-lg' : ''
                        }`}
                      >
                        <div className="aspect-square bg-gray-200 rounded-lg mb-1 overflow-hidden">
                          <img 
                            src={previewUrls[0]} 
                            alt={filter.label}
                            className={`w-full h-full object-cover filter-${filter.name}`}
                          />
                        </div>
                        <span className="text-xs">{filter.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Thumbnails */}
                {selectedFiles.length > 1 && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
                      {previewUrls.map((url, index) => (
                        <div key={index} className="relative flex-shrink-0">
                          <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-transparent hover:border-primary cursor-pointer">
                            <img src={url} alt="" className="w-full h-full object-cover" />
                          </div>
                          <button
                            onClick={() => removeFile(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          {index === 0 && (
                            <span className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] text-center py-0.5 rounded-b-lg">
                              Cover
                            </span>
                          )}
                        </div>
                      ))}
                      
                      {/* Add More Button */}
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-16 h-16 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center hover:border-primary transition-colors flex-shrink-0"
                      >
                        <Plus className="w-6 h-6 text-gray-400" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Details Step */}
            {currentStep === 'details' && selectedFiles.length > 0 && (
              <div className="h-full p-4 overflow-y-auto">
                <div className="space-y-4">
                  {/* Caption */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Caption</label>
                    <textarea
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      placeholder="Write a caption..."
                      className="w-full h-32 p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    />
                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                      <button className="hover:text-primary">
                        <Smile className="w-4 h-4" />
                      </button>
                      <span>{charCount}/{maxChars}</span>
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Location</label>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Add location"
                        className="flex-1 bg-transparent border-none focus:ring-0 p-0 text-sm"
                      />
                    </div>
                  </div>

                  {/* Tag People */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Tag people</label>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <UserPlus className="w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search for people"
                        className="flex-1 bg-transparent border-none focus:ring-0 p-0 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      onClick={() => setShowAdvanced(!showAdvanced)}
                      className="flex items-center justify-between w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                    >
                      <span className="text-sm font-medium">Advanced settings</span>
                      <ChevronDown className={`w-5 h-5 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                    </button>
                    
                    <AnimatePresence>
                      {showAdvanced && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3">
                            <label className="flex items-center gap-3">
                              <input type="checkbox" className="rounded text-primary" />
                              <span className="text-sm">Turn off commenting</span>
                            </label>
                            <label className="flex items-center gap-3">
                              <input type="checkbox" className="rounded text-primary" />
                              <span className="text-sm">Hide like and view counts</span>
                            </label>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                          Accessibility
                        </p>
                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                          Alt text describes your photos for people with visual impairments. 
                          Alt text will be automatically created for your photos.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <aside className="hidden lg:block w-80 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-y-auto">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 to-pink-600 p-[2px]">
                  <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 p-[2px]">
                    <img 
                      src="https://picsum.photos/seed/user/100/100" 
                      alt="User" 
                      className="w-full h-full rounded-full object-cover"
                      referrerPolicy="no-referrer" 
                    />
                  </div>
                </div>
                <div>
                  <p className="font-bold text-sm">alex_design_studio</p>
                  <p className="text-xs text-gray-500">@alex_designs</p>
                </div>
              </div>
            </div>

            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <Edit3 className="w-5 h-5 text-gray-400" />
                  <span className="text-sm">Write caption</span>
                </button>
                <button className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span className="text-sm">Add location</span>
                </button>
                <button className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <UserPlus className="w-5 h-5 text-gray-400" />
                  <span className="text-sm">Tag people</span>
                </button>
              </div>
            </div>

            <div className="p-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Recent Tags</h3>
              <div className="space-y-2">
                {['jessica_parker', 'travel_adventures', 'food_lover'].map((tag) => (
                  <div key={tag} className="flex items-center justify-between">
                    <span className="text-sm">{tag}</span>
                    <button className="text-xs text-primary">Tag</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-auto p-4 bg-gray-50 dark:bg-gray-700/50">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <AlertCircle className="w-4 h-4" />
                <p>Posts with locations get 79% more engagement</p>
              </div>
            </div>
          </aside>
        </div>

        {selectedFiles.length > 0 && (
          <div className="lg:hidden border-t border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img 
                  src={previewUrls[0]} 
                  alt="" 
                  className="w-10 h-10 rounded object-cover"
                />
                <div>
                  <p className="text-sm font-medium">{selectedFiles.length} item(s) selected</p>
                  <p className="text-xs text-gray-500">Ready to post</p>
                </div>
              </div>
              <button
                onClick={() => setCurrentStep(currentStep === 'upload' ? 'edit' : currentStep === 'edit' ? 'details' : 'edit')}
                className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                {currentStep === 'upload' && 'Edit'}
                {currentStep === 'edit' && 'Next'}
                {currentStep === 'details' && 'Back to edit'}
              </button>
            </div>
          </div>
        )}
      </motion.div>

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


function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}