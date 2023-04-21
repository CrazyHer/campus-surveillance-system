import { useRef, type FC, useEffect } from 'react';
import Styles from './index.module.less';
import constants from '@/constants';
import HLS from 'hls.js';

const HlsPlayer: FC<{
  item: {
    cameraName: string;
    cameraID: number;
    cameraStatus: string;
    hlsUrl: string;
  };
  className?: string;
}> = ({ item, className }) => {
  const videosRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const videoRef = videosRef.current;
    if (videoRef && item.cameraStatus !== constants.cameraStatus.OFFLINE) {
      if (videoRef.canPlayType('application/vnd.apple.mpegurl').length > 0) {
        videoRef.src = item.hlsUrl;
      } else if (HLS.isSupported()) {
        const hlsPlayer = new HLS(constants.HLS_LOWLATENCY_OPTION);
        hlsPlayer.loadSource(item.hlsUrl);
        hlsPlayer.attachMedia(videoRef);
        return () => {
          hlsPlayer.detachMedia();
          hlsPlayer.destroy();
        };
      } else {
        videoRef.innerText = '您的浏览器不支持查看摄像头视频';
      }
    }
  }, [item.hlsUrl, item.cameraStatus]);

  return (
    <video
      key={item.cameraID}
      className={className ? className + ' ' + Styles.player : Styles.player}
      controls
      muted
      autoPlay={item.cameraStatus !== constants.cameraStatus.OFFLINE}
      ref={videosRef}
    />
  );
};

export default HlsPlayer;
