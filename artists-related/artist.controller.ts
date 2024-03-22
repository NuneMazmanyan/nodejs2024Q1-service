import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    ParseUUIDPipe,
    Post,
    Put,
} from '@nestjs/common';
import {CreateArtistDto} from "./dto/create-artist.dto";
import {UpdateArtistDto} from "./dto/update-artist.dto";
import {ArtistService} from "./artist.service";

@Controller('artist')
export class ArtistController {
    constructor(private readonly artistService: ArtistService) {}

    @Get()
    getArtists() {
        return this.artistService.getArtists();
    }

    @Get(':id')
    getArtist(@Param('id', ParseUUIDPipe) id: string) {
        return this.artistService.getArtistById(id);
    }

    @Post()
    @HttpCode(201)
    create(@Body() artistDto: CreateArtistDto) {
        return this.artistService.createArtist(artistDto);
    }

    @Put(':id')
    @HttpCode(200)
    updateArtist(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateArtistDto: UpdateArtistDto,
    ) {
        return this.artistService.updateArtist(id, updateArtistDto);
    }

    @Delete(':id')
    @HttpCode(204)
    deleteArtist(@Param('id', ParseUUIDPipe) id: string) {
        return this.artistService.deleteArtist(id);
    }
}