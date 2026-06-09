document.addEventListener("DOMContentLoaded", function () {
  var themeToggle = document.getElementById("themeToggle");
  var projectButtons = document.querySelectorAll(".custom-btn[data-target]");
  var hoverTriggers = document.querySelectorAll(".hover-trigger");

  applySavedTheme();
  elevatePortfolioCopy();
  groupProjectDescriptions();
  setScrolling();
  setPageOverflow();

  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
  }

  projectButtons.forEach(function (button) {
    button.setAttribute("aria-expanded", "false");

    button.addEventListener("click", function () {
      var targetSelector = button.getAttribute("data-target");
      var target = document.querySelector(targetSelector);

      if (!target) {
        return;
      }

      document.querySelectorAll("tr.collapse").forEach(function (row) {
        if (row !== target) {
          row.classList.remove("is-open");
          setExpandedState(row.id, false);
        }
      });

      var isOpen = target.classList.toggle("is-open");
      setExpandedState(target.id, isOpen);

      if (isOpen) {
        scrollProjectHeaderIntoView(button);
      }
    });
  });

  hoverTriggers.forEach(function (trigger) {
    trigger.addEventListener("mouseenter", function () {
      displayHoveredImage(trigger.getAttribute("data-image-source"));
    });

    trigger.addEventListener("mouseleave", hideHoveredImage);
  });

  window.addEventListener("resize", function () {
    setScrolling();
    setPageOverflow();
  });
});

function applySavedTheme() {
  document.body.classList.remove("dark-mode");
  document.body.classList.add("light-mode");
  localStorage.setItem("theme", "light");
}

function toggleTheme() {
  var willBeDark = document.body.classList.contains("light-mode");

  document.body.classList.toggle("dark-mode", willBeDark);
  document.body.classList.toggle("light-mode", !willBeDark);
  localStorage.setItem("theme", willBeDark ? "dark" : "light");
}

function setScrolling() {
  var leftContent = document.querySelector(".left-theme .overlay-text");
  var rightContent = document.querySelector(".right-theme .scroll-wrapper");

  if (!leftContent || !rightContent) {
    return;
  }

  if (window.innerWidth <= 768) {
    leftContent.style.overflowY = "hidden";
    rightContent.style.overflowY = "visible";
    return;
  }

  leftContent.style.overflowY = leftContent.scrollHeight > leftContent.clientHeight ? "auto" : "hidden";
  rightContent.style.overflowY = "auto";
}

function setPageOverflow() {
  document.body.style.overflowY = window.innerWidth <= 768 ? "auto" : "hidden";
}

