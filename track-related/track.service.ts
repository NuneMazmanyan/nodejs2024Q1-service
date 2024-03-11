import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import * as fs from "fs";
import * as path from "path";
import {v4 as uuidv4} from 'uuid';
import {Track} from "./track.model";
import {CreateTrackDto} from "./dto/create-track.dto";
import {UpdateTrackDto} from "./dto/update-track.dto";
import {ITypeOperation} from "../types";

@Injectable()
export class TrackService {
    tracks: Track[] = [];
    tracksDirPath: string = path.join(__dirname, 'track.json')

    constructor() {
        this.getTracks().then((tracks) => {
            this.tracks = tracks || [];
        });
    }

    private async readTracks() {
        let fileContent: Track[] = [];
        await fs.readFile(this.tracksDirPath, (err, data) => {
            if (err) throw err;
            fileContent.push(...JSON.parse(data.toString()).tracks)
        })
        return fileContent;
    }

    async getTracks(): Promise<Track[]> {
        return await this.readTracks();
    }

    getTrackById(id: string) {
        this.checkTrackId(id);
    }

    createTrack(trackDto: CreateTrackDto) {
        this.validateArtistAndAlbum(trackDto, ITypeOperation.create);

        const trackData = {
            id: uuidv4(),
            name: trackDto.name,
            duration: trackDto.duration,
            artistId: trackDto?.artistId || null,
            albumId: trackDto?.albumId || null,
        };
        this.tracks.push(trackData);
        this.writeFile(JSON.stringify({tracks: this.tracks}))
        return trackData;
    }

    updateTrack(id: string, updateTrackDto: UpdateTrackDto) {
        this.checkTrackId(id);
        this.validateArtistAndAlbum(updateTrackDto, ITypeOperation.update);

        const index = this.tracks.findIndex((track) => track.id === id);
        const updatedTrack = {...this.tracks[index], ...updateTrackDto};
        this.tracks[index] = updatedTrack;

        this.writeFile(JSON.stringify({tracks: this.tracks}))
        return updatedTrack;
    }

    deleteTrack(id: string): string {
        this.checkTrackId(id);
        this.tracks = this.tracks.filter(track => track.id !== id)
        this.writeFile(JSON.stringify({tracks: this.tracks}))
        return 'deleted successfully';
    }

    private writeFile(content: string) {
        fs.writeFile(this.tracksDirPath, content, (err) => {
            if (err) throw err;
        })
    }

    private checkTrackId(id: string) {
        const track = this.tracks.find((track) => track.id === id);
        if (!track) {
            throw new NotFoundException('track not exists');
        }

        return track;
    }

    private validateArtistAndAlbum(
        updateTrackDto: UpdateTrackDto,
        typeOperation: ITypeOperation,
    ) {
        const {name, artistId, albumId, duration} = updateTrackDto;

        if (artistId && (typeof artistId !== 'string' || artistId.trim() === '')) {
            throw new BadRequestException('Artist ID must be a non-empty string'); //400
        }

        if (albumId && (typeof albumId !== 'string' || albumId.trim() === '')) {
            throw new BadRequestException('Album ID must be a non-empty string');
        }

        if (typeOperation === ITypeOperation.create) {
            if (typeof name !== 'string' || name.trim() === '') {
                throw new BadRequestException('Name must be a non-empty string');
            }

            if (typeof duration !== 'number' || isNaN(duration)) {
                throw new BadRequestException('Duration must be a number');
            }
        }

        if (typeOperation === ITypeOperation.update) {
            if (name && (typeof name !== 'string' || name.trim() === '')) {
                throw new BadRequestException('Name must be a non-empty string');
            }

            if (duration && (typeof duration !== 'number' || isNaN(duration))) {
                throw new BadRequestException('Duration must be a number');
            }
        }
    }
}
