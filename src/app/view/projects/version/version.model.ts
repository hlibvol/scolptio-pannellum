export class Version{
    id: string;
    projectId: string;
    documentTypeId: string;
    versionName: string;
}

export class VersionForm extends Version{
    header: string = '';
}

export class VersionUpdateForm{
    action: VersionUpdateAction = 'move';
    targetVersionId: string = '';
    errorMsg: string = '';
}

export type VersionUpdateAction = "move" | "copy";