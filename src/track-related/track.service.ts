import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { UpdateTrackDto } from './dto/update-track.dto';
import { CreateTrackDto } from './dto/create-track.dto';
import {DBService} from "../db/db.service";

@Injectable()
export class TrackService {
    constructor(private readonly databaseService: DBService) {}

    async getTracks() {
        const trackDb = await this.databaseService.track.findMany();
        return trackDb;
    }

    async createTrack(trackDto: CreateTrackDto) {
        this.validateArtistAndAlbum(trackDto, 'create');

        const track = await this.databaseService.track.create({ data: trackDto });

        return track;
    }

    async getTrack(id: string) {
        const track = await this.databaseService.track.findUnique({
            where: { id },
        });
        if (!track) {
            throw new NotFoundException('This track does not exist'); // 404
        }

        return track;
    }

    async updateTrack(id: string, updateTrackDto: UpdateTrackDto) {
        const track = await this.databaseService.track.findUnique({
            where: { id },
        });
        if (!track) {
            throw new NotFoundException('This track does not exist'); // 404
        }

        this.validateArtistAndAlbum(updateTrackDto, 'update');

        const updatedTrack = await this.databaseService.track.update({
            where: { id },
            data: updateTrackDto,
        });

        return updatedTrack;
    }

    async deleteTrack(id: string) {
        const track = await this.databaseService.track.findUnique({
            where: { id },
        });
        if (!track) {
            throw new NotFoundException('This track does not exist'); // 404 !
        }
        await this.databaseService.track.delete({
            where: { id },
        });
    }

    private validateArtistAndAlbum(
        updateTrackDto: UpdateTrackDto,
        typeOperation: 'create' | 'update',
    ) {
        const { name, artistId, albumId, duration } = updateTrackDto;

        if (artistId && (typeof artistId !== 'string' || artistId.trim() === '')) {
            throw new BadRequestException('Artist ID must be a non-empty string'); //400
        }

        if (albumId && (typeof albumId !== 'string' || albumId.trim() === '')) {
            throw new BadRequestException('Album ID must be a non-empty string');
        }

        if (typeOperation === 'create') {
            if (typeof name !== 'string' || name.trim() === '') {
                throw new BadRequestException('Name must be a non-empty string');
            }

            if (typeof duration !== 'number' || isNaN(duration)) {
                throw new BadRequestException('Duration must be a number');
            }
        }

        if (typeOperation === 'update') {
            if (name && (typeof name !== 'string' || name.trim() === '')) {
                throw new BadRequestException('Name must be a non-empty string');
            }

            if (duration && (typeof duration !== 'number' || isNaN(duration))) {
                throw new BadRequestException('Duration must be a number');
            }
        }
    }
}