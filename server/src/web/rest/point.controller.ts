import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    Logger,
    Param,
    Post as PostMethod,
    Put,
    UseGuards,
    Req,
    UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { PointDTO } from '../../service/dto/point.dto';
import { PointService } from '../../service/point.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/points')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('points')
export class PointController {
    logger = new Logger('PointController');

    constructor(private readonly pointService: PointService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: PointDTO,
    })
    async getAll(@Req() req: Request): Promise<PointDTO[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.pointService.findAndCount({
            skip: +pageRequest.page * pageRequest.size,
            take: +pageRequest.size,
            order: pageRequest.sort.asOrder(),
        });
        HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
        return results;
    }

    @Get('/:id')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'The found record',
        type: PointDTO,
    })
    async getOne(@Param('id') id: number): Promise<PointDTO> {
        return await this.pointService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Create point' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: PointDTO,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() pointDTO: PointDTO): Promise<PointDTO> {
        const created = await this.pointService.save(pointDTO, req.user?.login);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Point', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update point' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: PointDTO,
    })
    async put(@Req() req: Request, @Body() pointDTO: PointDTO): Promise<PointDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Point', pointDTO.id);
        return await this.pointService.update(pointDTO, req.user?.login);
    }

    @Put('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update point with id' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: PointDTO,
    })
    async putId(@Req() req: Request, @Body() pointDTO: PointDTO): Promise<PointDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Point', pointDTO.id);
        return await this.pointService.update(pointDTO, req.user?.login);
    }

    @Delete('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Delete point' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'Point', id);
        return await this.pointService.deleteById(id);
    }
}
