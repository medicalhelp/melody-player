import { useState, useRef, useEffect } from "react";
import { Play, Pause } from "lucide-react";
import coverImage from "@/assets/cover.png";
import songFile from "@/assets/song.mp3";

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    const newTime = clickPosition * duration;
    
    audio.currentTime = newTime;
    setProgress(clickPosition * 100);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background px-8">
      <audio ref={audioRef} src={songFile} preload="metadata" />
      
      {/* Title */}
      <h1 className="text-4xl md:text-5xl italic text-foreground mb-16 animate-fade-in font-display">
        {isPlaying ? "Opening" : "Hej Brie :)"}
      </h1>

      {/* Cover Button */}
      <button
        onClick={togglePlay}
        className="cover-button w-48 h-48 md:w-56 md:h-56 flex items-center justify-center"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        <img
          src={coverImage}
          alt="Song cover"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-10 text-primary-foreground">
          {isPlaying ? (
            <Pause size={48} strokeWidth={2.5} fill="currentColor" />
          ) : (
            <Play size={48} strokeWidth={2.5} fill="currentColor" className="ml-1" />
          )}
        </div>
      </button>

      {/* Instruction or Progress */}
      <div className="mt-12 w-full max-w-xs h-7 flex items-center">
        {isPlaying ? (
          <div 
            className="progress-track cursor-pointer relative w-full"
            onClick={handleProgressClick}
          >
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }} 
            />
            <div 
              className="progress-thumb"
              style={{ left: `${progress}%` }}
            />
          </div>
        ) : (
          <p className="text-center text-muted-foreground italic text-lg font-display animate-fade-in w-full">
            Click to play
          </p>
        )}
      </div>
    </div>
  );
};

export default MusicPlayer;
