---
title: "CI with Dagger"
publishDate: "15 Oct 2023"
description: "En este tutorial veremos como escribir nuestros pipelines con dagger"
tags: ["npm", "package"]
---

### ¿Que es Dagger.io?

[Dagger.io](http://Dagger.io) es una herramienta que nos permita desarrollar pipelines CI/CD programables que son ejecutados en contenedores.

¿Que significa que sean progamables?

Significa que te permite desarrollar tus pipeline CI/CD como código (**Pipelines as Code**), en el mismo lenguaje de programación que tu aplicación. Simplemente debemos elegir el SDK de dagger del lenguaje que estemos progamando y desarrollar el pipeline como codigo.

El Motor Dagger ejecuta tus pipelines completamente como contenedores [OCI estándar](https://opencontainers.org/). Esto tiene varias ventajas:

- Pruebas locales instantáneas
- Portabilidad: el mismo pipeline puede ejecutarse en tu máquina local, un runner de CI, un servidor dedicado o cualquier servicio de alojamiento de contenedores.
- Caché superior: cada operación se almacena en caché de forma predeterminada, y la caché funciona de la misma manera en todas partes.
- Compatibilidad con el ecosistema Docker: si se ejecuta en un contenedor, puedes agregarlo a tu flujo de trabajo.

¿Cómo funciona Dagger?

1. Tu programa importa el SDK de dagger en el lenguaje que elijas.
2. Usando el SDK, tu programa abre una nueva sesion con el motor de Dagger: ya sea conectandose a un motor de Dagger existente o provisionando uno sobre la marcha.
3. Usando el SDK, tu programa prepara API requests describiendo el pipeline a correr, luego son estos request son enviados al motor de dagger.
4. Cuando el motor recibe estos API request, computa un **[Directed Acyclic Graph (DAG)](https://en.wikipedia.org/wiki/Directed_acyclic_graph)** de operaciones a bajo nivel para computar el resultado final.
5. Cuando todas las operaciones en el pipeline son resueltas, el motor devuelve el resultado a tu programar.

### Probando Dagger con el SDK de Node.JS

Antes de empezar dejo de referencia el repo donde esta implementado este codigo:

[https://github.com/ldamoredev/dagger-test](https://github.com/ldamoredev/dagger-test)

Lo primero es inicializar nuestro proyecto y agregar las dependencias que necesitamos. En mi caso estare usando typescript, pero ustedes pueden elegir hacerlo en javascript si asi lo desean.

Para iniciar el proyecto e instalar las dependencias necesarias usaremos los siguiente comandos:

```bash
ldamore@Desktop:~ $ mkdir dagger-test
ldamore@Desktop:~ $ cd dagger-test
ldamore@Desktop/my-npm-package:~ $ npm init
ldamore@Desktop/my-npm-package:~ $ npm install @babel/preset-env @types/jest ts-node typescript @babel/preset-typescript @dagger.io/dagger jest ts-jest
```

### Configuracion del proyecto y codigo

Antes de configurar Dagger debemos configurar el proyecto para que entienda typescript.

Para eso crearemos un archivo **tsconfig.json** con la siguiente configuracion:

```json
{
  "compilerOptions": {
    "module": "NodeNext",
    "moduleResolution": "nodenext",
    "allowImportingTsExtensions": true,
    "noImplicitAny": true,
    "removeComments": true,
    "preserveConstEnums": true,
    "sourceMap": true
  }
}
```

El archivo babel.config.cjs para configurar babel:

```jsx
module.exports = {
  presets: [
    ['@babel/preset-env', {targets: {node: 'current'}}],
    '@babel/preset-typescript',
  ],
}
```

Ademas crearemos una carpeta **src** donde ira nuestro codigo y una carpeta **test** donde iran nuestros test con el siguiente codigo:

en **/src/index.ts**

```tsx
export const sum = (a: number, b: number) => a + b
```

en **/test/SumTest.test.ts**

```tsx
import { sum } from '../src/index.ts'

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
})
```

### Configuracion de Dagger

Una vez escrito nuestro programa, lo siguiente es escribir el pipeline con dagger, lo que hara el pipeline simplemente es:

- Crear un contenedor Node
- Crear una cache para las dependencias
- Instalar las dependencias de nuestro programa
- Ejecutar los tests de nuestro programa

Para eso crearemos un archivo en la siguiente ubicacion: **/ci/index.mts**

```tsx
import { connect } from "@dagger.io/dagger"

connect(async (client) => {
  const nodeCache = client.cacheVolume("node")

  const source = client.container()
    .from("node:16-slim")
    .withDirectory('/src', client.host().directory('.'), { exclude: ["node_modules/", "ci/"] })
    .withMountedCache("/src/node_modules", nodeCache)

  const runner = source
    .withWorkdir("/src")
    .withExec(["npm", "install"])

  await runner
    .withExec(["npm", "test", "--", "--watchAll=false"])
    .stderr()

}, { LogOutput: process.stdout })
```

### Integracion con Github Actions

Ya tenemos nuestro pipeline con dagger, ahora podemos integrarlo con github actions para que con cada commit ejecuta dicho pipeline. Se puede notar que en vez de escribir nuestro pipeline con Github Actions, lo unico que hara github actions sera ejecutar nuestro pipeline escrito en dagger

Entonces dentro de **.github/workflows/pipeline.yml:**

```yaml
name: dagger

on:
  push:
    branches:
      - main

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'yarn'
          cache-dependency-path: |
            yarn.lock
      - name: Install dependencies
        run: |
          yarn install
      - name: Dagger
        run: curl -L https://dl.dagger.io/dagger/install.sh | sh
      - name: Run tests
        run: |
          ./bin/dagger run node --loader ts-node/esm ci/index.mts
```

Como podemos notar, el pipeline instala dagger y ejecuta nuestro pipeline escrito con el SDK de dagger, en vez de tener que escribir nuestro pipeline con comandos shell como se hace usualmente lo escribimos en el lenguaje de nuestra aplicacion y esa es la gran ventaja que nos ofrece dagger.
