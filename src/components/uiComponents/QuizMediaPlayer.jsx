import React, { useState } from "react";
import YouTube from "react-youtube";
import "../../style/uiComponents/QuizMediaPlayer.scss";

const extractYouTubeId = (url) => {
  const regExp =
    /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[1].length === 11 ? match[1] : null;
};

const QuizMediaPlayer = ({ mediaUrl, onMediaLoaded, showLoading }) => {
  const [url, format] = mediaUrl.split(", ");
  const isYouTube = url.includes("youtube.com") || url.includes("youtu.be");
  const youtubeId = extractYouTubeId(url);
  const [isReady, setIsReady] = useState(false);

  const handleReady = () => {
    setIsReady(true);
    onMediaLoaded();
  };

  return (
    <div className="media-container">
      {showLoading && !isReady && (
        <div className="media-loading">
          <div className="loading-spinner"></div>
        </div>
      )}

      {isYouTube && format === "mp3" && youtubeId && (
        <div style={{ display: "none" }}>
          <YouTube
            videoId={youtubeId}
            opts={{
              width: "0",
              height: "0",
              playerVars: {
                autoplay: 1,
                controls: 0,
                modestbranding: 1,
              },
            }}
            onReady={handleReady}
          />
        </div>
      )}

      {isYouTube && format !== "mp3" && youtubeId && (
        <>
          <YouTube
            videoId={youtubeId}
            opts={{
              width: "100%",
              height: "400",
              playerVars: {
                autoplay: 1,
                modestbranding: 1,
              },
            }}
            onReady={handleReady}
          />
          <div className="hover-shape" />
        </>
      )}

      {!isYouTube && (
        <video 
          controls 
          autoPlay 
          muted 
          className="question-media"
          onCanPlay={handleReady}
          onLoadedData={handleReady}
        >
          <source src={url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
};

export default QuizMediaPlayer;