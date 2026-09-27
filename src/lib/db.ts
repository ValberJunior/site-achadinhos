import postgres from "postgres";

// Singleton do client Postgres (postgres.js). Em dev, o Next recarrega o
// módulo a cada mudança — guardamos a instância em globalThis pra não abrir
// uma conexão nova a cada hot-reload.
//
// A criação é lazy (só na primeira chamada de fato) porque, sem
// DATABASE_URL, o site cai pro modo de fixtures (ver fixtures.ts/data.ts) —
// nesse modo o client nunca é chamado, então não faz sentido explodir só
// por importar este módulo.

declare global {
  var __sql: ReturnType<typeof postgres> | undefined;
}

function createClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL não configurada — copie .env.example para .env.local e aponte pro Postgres do projeto."
    );
  }
  return postgres(connectionString, {
    max: 5,
    idle_timeout: 20,
    connect_timeout: 10,
  });
}

function getClient(): ReturnType<typeof postgres> {
  if (!globalThis.__sql) {
    const client = createClient();
    if (process.env.NODE_ENV !== "production") {
      globalThis.__sql = client;
    }
    return client;
  }
  return globalThis.__sql;
}

// Proxy que só chama getClient() (e portanto só valida DATABASE_URL) no
// momento em que `sql` é efetivamente invocado como tagged template ou
// tem um método chamado — nunca só por ser importado.
export const sql = new Proxy(function () {} as unknown as ReturnType<typeof postgres>, {
  apply(_target, thisArg, args) {
    return Reflect.apply(getClient(), thisArg, args);
  },
  get(_target, prop) {
    const client = getClient();
    const value = Reflect.get(client, prop);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
