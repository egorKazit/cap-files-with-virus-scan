namespace file.db;

using {
    cuid,
    managed
} from '@sap/cds/common';

entity Files : cuid, managed {
    name      : String;
    content   : LargeBinary @Core.MediaType  : mediaType;
    mediaType : String      @Core.IsMediaType: true;
    url       : String      @readonly;
}
