import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PointController } from '../web/rest/point.controller';
import { PointRepository } from '../repository/point.repository';
import { PointService } from '../service/point.service';

@Module({
    imports: [TypeOrmModule.forFeature([PointRepository])],
    controllers: [PointController],
    providers: [PointService],
    exports: [PointService],
})
export class PointModule {}
