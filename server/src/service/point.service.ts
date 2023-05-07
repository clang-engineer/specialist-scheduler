import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { PointDTO } from '../service/dto/point.dto';
import { PointMapper } from '../service/mapper/point.mapper';
import { PointRepository } from '../repository/point.repository';

const relationshipNames = [];

@Injectable()
export class PointService {
    logger = new Logger('PointService');

    constructor(@InjectRepository(PointRepository) private pointRepository: PointRepository) {}

    async findById(id: number): Promise<PointDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.pointRepository.findOne(id, options);
        return PointMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<PointDTO>): Promise<PointDTO | undefined> {
        const result = await this.pointRepository.findOne(options);
        return PointMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<PointDTO>): Promise<[PointDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.pointRepository.findAndCount(options);
        const pointDTO: PointDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach((point) => pointDTO.push(PointMapper.fromEntityToDTO(point)));
            resultList[0] = pointDTO;
        }
        return resultList;
    }

    async save(pointDTO: PointDTO, creator?: string): Promise<PointDTO | undefined> {
        const entity = PointMapper.fromDTOtoEntity(pointDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.pointRepository.save(entity);
        return PointMapper.fromEntityToDTO(result);
    }

    async update(pointDTO: PointDTO, updater?: string): Promise<PointDTO | undefined> {
        const entity = PointMapper.fromDTOtoEntity(pointDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.pointRepository.save(entity);
        return PointMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.pointRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
