import { AfterViewInit, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Role } from '../team.model';
import { TeamService } from '../team.service';
import { ToastrService } from 'ngx-toastr';
import { team_add } from 'src/app/shared/toast-message-text';

declare var $: any;
@Component({
  selector: 'app-team-add',
  templateUrl: './team-add.component.html',
  styleUrls: ['./team-add.component.scss',
    '../../../../assets/css/app.css',
    '../../../../assets/css/icons.css']
})
export class TeamAddComponent implements OnInit, AfterViewInit {

  @Output() addSuccessEvent = new EventEmitter<string>();

  errorMsg = '';
  userRoles: Role[];
  isLoading = false;
  members: any[];
  teamName: string;
  selectedRole: string;
  isSaving = false;
  constructor(private teamService: TeamService,
    private toastr: ToastrService) {
    this.selectedRole = null;
  }

  ngOnInit(): void {
    this.GetRoles();
    this.GetUsersInformationByOrg();
  }

  ngAfterViewInit() {
    this.reset()
  }

  save(form: any) {
    this.errorMsg = '';
    const teamMembers = [];
    const members = document.getElementById('members-add');
    if (members != null) {
      const options = members['options'];
      if (options && options.length > 0) {
        for (const option of options) {
          if (option.selected) {
            teamMembers.push(option.value);
          }
        }
      }
    }
    this.isSaving = true;
    this.teamService.SaveTeam(this.teamName, teamMembers, this.selectedRole).subscribe((data: any) => {
      this.isSaving = false;
      this.addSuccessEvent.emit("value");
      this.toastr.info(team_add.add_team_success);
      this.close(form);
    }, (error) => {
      this.errorMsg = error;
      this.toastr.error(team_add.add_team_error);
      this.isSaving = false;
    })
  }

  GetRoles() {
    this.isLoading = true;
    this.teamService.GetRole(1, 100, null, null).subscribe((data: any) => {
      this.userRoles = data;
      const index = this.userRoles.findIndex(x => x.title.toLocaleLowerCase() === 'superadmin');
      if (index > -1) {
        this.userRoles.splice(index, 1);
      }
      const defaultUser = this.userRoles.find(x => x.title.toLocaleLowerCase() === 'defaultuser');
      if (defaultUser) {
        defaultUser.title = defaultUser.title.replace('User', ' User');
      }
      this.isLoading = false;
    }, (error) => {
      this.errorMsg = 'Something went wrong. Please try again later.';
      this.isLoading = false;
    })
  }


  GetUsersInformationByOrg() {
    this.isLoading = true;
    this.teamService.GetUsersInformationByOrg(1, 1000).subscribe((data: any[]) => {
      this.isLoading = false;
      this.members = data;
      if ($('.select2').length) {
        $('.select2').select2();
      }
    }, (error) => {
      this.errorMsg = 'Something went wrong. Please try again later.';
      this.isLoading = false;
    })
  }

  reset() {
    this.selectedRole = null;
    this.teamName = undefined;
    const members = document.getElementById('members-add');
    if (members) {
      const options = members['options'];
      if (options && options.length > 0) {
        for (let i = 0; i < options.length; i++) {
          $('#members-add')[0]['options'][i].selected = false;
        }
      }
    }
    if ($('.select2').length) {
      $('.select2').select2();
    }
  }

  close(form: any) {
    form.resetForm();
    this.reset();
    $('#addTeams').modal('toggle');

  }

}
