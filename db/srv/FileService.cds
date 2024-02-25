namespace srv.file;

using file.db as file from '../db/File';

@path: '/api/file'
@impl: 'srv/handlers/files-service.js'
service FilesService {

    entity Files as projection on file.Files;

}