# Land Hub

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.0.6.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

##Modules
- Client
--Add/edit/update
---First Name*, Last Name*, Email*, Phone*, Company Name, Address, Logo, Website

- Projects (list view like property lead list in ph. Blend with -- https://mannatthemes.com/dastone/default/apps-project-projects.html)
-- Add/edit/update
-- When open, looks like property details view (with cleanup)
---Fields: Project Name*, Client* (dropdown select), Start date*, Deadline, Cost, Status (Planning, CAD drawing, 3D Modeling, Final Rendering, Completed)

- Project Board (sub menu under projects. View design - https://mannatthemes.com/dastone/default/apps-project-board.html#)
-- Following columns in the board - Planning, CAD drawing, 3D Modeling, Final Rendering, Completed
- Invoices (sub menu under projects. Integrated to Strip api for creating and sending invoices)
