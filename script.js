document.addEventListener("DOMContentLoaded", () => {
  const thumbnails = Array.from(document.querySelectorAll(".scrollgallery .column img"));
  const expandedImage = document.getElementById("expandedImg");
  const caption = document.getElementById("imgtext");
  const credit = document.getElementById("imgcredit");
  const previousButton = document.getElementById("previousImage");
  const nextButton = document.getElementById("nextImage");
  const gallery = document.querySelector(".scrollgallery");
  const imageViewer = document.getElementById("imgContainer");

  if (!expandedImage || !caption || !credit || !previousButton || !nextButton || thumbnails.length === 0) {
    return;
  }

  let currentIndex = 0;
  let autoAdvanceTimer;

  function stopAutoAdvance() {
    window.clearTimeout(autoAdvanceTimer);
  }

  function startAutoAdvance() {
    stopAutoAdvance();

    const interactionInProgress =
      document.hidden ||
      [gallery, imageViewer].some((element) =>
        element &&
        (element.matches(":hover") || element.contains(document.activeElement))
      );

    if (interactionInProgress) {
      return;
    }

    autoAdvanceTimer = window.setTimeout(() => {
      showImage(currentIndex + 1, true);
    }, 8000);
  }

  function scrollThumbnailIntoView(thumbnail) {
    const gallery = thumbnail.closest(".scrollgallery");
    const thumbnailCard = thumbnail.closest(".column");

    if (!gallery || !thumbnailCard) {
      return;
    }

    if (gallery.scrollWidth <= gallery.clientWidth) {
      return;
    }

    const galleryRect = gallery.getBoundingClientRect();
    const thumbnailRect = thumbnailCard.getBoundingClientRect();
    const scrollOffset =
      thumbnailRect.left -
      galleryRect.left -
      (gallery.clientWidth - thumbnailRect.width) / 2;

    gallery.scrollBy({ left: scrollOffset, behavior: "smooth" });
  }

  function showImage(index, scrollThumbnail = false) {
    currentIndex = (index + thumbnails.length) % thumbnails.length;
    const thumbnail = thumbnails[currentIndex];

    expandedImage.src = thumbnail.src;
    expandedImage.alt = thumbnail.alt;
    caption.textContent = thumbnail.alt;
    credit.innerHTML = thumbnail.getAttribute("data-credit") || "";

    thumbnails.forEach((image, imageIndex) => {
      image.classList.toggle("selected", imageIndex === currentIndex);
      image.setAttribute("aria-pressed", String(imageIndex === currentIndex));
    });

    if (scrollThumbnail) {
      scrollThumbnailIntoView(thumbnail);
    }

    startAutoAdvance();
  }

  thumbnails.forEach((thumbnail, index) => {
    thumbnail.setAttribute("role", "button");
    thumbnail.setAttribute("tabindex", "0");
    thumbnail.setAttribute("aria-label", thumbnail.alt);
    thumbnail.setAttribute("aria-pressed", "false");
    thumbnail.addEventListener("click", () => showImage(index, true));
    thumbnail.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        showImage(index, true);
      }
    });
  });

  previousButton.addEventListener("click", () => showImage(currentIndex - 1, true));
  nextButton.addEventListener("click", () => showImage(currentIndex + 1, true));

  [gallery, imageViewer].forEach((element) => {
    if (!element) {
      return;
    }

    element.addEventListener("mouseenter", stopAutoAdvance);
    element.addEventListener("mouseleave", startAutoAdvance);
    element.addEventListener("focusin", stopAutoAdvance);
    element.addEventListener("focusout", (event) => {
      if (!element.contains(event.relatedTarget)) {
        startAutoAdvance();
      }
    });
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopAutoAdvance();
    } else {
      startAutoAdvance();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      showImage(currentIndex - 1, true);
    } else if (event.key === "ArrowRight") {
      showImage(currentIndex + 1, true);
    }
  });

  showImage(currentIndex);
});