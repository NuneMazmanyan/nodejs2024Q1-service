import {Injectable, NotFoundException, UnprocessableEntityException} from '@nestjs/common';
import * as fs from "fs";
import * as path from "path";
import {Favorite} from "./favorites.model";
import {Album} from "../albums-related/album.model";
import {Artist} from "../artists-related/artist.model";
import {Track} from "../track-related/track.model";
import {TrackService} from "../track-related/track.service";
import {ArtistService} from "../artists-related/artist.service";
import {AlbumService} from "../albums-related/album.service";
import {DBService} from "../db/db.service";

@Injectable()
export class FavoritesService {
    favorites: Favorite;
    albums: Album[] = [];
    artists: Artist[] = [];
    tracks: Track[] = [];
    favoritesDirPath: string = path.join(__dirname, 'favorites.json');

    constructor(private trackService: TrackService,
                private artistService: ArtistService,
                private albumService: AlbumService,
                private readonly databaseService: DBService,) {
        this.getFavorites().then((favs) => {
            this.favorites = favs;
        });
        trackService.getTracks().then((tracks) => {
            this.tracks = tracks || [];
        });
        artistService.getArtists().then((artists) => {
            this.artists = artists || [];
        });
        albumService.getAlbums().then((album) => {
            this.albums = album || [];
        });
    }


    public readFavs(): Favorite {
        try {
            const data = fs.readFileSync(this.favoritesDirPath, 'utf8');
            const fileContent: Favorite = JSON.parse(data);
            return fileContent;
        } catch (err) {
            throw new Error(`Error reading favorites: ${err}`);
        }
    }

    async getFavorites(): Promise<Favorite> {
        return this.readFavs();
    }

    addAlbum(id: string) {
        const index = this.albums.findIndex((album) => album.id === id);
        if (index === -1) {
            throw new UnprocessableEntityException();
        }
        this.favorites.albums.push(id);
        this.writeFile(JSON.stringify({favorites: this.favorites}), this.favoritesDirPath);
        return index;
    }

    addArtist(id: string) {
        const index = this.artists.findIndex((artist) => artist.id === id);
        if (index === -1) {
            throw new UnprocessableEntityException();
        }
        this.favorites.artists.push(id);
        this.writeFile(JSON.stringify({favorites: this.favorites}), this.favoritesDirPath);
        return index;
    }

    addTrack(id: string) {
        const index = this.tracks.findIndex((track) => track.id === id);
        if (index === -1) {
            throw new UnprocessableEntityException();
        }
        this.favorites.tracks.push(id);
        this.writeFile(JSON.stringify({favorites: this.favorites}), this.favoritesDirPath);
        return index;
    }

    deleteTrack(id: string) {
        const index = this.favorites.tracks.findIndex((e) => e === id);
        if (index === -1) {
            throw new NotFoundException('This track was not found in favorites');
        }
        this.favorites.tracks = this.favorites.tracks.filter(
            (track) => track !== id,
        );
        this.writeFile(JSON.stringify({favorites: this.favorites}), this.favoritesDirPath);
        return 'This track deleted';
    }


    deleteAlbum(id: string) {
        const index = this.favorites.albums.findIndex((e) => e === id);
        if (index === -1) {
            throw new NotFoundException('This album was not found in favorites');
        }
        this.favorites.albums = this.favorites.albums.filter(
            (album) => album !== id,
        );
        this.writeFile(JSON.stringify({favorites: this.favorites}), this.favoritesDirPath);
        return;
    }

    deleteArtist(id: string) {
        const index = this.favorites.artists.findIndex((e) => e === id);
        if (index === -1) {
            throw new NotFoundException('This track was not found in favorites');
        }
        this.favorites.artists = this.favorites.artists.filter(
            (artist) => artist !== id,
        );
        this.writeFile(JSON.stringify({favorites: this.favorites}), this.favoritesDirPath);
        return;
    }

    private writeFile(content: string, path: string) {
        fs.writeFile(path, content, (err) => {
            if (err) throw err;
        })
    }

}
