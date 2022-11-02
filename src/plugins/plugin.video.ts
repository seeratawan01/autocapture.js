/**
 * Plugin to Detect video play, progress, and complete events as visitors view embedded videos on your site.
 * Scope:
 * - Video state
 * - Video percentage
 * - Video mute
 * - etc...
 * @internal
 * @extends PluginBuilder
 */
import { BaseOptions, BindResult } from '../../types'
import { PluginBuilder } from '../core'

export default class VideoPlugin extends PluginBuilder {
  override key: string = 'video'

  constructor() {
    super()
  }

  override bind(_: BaseOptions): BindResult[] {
    return [
      {
        name: 'video',
        target: document.getElementsByTagName('video'),
        event: 'load',
        callback: (event) => {
          return this.captureEvent(event)
        }
      }
    ]
  }

  /**
   * A function to capture the video events on your site.
   */
  private captureEvent(event: Event): Record<string, any> {
    const video = event.target as HTMLVideoElement

    return {
      details: {
        id: video.id,
        state: video.paused ? 'pause' : 'play',
        duration: video.duration,
        currentTime: video.currentTime,
        percent: video.currentTime / video.duration,
        volume: video.volume,
        muted: video.muted,
        playbackRate: video.playbackRate,
        buffered: video.buffered,
        ended: video.ended,
        paused: video.paused,
        played: video.played,
        readyState: video.readyState,
        seeking: video.seeking,
        src: video.src,
        videoHeight: video.videoHeight,
        videoWidth: video.videoWidth
      }
    }
  }
}
