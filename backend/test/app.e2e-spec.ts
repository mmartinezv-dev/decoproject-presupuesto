import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import cookieParser from 'cookie-parser';
import { DataSource } from 'typeorm';
import { AppModule } from './../src/app.module';

describe('Budgets API (e2e)', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api', { exclude: ['/'] });
    app.use(cookieParser());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
    dataSource = app.get(DataSource);
    await dataSource.query(
      'INSERT INTO `budget_sequence` (`id`, `nextValue`) VALUES (1, 1)',
    );
  });

  it('preserves duplicate and empty sections, recalculates totals and allocates unique correlatives', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ username: 'e2e-admin', password: 'e2e-password' })
      .expect(201);
    const loginBody: unknown = loginResponse.body;
    const accessToken = (loginBody as { accessToken: string }).accessToken;
    const authorization = `Bearer ${accessToken}`;

    const draftResponse = await request(app.getHttpServer())
      .post('/api/budgets')
      .set('Authorization', authorization)
      .send({
        status: 'borrador',
        currentStep: 5,
        neto: 1,
        iva: 1,
        total: 2,
        sections: [
          { title: 'Repetida', manualTotal: null },
          { title: 'Repetida', manualTotal: 1000 },
          { title: 'Solo total', manualTotal: 500 },
        ],
        items: [
          {
            productName: 'Producto A',
            section: 'Repetida',
            sectionIndex: 0,
            unit: 'un',
            quantity: 2,
            price: 100,
            subtotal: 1,
          },
          {
            productName: 'Producto B',
            section: 'Repetida',
            sectionIndex: 1,
            unit: 'un',
            quantity: 3,
            price: 200,
            subtotal: 1,
          },
        ],
      })
      .expect(201);
    const draftBody: unknown = draftResponse.body;
    const draft = draftBody as {
      id: number;
      neto: number;
      iva: number;
      total: number;
      sections: unknown[];
      items: unknown[];
    };
    expect(draft.neto).toBe(1700);
    expect(draft.iva).toBe(323);
    expect(draft.total).toBe(2023);
    expect(draft.sections).toHaveLength(3);

    await request(app.getHttpServer())
      .put(`/api/budgets/${draft.id}`)
      .set('Authorization', authorization)
      .send({
        status: 'borrador',
        currentStep: 5,
        sections: [{ title: 'Unica', manualTotal: null }],
        items: [
          {
            productName: 'Producto final',
            section: 'Unica',
            sectionIndex: 0,
            unit: 'un',
            quantity: 1,
            price: 300,
            subtotal: 999,
          },
        ],
      })
      .expect(200);

    const updatedResponse = await request(app.getHttpServer())
      .get(`/api/budgets/${draft.id}`)
      .set('Authorization', authorization)
      .expect(200);
    const updatedBody: unknown = updatedResponse.body;
    expect((updatedBody as { items: unknown[] }).items).toHaveLength(1);
    const orphanResult: unknown = await dataSource.query(
      'SELECT COUNT(*) AS count FROM `budget_item` WHERE `budgetId` IS NULL',
    );
    const orphanRows = orphanResult as { count: number | string }[];
    expect(Number(orphanRows[0]?.count)).toBe(0);

    const finalPayload = {
      status: 'final',
      currentStep: 6,
      sections: [{ title: 'General', manualTotal: 100 }],
      items: [],
    };
    const finalResponses = await Promise.all([
      request(app.getHttpServer())
        .post('/api/budgets')
        .set('Authorization', authorization)
        .send(finalPayload)
        .expect(201),
      request(app.getHttpServer())
        .post('/api/budgets')
        .set('Authorization', authorization)
        .send(finalPayload)
        .expect(201),
    ]);
    const finalBodies = finalResponses.map((response) => {
      const body: unknown = response.body;
      return body as { id: number; correlativo: number };
    });
    expect(finalBodies[0].correlativo).not.toBe(finalBodies[1].correlativo);

    for (const id of [draft.id, ...finalBodies.map((body) => body.id)]) {
      await request(app.getHttpServer())
        .delete(`/api/budgets/${id}`)
        .set('Authorization', authorization)
        .expect(200);
    }
  });

  afterAll(async () => {
    if (app) await app.close();
  });
});
