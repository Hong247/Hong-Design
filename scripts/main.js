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
  setText(".intro-detail", "My work sits between brand identity, campaign direction, digital experience, product design, and rendered visualization. I approach design as a system of decisions: how an idea is positioned, how it behaves across touchpoints, how visual language supports business intent, and how a concept can remain coherent when it moves from presentation into production.");

  updateFact("Focus", "Brand systems / campaign direction / product-led visual experiences");
  updateFact("Tools", "Adobe CC / Figma / SolidWorks / KeyShot / research / art direction");
  updateFact("Experience", "Work across hospitality, retail, mobility, recruitment, environmental campaigns, and product concepts");

  var descriptions = {
    demo1: [
      {
        label: "Context",
        text: "Kee is a brand identity concept for a wonton noodle shop rooted in Malaysian Chinese food culture. I treated the brand less as a restaurant logo exercise and more as a study of food memory: the pull of noodles, the steam of broth, the rhythm of handwritten order slips, and the generational familiarity of a simple meal done precisely. The identity uses the Yuwei typeface, linear movement, and restrained composition to connect written language with the physical gesture of cooking."
      },
      {
        label: "Direction",
        text: "The system is built around four material cues: carbon, moonstone, flour white, and brandy yellow. Each colour has a sensory role rather than a decorative one. Carbon references charcoal heat and old kitchens, moonstone softens the contrast between black and white, flour white connects to the raw material of wonton skins and noodles, while brandy yellow captures the shifting warmth of cooked noodles under morning light, fluorescent shop lighting, and broth reflection."
      },
      {
        label: "Observation",
        text: "The visual restraint is intentional. Wonton noodle shops often carry cultural weight through repetition, speed, and inherited craft rather than luxury signals. I wanted the identity to feel quiet enough to belong to a working food environment, but refined enough to translate into signage, packaging, motion graphics, and printed collateral. The linework becomes both a graphic device and a metaphor for continuity: family recipes, noodles, handwriting, and the thread of memory across generations."
      }
    ],
    demo2: [
      {
        label: "Context",
        text: "maia is a luxury fashion and beauty identity exploring softness, confidence, and modern femininity. The project required a visual language that could hold aspiration and intimacy at the same time: refined enough for fashion, but warm enough for beauty and personal care. I approached the brand as something atmospheric rather than decorative, where the feeling of the image matters as much as the mark itself."
      },
      {
        label: "Direction",
        text: "The identity is shaped through a restrained logo, muted tonal palette, softened imagery, and elegant typographic pacing. Blur is used not as an effect, but as a brand behaviour: it creates distance, desirability, and emotional softness. Negative space allows the product and body language to breathe, while the typography avoids excessive contrast so the brand stays polished without becoming cold or inaccessible."
      },
      {
        label: "Observation",
        text: "A luxury beauty brand can easily become either too clinical or too ornamental. maia sits between those extremes. The design choices aim to suggest confidence without aggression, sensuality without excess, and premium positioning without alienating the audience. Across digital, print, and campaign applications, the system creates a controlled emotional tone: quiet, feminine, modern, and composed."
      }
    ],
    demo3: [
      {
        label: "Context",
        text: "This rebrand concept for Browns Shoes Inc. investigates how an established national footwear retailer could sharpen its visual presence beyond a logo refresh. Browns already carries recognition and accessibility, so the challenge was not to reinvent the business, but to create a clearer visual attitude: cleaner, more modern, more product-led, and better suited to lifestyle retail across physical and digital environments."
      },
      {
        label: "Direction",
        text: "I built the system around an inhuman art direction, reducing reliance on models so the footwear becomes the central character. The approach shifts attention from lifestyle aspiration to object presence. Colour, texture, material contrast, and spatial composition work together to give shoes more authority in the frame. This creates a sleeker retail language where the product carries the narrative rather than becoming an accessory to a human figure."
      },
      {
        label: "Observation",
        text: "The word inhuman is not meant to feel cold; it is a way to remove visual noise. In footwear retail, the model can easily dominate the story and reduce the shoe to styling support. By isolating the product, exaggerating material qualities, and tightening composition, the brand becomes more ownable and scalable. The system can support campaign images, store graphics, product launches, and social content while keeping the focus on what Browns actually sells."
      }
    ],
    demo4: [
      {
        label: "Context",
        text: "monday is an office-chair brand and website prototype developed for a product entering a crowded furniture market. Office furniture often defaults to either technical performance language or lifestyle minimalism, so the challenge was to create a brand that felt trustworthy, resilient, authentic, and subtle without looking generic."
      },
      {
        label: "Direction",
        text: "The lowercase logo and prototype direction draw from Bauhaus efficiency, geometric restraint, and quiet utility. I treated the chair not as an object that demands attention, but as a support system that sits beside the user throughout repetitive daily routines. Wider letter spacing, calm interface rhythm, and restrained product presentation make the brand feel dependable, understated, and designed for repeated use rather than one-time spectacle."
      },
      {
        label: "Observation",
        text: "The name monday carries a very specific emotional weight: the beginning of work, structure, fatigue, routine, and reset. The identity leans into that tension by avoiding motivational exaggeration. It does not try to make work glamorous. Instead, it positions the chair as quiet infrastructure: an object that supports focus, posture, and continuity. That restraint gives the brand a more mature and believable workplace tone."
      }
    ],
    demo5: [
      {
        label: "Context",
        text: "Kill The Bride is a speculative film-poster series imagining a spiritual sequel to Kill Bill. The project examines how an established action-revenge visual language could be extended decades later without simply repeating the original films. The challenge was to preserve the graphic force of the franchise while giving the imagined sequel its own tonal shift."
      },
      {
        label: "Direction",
        text: "I built the series around bold typography, compressed tension, controlled colour contrast, and a blue-led palette that expands the familiar red and yellow world. The posters use strong silhouettes and direct composition to communicate confidence and threat. Instead of overloading the layout with cinematic detail, the design relies on clarity, scale, and colour tension to make the imagined film feel immediate."
      },
      {
        label: "Observation",
        text: "The project is about visual inheritance. A sequel identity has to acknowledge what audiences remember while creating enough distance to feel necessary. Blue was used as a strategic third temperature: cooler, older, more fatalistic, and less impulsive than the original palette. The result is a campaign system that feels connected to the franchise but suggests time, consequence, and revenge after memory has hardened."
      }
    ],
    demo6: [
      {
        label: "Context",
        text: "Stop Haunting Mother Nature is an environmental awareness campaign concept for WWF. Instead of using expected nature imagery, the campaign reframes pollution as a horror narrative where human activity becomes the threat. The concept begins from the observation that many environmental messages lose impact because audiences already know the visual language: green landscapes, animals, hands, leaves, and urgent slogans."
      },
      {
        label: "Direction",
        text: "The series restyles recognizable horror references including The Silence of the Lambs, The Shining, and Halloween into environmental messages. Familiar poster silhouettes create immediate recognition, while altered details reveal the campaign idea: nature is not the monster, it is the victim. The horror format makes pollution feel less abstract by giving it atmosphere, threat, and narrative tension."
      },
      {
        label: "Observation",
        text: "The campaign works through misdirection. At first glance, the viewer recognizes cinema; on second reading, the environmental message appears. That delay is important because it creates memory. The posters use pop-culture familiarity as a delivery mechanism for ecological discomfort, making the call for responsibility feel sharper, stranger, and less predictable than a conventional awareness campaign."
      }
    ],
    demo7: [
      {
        label: "Context",
        text: "X̱wáýx̱way is a speculative vinyl soundtrack album dedicated to Stanley Park in Vancouver. The project treats the park as living history rather than a tourist landmark, connecting landscape, memory, Indigenous presence, ecology, and contemporary city life through sound and print. I approached the album as an object that could carry atmosphere, place, and civic memory."
      },
      {
        label: "Direction",
        text: "The album is structured around six themes: Indigenous history, woods, waves, land, wind, and modernization. A monochromatic retro direction gives the object an archival quality, as if it could belong to a public record, a collector's shelf, or a museum shop. The restrained palette allows texture, sequence, and pacing to become the main visual tools."
      },
      {
        label: "Observation",
        text: "Stanley Park is often flattened into scenery, but the name X̱wáýx̱way points to deeper layers of place and displacement. The design tries to slow the viewer down and make the album feel less like merchandise and more like a listening artifact. It imagines design as a preservation tool: part fundraiser, part soundtrack, part reminder that landscapes are not neutral backdrops but records of people, history, and change."
      }
    ],
    demo8: [
      {
        label: "Context",
        text: "raku haru is a hijab brand identity focused on accessible elegance. The logo needed to feel feminine, modern, and timeless while supporting a product range designed for women across different ages, contexts, and personal styles. The project required softness without fragility and simplicity without becoming generic."
      },
      {
        label: "Direction",
        text: "The visual direction balances proportion, restraint, and calm brand tone. Instead of relying on ornamental cues, the mark uses clarity and softness to create recognition. The identity is intentionally quiet so it can sit comfortably across labels, packaging, product photography, social content, and everyday retail touchpoints."
      },
      {
        label: "Observation",
        text: "Accessible elegance depends on trust. The brand cannot feel too distant, but it also cannot look careless. The design therefore avoids luxury exaggeration and focuses on warmth, legibility, and product adaptability. It gives raku haru a polished foundation that can support affordable products while still communicating care, taste, and consistency."
      }
    ],
    demo9: [
      {
        label: "Context",
        text: "This digital catalogue prototype for TRAPO explores a more efficient alternative to printed sales materials. Designed in Figma, the tool was created with offline sales teams, in-store promotion, and quick product comparison in mind. The project responds to a practical sales problem: product information changes faster than printed materials can adapt."
      },
      {
        label: "Direction",
        text: "The interface prioritizes speed, hierarchy, and practical navigation over decorative interaction. I focused on making information easier to retrieve during a sales conversation, where clarity matters more than visual complexity. Product categories, comparison logic, and screen flow were treated as part of the brand experience, not just interface mechanics."
      },
      {
        label: "Observation",
        text: "The strongest value of the prototype is operational. A digital catalogue can reduce paper dependency, improve presentation consistency, and allow sales teams to move through product information with more confidence. The design turns static product data into a guided sales tool, helping the brand appear more organized, more current, and more scalable at the point of customer interaction."
      }
    ],
    demo10: [
      {
        label: "Context",
        text: "This MagSafe-compatible smartphone holder was developed as a flagship product concept for TRAPO. The design needed to feel more ownable than a generic accessory while still respecting practical constraints around size, mounting, heat, visibility, manufacturing, and in-car use."
      },
      {
        label: "Direction",
        text: "I worked through form development, rendering, material direction, and brand integration. The final direction uses the company logo as a silhouette cue, pairs premium Alcantara material with a glow LED detail, and balances automotive luxury with everyday usability. The object is designed to feel like part of the car environment rather than an add-on clipped to it."
      },
      {
        label: "Observation",
        text: "Small automotive accessories are often treated as purely functional, but they sit in a highly visible personal space. This concept uses material contrast, light, and branded form language to elevate that moment. The holder becomes a tactile brand touchpoint: something the driver sees, touches, and depends on daily. The goal was to make utility feel intentional, not anonymous."
      }
    ],
    demo11: [
      {
        label: "Context",
        text: "For Talentlounge, I designed and rendered a virtual career fair experience that helped job seekers explore opportunities through an online 3D environment. The challenge was to make digital recruitment feel more engaging without sacrificing orientation, clarity, or navigation."
      },
      {
        label: "Direction",
        text: "My role covered visual direction, 3D modelling, rendering, and website integration. I created booth environments, category-based exploration, and visual assets that supported communication between candidates and employers. The environment translates the structure of a physical fair into a digital space while avoiding unnecessary realism that could slow down comprehension."
      },
      {
        label: "Observation",
        text: "A virtual fair has to balance immersion with usability. If it becomes too decorative, people get lost; if it becomes too flat, it loses the sense of event. The design uses spatial cues, booth logic, and controlled perspective to make the experience feel navigable and active. It gives recruitment a sense of place while keeping the user's goal clear: understand opportunities and move through them efficiently."
      }
    ],
    demo12: [
      {
        label: "Context",
        text: "Nexus is a public furniture concept created for the Malaysia National Design Competition TRANSEAT, where our team became a top 10 finalist. The project reimagines station seating as a connector for people, movement, and public space rather than a passive object placed along a platform."
      },
      {
        label: "Direction",
        text: "Inspired by the Serambi concept in traditional Malay houses, the bench encourages pause, interaction, and continuity within MRT environments. The design uses Thermoplastic Elastomer, modular construction, and illuminated edge details to create a seating system that is functional, symbolic, and memorable in transit spaces."
      },
      {
        label: "Observation",
        text: "Public seating carries behavioural responsibility. It affects how people wait, gather, rest, and move. Nexus treats furniture as infrastructure and cultural gesture at once: durable enough for transit, soft enough for human pause, and symbolic enough to reflect local spatial memory. The illumination detail is not only aesthetic; it helps the object register within a busy station environment."
      }
    ],
    demo13: [
      {
        label: "Context",
        text: "During my internship with Motorola Solutions, I completed a 12-week product design project for a two-way radio concept. The process covered research, concept development, 2D exploration, 3D modelling, rendering, and final presentation, with a focus on communication tools for service environments."
      },
      {
        label: "Direction",
        text: "I visited 14 hotels to observe staff communication across different workplace conditions. Those observations revealed opportunities around size, multitasking, information access, quick status reading, and product aesthetics. The final concept is a compact radio with a hidden display, LED indicator, intuitive controls, and an ergonomic form designed around real workplace behaviour rather than abstract styling."
      },
      {
        label: "Observation",
        text: "The research showed that radios in hospitality are not isolated devices; they are worn, grabbed, glanced at, and used while staff perform other tasks. That changed the design priorities. The hidden display reduces visual clutter until information is needed, the LED supports fast peripheral reading, and the compact form respects uniforms, movement, and service posture. The concept connects industrial design decisions directly to observed user behaviour."
      }
    ],
    demo14: [
      {
        label: "Context",
        text: "E&K is an automotive accessories and installation brand identity. The logo needed to feel simple, sharp, and memorable while reflecting the brand's focus on cars, customization, service, and technical trust."
      },
      {
        label: "Direction",
        text: "I developed a compact mark from the letters E and K, creating a technical visual form without making it overly complex. The identity is designed to work across signage, decals, packaging, digital applications, and automotive surfaces where quick recognition matters."
      },
      {
        label: "Observation",
        text: "Automotive accessory brands often lean too heavily into aggressive styling. E&K needed a cleaner balance: technical, but not overdesigned; sharp, but not loud. The mark is compact so it can scale down onto small applications while still holding enough structure for storefront, decal, and service-related use. It gives the brand a practical identity system suited to both workshop and customer-facing environments."
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
