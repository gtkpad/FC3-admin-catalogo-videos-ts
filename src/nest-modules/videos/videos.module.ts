import { Module } from '@nestjs/common';
import { VideosController } from './videos.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { CategoriesModule } from '../categories/categories.module';
import { VIDEOS_PROVIDERS } from './videos.providers';
import {
  VideoCastMemberModel,
  VideoCategoryModel,
  VideoGenreModel,
  VideoModel,
} from '../../core/video/infra/repository/sequelize/video.model';
import { ImageMediaModel } from '../../core/video/infra/repository/sequelize/image-media.model';
import { AudioVideoMediaModel } from '../../core/video/infra/repository/sequelize/audio-video-media.model';
import { GenresModule } from '../genres/genres.module';
import { CastMembersModule } from '../cast-members/cast-members.module';
import { RabbitmqModule } from '../rabbitmq/rabbitmq.module';
import { VideosConsumers } from './videos.consumers';
// import { VideosConsumers } from './videos.consumers';

@Module({
  imports: [
    SequelizeModule.forFeature([
      VideoModel,
      VideoCategoryModel,
      VideoGenreModel,
      VideoCastMemberModel,
      ImageMediaModel,
      AudioVideoMediaModel,
    ]),
    RabbitmqModule.forFeature(),
    CategoriesModule,
    GenresModule,
    CastMembersModule,
  ],
  controllers: [VideosController],
  providers: [
    ...Object.values(VIDEOS_PROVIDERS.REPOSITORIES),
    ...Object.values(VIDEOS_PROVIDERS.USE_CASES),
    ...Object.values(VIDEOS_PROVIDERS.HANDLERS),
    VideosConsumers,
  ],
  //exports: [VIDEOS_PROVIDERS.REPOSITORIES.VIDEO_REPOSITORY.provide],
})
export class VideosModule {}
