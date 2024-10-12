---
title: "Restore backup of postgres container"
publishDate: "21 Jun 2024"
description: "En este tutorial vamos a ver como crear un backup de un volumen sobre un container postgres y como restaurarlo en un nuevo container."
tags: ["docker", "devops"]
---

### Creacion de volumen y container postgres (opcional)

Lo primero es crear un volumen para nuestro container postgres que crearemos. Si ya tenes un volumen con un postgres al cual hacerle backup, puedes saltear este paso.

```bash
ldamore@Desktop:~ $ docker volume create postgres_data
ldamore@Desktop:~ $ docker run --name postgres_container -e POSTGRES_PASSWORD=mypassword -v postgres_data:/var/lib/postgresql/data -d postgres
```

Con estos comandos hemos creado un volumen y bindeado el volumen en donde se almacen los datos en el container de postgres.

### Creacion de una base de datos y una tabla

Para asegurarnos que el backup y el restore funciono, crearemos una base de datos y una tabla para hacerle backup. Para luego verificar en el container con el backup restoreado que existan.

```bash
ldamore@Desktop:~ $ docker exec -it postgres_container psql -U postgres
postgres=# CREATE DATABASE my_database;
postgres=# \c my_database
You are now connected to database "my_database" as user "postgres".
postgres=# CREATE TABLE my_table ( id SERIAL PRIMARY KEY, name VARCHAR(100), age INT );
postgres=# \dt
List of relations
Schema |   Name   | Type  |  Owner

--------+----------+-------+----------
public | my_table | table | postgres
(1 row)
```

### Backup del container

Una vez creada la base de datos y la tabla haremos el backup del container, donde le indicaremos donde queremos que almacene en nuestra computadora el backup y que archivos del container le haremos el backup

```bash
ldamore@Desktop:~ $ docker stop postgres_container
ldamore@Desktop:~ $ docker run --rm -v postgres_data:/var/lib/postgresql/data -v $(pwd)/backup:/backup busybox tar czvf /backup/db_backup.tar.gz -C /var/lib/postgresql/data .
```

Ahora el backup estara en nuestro directorio actual, dentro de la carpeta backup y con el nombre `db_backup.tar.gz`

### Restore del container

Lo siguiente es crear un nuevo volumen, restorearle el backup del anterior container y crear un nuevo container con el nuevo volumen backupeado bindeado. Luego entraremos dentro del container y verificaremos que existan la base de datos y la tabla que creamos.

```bash
ldamore@Desktop:~ $ docker volume create new_postgres_data
ldamore@Desktop:~ $ docker run --rm -v new_postgres_data:/var/lib/postgresql/data -v $(pwd)/backup:/backup busybox tar xzvf /backup/db_backup.tar.gz -C /var/lib/postgresql/data
ldamore@Desktop:~ $ docker run --name new_postgres_container -e POSTGRES_PASSWORD=mypassword -v new_postgres_data:/var/lib/postgresql/data -d postgres
ldamore@Desktop:~ $ docker exec -it new_postgres_container psql -U postgres
postgres=# \c my_database
You are now connected to database "postgres" as user "postgres".
postgres=# \dt
List of relations
Schema |   Name   | Type  |  Owner

--------+----------+-------+----------
public | my_table | table | postgres
(1 row)
```

Como podemos observar creamos un nuevo container con el backup hecho anteriormente

### Plus

Hace poco tiempo en el trabajo tuve que restorear un backup que no estaba en formato .tar, el formato eran las carpetas con todo el backup descomprimido. De esa forma no podia usar el comando utilizado anteriormente para restaurar el backup.

De esa forma, lo que tuve que hacer fue copiar la carpeta con los archivos del backup descomprimidos adentro del container y luego una vez d2entro del container sobreescribir los datos donde postgres los almacena, con los datos del backup.

```bash
ldamore@Desktop:~ $ docker run --name new_postgres_container -e POSTGRES_PASSWORD=mypassword -d postgres
ldamore@Desktop:~ $ docker cp backup new_postgres_container:/backup
ldamore@Desktop:~ $ docker exec -it new_postgres_container bash
root@8fb1309fafd2:/# cp -TRv backup /var/lib/postgresql/data
root@8fb1309fafd2:/# exit
ldamore@Desktop:~ $ docker restart new_postgres_container
```

De esta forma sobreescribimos los datos del backup sobre los datos de postgres, reiniciamos el servicio y ya deberiamos tener el restaurado el backup.
