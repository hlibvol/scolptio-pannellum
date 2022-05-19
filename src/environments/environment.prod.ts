export const environment = {
  production: true,
  baseUrl: window["env"]["apiUrl"] || "",
  s3ModelUrl: window["env"]["s3ModelUrl"] || "",
  debug: window["env"]["debug"] || false,
  bucket : window["env"]["bucket"] || "",
  region : window["env"]["region"] || "",
  s3AccessKeyId : window["env"]["s3AccessKeyId"] || "",
  s3SecretAccessKey : window["env"]["s3SecretAccessKey"] || "",
  salesSiteUrl : window["env"]["salesSiteUrl"] || ""
};