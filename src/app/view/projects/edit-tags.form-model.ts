import { NgOption } from "@ng-select/ng-select";

export class EditTagsFormModel{
    documentId: string = '';
    tags: NgOption[] = [];
    tagOptions: NgOption[] = [];
}