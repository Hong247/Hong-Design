document.addEventListener("DOMContentLoaded", function () {
  insertCMarketToteBagProject();
});

function insertCMarketToteBagProject() {
  var tbody = document.querySelector("tbody");
  var firstProject = tbody ? tbody.querySelector(".hover-trigger") : null;

  if (!tbody || document.getElementById("demo-cmarket-tote-bag")) {
    renumberArchiveAfterToteInsert();
    return;
  }

  var headerRow = document.createElement("tr");
  var detailRow = document.createElement("tr");

  headerRow.className = "hover-trigger";
  headerRow.setAttribute("data-image-source", "https://www.cmarket.ca/cdn/shop/files/black_tote_bag.png");
  headerRow.innerHTML = '<td><button type="button" class="custom-btn" data-target="#demo-cmarket-tote-bag">01</button></td><td><button type="button" class="custom-btn" data-target="#demo-cmarket-tote-bag">C Market Coffee Tote Bag</button></td><td class="role-cell"><button type="button" class="custom-btn" data-target="#demo-cmarket-tote-bag">Merchandise Design</button></td><td><button type="button" class="custom-btn" data-target="#demo-cmarket-tote-bag">2026</button></td>';

  detailRow.id = "demo-cmarket-tote-bag";
  detailRow.className = "collapse";
  detailRow.innerHTML = '<td colspan="4"><div class="scroll-container"><img class="fullscreen-image" src="https://www.cmarket.ca/cdn/shop/files/black_tote_bag.png" alt="C Market Coffee black tote bag"><img class="fullscreen-image" src="https://www.cmarket.ca/cdn/shop/files/white_tote_bag.png" alt="C Market Coffee white tote bag" loading="lazy"></div><p class="max-width-paragraph"><span class="case-label">Brief</span>A merchandise design project for C Market Coffee, created as a simple everyday tote bag that extends the brand beyond the cafe environment and into daily use.</p><p><span class="case-label">Direction</span>The design keeps the tote visually direct and practical, using the C Market Coffee identity across black and white bag variations so the product feels recognizable, wearable, and easy to pair with different customer lifestyles.</p><p><span class="case-label">Outcome</span>The final tote bag functions as both a retail product and a mobile brand touchpoint, giving customers a useful object while increasing everyday visibility for the C Market Coffee brand.</p><br></td>';

  if (firstProject) {
    tbody.insertBefore(detailRow, firstProject);
    tbody.insertBefore(headerRow, detailRow);
  } else {
    tbody.appendChild(headerRow);
    tbody.appendChild(detailRow);
  }

  renumberArchiveAfterToteInsert();
}

function renumberArchiveAfterToteInsert() {
  document.querySelectorAll("tbody .hover-trigger").forEach(function (row, index) {
    var numberButton = row.querySelector("td:first-child .custom-btn");

    if (numberButton) {
      numberButton.textContent = String(index + 1).padStart(2, "0");
    }
  });
}
