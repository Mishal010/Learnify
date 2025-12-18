import React, { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "videojs-contrib-quality-levels";
import "videojs-http-source-selector";

const VideoJS = ({
  onReady,
  videoUrl,
  lectureTitle,
  courseData,
  instructor,
}) => {
  const playerRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current) return;

    // Merge provided options with defaults
    const playerOptions = {
      controls: true,
      autoplay: false,
      preload: "auto",
      responsive: true,
      fluid: true,
      playbackRates: [0.5, 1, 1.5, 2],
      controlBar: {
        children: [
          "playToggle",
          "volumePanel",
          "currentTimeDisplay",
          "timeDivider",
          "durationDisplay",
          "progressControl",
          "playbackRateMenuButton",
          "fullscreenToggle",
        ],
      },
    };

    const videoElement = document.createElement("video-js");
    videoElement.classList.add("vjs-big-play-centered");
    videoRef.current.appendChild(videoElement);

    const player = (playerRef.current = videojs(
      videoElement,
      playerOptions,
      () => {
        videojs.log("player is ready");
        onReady && onReady(player);
      }
    ));

    player.ready(() => {
      // Enable keyboard controls
      player.controls(true);
      player.userActive(false);

      // Set video source with support for m3u8 (HLS)
      if (videoUrl) {
        const sourceType = "application/x-mpegURL";

        player.src({
          src: videoUrl,
          type: sourceType,
        });
      }

      // Enable HTTP source selector if available
      if (typeof player.httpSourceSelector === "function") {
        player.httpSourceSelector({
          default: "auto",
        });
      }
    });

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [videoUrl, onReady]);

  return (
    <div className="video-player-wrapper">
      <div data-vjs-player>
        <div ref={videoRef} />
      </div>
    </div>
  );
};

export default VideoJS;
