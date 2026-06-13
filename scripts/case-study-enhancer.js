(function () {
  var enhancedCopy = {
    demo1: [
      ["Summary", "A food-culture identity system that turns the movement of noodles into a quiet, ownable visual language."],
      ["Challenge", "Kee needed to feel rooted in Malaysian Chinese dining without relying on generic nostalgia or decorative restaurant cues."],
      ["Direction", "I connected noodle movement, Chinese character structure, and the Yuwei typeface into a restrained identity system supported by carbon, moonstone, flour white, and brandy yellow."],
      ["Outcome", "The result is a distinctive brand world that can extend across signage, packaging, motion assets, and retail touchpoints while staying traditional, warm, and contemporary."]
    ],
    demo3: [
      ["Summary", "A footwear rebrand concept that makes product, material, and atmosphere the central characters."],
      ["Challenge", "Browns needed a sharper visual position beyond a logo refresh, with a system that could feel modern, premium, and product-led."],
      ["Direction", "I developed an inhuman art direction that reduces reliance on models and uses color, texture, composition, and material detail to give shoes more authority."],
      ["Outcome", "The concept creates a cleaner retail identity with stronger product focus, clearer campaign flexibility, and a more distinctive visual tone across digital and print applications."]
    ],
    demo4: [
      ["Summary", "A calm office-chair identity and prototype built around support, restraint, and everyday usability."],
      ["Challenge", "The brand needed to enter a competitive furniture category without becoming loud, over-designed, or visually generic."],
      ["Direction", "I shaped the logo and prototype around trust, resilience, authenticity, and subtlety, using a wider lowercase form, Bauhaus cues, and restrained interface rhythm."],
      ["Outcome", "The final direction gives monday a quiet but memorable product presence, translating the idea of comfort and support into both brand identity and digital experience."]
    ],
    demo9: [
      ["Summary", "A digital catalogue prototype designed to make TRAPO sales presentations faster, clearer, and easier to update."],
      ["Challenge", "Sales teams needed a more efficient alternative to printed material for offline selling, in-store promotion, and quick product comparison."],
      ["Direction", "I built a Figma prototype focused on direct navigation, clear product hierarchy, and fast access to key specifications."],
      ["Outcome", "The prototype reduces dependence on paper, improves product presentation flow, and gives the sales team a more interactive tool that can adapt as product information changes."]
    ],
    demo10: [
      ["Summary", "A MagSafe-compatible automotive accessory concept that turns brand identity into physical product form."],
      ["Challenge", "The smartphone holder needed to feel more ownable than a generic mount while still respecting size, heat, mounting, manufacturing, and everyday usability constraints."],
      ["Direction", "I explored form development, rendering, material direction, and brand integration, using the TRAPO logo as a silhouette cue with Alcantara material and a glow LED detail."],
      ["Outcome", "The final concept balances automotive luxury with practical use, giving TRAPO a more distinctive flagship accessory direction with stronger brand recognition."]
    ],
    demo11: [
      ["Summary", "A virtual career fair environment that translates recruitment into an approachable 3D digital experience."],
      ["Challenge", "Talentlounge needed an online career-fair experience that felt engaging without making navigation or employer discovery harder."],
      ["Direction", "I created booth environments, category-based exploration, visual assets, 3D models, and rendered scenes to support communication between candidates and employers."],
      ["Outcome", "The result gives recruitment a clearer spatial experience, helping users scan opportunities while making the platform feel more memorable and interactive."]
    ],
    demo12: [
      ["Summary", "A public seating concept that uses station furniture as a connector between people, movement, and place."],
      ["Challenge", "The project needed to reimagine MRT station seating as more than a functional object for the Malaysia National Design Competition TRANSEAT."],
      ["Direction", "Inspired by the Serambi concept in traditional Malay houses, the bench uses modular form, Thermoplastic Elastomer, and illuminated edges to support pause and interaction."],
      ["Outcome", "The concept became a top 10 finalist and presented a seating system that is functional, symbolic, and memorable within high-traffic transit spaces."]
    ],
    demo13: [
      ["Summary", "A workplace radio concept developed through field research, product design, modelling, and rendering."],
      ["Challenge", "The product needed to support hotel staff communication while improving size, multitasking, information access, and workplace aesthetics."],
      ["Direction", "I visited 14 hotels, translated observations into product opportunities, and developed a compact two-way radio with a hidden display, LED indicator, intuitive controls, and ergonomic form."],
      ["Outcome", "The final concept turned field research into an industrial product direction designed for real service environments and completed the full process from research to final presentation."]
    ]
  };

  document.addEventListener("DOMContentLoaded", function () {
    Object.keys(enhancedCopy).forEach(function (id) {
      var row = document.getElementById(id);

      if (!row) {
        return;
      }

      var cell = row.querySelector("td");
      var copy = enhancedCopy[id];
      var existingBreak = cell ? cell.querySelector("br") : null;

      if (!cell || cell.querySelector(".case-summary")) {
        return;
      }

      cell.querySelectorAll("p.max-width-paragraph, p:not(.case-summary)").forEach(function (paragraph) {
        paragraph.remove();
      });

      copy.forEach(function (item, index) {
        var paragraph = document.createElement("p");
        paragraph.className = index === 0 ? "case-summary max-width-paragraph" : "max-width-paragraph";
        paragraph.innerHTML = '<span class="case-label">' + item[0] + '</span>' + item[1];
        cell.insertBefore(paragraph, existingBreak || null);
      });
    });
  });
}());