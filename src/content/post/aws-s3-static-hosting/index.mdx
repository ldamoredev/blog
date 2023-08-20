---
title: "Static WebSite with S3 and Cloudfront"
publishDate: "30 Aug 2022"
description: "En este tutorial veremos como configurar S3 + CloudFront para servir como Static Website."
tags: ["aws"]
---

## Configurar S3

1. Crear el S3 bucket con el nombre de tu aplicacion.
2. Desactivar la opcion que bloquea el acceso publico. Esta opcion se encuentra en “**Block *all* public access**”. Por defecto todos los buckets de AWS son privados, para hacer lo publico debemos desmarcar esta opcion.
3. Una vez creado, debemos subir todos los archivos de nuestra aplicacion (previamente buildeada). Para eso podemos arrastrar los archivos al bucket o hacerlo mediante el CLI de AWS

```bash
aws s3 cp dist/ s3://<BUCKET_NAME>/ --recursive
```

4. Para que nuestros archivos sean publicos, debemos modificar la **policy** del bucket. Dentro de **Permissions > Bucket policy,** copiar el siguiente fragmento.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::<YOUR_BUCKET_NAME>/*"
    }
  ]
}
```

<aside>
> 💡 No olvides remplazar YOUR_BUCKET_NAME por el nombre de tu bucket.

</aside>

5. El ultimo paso es habilitar **website hosting** para nuestro bucket. En **Settings > Static website hosting.** Para activarlo debemos marcar cual va a ser el index de nuestra pagina (generalmente nuestro `index.html`). Una vez activado nos dara una url que la podemos ver en  **Settings > Static website hosting.**

## ****CloudFront setup****

Crear una nueva distribucion CloudFront. Con los siguientes valores:

- **Origin domain:** Nuestro S3 bucket
- **Viewer protocol policy:** Redirect HTTP to HTTPS
- **Default root object:** index.html

Esta configuracion nos creara una nueva distribucion de CloudFront apuntando a nuestro S3. Una vez creada podremos encontrar la url de nuestra distribucion en **Distributions > Domain name.**

## ****CloudFront Functions setup****

Por defecto cloudfront nos soporta “pretty urls”, si no especificamos en la url la terminacion con index.html provocara un error 403, como si no tuviesemos acceso a lo que estamos pidiendo (porque en realidad no existe). Tampoco soporta multi-page `sub-folder/index` routing.
Para configurarlo tenemos que crear una CloudFront Function para nuestra CloudFront Distribution.

1. Dentro de **CloudFront > Functions** crearemos una funcion con el siguiente snippet.

```jsx
function handler(event) {
  var request = event.request;
  var uri = request.uri;

  // Check whether the URI is missing a file name.
  if (uri.endsWith('/')) {
    request.uri += 'index.html';
  }
  // Check whether the URI is missing a file extension.
  else if (!uri.includes('.')) {
    request.uri += '/index.html';
  }

  return request;
}
```

1. Ahora debemos adjuntar nuestra funcion a la distribucion de CloudFront. Dentro de nuestra CloudFront Distribution debemos ir a **Settings > Behaviors > Edit > Function associations.**
    - **Viewer request - Function type:** CloudFront Function.
    - **Viewer request - Function ARN:** Seleccionar la funcion creada en el paso anterior.

## Bonus - ****Continuous deployment with GitHub Actions****

1. Generar AWS Crendentials para obtener `AWS_SECRET_ACCESS_KEY`
 y `AWS_ACCESS_KEY_ID`
2. En nuestro repositorio crear el siguiente archivo `.github/workflows/deploy.yml` y pushear para que se active el workflow. Hay que agregar `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` , `BUCKET_ID`, y `DISTRIBUTION_ID` como  “secrets” en nuestro repotitorio de GitHub en **Settings** > **Secrets** > **Actions.**

```yaml
name: Deploy Website

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      - name: Install modules
        run: npm ci
      - name: Build application
        run: npm run build
      - name: Deploy to S3
        run: aws s3 sync ./dist/ s3://${{ secrets.BUCKET_ID }}
      - name: Create CloudFront invalidation
        run: aws cloudfront create-invalidation --distribution-id ${{ secrets.DISTRIBUTION_ID }} --paths "/*"
```
