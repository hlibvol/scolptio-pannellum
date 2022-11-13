import { ProjectsViewMode } from "src/app/shared/router-interaction-types";

export interface ProjectDetailsModules {
    [moduleName: string]: ModuleSectionInfo
}

export interface ProjectDetailsSection {
    key: string;
    label: string;
    component: string;
}

export interface ModuleSectionInfo {
    sections: ProjectDetailsSection[];
    showInModes: ProjectsViewMode[];
    label: string;
    expanded: boolean;
}

export type ProjectDetailComponent = 'notes' | 'images' | 'documents' | 'videos' | 'models'