function elevatePortfolioCopy() {
  setText(".intro-kicker", "Vancouver, BC / brand systems, visual direction, product thinking");
  setText(".intro-statement", "I build visual systems that translate strategy into clear, memorable, and commercially usable design.");
  setText(".intro-detail", "My work sits between brand identity, campaign direction, digital experience, product design, and rendered visualization. I approach design as a system of decisions: how an idea is positioned, how it behaves across touchpoints, and how it can remain consistent when it moves from concept into production.");

  updateFact("Focus", "Brand systems / campaign direction / product-led visual experiences");
  updateFact("Tools", "Adobe CC / Figma / SolidWorks / KeyShot / research / art direction");
  updateFact("Experience", "Work across hospitality, retail, mobility, recruitment, environmental campaigns, and product concepts");

  var descriptions = {
    demo1: [
      {
        label: "Context",
        text: "Kee is a brand identity concept for a wonton noodle shop rooted in Malaysian Chinese food culture. Rather than treating the project as a surface-level restaurant logo, I built the direction around rhythm, line, and the cultural memory of handmade noodles. The identity uses the Yuwei typeface, linear movement, and restrained composition to connect typography with the physical gesture of cooking."
      },
      {
        label: "Direction",
        text: "The visual system is structured around four material cues: carbon, moonstone, flour white, and brandy yellow. Each colour is tied to a specific sensory reference, from charcoal heat to flour dust and the shifting warmth of noodles under different light. The result is an identity that feels quiet, traditional, and contemporary without relying on nostalgic decoration."
      }
    ],
    demo2: [
      {
        label: "Context",
        text: "maia is a luxury fashion and beauty identity exploring softness, confidence, and modern femininity. The challenge was to create a premium language that could hold aspiration and intimacy at the same time: refined enough for fashion, but warm enough for beauty and personal care."
      },
      {
        label: "Direction",
        text: "I developed the identity through a restrained logo, muted tonal palette, softened imagery, and elegant typographic pacing. The art direction uses blur, atmosphere, and negative space to create a sense of desirability without becoming cold or inaccessible. Across digital, print, and campaign applications, the system positions maia as polished, calm, and emotionally precise."
      }
    ],
    demo3: [
      {
        label: "Context",
        text: "This rebrand concept for Browns Shoes Inc. investigates how an established national footwear retailer could sharpen its visual presence beyond a logo refresh. The goal was to make the brand feel cleaner, more modern, and more product-led while preserving its accessibility as a lifestyle retailer."
      },
      {
        label: "Direction",
        text: "I built the system around an inhuman art direction: reducing reliance on models so the footwear becomes the central character. Colour, texture, material contrast, and spatial composition work together to create a sleeker retail language where products carry the narrative. This approach gives Browns a more ownable visual world while keeping the brand commercially flexible."
      }
    ],
    demo4: [
      {
        label: "Context",
        text: "monday is an office-chair brand and website prototype developed for a product entering a crowded furniture market. The identity needed to communicate trust, resilience, authenticity, and subtlety without falling into generic workplace minimalism."
      },
      {
        label: "Direction",
        text: "The lowercase logo and prototype direction draw from Bauhaus efficiency, geometric restraint, and quiet utility. I treated the chair not as an object that demands attention, but as a support system that sits beside the user. Wider letter spacing, calm interface rhythm, and restrained product presentation make the brand feel dependable, understated, and designed for daily use."
      }
    ],
    demo5: [
      {
        label: "Context",
        text: "Kill The Bride is a speculative film-poster series imagining a spiritual sequel to Kill Bill. The project examines how an established action-revenge visual language could be extended decades later without simply repeating the original films."
      },
      {
        label: "Direction",
        text: "I built the series around graphic force, controlled colour contrast, and a blue-led palette that expands the familiar red and yellow visual world. The posters use bold typography, compressed tension, and confident composition to balance homage with authorship. The result is a campaign system that feels connected to the franchise while giving the sequel its own visual temperature."
      }
    ],
    demo6: [
      {
        label: "Context",
        text: "Stop Haunting Mother Nature is an environmental awareness campaign concept for WWF. Instead of using expected nature imagery, the campaign reframes pollution as a horror narrative where human activity becomes the threat."
      },
      {
        label: "Direction",
        text: "The series restyles recognizable horror references including The Silence of the Lambs, The Shining, and Halloween into environmental messages. Familiar poster silhouettes create immediate recognition, while altered details reveal the campaign idea: nature is not the monster, it is the victim. This strategy uses pop-culture memory as a shortcut to emotional impact and makes the call for environmental responsibility feel sharper and less predictable."
      }
    ],
    demo7: [
      {
        label: "Context",
        text: "X̱wáýx̱way is a speculative vinyl soundtrack album dedicated to Stanley Park in Vancouver. The project treats the park as living history rather than a tourist landmark, connecting landscape, memory, Indigenous presence, ecology, and contemporary city life through sound and print."
      },
      {
        label: "Direction",
        text: "The album is structured around six themes: Indigenous history, woods, waves, land, wind, and modernization. I used a monochromatic retro direction to make the object feel archival and collectible, as if it belonged to both a record shelf and a civic memory project. The work imagines design as a fundraising object, a listening experience, and a preservation tool."
      }
    ],
    demo8: [
      {
        label: "Context",
        text: "raku haru is a hijab brand identity focused on accessible elegance. The logo needed to feel feminine, modern, and timeless while supporting a product range designed for women across different ages, contexts, and personal styles."
      },
      {
        label: "Direction",
        text: "I developed a visual direction that balances softness with clarity. The mark avoids over-decoration and instead relies on proportion, restraint, and a calm brand tone. The result is an identity that can support affordable products while still feeling considered, polished, and emotionally warm."
      }
    ],
    demo9: [
      {
        label: "Context",
        text: "This digital catalogue prototype for TRAPO explores a more efficient alternative to printed sales materials. Designed in Figma, the tool was created with offline sales teams, in-store promotion, and quick product comparison in mind."
      },
      {
        label: "Direction",
        text: "The interface prioritizes speed, product hierarchy, and practical navigation over decorative interaction. I focused on making information easier to retrieve in a sales conversation, reducing dependency on paper while improving presentation consistency. The prototype demonstrates how a brand can turn product information into a scalable sales experience rather than a static catalogue."
      }
    ],
    demo10: [
      {
        label: "Context",
        text: "This MagSafe-compatible smartphone holder was developed as a flagship product concept for TRAPO. The design needed to feel more ownable than a generic accessory while still respecting practical constraints around size, mounting, heat, and manufacturing."
      },
      {
        label: "Direction",
        text: "I worked through form development, rendering, material direction, and brand integration. The final direction uses the company logo as a silhouette cue, pairs premium Alcantara material with a glow LED detail, and balances automotive luxury with everyday usability. The concept positions the holder as a branded object rather than an anonymous utility part."
      }
    ],
    demo11: [
      {
        label: "Context",
        text: "For Talentlounge, I designed and rendered a virtual career fair experience that helped job seekers explore opportunities through an online 3D environment. The challenge was to make digital recruitment feel more engaging without sacrificing orientation, clarity, or navigation."
      },
      {
        label: "Direction",
        text: "My role covered visual direction, 3D modelling, rendering, and website integration. I created booth environments, category-based exploration, and visual assets that supported communication between candidates and employers. The experience translates the structure of a physical fair into a digital space while keeping the interface approachable and easy to scan."
      }
    ],
    demo12: [
      {
        label: "Context",
        text: "Nexus is a public furniture concept created for the Malaysia National Design Competition TRANSEAT, where our team became a top 10 finalist. The project reimagines station seating as a connector for people, movement, and public space."
      },
      {
        label: "Direction",
        text: "Inspired by the Serambi concept in traditional Malay houses, the bench encourages pause, interaction, and continuity within MRT environments. The design uses Thermoplastic Elastomer, modular construction, and illuminated edge details to create a seating system that is functional, symbolic, and memorable in transit spaces. It treats public furniture as both infrastructure and cultural gesture."
      }
    ],
    demo13: [
      {
        label: "Context",
        text: "During my internship with Motorola Solutions, I completed a 12-week product design project for a two-way radio concept. The process covered research, concept development, 2D exploration, 3D modelling, rendering, and final presentation."
      },
      {
        label: "Direction",
        text: "I visited 14 hotels to observe staff communication across different service environments. Those observations revealed opportunities around size, multitasking, information access, and product aesthetics. The final concept is a compact radio with a hidden display, LED indicator, intuitive controls, and an ergonomic form designed around real workplace behaviour rather than abstract styling."
      }
    ],
    demo14: [
      {
        label: "Context",
        text: "E&K is an automotive accessories and installation brand identity. The logo needed to feel simple, sharp, and memorable while reflecting the brand's focus on cars, customization, and service."
      },
      {
        label: "Direction",
        text: "I developed a compact mark from the letters E and K, creating a technical visual form without making it overly complex. The identity is designed to work across signage, decals, packaging, and digital applications, giving the brand a clean and adaptable system suited to automotive environments."
      }
    ]
  };

  Object.keys(descriptions).forEach(function (id) {
    var row = document.getElementById(id);

    if (!row) {
      return;
    }

    var cell = row.querySelector("td");
    var existingParagraphs = Array.from(cell.querySelectorAll(":scope > p"));

    existingParagraphs.forEach(function (paragraph) {
      paragraph.remove();
    });

    descriptions[id].forEach(function (item, index) {
      var paragraph = document.createElement("p");

      if (index === 0) {
        paragraph.className = "max-width-paragraph";
      }

      var label = document.createElement("span");
      label.className = "case-label";
      label.textContent = item.label;

      paragraph.appendChild(label);
      paragraph.appendChild(document.createTextNode(item.text));
      cell.appendChild(paragraph);
    });
  });
}

