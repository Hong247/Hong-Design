(function () {
  var MOJIBAKE_PATTERN = /[\u00c3\u00c2\u00e2\u00cc\u00e6\u0080]/;
  var IMAGE_SRC_REPLACEMENTS = {
    "images/wwf/wwf2.jpg": "images/wwf/wwf2 copy.jpg"
  };
  var IMAGE_ALT_TEXT = {
    "images/C Market Coffee Website/cmarket website 1.jpg": "C Market Coffee Shopify homepage and featured product layout",
    "images/C Market Coffee Website/cmarket website 2.png": "C Market Coffee drink and bakery product feature section",
    "images/C Market Coffee Website/cmarket website 3.png": "C Market Coffee menu and product collection page",
    "images/C Market Coffee Website/cmarket website 4.png": "C Market Coffee coffee beans collection interface",
    "images/C Market Coffee Website/cmarket website 5.png": "C Market Coffee mobile app promotion section",
    "images/C Market Coffee Website/cmarket website 6.png": "C Market Coffee barista classes information section",
    "images/C Market Coffee Website/cmarket website 7.png": "C Market Coffee pop-up market website banner",
    "images/C Market Coffee Tote Bag/c market coffee tote bag 1.jpg": "C Market Coffee black tote bag merchandise mockup",
    "images/C Market Coffee Tote Bag/c market coffee tote bag 2.jpg": "C Market Coffee natural tote bag merchandise mockup",
    "images/kaia/kaia1.png": "KAIA Korean sauce brand identity full system overview",
    "images/kaia/kaia2.png": "KAIA brand identity Latin letterform color-block poster",
    "images/kaia/kaia3.png": "KAIA brand identity Hangul character color-block poster",
    "images/kaia/kaia4.png": "KAIA brand identity additional design application",
    "images/kee/keea.jpg": "Kee wonton noodle shop brand application on packaging",
    "images/kee/keeb.jpg": "Kee identity typography and color system presentation",
    "images/kee/keec.jpg": "Kee logo and menu brand layout",
    "images/kee/keed.jpg": "Kee restaurant collateral and packaging mockup",
    "images/kee/keee.jpg": "Kee noodle shop visual identity application",
    "images/kee/keef.jpg": "Kee storefront and takeout brand application",
    "images/kee/kee1.gif": "Kee animated noodle identity motion graphic",
    "images/kee/kee2.gif": "Kee animated brand motion sequence",
    "images/kee/Kee1.jpg": "Kee brand identity presentation board",
    "images/kee/Kee2.jpg": "Kee typography and graphic system board",
    "images/kee/Kee3.jpg": "Kee packaging and restaurant identity board",
    "images/kee/keem1.jpg": "Kee motion asset still with noodle-inspired graphic forms",
    "images/kee/keem2.jpg": "Kee motion asset still with flowing identity graphics",
    "images/kee/keem3.jpg": "Kee motion asset still for restaurant brand system",
    "images/kee/keem4.jpg": "Kee motion asset still with animated brand composition",
    "images/maia/maia3.jpg": "maia luxury beauty identity packaging composition",
    "images/maia/maia4.jpg": "maia soft-focus fashion and beauty brand visual",
    "images/maia/maia5.jpg": "maia muted palette brand application layout",
    "images/maia/maia6.jpg": "maia product styling and typography layout",
    "images/maia/maia7.jpg": "maia campaign imagery and identity system mockup",
    "images/browns/browns1.png": "Browns Shoes product-led rebrand campaign layout",
    "images/browns/browns2.png": "Browns Shoes footwear color and material art direction",
    "images/browns/browns3.png": "Browns Shoes ecommerce product grid identity concept",
    "images/browns/browns3.jpg": "Browns Shoes footwear campaign composition",
    "images/browns/browns4.jpg": "Browns Shoes product-focused retail poster concept",
    "images/browns/browns5.jpg": "Browns Shoes footwear texture and styling study",
    "images/browns/browns6.jpg": "Browns Shoes campaign system application",
    "images/browns/browns7.jpg": "Browns Shoes editorial footwear layout",
    "images/monday/monday1.jpg": "monday office chair website prototype hero screen",
    "images/monday/monday2.jpg": "monday office chair brand and product interface screen",
    "images/killthebride/killthebride1.jpg": "Kill The Bride speculative sequel poster in blue palette",
    "images/killthebride/killthebride2.jpg": "Kill The Bride action poster typography study",
    "images/killthebride/killthebride3.jpg": "Kill The Bride graphic film poster variation",
    "images/killthebride/killthebride4.jpg": "Kill The Bride franchise poster system application",
    "images/wwf/wwf1.jpg": "WWF horror-inspired environmental campaign poster",
    "images/wwf/wwf2 copy.jpg": "WWF environmental campaign poster with horror film reference",
    "images/wwf/wwf3.jpg": "WWF Stop Haunting Mother Nature poster concept",
    "images/wwf/wwf4.jpg": "WWF campaign poster reframing pollution as horror",
    "images/wwf/wwf5.jpg": "WWF environmental awareness poster with cinematic composition",
    "images/wwf/wwf6.jpg": "WWF horror campaign layout for nature protection",
    "images/wwf/wwf7.jpg": "WWF poster using fear-based environmental messaging",
    "images/wwf/wwf8.jpg": "WWF campaign series poster with altered horror imagery",
    "images/x/x1.jpg": "Xway vinyl album cover for Stanley Park archival soundtrack",
    "images/x/x2.jpg": "Xway vinyl sleeve and liner note design",
    "images/x/x3.jpg": "Xway record packaging with monochromatic archival layout",
    "images/x/x4.jpg": "Xway album spread connecting landscape and memory",
    "images/x/x5.gif": "Xway animated vinyl soundtrack presentation",
    "images/x/x6.jpg": "Xway editorial album packaging detail",
    "images/x/x7.jpg": "Xway Stanley Park soundtrack design application",
    "images/rakuharu/rakuharu1.jpg": "raku haru hijab brand identity logo presentation",
    "images/rakuharu/rakuharu2.jpg": "raku haru accessible luxury packaging concept",
    "images/rakuharu/rakuharu3.jpg": "raku haru modest fashion brand application",
    "images/trapodpc/trapodpc1.png": "TRAPO digital catalogue Figma prototype home screen",
    "images/trapodpc/trapodpc2.png": "TRAPO digital catalogue product category interface",
    "images/trapodpc/trapodpc3.png": "TRAPO digital catalogue product detail screen",
    "images/traposh/traposh1.jpg": "TRAPO smartphone holder product form render",
    "images/traposh/traposh2.jpg": "TRAPO MagSafe holder front view render",
    "images/traposh/traposh3.jpg": "TRAPO smartphone holder material and LED detail",
    "images/traposh/traposh4.jpg": "TRAPO holder automotive interior product concept",
    "images/traposh/traposh5.jpg": "TRAPO smartphone holder hero render",
    "images/traposh/traposh6.jpg": "TRAPO holder branded silhouette design render",
    "images/traposh/traposh7.jpg": "TRAPO smartphone holder side profile render",
    "images/traposh/traposh8.jpg": "TRAPO premium holder final product presentation",
    "images/talentlounge/talentlounge1.jpg": "Talentlounge virtual career fair 3D booth environment",
    "images/talentlounge/talentlounge2.jpg": "Talentlounge recruitment booth category scene",
    "images/talentlounge/talentlounge3.jpg": "Talentlounge virtual fair employer booth render",
    "images/talentlounge/talentlounge4.jpg": "Talentlounge online career fair navigation environment",
    "images/talentlounge/talentlounge5.jpg": "Talentlounge 3D rendered virtual recruitment space",
    "images/talentlounge/talentlounge6.jpg": "Talentlounge virtual career fair website visual asset",
    "images/nexus/nexus1.jpg": "Nexus MRT station seating concept render",
    "images/nexus/nexus2.jpg": "Nexus modular public bench system render",
    "images/nexus/nexus3.jpg": "Nexus transit seating configuration study",
    "images/nexus/nexus4.jpg": "Nexus illuminated bench detail for MRT stations",
    "images/nexus/nexus5.jpg": "Nexus public furniture material and form presentation",
    "images/nexus/nexus6.jpg": "Nexus TRANSEAT competition final seating concept",
    "images/motorola/motorola1.jpg": "Motorola Solutions compact two-way radio concept render",
    "images/motorola/motorola2.jpg": "Motorola Solutions radio ergonomic form study",
    "images/motorola/motorola3.jpg": "Motorola Solutions hospitality radio product render",
    "images/motorola/motorola4.jpg": "Motorola Solutions radio hidden display concept",
    "images/motorola/motorola5.jpg": "Motorola Solutions radio controls and LED detail",
    "images/motorola/motorola6.jpg": "Motorola Solutions internship final radio presentation",
    "images/e&k/e&k1.jpg": "E&K automotive logo mark application",
    "images/e&k/e&k2.jpg": "E&K vehicle accessories identity mockup",
    "images/e&k/e&k3.jpg": "E&K lettermark logo presentation"
  };

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
      return repairMojibakeString(value);
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

  function getNormalizedImageSrc(src) {
    return IMAGE_SRC_REPLACEMENTS[src] || src;
  }

  function getImageAltText(src, fallback) {
    return IMAGE_ALT_TEXT[getNormalizedImageSrc(src)] || IMAGE_ALT_TEXT[src] || fallback;
  }

  function normalizeDetailHtmlImages(html) {
    if (typeof html !== "string") {
      return html;
    }

    return html.replace(/<img\b(?=[^>]*\bsrc="([^"]+)")[^>]*\balt="[^"]*"/g, function (match, src) {
      var normalizedSrc = getNormalizedImageSrc(src);
      var normalizedMatch = normalizedSrc !== src
        ? match.replace('src="' + src + '"', 'src="' + normalizedSrc + '"')
        : match;
      var alt = getImageAltText(src, "");

      return alt
        ? normalizedMatch.replace(/alt="[^"]*"/, 'alt="' + alt + '"')
        : normalizedMatch;
    });
  }

  function normalizeProjectImages(project) {
    if (!project || typeof project !== "object") {
      return project;
    }

    if (project.preview) {
      project.preview = getNormalizedImageSrc(project.preview);
    }

    if (project.detailHtml) {
      project.detailHtml = normalizeDetailHtmlImages(project.detailHtml);
    }

    if (Array.isArray(project.media)) {
      project.media.forEach(function (item) {
        if (!item || !item.src) {
          return;
        }

        item.src = getNormalizedImageSrc(item.src);
        item.alt = getImageAltText(item.src, item.alt || "");
      });
    }

    return project;
  }

  function normalizeProjectImageData(projects) {
    projects.forEach(normalizeProjectImages);
    return projects;
  }

  function normalizeProjectRegistry() {
    var projects = Array.isArray(window.PORTFOLIO_PROJECTS) ? window.PORTFOLIO_PROJECTS : [];
    window.PORTFOLIO_PROJECTS = normalizeProjectImageData(normalizeTextContent(projects));
  }

  normalizeProjectRegistry();
})();
