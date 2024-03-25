import { Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import {DBModule} from '../db/db.module';

@Module({
    imports: [DBModule],
    controllers: [AlbumController],
    providers: [AlbumService],
})
export class AlbumModule {}