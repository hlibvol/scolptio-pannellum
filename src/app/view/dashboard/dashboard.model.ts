export class Dashboard{
    public totalProjectCount: number;
    public inProgressProjectCount: number;
    public completedProjectCount: number;
    public recentProjects: ProjectForDasboard[];
    public totalDesigner:number;
}

export class ProjectForDasboard{
    public id: string;
    public startDate: Date;
    public deadline: Date;
    public projectName: string;
    public status: string;
    public cost: number;
}