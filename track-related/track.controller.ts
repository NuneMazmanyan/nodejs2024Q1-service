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
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import {TrackService} from "./track.service";

@Controller('track')
export class TrackController {
    constructor(private readonly trackService: TrackService) {}

    @Get()
    getTracks() {
        return this.trackService.getTracks();
    }

    @Get(':id')
    getTrack(@Param('id', ParseUUIDPipe) id: string) {
        return this.trackService.getTrackById(id);
    }

    @Post()
    @HttpCode(201)
    create(@Body() trackDto: CreateTrackDto) {
        return this.trackService.createTrack(trackDto);
    }

    @Put(':id')
    @HttpCode(200)
    updateTrack(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateTrackDto: UpdateTrackDto,
    ) {
        return this.trackService.updateTrack(id, updateTrackDto);
    }

    @Delete(':id')
    @HttpCode(204)
    deleteTrack(@Param('id', ParseUUIDPipe) id: string) {
        return this.trackService.deleteTrack(id);
    }
}