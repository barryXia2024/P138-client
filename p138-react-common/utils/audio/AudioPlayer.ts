import {message} from 'antd';
import {getFileFromOss, judgeFileIsOss} from '../upload/rn-upload';

// 音频播放单例类
class AudioPlayer {
  private static instance: AudioPlayer;
  private audio: HTMLAudioElement | null = null;
  private currentId: string | null = null;
  private onPlayEnd: (() => void) | null = null;

  private constructor() {}

  public static getInstance(): AudioPlayer {
    if (!AudioPlayer.instance) {
      AudioPlayer.instance = new AudioPlayer();
    }
    return AudioPlayer.instance;
  }

  public async play(
    url: string,
    id: string,
    onEnd: (() => void) | null = null,
  ) {
    // 如果正在播放的是当前音频，则停止播放
    if (this.currentId === id) {
      this.stop();
      return;
    }

    // 如果正在播放其他音频，先停止
    this.stop();

    // 播放新的音频
    try {
      let audioSrc = url;
      if (judgeFileIsOss(audioSrc)) {
        try {
          audioSrc = await getFileFromOss(audioSrc);
        } catch (error) {
          console.error('获取音频文件失败:', error);
          message.error('获取音频文件失败');
          return;
        }
      }

      this.audio = new Audio(audioSrc);
      this.currentId = id;
      this.onPlayEnd = onEnd;

      this.audio.onended = () => {
        this.stop();
      };

      this.audio.onerror = error => {
        message.error('播放失败：' + error);
        this.stop();
      };

      await this.audio.play();
    } catch (error) {
      message.error('播放失败：' + (error as Error).message);
      this.stop();
    }
  }

  public stop() {
    if (this.audio) {
      this.audio.pause();
      this.audio = null;
    }
    if (this.onPlayEnd) {
      this.onPlayEnd();
      this.onPlayEnd = null;
    }
    this.currentId = null;
  }

  public isPlaying(id: string): boolean {
    return this.currentId === id;
  }
}

export default AudioPlayer;