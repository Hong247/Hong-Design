(function () {
  var roleLabels = {
    demo1: "Brand Identity",
    demo2: "Brand Identity",
    demo3: "Art Direction",
    demo4: "UI Prototype",
    demo5: "Poster Design",
    demo6: "Campaign Design",
    demo7: "Editorial Design",
    demo8: "Brand Identity",
    demo9: "UI/UX Design",
    demo10: "Product Design",
    demo11: "Web Design",
    demo12: "Furniture Design",
    demo13: "Industrial Design",
    demo14: "Logo Design"
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
