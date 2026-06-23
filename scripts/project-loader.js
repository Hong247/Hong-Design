(function () {
  var MOJIBAKE_PATTERN = /[\u00c3\u00c2\u00e2\u00cc\u00e6\u0080]/;
  var IMAGE_PATH_FIXES = {
    "images/wwf/wwf2.jpg": "images/wwf/wwf2 copy.jpg"
  };

  function repairImagePaths(value) {
    Object.keys(IMAGE_PATH_FIXES).forEach(function (badPath) {
      value = value.split(badPath).join(IMAGE_PATH_FIXES[badPath]);
    });
    return value;
  }

  function repairMojibakeString(value) {
    var bytes;
    var index;
    if (typeof value !== "string" || !MOJIBAKE_PATTERN.test(value)) {
      return value;
    }
    bytes = new Uint8Array(value.length);
    for (index = 0; index < value.length; index += 1) {
      if (value.charCodeAt(index) > 255) {
        return value;
      }
      bytes[index] = value.charCodeAt(index);
    }
    try {
      return new TextDecoder("utf-8").decode(bytes);
    } catch (error) {
      return value;
    }
  }

  function normalizeTextContent(value) {
    if (typeof value === "string") {
      return repairImagePaths(repairMojibakeString(value));
    }
    if (Array.isArray(value)) {
      value.forEach(function (item, index) {
        value[index] = normalizeTextContent(item);
      });
      return value;
    }
    if (value && typeof value === "object") {
      Object.keys(value).forEach(function (key) {
        value[key] = normalizeTextContent(value[key]);
      });
    }
    return value;
  }

  function normalizeProjectRegistry() {
    var projects = Array.isArray(window.PORTFOLIO_PROJECTS) ? window.PORTFOLIO_PROJECTS : [];
    window.PORTFOLIO_PROJECTS = normalizeTextContent(projects);
  }

  normalizeProjectRegistry();
})();
