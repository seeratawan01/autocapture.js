/**
 * Plugin to Detect video play, progress, and complete events as visitors view embedded videos on your site.
 * @internal
 * @extends PluginBuilder
 */
import { BaseOptions } from '../../types'
import { BindResult } from '../../types/plugin'
import { PluginBuilder } from '../core'

export default class VideoPlugin extends PluginBuilder {
  override key: string = 'video-internal'

  constructor() {
    super()
  }

  override bind(_: BaseOptions): BindResult[] {
    return [
      {
        name: 'video',
        target: window,
        type: 'load',
        handler: () => {
          return this.captureEvent()
        },
        options: {}
      }
    ]
  }

  /**
   * A function to capture the video events on your site.
   */
  private captureEvent(): Record<string, any> {
    const videos = document.getElementsByTagName('video')
    if (videos.length === 0) {
      return {}
    }
    const videoElements = Array.from(videos)
    const videoEvents = videoElements.map((video) => {
      return {
        currentTime: video.currentTime,
        duration: video.duration,
        ended: video.ended,
        paused: video.paused,
        played: video.played,
        readyState: video.readyState,
        seeking: video.seeking,
        src: video.src,
        videoHeight: video.videoHeight,
        videoWidth: video.videoWidth,
        volume: video.volume
      }
    })
    return {
      videoElements,
      videoEvents
    }
  }



}
