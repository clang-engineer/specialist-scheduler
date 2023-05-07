import { Point } from '../../domain/point.entity';
import { PointDTO } from '../dto/point.dto';

/**
 * A Point mapper object.
 */
export class PointMapper {
    static fromDTOtoEntity(entityDTO: PointDTO): Point {
        if (!entityDTO) {
            return;
        }
        let entity = new Point();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach((field) => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: Point): PointDTO {
        if (!entity) {
            return;
        }
        let entityDTO = new PointDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach((field) => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
