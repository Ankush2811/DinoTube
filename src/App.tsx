import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type PointerEvent,
  type TouchEvent,
  type WheelEvent,
} from "react";
import "./App.css";
import { allVideos, categoryGroups, type VideoItem } from "./data/videos";

type PlayerMode = "hidden" | "full" | "mini";

declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds)) return "0:00";
  const clamped = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(clamped / 60);
  const secs = clamped % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const getYouTubeId = (url: string, fallback: string) => {
  if (url.includes("embed/")) {
    const id = url.split("embed/")[1]?.split(/[?&]/)[0];
    if (id) return id;
  }
  if (url.includes("watch?v=")) {
    const id = url.split("watch?v=")[1]?.split(/[?&]/)[0];
    if (id) return id;
  }
  if (url.includes("youtu.be/")) {
    const id = url.split("youtu.be/")[1]?.split(/[?&]/)[0];
    if (id) return id;
  }
  return fallback;
};

function App() {
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [playerMode, setPlayerMode] = useState<PlayerMode>("hidden");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [relatedOpen, setRelatedOpen] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [skipIndicator, setSkipIndicator] = useState<string | null>(null);
  const [nextCountdown, setNextCountdown] = useState<{
    seconds: number;
    nextVideo: VideoItem;
  } | null>(null);
  const [visibleCategoryCount, setVisibleCategoryCount] = useState(2);
  const [pipSupported, setPipSupported] = useState(false);
  const [isPiP, setIsPiP] = useState(false);
  const [ytReady, setYtReady] = useState(false);
  const [ytLoaded, setYtLoaded] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const ytPlayerRef = useRef<any>(null);
  const ytWrapperRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const dragStartY = useRef(0);
  const touchStartY = useRef(0);

  const isYouTube = Boolean(activeVideo?.mediaType === "YOUTUBE");
  const ytControlsDisabled = isYouTube && !ytLoaded;

  const relatedVideos = useMemo(() => {
    if (!activeVideo) return [];
    return allVideos.filter(
      (video) => video.category.slug === activeVideo.category.slug,
    );
  }, [activeVideo]);

  useEffect(() => {
    if (playerMode === "full") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [playerMode]);

  useEffect(() => {
    if (!activeVideo) return;
    if (!isYouTube) {
      const video = videoRef.current;
      if (!video) return;
      video.currentTime = 0;
      const playPromise = video.play();
      if (playPromise) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      }
    }
  }, [activeVideo, isYouTube]);

  useEffect(() => {
    if (!nextCountdown) return;
    if (nextCountdown.seconds <= 0) {
      playVideo(nextCountdown.nextVideo);
      setNextCountdown(null);
      return;
    }
    const timeout = window.setTimeout(() => {
      setNextCountdown((prev) =>
        prev ? { ...prev, seconds: prev.seconds - 1 } : prev,
      );
    }, 1000);
    return () => window.clearTimeout(timeout);
  }, [nextCountdown]);

  useEffect(() => {
    if (window.YT?.Player) {
      setYtReady(true);
      return;
    }
    const existing = document.querySelector("script[data-yt-api]");
    if (existing) {
      (window as Window & {
        onYouTubeIframeAPIReady?: () => void;
      }).onYouTubeIframeAPIReady = () => setYtReady(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    script.dataset.ytApi = "true";
    document.body.appendChild(script);
    (window as Window & {
      onYouTubeIframeAPIReady?: () => void;
    }).onYouTubeIframeAPIReady = () => setYtReady(true);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        setVisibleCategoryCount((prev) =>
          Math.min(prev + 1, categoryGroups.length),
        );
      },
      { rootMargin: "200px" },
    );
    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isYouTube) {
      setPipSupported(false);
      return;
    }
    const video = videoRef.current;
    if (!video) return;
    const supported =
      "pictureInPictureEnabled" in document &&
      Boolean((document as Document & { pictureInPictureEnabled?: boolean })
        .pictureInPictureEnabled);
    setPipSupported(supported);

    const handleEnter = () => setIsPiP(true);
    const handleLeave = () => setIsPiP(false);
    video.addEventListener("enterpictureinpicture", handleEnter);
    video.addEventListener("leavepictureinpicture", handleLeave);
    return () => {
      video.removeEventListener("enterpictureinpicture", handleEnter);
      video.removeEventListener("leavepictureinpicture", handleLeave);
    };
  }, [activeVideo, isYouTube]);

  useEffect(() => {
    if (!activeVideo || !isYouTube || !ytReady) return;
    const wrapper = ytWrapperRef.current;
    if (!wrapper || !window.YT?.Player) return;
    ytPlayerRef.current?.destroy?.();
    wrapper.innerHTML = "";
    const mount = document.createElement("div");
    wrapper.appendChild(mount);
    const videoId = getYouTubeId(activeVideo.mediaUrl, activeVideo.slug);
    ytPlayerRef.current = new window.YT.Player(mount, {
      videoId,
      playerVars: {
        autoplay: 1,
        controls: 0,
        rel: 0,
        modestbranding: 1,
        playsinline: 1,
        iv_load_policy: 3,
        origin: window.location.origin,
      },
      events: {
        onReady: () => {
          setDuration(ytPlayerRef.current?.getDuration?.() || 0);
          setCurrentTime(0);
          ytPlayerRef.current?.playVideo?.();
          setIsPlaying(true);
          setYtLoaded(true);
        },
        onStateChange: (event: { data: number }) => {
          if (event.data === window.YT.PlayerState.PLAYING) {
            setIsPlaying(true);
            setYtLoaded(true);
          }
          if (event.data === window.YT.PlayerState.PAUSED) {
            setIsPlaying(false);
          }
          if (event.data === window.YT.PlayerState.ENDED) {
            setIsPlaying(false);
            handleVideoEnded();
          }
        },
      },
    });
  }, [activeVideo, isYouTube, ytReady]);

  useEffect(() => {
    if (!isYouTube || !ytPlayerRef.current) return;
    const interval = window.setInterval(() => {
      const player = ytPlayerRef.current;
      if (!player?.getCurrentTime) return;
      const time = player.getCurrentTime();
      const total = player.getDuration?.() || duration;
      setCurrentTime(time);
      if (total) setDuration(total);
    }, 500);
    return () => window.clearInterval(interval);
  }, [isYouTube, duration, activeVideo]);

  const playVideo = (video: VideoItem) => {
    setActiveVideo(video);
    setPlayerMode("full");
    setRelatedOpen(false);
    setCurrentTime(0);
    setDuration(0);
    setYtLoaded(false);
    setNextCountdown(null);
  };

  const closePlayer = () => {
    setPlayerMode("hidden");
    setRelatedOpen(false);
    setNextCountdown(null);
    window.setTimeout(() => setActiveVideo(null), 220);
  };

  const togglePlay = () => {
    if (isYouTube && ytPlayerRef.current && ytLoaded) {
      if (isPlaying) {
        ytPlayerRef.current.pauseVideo?.();
        setIsPlaying(false);
      } else {
        ytPlayerRef.current.playVideo?.();
        setIsPlaying(true);
      }
      return;
    }
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const skipBy = (amount: number) => {
    if (isYouTube && ytPlayerRef.current && ytLoaded) {
      const current = ytPlayerRef.current.getCurrentTime?.() || 0;
      const total =
        ytPlayerRef.current.getDuration?.() ||
        duration ||
        activeVideo?.durationSeconds ||
        0;
      if (!total) return;
      const nextTime = Math.min(Math.max(0, current + amount), total);
      try {
        ytPlayerRef.current.seekTo?.(nextTime, true);
      } catch {
        return;
      }
      setCurrentTime(nextTime);
      setSkipIndicator(amount > 0 ? "+10s" : "-10s");
      window.setTimeout(() => setSkipIndicator(null), 450);
      return;
    }
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.min(
      Math.max(0, video.currentTime + amount),
      duration || activeVideo?.durationSeconds || 0,
    );
    setSkipIndicator(amount > 0 ? "+10s" : "-10s");
    window.setTimeout(() => setSkipIndicator(null), 450);
  };

  const handleSeek = (value: number) => {
    if (isYouTube && ytPlayerRef.current && ytLoaded) {
      try {
        ytPlayerRef.current.seekTo?.(value, true);
        setCurrentTime(value);
      } catch {
        return;
      }
      return;
    }
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = value;
    setCurrentTime(value);
  };

  const handlePlayerPointerDown = (
    event: PointerEvent<HTMLDivElement>,
  ) => {
    if (playerMode !== "full") return;
    const target = event.target as HTMLElement;
    if (target.closest("[data-no-drag]")) return;
    setIsDragging(true);
    dragStartY.current = event.clientY;
  };

  const handlePlayerPointerMove = (
    event: PointerEvent<HTMLDivElement>,
  ) => {
    if (!isDragging) return;
    const delta = event.clientY - dragStartY.current;
    setDragOffset(Math.max(0, delta));
  };

  const handlePlayerPointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragOffset > window.innerHeight * 0.22) {
      setPlayerMode("mini");
      setRelatedOpen(false);
    }
    setDragOffset(0);
  };

  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    if (playerMode !== "full") return;
    if (event.deltaY > 20 && !relatedOpen) setRelatedOpen(true);
    if (event.deltaY < -20 && relatedOpen) setRelatedOpen(false);
  };

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartY.current = event.touches[0]?.clientY ?? 0;
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const endY = event.changedTouches[0]?.clientY ?? 0;
    const delta = touchStartY.current - endY;
    if (delta > 50) setRelatedOpen(true);
    if (delta < -50) setRelatedOpen(false);
  };

  const handleVideoEnded = () => {
    if (!activeVideo || relatedVideos.length < 2) return;
    const currentIndex = relatedVideos.findIndex(
      (video) => video.id === activeVideo.id,
    );
    const nextVideo =
      relatedVideos[(currentIndex + 1) % relatedVideos.length];
    setNextCountdown({ seconds: 2, nextVideo });
  };

  const handleMiniRestore = () => {
    setPlayerMode("full");
  };

  const handleMiniClose = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    closePlayer();
  };

  const handleMiniToggle = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    togglePlay();
  };

  const handleTogglePiP = async () => {
    const video = videoRef.current;
    if (!video || !pipSupported) return;
    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture();
    } else {
      await video.requestPictureInPicture();
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-brand">
          <span className="app-dot" />
          DinoTube
        </div>
      </header>

      <main className="feed">
        {categoryGroups.slice(0, visibleCategoryCount).map((group) => (
          <section className="category-section" key={group.category.slug}>
            <div className="category-header">
              <img
                src={group.category.iconUrl}
                alt={group.category.name}
                className="category-icon"
              />
              <div>
                <h2>{group.category.name}</h2>
                <span className="category-count">
                  {group.contents.length} videos
                </span>
              </div>
            </div>
            <div className="video-row">
              {group.contents.map((video) => (
                <button
                  key={video.id}
                  className="video-card"
                  onClick={() => playVideo(video)}
                  type="button"
                >
                  <div className="video-thumb">
                    <img src={video.thumbnailUrl} alt={video.title} />
                    <span className="video-duration">
                      {formatTime(video.durationSeconds)}
                    </span>
                    <span className="video-badge">
                      {group.category.name}
                    </span>
                  </div>
                  <div className="video-title">{video.title}</div>
                </button>
              ))}
            </div>
          </section>
        ))}
        {visibleCategoryCount < categoryGroups.length && (
          <div className="feed-sentinel" ref={sentinelRef}>
            Loading more categories…
          </div>
        )}
      </main>

      {activeVideo && (
        <div
          className={`player-shell ${playerMode} ${
            isDragging ? "is-dragging" : ""
          }`}
          onPointerDown={handlePlayerPointerDown}
          onPointerMove={handlePlayerPointerMove}
          onPointerUp={handlePlayerPointerUp}
          onPointerCancel={handlePlayerPointerUp}
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="player"
            style={
              {
                ["--drag-offset" as string]: `${dragOffset}px`,
              } as CSSProperties
            }
          >
            <div className="player-video">
              {skipIndicator && (
                <div className="skip-indicator">{skipIndicator}</div>
              )}
              {nextCountdown && playerMode === "full" && (
                <div className="next-overlay" data-no-drag>
                  <div>
                    Playing next in {nextCountdown.seconds}s
                  </div>
                  <button
                    type="button"
                    onClick={() => setNextCountdown(null)}
                  >
                    Cancel
                  </button>
                </div>
              )}
              {isYouTube ? (
                <div ref={ytWrapperRef} className="yt-frame" data-no-drag />
              ) : (
                <video
                  ref={videoRef}
                  src={activeVideo.playbackUrl}
                  onTimeUpdate={(event) =>
                    setCurrentTime(event.currentTarget.currentTime)
                  }
                  onLoadedMetadata={(event) =>
                    setDuration(event.currentTarget.duration)
                  }
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={handleVideoEnded}
                  playsInline
                />
              )}
            </div>

            <div className="player-meta">
              <div>
                <div className="player-title">{activeVideo.title}</div>
                <div className="player-category">
                  {activeVideo.category.name}
                </div>
              </div>
              {playerMode === "full" && (
                <button
                  type="button"
                  className="player-close"
                  onClick={closePlayer}
                  data-no-drag
                >
                  Close
                </button>
              )}
            </div>

            <div className="player-controls" data-no-drag>
              <button
                type="button"
                onClick={() => skipBy(-10)}
                disabled={ytControlsDisabled}
              >
                -10s
              </button>
              <button
                type="button"
                onClick={togglePlay}
                disabled={ytControlsDisabled}
              >
                {isPlaying ? "Pause" : "Play"}
              </button>
              <button
                type="button"
                onClick={() => skipBy(10)}
                disabled={ytControlsDisabled}
              >
                +10s
              </button>
              {pipSupported && (
                <button type="button" onClick={handleTogglePiP}>
                  {isPiP ? "Exit PiP" : "PiP"}
                </button>
              )}
            </div>

            {playerMode === "full" && (
              <div className="player-progress" data-no-drag>
                <span>{formatTime(currentTime)}</span>
                <input
                  type="range"
                  min={0}
                  max={duration || activeVideo.durationSeconds}
                  value={currentTime}
                  onChange={(event) =>
                    handleSeek(Number(event.target.value))
                  }
                />
                <span>
                  {formatTime(duration || activeVideo.durationSeconds)}
                </span>
              </div>
            )}

            {playerMode === "full" && (
              <div
                className={`player-sheet ${relatedOpen ? "is-open" : ""}`}
                data-no-drag
              >
                <div className="sheet-handle" />
                <div className="sheet-header">
                  Related in {activeVideo.category.name}
                </div>
                <div className="sheet-list">
                  {relatedVideos.map((video) => (
                    <button
                      key={video.id}
                      className={`sheet-item ${
                        video.id === activeVideo.id ? "is-active" : ""
                      }`}
                      onClick={() => playVideo(video)}
                      type="button"
                    >
                      <img src={video.thumbnailUrl} alt={video.title} />
                      <div>
                        <div className="sheet-title">{video.title}</div>
                        <div className="sheet-time">
                          {formatTime(video.durationSeconds)}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {playerMode === "mini" && (
            <div className="mini-overlay" onClick={handleMiniRestore}>
              <div className="mini-title">{activeVideo.title}</div>
              <div className="mini-controls">
                <button type="button" onClick={handleMiniToggle}>
                  {isPlaying ? "Pause" : "Play"}
                </button>
                <button type="button" onClick={handleMiniClose}>
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
