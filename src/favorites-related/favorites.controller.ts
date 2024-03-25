import {
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    ParseUUIDPipe,
    Post,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';

@Controller('favs')
export class FavoritesController {
    constructor(private readonly FavoritesServ: FavoritesService) {}

    @Get()
    getFavorites() {
        return this.FavoritesServ.getFavorites();
    }

    @Post('album/:id')
    @HttpCode(201)
    addAlbum(@Param('id', ParseUUIDPipe) id: string) {
        return this.FavoritesServ.addAlbum(id);
    }

    @Post('track/:id')
    @HttpCode(201)
    addTrack(@Param('id', ParseUUIDPipe) id: string) {
        return this.FavoritesServ.addTrack(id);
    }

    @Post('artist/:id')
    @HttpCode(201)
    addArtist(@Param('id', ParseUUIDPipe) id: string) {
        return this.FavoritesServ.addArtist(id);
    }

    @Delete('track/:id')
    @HttpCode(204)
    deleteTrack(@Param('id', ParseUUIDPipe) id: string) {
        return this.FavoritesServ.deleteTrack(id);
    }

    @Delete('album/:id')
    @HttpCode(204)
    deleteAlbum(@Param('id', ParseUUIDPipe) id: string) {
        return this.FavoritesServ.deleteAlbum(id);
    }

    @Delete('artist/:id')
    @HttpCode(204)
    deleteArtist(@Param('id', ParseUUIDPipe) id: string) {
        return this.FavoritesServ.deleteArtist(id);
    }
}