(function () {
  var roleLabels = {
    demo1: "Brand Identity, Art Direction",
    demo2: "Brand Identity, Visual Direction",
    demo3: "Rebrand Concept, Art Direction",
    demo4: "Brand Identity, UI Prototype",
    demo5: "Poster Design, Art Direction",
    demo6: "Campaign Concept, Poster Design",
    demo7: "Editorial Design, Album Concept",
    demo8: "Logo Design, Brand Identity",
    demo9: "UI/UX Prototype, Sales Tool",
    demo10: "Product Design, 3D Rendering",
    demo11: "Web Design, 3D Environment",
    demo12: "Furniture Design, Product Concept",
    demo13: "Industrial Design, User Research",
    demo14: "Logo Design, Automotive Branding"
  };

  document.addEventListener("DOMContentLoaded", function () {
    Object.keys(roleLabels).forEach(function (targetId) {
      document.querySelectorAll('.custom-btn[data-target="#' + targetId + '"]').forEach(function (button) {
        var cell = button.closest("td");

        if (cell && cell.classList.contains("role-cell")) {
          button.textContent = roleLabels[targetId];
        }
      });
    });
  });
}());
