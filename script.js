const siteHeader = document.getElementById("siteHeader");
const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");
const chips = document.querySelectorAll(".chip");
const searchInput = document.getElementById("testSearch");
const testCards = document.querySelectorAll(".test-card");
const counters = document.querySelectorAll("[data-count]");
const reportForm = document.getElementById("reportForm");
const patientIdInput = document.getElementById("patientId");
const mobileNumberInput = document.getElementById("mobileNumber");
const downloadBtn = document.getElementById("downloadBtn");
const formNote = document.getElementById("formNote");
const bookButtons = document.querySelectorAll("[data-book]");
const homeCollectionBtn = document.getElementById("homeCollectionBtn");

let activeFilter = "all";

window.addEventListener("scroll", () => {
    siteHeader.classList.toggle("scrolled", window.scrollY > 10);
});

if (menuToggle) {
    menuToggle.addEventListener("click", () => {
        const isOpen = mobileMenu.classList.toggle("open");
        menuToggle.classList.toggle("open", isOpen);
        menuToggle.setAttribute("aria-expanded", String(isOpen));
    });
}

mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
        mobileMenu.classList.remove("open");
        menuToggle.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
    });
});

function applyFilters() {
    const query = searchInput.value.trim().toLowerCase();

    testCards.forEach((card) => {
        const name = (card.dataset.name || "").toLowerCase();
        const category = card.dataset.category || "";
        const matchesFilter = activeFilter === "all" || category === activeFilter;
        const matchesSearch = !query || name.includes(query);
        card.classList.toggle("hidden", !(matchesFilter && matchesSearch));
    });
}

chips.forEach((chip) => {
    chip.addEventListener("click", () => {
        chips.forEach((item) => item.classList.remove("active"));
        chip.classList.add("active");
        activeFilter = chip.dataset.filter || "all";
        applyFilters();
    });
});

searchInput.addEventListener("input", applyFilters);

bookButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const testName = button.dataset.book || "a health package";
        const message = `Hello! I want to book ${testName}. Please share the next steps.`;
        window.open(`https://wa.me/919876543210?text=${encodeURIComponent(message)}`, "_blank");
    });
});

homeCollectionBtn.addEventListener("click", () => {
    const message = "Hello! I want to book a home sample collection. Please guide me.";
    window.open(`https://wa.me/919876543210?text=${encodeURIComponent(message)}`, "_blank");
});

mobileNumberInput.addEventListener("input", (event) => {
    event.target.value = event.target.value.replace(/\D/g, "").slice(0, 10);
});

reportForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const patientId = patientIdInput.value.trim();
    const mobileNumber = mobileNumberInput.value.trim();

    if (!patientId || mobileNumber.length !== 10) {
        formNote.textContent = "Please enter a valid patient ID and a 10-digit mobile number.";
        formNote.style.color = "#d64545";
        return;
    }

    downloadBtn.disabled = true;
    downloadBtn.textContent = "Processing...";
    formNote.textContent = "Submitting your request. Please wait a moment.";
    formNote.style.color = "#5b6474";

    window.setTimeout(() => {
        downloadBtn.disabled = false;
        downloadBtn.textContent = "Send Report Request";
        formNote.textContent = `Request received for ${patientId}. Our team can follow up on ${mobileNumber}.`;
        formNote.style.color = "#1bb38a";
        patientIdInput.value = "";
        mobileNumberInput.value = "";
    }, 1600);
});

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll(".reveal").forEach((element) => {
    revealObserver.observe(element);
});

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) {
            return;
        }

        const target = entry.target;
        const finalValue = Number(target.dataset.count || 0);
        const duration = 900;
        const startTime = performance.now();

        function tick(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            const current = Math.floor(progress * finalValue);
            target.textContent = `${current}+`;

            if (progress < 1) {
                window.requestAnimationFrame(tick);
                return;
            }

            target.textContent = `${finalValue}+`;
        }

        window.requestAnimationFrame(tick);
        counterObserver.unobserve(target);
    });
}, { threshold: 0.5 });

counters.forEach((counter) => counterObserver.observe(counter));
