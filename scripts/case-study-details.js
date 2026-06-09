document.addEventListener("DOMContentLoaded", function () {
  var caseStudyDetails = {
    demo1: {
      role: "Visual identity, logo direction, colour system, typographic research, brand application logic.",
      challenge: "Build a culturally specific food identity that feels contemporary without stripping away the atmosphere, speed, and inherited craft of a working wonton noodle shop.",
      constraints: "The system needed to stay simple enough for signage, packaging, motion, and small-format print while still carrying enough detail to feel ownable and memorable.",
      impact: "Positions the brand as a quiet, craft-led food concept rather than a generic Asian restaurant identity, giving it a flexible visual language that can scale across physical and digital touchpoints."
    },
    demo2: {
      role: "Brand identity, art direction, logo refinement, palette development, image mood, typographic pacing.",
      challenge: "Create a premium beauty and fashion identity that feels aspirational but still intimate, warm, and emotionally accessible.",
      constraints: "The tone had to avoid both clinical minimalism and over-decorated luxury cues, while remaining adaptable across campaign imagery, print, digital, and service-led touchpoints.",
      impact: "Creates a controlled visual atmosphere that frames maia as polished, feminine, and composed, with enough restraint to support long-term brand consistency."
    },
    demo3: {
      role: "Rebrand concept, creative direction, product-led campaign system, visual positioning, retail application thinking.",
      challenge: "Refresh an established footwear retailer without losing accessibility or recognition, while giving the product stronger visual authority.",
      constraints: "The system needed to work commercially across retail graphics, product launches, social media, and promotional campaigns without depending on expensive model-led production every time.",
      impact: "Shifts attention back to the footwear itself and creates a more scalable retail language where material, form, and product presence carry the story."
    },
    demo4: {
      role: "Naming interpretation, logo design, website prototype, interface direction, product-brand positioning.",
      challenge: "Differentiate an office-chair brand in a market crowded with ergonomic claims, generic minimalism, and lifestyle work-from-home visuals.",
      constraints: "The identity had to feel calm and functional rather than flashy, while still communicating trust, durability, and daily comfort.",
      impact: "Positions the chair as quiet work infrastructure: a product that supports focus and routine instead of trying to dramatize the workplace."
    },
    demo5: {
      role: "Poster system, campaign art direction, colour strategy, typographic composition, franchise-extension concept.",
      challenge: "Extend a recognizable cinematic visual language without copying it, while giving the imagined sequel a distinct emotional temperature.",
      constraints: "The work had to preserve the graphic aggression associated with the original films while introducing enough distance to feel like a new chapter.",
      impact: "Creates a poster campaign that feels familiar but not derivative, using blue as a cooler, older, more fatalistic counterpoint to the original red and yellow world."
    },
    demo6: {
      role: "Campaign concept, poster art direction, visual metaphor, environmental message framing, cultural-reference strategy.",
      challenge: "Make an environmental message feel memorable in a category where audiences are already familiar with predictable nature imagery and urgent slogans.",
      constraints: "The campaign had to use recognizable horror references without letting the film homage overpower the environmental message.",
      impact: "Uses visual misdirection to create a stronger second-read effect, turning familiar horror imagery into a sharper environmental warning."
    },
    demo7: {
      role: "Album concept, visual identity, editorial art direction, archival object design, cultural narrative framing.",
      challenge: "Represent Stanley Park as a layered cultural and ecological site rather than a scenic tourist image.",
      constraints: "The project needed to remain respectful, atmospheric, and collectible while avoiding over-explanation or decorative appropriation.",
      impact: "Frames the album as a listening artifact and preservation object, giving the work a civic and archival quality beyond conventional merchandise."
    },
    demo8: {
      role: "Logo design, brand identity, visual tone, product-brand positioning, retail application thinking.",
      challenge: "Create a hijab brand identity that feels elegant and modern while remaining warm, accessible, and adaptable across everyday retail touchpoints.",
      constraints: "The identity had to avoid excessive ornamentation and luxury distance, while still looking considered enough to support product trust.",
      impact: "Gives the brand a soft but disciplined foundation that can support packaging, labels, product photography, and social content."
    },
    demo9: {
      role: "Figma prototype, interface structure, sales-tool design, product hierarchy, digital catalogue experience.",
      challenge: "Translate printed product information into a faster, more flexible digital sales tool for product comparison and in-person presentation.",
      constraints: "The interface needed to support quick access during real sales conversations, where clarity and speed matter more than decorative interaction.",
      impact: "Turns static product information into a scalable presentation system that can reduce paper dependency and improve brand consistency at point of sale."
    },
    demo10: {
      role: "Product concept, form exploration, 3D rendering, material direction, brand integration, premium accessory positioning.",
      challenge: "Make a smartphone holder feel like a branded automotive object rather than a generic utility accessory.",
      constraints: "The design had to consider size, visibility, mounting, heat, manufacturing logic, touchpoints, and how the object sits inside a car interior.",
      impact: "Elevates a small daily-use accessory into a tactile brand moment, using silhouette, Alcantara, lighting, and form language to create stronger product ownership."
    },
    demo11: {
      role: "3D environment design, visual direction, rendering, website integration, spatial experience planning.",
      challenge: "Make online recruitment feel more engaging and spatial without making users feel lost inside a decorative virtual environment.",
      constraints: "The experience had to balance event atmosphere with fast orientation, category clarity, and practical navigation for job seekers and employers.",
      impact: "Creates a digital fair environment that feels active and navigable, translating physical-event logic into an online recruitment experience."
    },
    demo12: {
      role: "Furniture concept, team design development, form strategy, material thinking, presentation rendering.",
      challenge: "Reimagine MRT station seating as public infrastructure that supports pause, movement, interaction, and cultural memory.",
      constraints: "The bench needed to respond to durability, modularity, public use, visual recognition, and station visibility.",
      impact: "Positions public seating as both functional object and cultural gesture, contributing to a top 10 finalist outcome in the TRANSEAT competition."
    },
    demo13: {
      role: "Product research, user observation, 2D exploration, 3D modelling, rendering, ergonomic concept development.",
      challenge: "Design a two-way radio concept informed by real service environments rather than assumptions about industrial communication tools.",
      constraints: "The product had to consider uniform wear, multitasking, quick glances, compactness, information access, and repeated use during hotel staff workflows.",
      impact: "Connects each product feature back to observed behaviour, turning research from 14 hotel visits into a compact, ergonomic, service-oriented radio concept."
    },
    demo14: {
      role: "Logo design, compact mark development, automotive identity direction, application thinking.",
      challenge: "Create an automotive accessories identity that feels technical and sharp without becoming aggressive or overdesigned.",
      constraints: "The mark needed to stay legible across decals, signage, packaging, digital uses, and small-format automotive applications.",
      impact: "Gives the brand a clean, scalable identity that can operate in both workshop and customer-facing environments."
    }
  };

  Object.keys(caseStudyDetails).forEach(function (id) {
    var row = document.getElementById(id);

    if (!row) {
      return;
    }

    var description = row.querySelector(".project-description") || row.querySelector("td");
    var detail = caseStudyDetails[id];

    [
      ["Role", detail.role],
      ["Challenge", detail.challenge],
      ["Constraints", detail.constraints],
      ["Impact", detail.impact]
    ].forEach(function (item) {
      var paragraph = document.createElement("p");
      var label = document.createElement("span");

      label.className = "case-label";
      label.textContent = item[0];
      paragraph.appendChild(label);
      paragraph.appendChild(document.createTextNode(item[1]));
      description.appendChild(paragraph);
    });
  });
});
