import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import * as fs from "fs";
import * as path from "path";
import { v4 as uuidv4 } from 'uuid';
import {Artist} from "./artist.model";
import {CreateArtistDto} from "./dto/create-artist.dto";
import {UpdateArtistDto} from "./dto/update-artist.dto";

@Injectable()
export class ArtistService {
    artists: Artist[] = [];
    artistsDirPath: string = path.join(__dirname, 'artist.json')

    constructor() {
        this.getArtists().then((artists) => {
            this.artists = artists || [];
        });
    }

    private async readArtists() {
        let fileContent: Artist[] = [];
        await fs.readFile(this.artistsDirPath, (err, data) => {
            if (err) throw err;
            fileContent.push(...JSON.parse(data.toString()).artists)
        })
        return fileContent;
    }

    async getArtists(): Promise<Artist[]> {
        return await this.readArtists();
    }

    getArtistById(id: string) {
        this.checkArtistId(id);
    }

    createArtist(artistDto: CreateArtistDto) {
        this.validateNameAndGrammy(artistDto);

        const artistData = {
            id: uuidv4(),
            name: artistDto.name,
            grammy: artistDto.grammy,
        };
        this.artists.push(artistData);
        this.writeFile(JSON.stringify({artists: this.artists}))
        return artistData;
    }

    updateArtist(id: string, updateArtistDto: UpdateArtistDto) {
        this.checkArtistId(id);
        this.validateUpdateArtist(updateArtistDto);

        const index = this.artists.findIndex((artist) => artist.id === id);
        const artist = this.artists.find((artist) => artist.id === id);

        const newArtistData = {
            ...artist,
            name: updateArtistDto.name,
            grammy: updateArtistDto.grammy,
        };
        try {
            this.artists[index] = newArtistData;
            this.writeFile(JSON.stringify({artists: this.artists}))
            return newArtistData;
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    private validateNameAndGrammy(createArtistDto: CreateArtistDto) {
        const {name, grammy} = createArtistDto;

        if (!(name && grammy)) {
            throw new BadRequestException('Artist data is invalid');
        }
    }

    private validateUpdateArtist(updateArtistDto: UpdateArtistDto) {
        const {name, grammy} = updateArtistDto;

        if (
            (!name && !grammy) ||
            (name && typeof name !== 'string') ||
            (grammy && typeof grammy !== 'boolean')
        ) {
            throw new BadRequestException('Artist data is invalid');
        }
    }


    deleteArtist(id: string): string {
        this.checkArtistId(id);
        this.artists = this.artists.filter(artist => artist.id !== id)
        this.writeFile(JSON.stringify({artists: this.artists}))
        return 'deleted successfully';
    }

    private writeFile(content: string) {
        fs.writeFile(this.artistsDirPath, content, (err) => {
            if (err) throw err;
        })
    }

    private checkArtistId(id: string) {
        const artist = this.artists.find((artist) => artist.id === id);
        if (!artist) {
            throw new NotFoundException('Artist not exists');
        }

        return artist;
    }
}
