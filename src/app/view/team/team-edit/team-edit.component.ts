import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Role, Team } from '../team.model';
import { TeamService } from '../team.service';
import { ToastrService } from 'ngx-toastr';
import { team_edit } from 'src/app/shared/toast-message-text';

declare var $: any;
@Component({
  selector: 'app-team-edit',
  templateUrl: './team-edit.component.html',
  styleUrls: ['./team-edit.component.scss',
    '../../../../assets/css/app.css',
    '../../../../assets/css/icons.css']
})
export class TeamEditComponent implements OnInit, OnChanges {

  @Input() selectedTeam: Team;

  @Output() updateSuccessEvent = new EventEmitter<string>();

  errorMsg = '';
  userRoles: Role[];
  isLoading = false;
  members: any[];
  teamName: string;
  selectedRole: string;
  isSaving = false;

  constructor(private teamService: TeamService,
    private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.GetRoles();
    this.GetUsersInformationByOrg();
  }

  ngOnChanges() {
    this.reset();
    if (this.selectedTeam) {
      this.teamName = this.selectedTeam.teamName;
      const userRole = this.userRoles.find((x: any) => x.title === this.selectedTeam.role);
      if (userRole) {
        this.selectedRole = userRole.id;
      }
      this.prepareMemberData();
    }
  }

  prepareMemberData() {
    if (this.selectedTeam.users != null && this.selectedTeam.users.length > 0) {
      const members = document.getElementById('members-edit');
      if (members) {
        const options = members['options'];
        if (options && options.length > 0) {
          for (let i = 0; i < options.length; i++) {
            const isExist = this.selectedTeam.users.find((x: any) => x.id === options[i].value);

            if (isExist) {
              $('#members-edit')[0]['options'][i].selected = true;
            } else {
              $('#members-edit')[0]['options'][i].selected = false;
            }
          }
        }
      }
    }
    if ($('.select2').length) {
      $('.select2').select2();
    }
  }


  save(form: any) {
    this.errorMsg = '';
    const teamMembers = [];
    const members = document.getElementById('members-edit');
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
    this.teamService.UpdateTeam(this.selectedTeam.id, this.teamName, this.selectedTeam.organizationId, teamMembers, this.selectedRole).subscribe((data: any) => {
      this.isSaving = false;
      this.updateSuccessEvent.emit("value");
      this.toastr.info(team_edit.edit_team_success);
      this.close(form);
    }, (error) => {
      this.errorMsg = error;
      this.toastr.error(team_edit.edit_team_error);
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
    }, (error) => {
      this.errorMsg = 'Something went wrong. Please try again later.';
      this.isLoading = false;
    })
  }

  reset() {
    this.selectedRole = undefined;
    this.teamName = undefined;
    const members = document.getElementById('members-edit');
    if (members) {
      const options = members['options'];
      if (options && options.length > 0) {
        for (let i = 0; i < options.length; i++) {
          $('#members-edit')[0]['options'][i].selected = false;
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
    $('#editTeam').modal('toggle');
  }

}