function setText(selector, value) {
  var element = document.querySelector(selector);

  if (element) {
    element.textContent = value;
  }
}

function updateFact(label, value) {
  document.querySelectorAll(".profile-facts div").forEach(function (item) {
    var term = item.querySelector("dt");
    var description = item.querySelector("dd");

    if (term && description && term.textContent.trim() === label) {
      description.textContent = value;
    }
  });
}

function groupProjectDescriptions() {
  document.querySelectorAll("tr.collapse > td").forEach(function (cell) {
    if (cell.querySelector(".project-detail")) {
      return;
    }

    var media = cell.querySelector(":scope > .scroll-container");
    var paragraphs = Array.from(cell.querySelectorAll(":scope > p"));

    if (!media || !paragraphs.length) {
      return;
    }

    var detail = document.createElement("div");
    detail.className = "project-detail";

    var description = document.createElement("div");
    description.className = "project-description";

    media.before(detail);
    detail.appendChild(media);
    detail.appendChild(description);

    paragraphs.forEach(function (paragraph) {
      description.appendChild(paragraph);
    });

    Array.from(cell.querySelectorAll(":scope > br")).forEach(function (breakElement) {
      breakElement.remove();
    });
  });
}

function setExpandedState(targetId, isExpanded) {
  if (!targetId) {
    return;
  }

  document.querySelectorAll('.custom-btn[data-target="#' + targetId + '"]').forEach(function (button) {
    button.setAttribute("aria-expanded", isExpanded ? "true" : "false");
  });
}

