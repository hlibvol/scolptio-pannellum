(function(window) {
 window.env = window.env || {};

 // Environment variables
 window["env"]["apiUrl"] = "${API_URL}";
 window["env"]["echo3dUrl"] = "${ECHO3D_URL}";
 window["env"]["debug"] = "${DEBUG}";
 window["env"]["bucket"] = "${bucket}";
 window["env"]["region"] = "${region}";
 window["env"]["s3AccessKeyId"] = "${s3AccessKeyId}";
 window["env"]["s3SecretAccessKey"] = "${s3SecretAccessKey}";
 window["env"]["salesSiteUrl"] = "${salesSiteUrl}";
})(this);