import { Injectable } from '@angular/core';
import { NgOption } from '@ng-select/ng-select';
import { EditTagsFormModel } from '../view/projects/edit-tags.form-model';
import { ProjectService } from '../view/projects/project.service';
import { Tag } from '../view/projects/tag/tag.model';

@Injectable({
  providedIn: 'root'
})
export class TagMultiSelectHelperService {

  constructor(private _projectService: ProjectService) { }
  async getAllTagOptions(batchSize: number = 100): Promise<NgOption[]> {
    let options = [];
    let firstBatch = await this._projectService.getAllTags(1, batchSize, '').toPromise();
    if(!firstBatch.tags.length)
      return options;
    else{
      options = options.concat(firstBatch.tags.map((x) => {
        return {
          label: x.name,
          value: x.id
        }
      }))
      let batchCount: number = firstBatch.count / batchSize + 1;
      for(var batchNumber = 2; batchNumber <= batchCount; batchNumber++){
        let page = await this._projectService.getAllTags(batchNumber, batchSize, '').toPromise();
        options = options.concat(page.tags.map((x) => {
          return {
            label: x.name,
            value: x.id
          }
        }))
      }
      return options;
    }
  }
  tagModelsToNgOptions(tags: Tag[]): NgOption[] {
    if(tags?.length && this._findType(tags) === 'NgOption')
      return tags as Tag[];
    return tags.map((x) => {
      return {
        label: x.name,
        value: x.id
      }
    })
  }
  ngOptionsToTagModels(options: NgOption[]): Tag[] {
    if(options?.length && this._findType(options) === 'Tag')
      return options as Tag[];
    return options.map(x => {
      let tag:Tag = new Tag;
      tag.id = x.value as string;
      tag.name = x.label;
      return tag;
    });
  }
  private _findType(list: any[]): "NgOption" | "Tag" {
    if(!list?.length)
      throw new Error("empty list");
    if(list[0].value && list[0].label)
      return "NgOption";
    else if(list[0].name && list[0].id)
      return "Tag";
    else throw new Error("Unknown Type")
  }
}
