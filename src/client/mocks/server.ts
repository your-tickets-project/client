import { rest } from 'msw';
import { setupServer } from 'msw/node';
// fixtures
import { createUser } from 'fixtures/user.fixture';
// http status codes
import { OK_STATUS } from 'server/constants/http.status';

export const server = setupServer(
  rest.get(`/auth/check-user`, async (req, res, ctx) => {
    return res(ctx.status(OK_STATUS), ctx.json({ user: createUser() }));
  }),
  rest.post('/media', async (req, res, ctx) => {
    return res(
      ctx.status(OK_STATUS),
      ctx.json({
        message: 'Media uploaded successfully.',
        filesData: [{ Key: 'test', name: 'test' }],
      })
    );
  })
);
