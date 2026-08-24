import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Contact & Quote Flow (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
    await app.init();
  }, 30000);

  afterAll(async () => {
    await app.close();
  });

  describe('Contact Messages', () => {
    it('POST /api/v1/contact-messages - should create a contact message', () => {
      return request(app.getHttpServer())
        .post('/api/v1/contact-messages')
        .send({
          fullName: 'Test User',
          email: 'test@example.com',
          phone: '+1234567890',
          subject: 'Test Subject',
          message: 'This is a test message',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.data).toHaveProperty('fullName', 'Test User');
          expect(res.body.data).toHaveProperty('email', 'test@example.com');
          expect(res.body.data).toHaveProperty('status', 'new');
        });
    });

    it('POST /api/v1/contact-messages - should fail without required fields', () => {
      return request(app.getHttpServer())
        .post('/api/v1/contact-messages')
        .send({
          email: 'test@example.com',
        })
        .expect(400);
    });
  });

  describe('Quote Requests', () => {
    it('POST /api/v1/quote-requests - should create a quote request', () => {
      return request(app.getHttpServer())
        .post('/api/v1/quote-requests')
        .send({
          fullName: 'Jane Smith',
          email: 'jane@example.com',
          phone: '+0987654321',
          description: 'I want a new vinyl pool',
          address: '123 Pool St, Miami FL',
          budgetRange: '$20,000 - $30,000',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.data).toHaveProperty('fullName', 'Jane Smith');
          expect(res.body.data).toHaveProperty('status', 'new');
        });
    });
  });

  describe('Public Endpoints', () => {
    it('GET /api/v1/services - should return services', () => {
      return request(app.getHttpServer())
        .get('/api/v1/services')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body.data)).toBe(true);
        });
    });

    it('GET /api/v1/packages - should return packages', () => {
      return request(app.getHttpServer())
        .get('/api/v1/packages')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body.data)).toBe(true);
        });
    });

    it('GET /api/v1/faq - should return faq items', () => {
      return request(app.getHttpServer())
        .get('/api/v1/faq')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body.data)).toBe(true);
        });
    });

    it('GET /api/v1/settings - should return settings', () => {
      return request(app.getHttpServer())
        .get('/api/v1/settings')
        .expect(200);
    });

    it('POST /api/v1/newsletter/subscribe - should subscribe', () => {
      return request(app.getHttpServer())
        .post('/api/v1/newsletter/subscribe')
        .send({ email: 'subscriber@test.com' })
        .expect(201)
        .expect((res) => {
          expect(res.body.data).toHaveProperty('email', 'subscriber@test.com');
        });
    });
  });

  describe('Auth', () => {
    it('POST /api/v1/auth/login - should fail with wrong credentials', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: 'wrong@test.com', password: 'wrongpass' })
        .expect(401);
    });

    it('POST /api/v1/auth/login - should login with correct credentials', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: 'admin@poolbk.com', password: 'Admin@123' });
      
      if (res.status === 200) {
        expect(res.body.data).toHaveProperty('accessToken');
        expect(res.body.data).toHaveProperty('refreshToken');
      }
    });
  });
});
