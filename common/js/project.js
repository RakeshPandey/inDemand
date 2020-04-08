"use strict";
"use es6";
function hs_i18n_log(n) {
    console.log("i18n_getmessage: " + n)
}
function hs_i18n_substituteStrings(n, e) {
    var s = n.match(new RegExp("\\$[0-9]+","g"));
    if (null == s)
        return n;
    for (var l = 0; l < s.length; l++) {
        var r = s[l]
          , t = parseInt(r.replace("$", ""));
        t <= 0 || null == e || t > e.length ? hs_i18n_log("no substitution string at index " + t + " found for string '" + n + "'") : n = n.replace(r, e[t - 1])
    }
    return n
}
function hs_i18n_insertPlaceholders(n, e) {
    var s = n.message
      , l = s.match(new RegExp("\\$\\w+\\$","g"));
    if (null == l)
        return s;
    for (var r = 0; r < l.length; r++) {
        var t = l[r]
          , o = t.replace(new RegExp("\\$","g"), "").toLowerCase()
          , u = n.placeholders[o];
        null == u && hs_i18n_log("no placeholder found for '" + o + "'");
        s = s.replace(t, u.content)
    }
    return (s = hs_i18n_substituteStrings(s, e)).replace(/\$\$/g, "$")
}
function hs_i18n_getMessage(n, e) {
    if (null == n) {
        hs_i18n_log("no messages found");
        return ""
    }
    var s = arguments[2];
    if (null == s || 0 == s.length || null == s[0]) {
        hs_i18n_log("no message name passed");
        return ""
    }
    var l = s[0]
      , r = e.split("-")[0]
      , t = null == t && r != e ? n[r] : n[e];
    if (null == t) {
        hs_i18n_log("no messages found for language '" + e + "'");
        return ""
    }
    var o = null == o && r != e ? n[r][l] : t[l];
    if (null == o) {
        hs_i18n_log("no message found for language '" + e + "' named '" + l + "'");
        return ""
    }
    return hs_i18n_insertPlaceholders(o.placeholders, s[1])
}

//# sourceMappingURL=project.js.map