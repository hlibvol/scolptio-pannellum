// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// export const environment = {
//   production: false,
//   apiUrl: 'https://localhost:5001/api/'
// };
export const environment = {
  production: false,
  baseUrl: window["env"]["apiUrl"] || "",
  s3ModelUrl: window["env"]["s3ModelUrl"] || "https://d2pz0mg31mouq1.cloudfront.net/",
  echo3dUrl: window["env"]["echo3dUrl"] || "",
  debug: window["env"]["debug"] || false,
  bucket : window["env"]["bucket"] || "",
  region : window["env"]["region"] || "",
  s3AccessKeyId : window["env"]["s3AccessKeyId"] || "",
  s3SecretAccessKey : window["env"]["s3SecretAccessKey"] || "",
  salesSiteUrl : window["env"]["salesSiteUrl"] || ""
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
