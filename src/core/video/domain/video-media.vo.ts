import {
  AudioVideoMedia,
  AudioVideoMediaStatus,
} from 'core/shared/domain/value-objects/audio-video-media.vo';
import { VideoId } from './video.aggregate';
import { Either } from 'core/shared/domain/either';
import { MediaFileValidator } from 'core/shared/domain/validators/media-file.validator';

export class VideoMedia extends AudioVideoMedia {
  static max_size = 1024 * 1024 * 1024 * 50; // 50GB;
  static mime_types = ['video/mp4'];

  static createFromFile({
    raw_name,
    mime_type,
    size,
    video_id,
  }: {
    raw_name: string;
    mime_type: string;
    video_id: VideoId;
    size: number;
  }) {
    const validator = new MediaFileValidator(
      VideoMedia.max_size,
      VideoMedia.mime_types,
    );

    return Either.safe(() => {
      const { name } = validator.validate({ raw_name, mime_type, size });

      return VideoMedia.create({
        name: `${video_id.id}-${name}`,
        raw_location: `videos/${video_id.id}/videos`,
      });
    });
  }

  static create({ name, raw_location }) {
    return new VideoMedia({
      name,
      raw_location,
      status: AudioVideoMediaStatus.PENDING,
    });
  }

  process() {
    return new VideoMedia({
      name: this.name,
      raw_location: this.raw_location,
      encoded_location: this.encoded_location!,
      status: AudioVideoMediaStatus.PROCESSING,
    });
  }

  complete(encoded_location: string) {
    return new VideoMedia({
      name: this.name,
      raw_location: this.raw_location,
      encoded_location,
      status: AudioVideoMediaStatus.COMPLETED,
    });
  }

  fail() {
    return new VideoMedia({
      name: this.name,
      raw_location: this.raw_location,
      encoded_location: this.encoded_location!,
      status: AudioVideoMediaStatus.FAILED,
    });
  }
}
