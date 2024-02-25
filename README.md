# Description

The project is CAP POC for file uploading/downloading.
Files are stored locally in /tmp folder with name as ID of file record.

# Structure

It contains these folders and files:

| File or Folder      | Purpose                              |
|---------------------|--------------------------------------|
| `app/`              | content for UI frontends goes here   |
| `db/`               | your domain models and data go here  |
| `srv/`              | your service models and code go here |
| `package.json`      | project metadata and configuration   |
| `readme.md`         | this getting started guide           |
| `install-clamav.sh` | script to start clamav in docker     |
| `collection/`       | postman collection with examples     |

## Run project

1. Deploy project to create sqlite db with tables

```shell
cds deploy
```

2. Make script [install-clamav.sh](install-clamav.sh) executable by command

```shell
chmod +x install-clamav.sh
```

3. Run script

```shell
./install-clamav.sh
```

4. Start CAP Project

```shell
cds-serve
```

5. Sends some request according to the collection attached to the project