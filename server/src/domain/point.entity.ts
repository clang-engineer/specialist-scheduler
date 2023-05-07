/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

/**
 * A Point.
 */
@Entity('point')
export class Point extends BaseEntity {
    @Column({ name: 'title' })
    title: string;

    @Column({ name: 'description', nullable: true })
    description: string;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
