/* ==========================================================
   Vertex Accounting & Bookkeeping Solutions
   script.js
   ========================================================== */
document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Hamburger / Mobile Nav ---------- */
  var hamburgerBtn = document.getElementById('hamburgerBtn');
  var mobileNav = document.getElementById('mobileNav');

  function closeMobileNav() {
    hamburgerBtn.classList.remove('is-open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('is-open');
  }

  hamburgerBtn.addEventListener('click', function () {
    var isOpen = hamburgerBtn.classList.toggle('is-open');
    hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
    mobileNav.classList.toggle('is-open', isOpen);
  });

  document.querySelectorAll('.mobile-link, .mobile-cta').forEach(function (link) {
    link.addEventListener('click', closeMobileNav);
  });

  /* ---------- Smooth Scrolling for in-page links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var targetId = link.getAttribute('href');
      if (targetId.length > 1) {
        var target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          var headerH = document.getElementById('siteHeader').offsetHeight;
          var top = target.getBoundingClientRect().top + window.pageYOffset - headerH + 1;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      }
    });
  });

  /* ---------- Active Navigation Highlighting ---------- */
  var sections = document.querySelectorAll('main section[id]');
  var navLinks = document.querySelectorAll('.nav-link');

  function setActiveLink() {
    var scrollPos = window.pageYOffset + document.getElementById('siteHeader').offsetHeight + 40;
    var currentId = sections.length ? sections[0].id : '';

    sections.forEach(function (section) {
      if (scrollPos >= section.offsetTop) {
        currentId = section.id;
      }
    });

    navLinks.forEach(function (link) {
      link.classList.toggle('active-link', link.getAttribute('href') === '#' + currentId);
    });
  }

  /* ---------- Scroll To Top Button ---------- */
  var scrollTopBtn = document.getElementById('scrollTopBtn');

  function toggleScrollTop() {
    scrollTopBtn.classList.toggle('is-visible', window.pageYOffset > 500);
  }

  scrollTopBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', function () {
    setActiveLink();
    toggleScrollTop();
  }, { passive: true });

  setActiveLink();
  toggleScrollTop();

  /* ---------- FAQ Accordion ---------- */
  document.querySelectorAll('.accordion-trigger').forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var item = trigger.closest('.accordion-item');
      var panel = item.querySelector('.accordion-panel');
      var isOpen = trigger.getAttribute('aria-expanded') === 'true';

      // Close all other panels
      document.querySelectorAll('.accordion-trigger').forEach(function (otherTrigger) {
        if (otherTrigger !== trigger) {
          otherTrigger.setAttribute('aria-expanded', 'false');
          otherTrigger.closest('.accordion-item').querySelector('.accordion-panel').style.maxHeight = null;
        }
      });

      trigger.setAttribute('aria-expanded', String(!isOpen));
      panel.style.maxHeight = isOpen ? null : panel.scrollHeight + 'px';
    });
  });

  /* ---------- Reveal on Scroll ---------- */
  var revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Animated Counters ---------- */
  var statNumbers = document.querySelectorAll('.stat-number');

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-target'), 10) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 1400;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.floor(eased * target);
      el.textContent = current + suffix;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        el.textContent = target + suffix;
      }
    }
    window.requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window && statNumbers.length) {
    var counterObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(function (el) { counterObserver.observe(el); });
  } else {
    statNumbers.forEach(function (el) {
      el.textContent = el.getAttribute('data-target') + (el.getAttribute('data-suffix') || '');
    });
  }

  
/* ---------- Contact Form Validation + WhatsApp Submission ---------- */

const contactForm = document.getElementById("contactForm");
const formSuccess = document.getElementById("formSuccess");

// Function to show or remove field errors
function setFieldError(field, hasError) {
    field.closest(".form-field").classList.toggle("has-error", hasError);
}

// Function to validate email
function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

// Check if the form exists
if (contactForm) {

    contactForm.addEventListener("submit", function (event) {

        // Stop normal form submission
        event.preventDefault();

        // Hide previous success message
        formSuccess.classList.remove("is-visible");

        /* ---------- Get Form Fields ---------- */

        const nameField = document.getElementById("name");
        const emailField = document.getElementById("email");
        const messageField = document.getElementById("message");

        /* ---------- Validate Form Fields ---------- */

        const nameValid = nameField.value.trim().length > 0;
        const emailValid = isValidEmail(emailField.value.trim());
        const messageValid = messageField.value.trim().length > 0;

        /* ---------- Show/Remove Errors ---------- */

        setFieldError(nameField, !nameValid);
        setFieldError(emailField, !emailValid);
        setFieldError(messageField, !messageValid);

        /* ---------- Stop if Form is Invalid ---------- */

        if (!nameValid || !emailValid || !messageValid) {

            const firstInvalid = contactForm.querySelector(
                ".has-error input, .has-error textarea"
            );

            if (firstInvalid) {
                firstInvalid.focus();
            }

            return;
        }

        /* ---------- Collect Form Data ---------- */

        const formData = new FormData(contactForm);

        const name = formData.get("name");
        const business = formData.get("business");
        const email = formData.get("email");
        const phone = formData.get("phone");
        const service = formData.get("service");
        const message = formData.get("message");

        /* ---------- WhatsApp Number ---------- */

        const whatsappNumber = "254724224747";

        /* ---------- Create WhatsApp Message ---------- */

        const whatsappMessage = `
Hello, I have a new enquiry from the website.

*Name:* ${name}
*Business Name:* ${business || "Not provided"}
*Email:* ${email}
*Phone:* ${phone || "Not provided"}
*Service Needed:* ${service || "Not specified"}

*Message:*
${message}
`;

        /* ---------- Encode WhatsApp Message ---------- */

        const encodedMessage = encodeURIComponent(whatsappMessage);

        /* ---------- Create WhatsApp URL ---------- */

        const whatsappURL =
            `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

        /* ---------- Open WhatsApp ---------- */

        window.open(whatsappURL, "_blank");

        /* ---------- Show Success Message ---------- */

        formSuccess.classList.add("is-visible");

        /* ---------- Reset Form ---------- */

        contactForm.reset();

    });

    /* ---------- Live Validation ---------- */

    ["name", "email", "message"].forEach(function (id) {

        const field = document.getElementById(id);

        field.addEventListener("input", function () {

            if (id === "email") {

                setFieldError(
                    field,
                    field.value.trim().length > 0 &&
                    !isValidEmail(field.value.trim())
                );

            } else {

                setFieldError(field, false);

            }

        });

    });

}
});
