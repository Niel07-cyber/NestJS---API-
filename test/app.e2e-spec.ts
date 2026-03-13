import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { DomainExceptionFilter } from './../src/modules/shared/errors/infrastructure/filters/domain-exception.filter';

describe('Medium-like API (e2e)', () => {
  let app: INestApplication<App>;
  let writerToken: string;
  let moderatorToken: string;
  let postId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new DomainExceptionFilter());
    await app.init();

    const writerLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'writer_user', password: 'password123' });
    writerToken = writerLogin.body.access_token;

    const modLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'moderator_user', password: 'password123' });
    moderatorToken = modLogin.body.access_token;
  }, 30000);

  afterAll(async () => {
    if (app) {
      // Wait for pending async events to complete before closing
      await new Promise(resolve => setTimeout(resolve, 500));
      await app.close();
    }
  });

  it('/ (GET) should return Hello World', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('POST /posts - should create a post as writer', async () => {
    const res = await request(app.getHttpServer())
      .post('/posts')
      .set('Authorization', `Bearer ${writerToken}`)
      .send({ title: 'E2E Test Post', content: 'Content for e2e test' })
      .expect(201);

    expect(res.body).toBeDefined();
    expect(res.body.id).toBeDefined();
    expect(res.body.status).toBe('draft');
    postId = res.body.id;
  });

  it('POST /posts/:id/submit-for-review - should submit post for review', async () => {
    expect(postId).toBeDefined();
    await request(app.getHttpServer())
      .post(`/posts/${postId}/submit-for-review`)
      .set('Authorization', `Bearer ${writerToken}`)
      .expect(200);
  });

  it('GET /posts?tags=typescript - should filter posts by tag', async () => {
    const res = await request(app.getHttpServer())
      .get('/posts?tags=typescript')
      .expect(200);

    expect(res.body.posts).toBeDefined();
    expect(Array.isArray(res.body.posts)).toBe(true);
  });

  it('GET /notifications - should return notifications for authenticated user', async () => {
    const res = await request(app.getHttpServer())
      .get('/notifications')
      .set('Authorization', `Bearer ${moderatorToken}`)
      .expect(200);

    expect(res.body.notifications).toBeDefined();
    expect(Array.isArray(res.body.notifications)).toBe(true);
    expect(res.body).toHaveProperty('total');
    expect(res.body).toHaveProperty('unreadCount');
  });

  it('POST /users/:id/follow - should return 400 when following yourself', async () => {
    const users = await request(app.getHttpServer()).get('/users').expect(200);
    const writer = users.body.find((u: any) => u.username === 'writer_user');

    if (writer) {
      const res = await request(app.getHttpServer())
        .post(`/users/${writer.id}/follow`)
        .set('Authorization', `Bearer ${writerToken}`);
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('CANNOT_FOLLOW_SELF');
    }
  });
});
