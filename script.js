
// Prism agency landing page interactions
document.addEventListener("DOMContentLoaded", () => {

  // Update copyright year
  const year = document.getElementById("year");
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // Mobile navigation menu
  const menuButton = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (menuButton && navLinks) {
    menuButton.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");

      menuButton.setAttribute("aria-expanded", String(isOpen));

      menuButton.innerHTML = isOpen
        ? '<span class="iconify" data-icon="ph:x-bold"></span>'
        : '<span class="iconify" data-icon="ph:list-bold"></span>';
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");

        menuButton.innerHTML =
          '<span class="iconify" data-icon="ph:list-bold"></span>';
      });
    });
  }

  // Highlight navigation item for the section in view
  const sections = document.querySelectorAll("main section[id]");
  const links = document.querySelectorAll(".nav-links a");

  if (
    "IntersectionObserver" in window &&
    sections.length &&
    links.length
  ) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        links.forEach((link) => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${entry.target.id}`
          );
        });
      });
    }, {
      rootMargin: "-35% 0px -55% 0px"
    });

    sections.forEach((section) => observer.observe(section));
  }

  // HERO SLIDER
  const slider = document.querySelector(".hslider");

  if (slider) {
    const slides = Array.from(
      slider.querySelectorAll(".hs")
    );

    const dotsBox = slider.querySelector(".hs-dots");
    const nextButton = slider.querySelector(".hs-btn.next");
    const prevButton = slider.querySelector(".hs-btn.prev");

    if (
      slides.length &&
      dotsBox &&
      nextButton &&
      prevButton
    ) {
      let current = 0;
      let timer = null;

      // Create slider dots
      const dots = slides.map((_, index) => {
        const dot = document.createElement("button");

        dot.type = "button";
        dot.setAttribute(
          "aria-label",
          `Go to slide ${index + 1}`
        );

        dot.addEventListener("click", () => {
          showSlide(index);
          startAutoplay();
        });

        dotsBox.appendChild(dot);

        return dot;
      });

      // Display selected slide
      function showSlide(index) {
        current = (index + slides.length) % slides.length;

        slides.forEach((slide, i) => {
          const active = i === current;

          slide.classList.toggle("active", active);

          slide.setAttribute(
            "aria-hidden",
            String(!active)
          );

          dots[i].classList.toggle("on", active);

          dots[i].setAttribute(
            "aria-current",
            active ? "true" : "false"
          );
        });
      }

      // Automatic slide movement
      function startAutoplay() {
        window.clearInterval(timer);

        if (
          !window.matchMedia(
            "(prefers-reduced-motion: reduce)"
          ).matches
        ) {
          timer = window.setInterval(() => {
            showSlide(current + 1);
          }, 3000);
        }
      }

      // Next button
      nextButton.addEventListener("click", () => {
        showSlide(current + 1);
        startAutoplay();
      });

      // Previous button
      prevButton.addEventListener("click", () => {
        showSlide(current - 1);
        startAutoplay();
      });

      // Pause slider when mouse is over it
      slider.addEventListener("mouseenter", () => {
        window.clearInterval(timer);
      });

      slider.addEventListener("mouseleave", startAutoplay);

      // Pause slider when keyboard focus is inside
      slider.addEventListener("focusin", () => {
        window.clearInterval(timer);
      });

      slider.addEventListener("focusout", startAutoplay);

      // Initialize slider
      showSlide(0);
      startAutoplay();
    }
  }


// KPI number counter animation
const kpiNumbers = document.querySelectorAll(".kpi b");

if (kpiNumbers.length) {
  const animateCounter = (element) => {
    const target = Number(element.dataset.count);
    const suffix = element.dataset.suffix || "";
    const duration = 2000;
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const progress = Math.min(
        (currentTime - startTime) / duration,
        1
      );

      const value = Math.floor(target * progress);

      element.textContent = value.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target.toLocaleString() + suffix;
      }
    }

    requestAnimationFrame(updateCounter);
  };

const kpiObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.5
  });

  kpiNumbers.forEach((number) => {
    kpiObserver.observe(number);
  });
}


// The About section currently has one static slide, so no slider script is needed.



});
