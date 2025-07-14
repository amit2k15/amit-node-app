const request = require('supertest');
const app = require('../app');

describe('GET /', () => {
  let server;

  beforeAll(() => {
    server = app.listen(3001); // Use different port for tests
  });

  afterAll((done) => {
    server.close(done);
  });

  it('responds with json', async () => {
    const response = await request(app)
      .get('/')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body.message).toBe('Hello from Dockerized Node.js app!');
  });
});