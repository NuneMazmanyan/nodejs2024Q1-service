import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import * as fs from "fs";
import * as path from "path";
import {v4 as uuidv4} from 'uuid';
import {Album} from "./album.model";
import {CreateAlbumDto} from "./dto/create-album.dto";

@Injectable()
export class AlbumService {
    albums: Album[] = [];
    albumsDirPath: string = path.join(__dirname, 'album.json')

    constructor() {
        this.getAlbums().then((albums) => {
            this.albums = albums || [];
        });
    }

    private async readAlbums() {
        let fileContent: Album[] = [];
        await fs.readFile(this.albumsDirPath, (err, data) => {
            if (err) throw err;
            fileContent.push(...JSON.parse(data.toString()).albums)
        })
        return fileContent;
    }

    async getAlbums(): Promise<Album[]> {
        return await this.readAlbums();
    }

    getAlbumById(id: string) {
        this.checkAlbumId(id);
    }

    createAlbum(albumDto: CreateAlbumDto) {
        this.validateAlbumCreate(albumDto);

        const validatedArtistId =
            albumDto.artistId && this.albums.find((album) => album.id === albumDto.artistId)
                ? albumDto.artistId
                : null;

        const albumData = {
            id: uuidv4(),
            name: albumDto.name,
            year: albumDto.year,
            artistId: validatedArtistId,
        };
        this.albums.push(albumData);
        this.writeFile(JSON.stringify({albums: this.albums}));
        return albumData;
    }

    updateAlbum(id: string, updateAlbumDto: CreateAlbumDto) {
        this.checkAlbumId(id);
        this.validateAlbumCreate(updateAlbumDto);

        const index = this.albums.findIndex((album) => album.id === id);
        const album = this.albums[index];
        const validatedArtistId =
            updateAlbumDto.artistId &&
            this.albums.find((a) => a.id === updateAlbumDto.artistId)
                ? updateAlbumDto.artistId
                : null;
        const newAlbumData = {
            id: album.id,
            name: updateAlbumDto.name || album.name,
            year: updateAlbumDto.year || album.year,
            artistId: validatedArtistId,
        };

        this.albums[index] = newAlbumData;
        this.writeFile(JSON.stringify({albums: this.albums}))
        return newAlbumData;
    }

    deleteAlbum(id: string): string {
        this.checkAlbumId(id);
        this.albums = this.albums.filter(track => track.id !== id)
        this.writeFile(JSON.stringify({albums: this.albums}))
        return 'deleted successfully';
    }

    private writeFile(content: string) {
        fs.writeFile(this.albumsDirPath, content, (err) => {
            if (err) throw err;
        })
    }

    private checkAlbumId(id: string) {
        const album = this.albums.find((album) => album.id === id);
        if (!album) {
            throw new NotFoundException('album not exists');
        }

        return album;
    }

    private validateAlbumCreate(albumDto: CreateAlbumDto) {
        const { name, artistId, year } = albumDto;

        if (!albumDto || typeof name !== 'string' || typeof year !== 'number') {
            throw new BadRequestException('New album invalid');
        }

        if (typeof artistId !== 'string' && artistId !== null) {
            throw new BadRequestException('Artist for new album invalid');
        }
    }
}
