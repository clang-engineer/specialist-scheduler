import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { PointDTO } from '../src/service/dto/point.dto';
import { PointService } from '../src/service/point.service';

describe('Point Controller', () => {
    let app: INestApplication;

    const authGuardMock = { canActivate: (): any => true };
    const rolesGuardMock = { canActivate: (): any => true };
    const entityMock: any = {
        id: 'entityId',
    };

    const serviceMock = {
        findById: (): any => entityMock,
        findAndCount: (): any => [entityMock, 0],
        save: (): any => entityMock,
        update: (): any => entityMock,
        deleteById: (): any => entityMock,
    };

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideGuard(AuthGuard)
            .useValue(authGuardMock)
            .overrideGuard(RolesGuard)
            .useValue(rolesGuardMock)
            .overrideProvider(PointService)
            .useValue(serviceMock)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/GET all points ', async () => {
        const getEntities: PointDTO[] = (await request(app.getHttpServer()).get('/api/points').expect(200)).body;

        expect(getEntities).toEqual(entityMock);
    });

    it('/GET points by id', async () => {
        const getEntity: PointDTO = (
            await request(app.getHttpServer())
                .get('/api/points/' + entityMock.id)
                .expect(200)
        ).body;

        expect(getEntity).toEqual(entityMock);
    });

    it('/POST create points', async () => {
        const createdEntity: PointDTO = (
            await request(app.getHttpServer()).post('/api/points').send(entityMock).expect(201)
        ).body;

        expect(createdEntity).toEqual(entityMock);
    });

    it('/PUT update points', async () => {
        const updatedEntity: PointDTO = (
            await request(app.getHttpServer()).put('/api/points').send(entityMock).expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/PUT update points from id', async () => {
        const updatedEntity: PointDTO = (
            await request(app.getHttpServer())
                .put('/api/points/' + entityMock.id)
                .send(entityMock)
                .expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/DELETE points', async () => {
        const deletedEntity: PointDTO = (
            await request(app.getHttpServer())
                .delete('/api/points/' + entityMock.id)
                .expect(204)
        ).body;

        expect(deletedEntity).toEqual({});
    });

    afterEach(async () => {
        await app.close();
    });
});
