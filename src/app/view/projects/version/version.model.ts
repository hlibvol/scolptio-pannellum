export class Version{
    id: string;
    projectId: string;
    documentTypeId: string;
    versionName: string;
}

export class VersionForm extends Version{
    header: string = '';
}