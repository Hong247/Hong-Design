window.HOMEPAGE_CONTENT = {
  intro: {
    kicker: "Vancouver, BC / multidisciplinary design",
    statement: "Working across visual identity, product design, and production-ready design assets — with a focus on clarity, restraint, and strong visual structure.",
    detail: "Good design should feel intentional, useful, and visually disciplined. Each project is built through careful decisions: composition, hierarchy, and how every detail holds together across real-world applications."
  },
  facts: [
    {
      label: "Focus",
      value: "Visual identity / product design / production-ready design assets"
    },
    {
      label: "Tools",
      value: "Adobe CC / Figma / SolidWorks / KeyShot / rendering / research"
    },
    {
      label: "Experience",
      value: "Work across retail, mobility, recruitment, environmental campaigns, and product concepts"
    }
  ],
  links: [
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/cheok-hong-lai/",
      external: true
    },
    {
      label: "Email",
      href: "mailto:cheokhong.design@gmail.com",
      email: "cheokhong.design@gmail.com",
      copyLabel: "⧉",
      copiedText: "Email copied"
    }
  ]
};

document.addEventListener("DOMContentLoaded", function () {
  applyHomepageContent(window.HOMEPAGE_CONTENT);
});

function applyHomepageContent(content) {
  if (!content) {
    return;
  }

  if (content.intro) {
    setHomepageText(".intro-kicker", content.intro.kicker);
    setHomepageText(".intro-statement", content.intro.statement);
    setHomepageText(".intro-detail", content.intro.detail);
  }

  if (content.facts) {
    renderHomepageFacts(content.facts);
  }

  if (content.links) {
    renderHomepageLinks(content.links);
  }
}

function setHomepageText(selector, value) {
  var element = document.querySelector(selector);

  if (element && value) {
    element.textContent = value;
  }
}

function renderHomepageFacts(facts) {
  var list = document.querySelector(".profile-facts");

  if (!list) {
    return;
  }

  list.innerHTML = "";

  facts.forEach(function (fact) {
    var item = document.createElement("div");
    var term = document.createElement("dt");
    var description = document.createElement("dd");

    term.textContent = fact.label;
    description.textContent = fact.value;

    item.appendChild(term);
    item.appendChild(description);
    list.appendChild(item);
  });
}

function renderHomepageLinks(links) {
  var list = document.querySelector(".social-links");

  if (!list) {
    return;
  }

  list.innerHTML = "";

  links.forEach(function (linkItem) {
    var item = document.createElement("li");
    var link = document.createElement("a");

    link.href = linkItem.href;
    link.textContent = linkItem.label;

    if (linkItem.external) {
      link.target = "_blank";
      link.rel = "noopener";
    }

    item.appendChild(link);

    if (linkItem.email) {
      item.className = "email-contact-item";
      item.appendChild(createEmailCopyButton(linkItem, item));
      item.appendChild(createEmailCopyFeedback(linkItem));
    }

    list.appendChild(item);
  });
}

function createEmailCopyButton(linkItem, container) {
  var copyButton = document.createElement("button");

  copyButton.type = "button";
  copyButton.className = "email-copy-button";
  copyButton.setAttribute("aria-label", "Copy email address");
  copyButton.textContent = linkItem.copyLabel || "⧉";

  copyButton.addEventListener("click", function (event) {
    event.preventDefault();
    event.stopPropagation();
    copyHomepageEmailAddress(linkItem.email, container);
  });

  return copyButton;
}

function createEmailCopyFeedback(linkItem) {
  var feedback = document.createElement("span");

  feedback.className = "email-copy-feedback";
  feedback.textContent = linkItem.copiedText || "Email copied";

  return feedback;
}

function copyHomepageEmailAddress(email, container) {
  function showCopiedState() {
    if (!container) {
      return;
    }

    container.classList.add("is-copied");
    window.clearTimeout(container.copyTimer);
    container.copyTimer = window.setTimeout(function () {
      container.classList.remove("is-copied");
    }, 1400);
  }

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(email).then(showCopiedState).catch(function () {
      fallbackHomepageCopyEmailAddress(email);
      showCopiedState();
    });
    return;
  }

  fallbackHomepageCopyEmailAddress(email);
  showCopiedState();
}

function fallbackHomepageCopyEmailAddress(email) {
  var temporaryInput = document.createElement("textarea");

  temporaryInput.value = email;
  temporaryInput.setAttribute("readonly", "readonly");
  temporaryInput.style.position = "fixed";
  temporaryInput.style.top = "-9999px";
  temporaryInput.style.left = "-9999px";
  document.body.appendChild(temporaryInput);
  temporaryInput.select();
  document.execCommand("copy");
  document.body.removeChild(temporaryInput);
}
