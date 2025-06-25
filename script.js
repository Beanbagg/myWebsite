document.addEventListener("DOMContentLoaded", () => {

  document.getElementById("menuToggle").onclick = () => {
    document.getElementById("sideMenu").classList.toggle("active");
  };

  document.querySelectorAll(".toggle-sub").forEach(btn => {
    btn.textContent = '+';
  });

  document.querySelectorAll(".toggle-sub").forEach(button => {
    button.addEventListener("click", () => {
      const menuItem = button.closest(".menu-item");
      const submenu = menuItem.querySelector(".submenu");

      menuItem.classList.toggle("active");

      if (submenu.style.maxHeight) {
        submenu.style.maxHeight = null;
        button.textContent = '+';
      } else {
        submenu.style.maxHeight = submenu.scrollHeight + "px";
        button.textContent = '−';
      }
    });
  });

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  document.querySelectorAll(".requires-login").forEach(item => {
    item.style.display = isLoggedIn ? "block" : "none";
  });

  const authMenu = document.getElementById("authMenuItem");
  if (authMenu) {
    if (isLoggedIn) {
      authMenu.innerHTML = `
        <div class="menu-header">
          <button id="logoutBtn" style="background: none; border: none; color: crimson; cursor: pointer;">Logout</button>
        </div>
      `;
      document.getElementById("logoutBtn").addEventListener("click", () => {
        localStorage.removeItem("isLoggedIn");
        const path = window.location.pathname.toLowerCase();
        if (path.endsWith('downloads.html') || path.endsWith('recipes.html')) {
          window.location.href = "index.html";
        } else {
          location.reload();
        }
      });
    } else {
      authMenu.innerHTML = `
        <div class="menu-header">
          <a href="login.html">Login</a>
        </div>
      `;
    }
  }

  const searchInput = document.getElementById("searchInput");

  searchInput.addEventListener("input", function () {
    const filter = this.value.toLowerCase();

    document.querySelectorAll(".menu-item").forEach(menuItem => {
      const requiresLogin = menuItem.classList.contains("requires-login");
      if (requiresLogin && !isLoggedIn) {
        menuItem.style.display = "none";
        return; // skip filtering this item entirely
      }

      const headerLink = menuItem.querySelector(".menu-header a");
      const headerText = headerLink ? headerLink.textContent.toLowerCase() : "";
      const submenu = menuItem.querySelector(".submenu");
      const toggleBtn = menuItem.querySelector(".toggle-sub");
      const submenuLinks = submenu ? submenu.querySelectorAll("li") : [];

      if (!filter) {
        menuItem.style.display = "block";
        submenuLinks.forEach(li => {
          li.style.display = "block";
        });

        if (submenu) {
          submenu.style.maxHeight = null;
        }

        if (toggleBtn) {
          toggleBtn.textContent = "+";
          menuItem.classList.remove("active");
        }
        return;
      }

      let match = headerText.includes(filter);

      submenuLinks.forEach(li => {
        const subText = li.textContent.toLowerCase();
        if (subText.includes(filter)) {
          li.style.display = "block";
          match = true;
        } else {
          li.style.display = "none";
        }
      });

      menuItem.style.display = match ? "block" : "none";

      if (submenu && toggleBtn) {
        if (match && !menuItem.classList.contains("active")) {
          submenu.style.maxHeight = submenu.scrollHeight + "px";
          toggleBtn.textContent = "−";
          menuItem.classList.add("active");
        } else if (!match) {
          submenu.style.maxHeight = null;
          toggleBtn.textContent = "+";
          menuItem.classList.remove("active");
        }
      }
    });
  });

  searchInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      const visibleLinks = Array.from(document.querySelectorAll("#menuLinks a"))
        .filter(link => link.closest("li").style.display !== "none");

      if (visibleLinks.length > 0) {
        visibleLinks[0].click();
      }
    }
  });
});