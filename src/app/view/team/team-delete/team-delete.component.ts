import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TeamService } from '../team.service';
import { Role, Team } from '../team.model';
import { ToastrService } from 'ngx-toastr';
import { team_delete } from 'src/app/shared/toast-message-text';
declare var $: any

@Component({
  selector: 'app-team-delete',
  templateUrl: './team-delete.component.html',
  styleUrls: ['./team-delete.component.scss']
})
export class TeamDeleteComponent implements OnInit {

  @Input() selectedTeam: Team;

  @Output() deleteSuccessEvent = new EventEmitter<string>();

  errorMsg: string;
  hasError = false;

  constructor(private teamService: TeamService,
    private toastr: ToastrService) {

  }

  ngOnInit(): void {
  }

  delete() {
    this.hasError = false;
    this.teamService.DeleteTeam(this.selectedTeam.id).subscribe((data: any) => {
      if (data === false) {
        this.hasError = true;
      } else {
        this.hasError = false;
        this.deleteSuccessEvent.emit("value");
        this.toastr.info(team_delete.delete_team_success);
        $('#deleteTeam').modal('toggle');
      }
    }, (error) => {
      this.errorMsg = error;
      this.toastr.error(team_delete.delete_team_error);
      this.hasError = false;
    })
  }

}
