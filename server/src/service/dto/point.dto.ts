/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';

/**
 * A PointDTO object.
 */
export class PointDTO extends BaseDTO {
    @IsNotEmpty()
    @MinLength(5)
    @ApiModelProperty({ description: 'title field' })
    title: string;

    @ApiModelProperty({ description: 'description field', required: false })
    description: string;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
