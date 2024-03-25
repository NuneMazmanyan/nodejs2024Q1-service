import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import {DBService} from "../db/db.service";

@Injectable()
export class ArtistService {
    constructor(private readonly databaseService: DBService) {}

    async getArtists() {
        const artist = await this.databaseService.artist.findMany();
        return artist;
    }

    async createArtist(artistDto: CreateArtistDto) {
        this.validateNameAndGrammy(artistDto);

        const artist = await this.databaseService.artist.create({
            data: artistDto,
        });

        return artist;
    }

    async getArtist(id: string) {
        const artist = await this.databaseService.artist.findUnique({
            where: { id },
        });
        if (!artist) {
            throw new NotFoundException('This artist does not exist'); // 404
        }

        return artist;
    }

    async updateArtist(id: string, updateArtistDto: UpdateArtistDto) {
        const artist = await this.databaseService.artist.findUnique({
            where: { id },
        });
        if (!artist) {
            throw new NotFoundException('This artist does not exist'); // 404
        }

        this.validateUpdateArtist(updateArtistDto);

        const updatedArtist = await this.databaseService.artist.update({
            where: { id },
            data: updateArtistDto,
        });

        return updatedArtist;
    }

    async deleteArtist(id: string) {
        const artist = await this.databaseService.artist.findUnique({
            where: { id },
        });
        if (!artist) {
            throw new NotFoundException('This artist does not exist'); // 404
        }

        await this.databaseService.album.updateMany({
            where: { artistId: id },
            data: { artistId: null },
        });

        await this.databaseService.track.updateMany({
            where: { artistId: id },
            data: { artistId: null },
        });

        await this.databaseService.artist.delete({
            where: { id },
        });
        return 'The record is found and deleted';
    }

    private validateNameAndGrammy(createArtistDto: CreateArtistDto) {
        const { name, grammy } = createArtistDto;

        if (!(name && grammy)) {
            throw new BadRequestException('Artist data is invalide'); //400
        }
    }

    private validateUpdateArtist(updateArtistDto: UpdateArtistDto) {
        const { name, grammy } = updateArtistDto;

        if (
            (!name && !grammy) ||
            (name && typeof name !== 'string') ||
            (grammy && typeof grammy !== 'boolean')
        ) {
            throw new BadRequestException('Artist data is invalide');
        }
    }
}