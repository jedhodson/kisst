export default {
    baseUrl: ( findGetParameter('ip') == null ? location.hostname : findGetParameter('ip') ),
    port: ( findGetParameter('port') == null ? location.port : findGetParameter('port') )
}

function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
          tmp = item.split("=");
          if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        });
    return result;
}