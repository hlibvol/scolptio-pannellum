import { Component, OnInit } from '@angular/core';
import { Team } from '../team.model';
import { TeamService } from '../team.service';
import { ToastrService } from 'ngx-toastr';
import { common_error_message } from 'src/app/shared/toast-message-text';

@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.scss',
    '../../../../assets/css/app.css',
    '../../../../assets/css/icons.css',]
})
export class TeamListComponent implements OnInit {

  isLoading = false;
  errorMsg = '';
  pageNumber = 1;
  pageSize = 10;
  total = 0;
  teamList: Team[];
  finalteamList: Team[];
  selectedTeam: Team;
  searchKey: '';
  searchName = '';
  visibleFilter = false;
  filterObj: any;
  constructor(private teamService: TeamService,
    private toastr: ToastrService) {
    this.selectedTeam = new Team();
  }

  ngOnInit(): void {
    this.GetTeamTotalCount();
  }

  GetAllTeam() {
    this.isLoading = true;
    this.teamService.GetAllTeam(this.pageNumber, this.pageSize, this.searchKey, this.filterObj).subscribe((data: any[]) => {
      this.isLoading = false;
      this.teamList = this.finalteamList = data;
    }, (error) => {
      this.toastr.error(common_error_message);
      this.isLoading = false;
    })
  }

  GetTeamTotalCount() {
    this.isLoading = true;
    this.teamService.GetTotalCount().subscribe((data: any) => {
      this.isLoading = false;
      this.total = data;
      this.GetAllTeam();
    }, (error) => {
      this.toastr.error(common_error_message);
      this.isLoading = false;
    })
  }

  setSelectedTeam(team: Team) {
    this.selectedTeam = team;
  }

  onPaginationChange(pageNumber: string) {
    const selectedPage = Number(pageNumber);
    if (selectedPage != NaN) {
      this.pageNumber = selectedPage;
      this.GetAllTeam();
    }
  }

  clearFilter() {
    this.searchName = '';
    this.filterObj = [''];
    this.visibleFilter = false;
    this.GetAllTeam();
  }

  onChange(val) {
    if (this.searchName == '')
      this.visibleFilter = false;
    else
      this.visibleFilter = true;
  }

  actionFilter() {
    this.filterObj = [
      this.searchName,  
    ]
    this.GetAllTeam();
  }

  onSearchList(searchValue) {
    if (searchValue != '')
      this.teamList = this.finalteamList.filter(x => (x.teamName != null && x.teamName.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1));
    else
      this.teamList = this.finalteamList;
  }

  search(event) {
    if(event.keyCode == 13) {
      this.GetAllTeam();
    }
  }

}
