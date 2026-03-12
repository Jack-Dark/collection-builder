// src/routes/index.tsx
import * as fs from 'node:fs';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';

import { neon } from '@neondatabase/serverless';

export const getData = createServerFn({ method: 'GET' }).handler(async () => {
  const sql = neon(process.env.DATABASE_URL!);
  const response = await sql`SELECT version()`;

  return response[0].version;
});

const Home = () => {
  const router = useRouter();
  const state = Route.useLoaderData();

  return (
    <button
      type="button"
      onClick={() => {
        updateCount({ data: 1 }).then(() => {
          router.invalidate();
        });
      }}
    >
      Add 1 to {state}?
    </button>
  );
};

export const Route = createFileRoute('/')({
  component: Home,
  loader: async () => {
    const data = await getData();
    console.log('🚀 ~ data:', data);

    return await getCount();
  },
});

const filePath = 'count.txt';

async function readCount() {
  return parseInt(
    await fs.promises.readFile(filePath, 'utf-8').catch(() => '0'),
  );
}

const getCount = createServerFn({
  method: 'GET',
}).handler(() => {
  return readCount();
});

const updateCount = createServerFn({ method: 'POST' })
  .inputValidator((d: number) => d)
  .handler(async ({ data }) => {
    const count = await readCount();
    await fs.promises.writeFile(filePath, `${count + data}`);
  });