function scrollProjectHeaderIntoView(button) {
  var projectHeader = button.closest(".hover-trigger");
  var scrollWrapper = projectHeader ? projectHeader.closest(".scroll-wrapper") : null;
  var tableHeader = document.querySelector("thead");

  if (!projectHeader) {
    return;
  }

  window.requestAnimationFrame(function () {
    window.requestAnimationFrame(function () {
      if (scrollWrapper && window.innerWidth > 768) {
        var headerHeight = tableHeader ? tableHeader.getBoundingClientRect().height : 0;
        var currentTop = projectHeader.getBoundingClientRect().top - scrollWrapper.getBoundingClientRect().top + scrollWrapper.scrollTop;

        scrollWrapper.scrollTo({
          top: currentTop - headerHeight,
          behavior: "smooth"
        });
        return;
      }

      var mobileHeaderHeight = tableHeader && window.getComputedStyle(tableHeader).display !== "none" ? tableHeader.getBoundingClientRect().height : 0;

      window.scrollTo({
        top: projectHeader.getBoundingClientRect().top + window.pageYOffset - mobileHeaderHeight,
        behavior: "smooth"
      });
    });
  });
}

function displayHoveredImage(imageSource) {
  var hoveredImage = document.querySelector(".hovered-image");

  if (!hoveredImage || !imageSource) {
    return;
  }

  hoveredImage.src = imageSource;
  hoveredImage.style.display = "block";
}

function hideHoveredImage() {
  var hoveredImage = document.querySelector(".hovered-image");

  if (hoveredImage) {
    hoveredImage.style.display = "none";
  }
}
