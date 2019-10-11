require('dotenv').config();

import Koa from 'koa';
import next from 'next';
import Router from 'koa-router';

const PORT = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = new Koa()
  const router = new Router()

  router.get('/foo', async (ctx) => {
    console.log(ctx.query);

    ctx.status = 200;
  })

  router.all('*', async ctx => {
    await handle(ctx.req, ctx.res)
    ctx.respond = false
  })

  server.use(async (ctx, next) => {
    const start = new Date();

    await next();

    const end = new Date();
    const diff = (end.getTime() - start.getTime()) / 1000;

    console.log(ctx.method, ctx.path, `${diff.toFixed(3)}s`)
  });

  server.use(async (ctx, next) => {
    ctx.res.statusCode = 200
    await next()
  })

  server.use(router.routes())

  server.listen(PORT, () => {
    console.log(`> Ready on http://localhost:${PORT}`)
  })
})
