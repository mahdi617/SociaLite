// Post data
const posts = [
  {
    id: 0,
    slides: [
      { type: "image", src: "https://picsum.photos/800/800?11" },
      { type: "video", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
    ],
    description:
      "این یک پست نمونه است با چندین تصویر زیبا که نشان‌دهنده محتوای جذاب شبکه‌های اجتماعی است. لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است.",
    likes: 142,
    comments: [
      {
        user: "علی احمدی",
        text: "عکس فوق‌العاده‌ای است! واقعاً دوست داشتم",
        time: "2 ساعت پیش",
      },
      {
        user: "مریم حسینی",
        text: "واقعاً زیبا و الهام‌بخش. کجا گرفتید این عکس رو؟",
        time: "1 ساعت پیش",
      },
    ],
  },
  {
    id: 1,
    slides: [
      { type: "image", src: "https://picsum.photos/800/800?13" },
      {
        type: "video",
        src: "https://www.w3schools.com/html/mov_bbb.mp4",
      },
    ],
    description:
      "ترکیبی از تصویر و ویدیو برای نمایش بهتر محتوا. این پست شامل محتوای متنوعی است.",
    likes: 89,
    comments: [
      {
        user: "رضا کریمی",
        text: "ویدیو بسیار جالبی بود، ممنون از اشتراک",
        time: "3 ساعت پیش",
      },
    ],
  },
  {
    id: 2,
    slides: [{ type: "image", src: "https://picsum.photos/800/800?14" }],
    description: "تصویر منفرد با کیفیت بالا که جزئیات فوق‌العاده‌ای دارد.",
    likes: 256,
    comments: [],
  },
  {
    id: 3,
    slides: [{ type: "image", src: "https://picsum.photos/800/800?21" }],
    description: "لحظه‌ای زیبا از طبیعت که در زمان مناسب ثبت شده است.",
    likes: 178,
    comments: [
      {
        user: "سارا محمدی",
        text: "طبیعت همیشه زیباست و این عکس نشان‌دهنده همین زیبایی است",
        time: "4 ساعت پیش",
      },
    ],
  },
  {
    id: 4,
    slides: [{ type: "image", src: "https://picsum.photos/800/800?22" }],
    description: "هنر خیابانی مدرن که نمایانگر خلاقیت هنرمندان معاصر است.",
    likes: 95,
    comments: [],
  },
  {
    id: 5,
    slides: [
      {
        type: "video",
        src: "https://www.w3schools.com/html/mov_bbb.mp4",
      },
    ],
    description: "ویدیو کوتاه و جذاب که لحظات خاصی را به تصویر می‌کشد.",
    likes: 203,
    comments: [
      {
        user: "امیر رضایی",
        text: "ویدیو عالی! کیفیت فوق‌العاده‌ای داره",
        time: "5 ساعت پیش",
      },
      {
        user: "نازنین اکبری",
        text: "دوست داشتم، ممنون از اشتراک",
        time: "4 ساعت پیش",
      },
    ],
  },
  {
    id: 6,
    slides: [{ type: "image", src: "https://picsum.photos/800/800?31" }],
    description: "معماری مدرن و خلاقانه که ترکیب زیبایی از سنت و مدرنیته است.",
    likes: 167,
    comments: [],
  },
  {
    id: 7,
    slides: [
      {
        type: "video",
        src: "https://www.w3schools.com/html/mov_bbb.mp4",
      },
    ],
    description: "نمایی از شهر در شب که جلوه‌ای خاص و رمانتیک دارد.",
    likes: 134,
    comments: [
      {
        user: "حسین نوری",
        text: "شب‌های شهر زیبا و دلنشین هستند",
        time: "6 ساعت پیش",
      },
    ],
  },
  {
    id: 8,
    slides: [{ type: "image", src: "https://picsum.photos/800/800?33" }],
    description: "آخرین پست از مجموعه که خاتمه‌ای زیبا برای این سری محتوا است.",
    likes: 221,
    comments: [
      {
        user: "فاطمه احمدی",
        text: "مجموعه فوق‌العاده‌ای بود، منتظر پست‌های بعدی هستم",
        time: "7 ساعت پیش",
      },
    ],
  },
];

let currentPost = null;
let isLiked = false;
let modalSwiper = null;
let selectedFiles = [];

// File size limits (in bytes)
const FILE_SIZE_LIMITS = {
  image: 2 * 1024 * 1024, // 2MB
  video: 10 * 1024 * 1024, // 10MB
};

// Import Swiper library
// import Swiper from 'swiper';

// Initialize event listeners
document.addEventListener("DOMContentLoaded", function () {
  initializePostGrid();
  initializeModalEvents();
});

function initializePostGrid() {
  const postItems = document.querySelectorAll(".gallery-post-item");
  postItems.forEach((item) => {
    item.addEventListener("click", function () {
      const postId = parseInt(this.dataset.post);
      openModal(postId);
    });
  });
}

document.querySelector(".gallery-posts-grid")
  .addEventListener("click", e => {
    const item = e.target.closest(".gallery-post-item");
    if (!item) return;
    const postId = parseInt(item.dataset.post, 10);
    openModal(postId);
  });


function initializeModalEvents() {
  // Modal click outside to close
  document.getElementById("gallery-postModal").addEventListener("click", function (e) {
    if (e.target === this) {
      closeModal();
    }
  });

  // Keyboard navigation
  document.addEventListener("keydown", function (e) {
    if (document.getElementById("gallery-postModal").classList.contains("active")) {
      if (e.key === "Escape") {
        closeModal();
      }
    }
  });

  // Comment input Enter key
  const commentInput = document.getElementById("gallery-commentInput");
  if (commentInput) {
    commentInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        addComment();
      }
    });
  }
}

function openModal(postId) {
  currentPost = posts[postId];
  isLiked = false;

  // Update modal content
  updateModalContent();

  // Create and initialize swiper
  createSwiperSlides();
  initializeModalVideoSettings();
  initializeSwiper();

  // Show modal with animation
  const modal = document.getElementById("gallery-postModal");
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  // Destroy swiper instance properly
  if (modalSwiper && typeof modalSwiper.destroy === "function") {
    modalSwiper.destroy(true, true);
    modalSwiper = null;
  }

  // Pause all videos
  const videos = document.querySelectorAll("#gallery-postModal video");
  videos.forEach((video) => {
    video.pause();
    video.currentTime = 0;
  });

  // Hide modal
  const modal = document.getElementById("gallery-postModal");
  modal.classList.remove("active");
  document.body.style.overflow = "";

  // Reset state
  currentPost = null;
  selectedFiles = [];
  hideOverlay();
}

function createSwiperSlides() {
  const swiperWrapper = document.querySelector(".gallery-modal-swiper .swiper-wrapper");
  if (!swiperWrapper) return;

  // Clear existing slides
  swiperWrapper.innerHTML = "";

  // Create new slides
  currentPost.slides.forEach((slide, index) => {
    const slideDiv = document.createElement("div");
    slideDiv.className = "swiper-slide";

    if (slide.type === "image") {
      const img = document.createElement("img");
      img.src = slide.src;
      img.alt = `Slide ${index + 1}`;
      img.loading = "lazy";
      slideDiv.appendChild(img);
    } else if (slide.type === "video") {
      const video = document.createElement("video");
      video.src = slide.src;
      video.controls = true;
      video.muted = false;
      video.preload = "metadata";
      slideDiv.appendChild(video);
    }

    swiperWrapper.appendChild(slideDiv);
  });
}

function initializeSwiper() {
  // Destroy existing swiper if it exists
  if (modalSwiper && typeof modalSwiper.destroy === "function") {
    modalSwiper.destroy(true, true);
    modalSwiper = null;
  }

  // Wait for DOM to be ready
  setTimeout(() => {
    try {
      // Initialize new swiper with proper configuration
      modalSwiper = new Swiper(".gallery-modal-swiper", {
        // Basic settings
        direction: "horizontal",
        loop: false,
        centeredSlides: true,
        slidesPerView: 1,
        spaceBetween: 0,

        // Navigation
        navigation: {
          nextEl: ".gallery-modal-swiper .swiper-button-next",
          prevEl: ".gallery-modal-swiper .swiper-button-prev",
        },

        // Pagination
        pagination: {
          el: ".gallery-modal-swiper .swiper-pagination",
          clickable: true,
          type: "fraction",
        },

        // Touch settings
        touchRatio: 1,
        touchAngle: 45,
        grabCursor: true,
        simulateTouch: true,

        // Keyboard control
        keyboard: {
          enabled: true,
          onlyInViewport: true,
        },

        // Mouse wheel
        mousewheel: {
          invert: false,
          forceToAxis: true,
        },

        // Effects and transitions
        effect: "slide",
        speed: 400,

        // Lazy loading
        lazy: {
          loadPrevNext: true,
          loadPrevNextAmount: 1,
        },

        // Auto height
        autoHeight: false,

        // Responsive breakpoints
        breakpoints: {
          320: {
            slidesPerView: 1,
            spaceBetween: 0,
          },
          768: {
            slidesPerView: 1,
            spaceBetween: 0,
          },
        },

        // Event callbacks
        on: {
          init: function () {
            console.log("Swiper initialized");
            updateSwiperVisibility();
            handleSlideChange();
          },
          slideChange: function () {
            handleSlideChange();
          },
          touchStart: function () {
            // Pause all videos on touch start
            pauseAllVideos();
          },
        },
      });
    } catch (error) {
      console.error("Error initializing Swiper:", error);
    }
  }, 100);
}

function updateSwiperVisibility() {
  const navigation = document.querySelectorAll(
    ".gallery-modal-swiper .swiper-button-next, .gallery-modal-swiper .swiper-button-prev"
  );
  const pagination = document.querySelector(".gallery-modal-swiper .swiper-pagination");

  if (currentPost.slides.length <= 1) {
    navigation.forEach((btn) => (btn.style.display = "none"));
    if (pagination) pagination.style.display = "none";
  } else {
    navigation.forEach((btn) => (btn.style.display = "flex"));
    if (pagination) pagination.style.display = "flex";
  }
}

function handleSlideChange() {
  // Pause all videos
  pauseAllVideos();

  // Play current slide video if exists
  if (modalSwiper && modalSwiper.slides) {
    const activeSlide = modalSwiper.slides[modalSwiper.activeIndex];
    if (activeSlide) {
      const video = activeSlide.querySelector("video");
      if (video) {
        video.currentTime = 0;
        video.play().catch((e) => console.log("Video play failed:", e));
      }
    }
  }
}

function pauseAllVideos() {
  const videos = document.querySelectorAll(".gallery-modal-swiper video");
  videos.forEach((video) => {
    video.pause();
  });
}

function updateModalContent() {
  const descriptionEl = document.getElementById("gallery-modalDescription");
  if (descriptionEl) {
    descriptionEl.textContent = currentPost.description;
  }
  updateLikesCount();
  updateLikeButton();
}

function updateLikeButton() {
  const likeBtn = document.getElementById("gallery-likeBtn");
  if (likeBtn) {
    likeBtn.classList.toggle("liked", isLiked);
  }
}

function updateLikesCount() {
  const likesCount = document.getElementById("gallery-likesCount");
  if (likesCount) {
    const count = currentPost.likes + (isLiked ? 1 : 0);
    likesCount.textContent = `${count} پسندیدن`;
  }
}

function showLikes() {
  isLiked = !isLiked;
  updateLikeButton();
  updateLikesCount();
}

function showComments() {
  const overlay = document.getElementById("gallery-slidingOverlay");
  const overlayTitle = document.getElementById("gallery-overlayTitle");
  const overlayContent = document.getElementById("gallery-overlayContent");
  const commentForm = document.getElementById("gallery-commentForm");

  if (!overlay || !overlayTitle || !overlayContent || !commentForm) return;

  overlayTitle.textContent = "نظرات";
  commentForm.style.display = "flex";

  overlayContent.innerHTML = `
    <div class="gallery-comments-list">
      ${currentPost.comments
        .map(
          (comment) => `
          <div class="gallery-comment">
            <div class="gallery-comment-avatar"></div>
            <div class="gallery-comment-content">
              <div class="gallery-comment-text">
                <span class="gallery-comment-username">${comment.user}</span>
                ${comment.text}
              </div>
              <div class="gallery-comment-time">${comment.time}</div>
            </div>
          </div>
        `
        )
        .join("")}
    </div>
  `;

  overlay.classList.add("active");
  overlay.classList.remove("gallery-highoverlay");
}

function hideOverlay() {
  const overlay = document.getElementById("gallery-slidingOverlay");
  if (overlay) {
    overlay.classList.remove("active");
    overlay.classList.remove("gallery-highoverlay");
  }
}

function toggleSubmitButton() {
  const input = document.getElementById("gallery-commentInput");
  const submitBtn = document.getElementById("gallery-submitBtn");
  if (input && submitBtn) {
    submitBtn.classList.toggle("active", input.value.trim().length > 0);
  }
}

function addComment() {
  const input = document.getElementById("gallery-commentInput");
  if (!input) return;

  const text = input.value.trim();
  if (text && currentPost) {
    const newComment = {
      user: "شما",
      text: text,
      time: "اکنون",
    };

    currentPost.comments.push(newComment);
    showComments(); // Refresh comments display
    input.value = "";
    toggleSubmitButton();

    // Scroll to bottom
    const overlayContent = document.getElementById("gallery-overlayContent");
    if (overlayContent) {
      setTimeout(() => {
        overlayContent.scrollTop = overlayContent.scrollHeight;
      }, 100);
    }
  }
}

function initializeModalVideoSettings() {
  const modalVideos = document.querySelectorAll("#gallery-postModal video");
  modalVideos.forEach((video) => {
    video.removeAttribute("controls");
    video.autoplay = false;
    video.muted = false;
    video.loop = true;
    video.playsInline = true;
    video.addEventListener("contextmenu", (e) => e.preventDefault());
  });
}

function showLikesme() {
  const overlay = document.getElementById("gallery-slidingOverlay");
  const overlayTitle = document.getElementById("gallery-overlayTitle");
  const overlayContent = document.getElementById("gallery-overlayContent");
  const commentForm = document.getElementById("gallery-commentForm");

  if (!overlay || !overlayTitle || !overlayContent || !commentForm) return;

  overlayTitle.textContent = "پسندیدن‌ها";
  commentForm.style.display = "none";

  // Generate likes list
  const likesUsers = [
    "علی احمدی",
    "مریم حسینی",
    "رضا کریمی",
    "سارا محمدی",
    "امیر رضایی",
    "نازنین اکبری",
    "حسین نوری",
    "فاطمه احمدی",
    "محمد صادقی",
    "زهرا کریمی",
    "حامد موسوی",
    "لیلا رضایی",
    "مهدی جعفری",
    "شیما کریمی",
    "بهزاد احمدی",
  ];

  const displayCount = Math.min(currentPost.likes + (isLiked ? 1 : 0), 15);
  overlayContent.innerHTML = `
    <div class="gallery-likes-list">
      ${likesUsers
        .slice(0, displayCount)
        .map(
          (user) => `
          <div class="gallery-like-item">
            <div class="gallery-like-avatar"></div>
            <div class="gallery-like-username">${user}</div>
          </div>
        `
        )
        .join("")}
    </div>
  `;

  overlay.classList.add("active");
  overlay.classList.remove("gallery-highoverlay");
}

// Fixed and improved edit function
function showedit() {
  const overlay = document.getElementById("gallery-slidingOverlay");
  const overlayTitle = document.getElementById("gallery-overlayTitle");
  const overlayContent = document.getElementById("gallery-overlayContent");

  if (!overlay || !overlayTitle || !overlayContent) return;

  overlayTitle.textContent = "ویرایش پست";

  overlayContent.innerHTML = `
    <div class="gallery-modal-body gallery-createPostModal-body">
      <form id="gallery-postForm" class="gallery-createPostModal-postform">
        <div class="gallery-form-group gallery-createPostModal-form-group">
          <label for="gallery-postDescription" class="gallery-form-label">
            توضیحات پست
          </label>
          <div>
            <div class="gallery-rich-text-toolbar">
              <button type="button" data-command="bold" title="Bold"><i class="ri-bold"></i></button>
              <button type="button" data-command="italic" title="Italic"><i class="ri-italic"></i></button>
              <button type="button" data-command="underline" title="Underline"><i class="ri-underline"></i></button>
              <button type="button" data-command="insertUnorderedList" title="Bullet List"><i class="ri-list-unordered"></i></button>
              <button type="button" data-command="insertOrderedList" title="Numbered List"><i class="ri-list-ordered"></i></button>
            </div>
            <div id="gallery-postDescription" class="gallery-form-control gallery-rich-text-editor" contenteditable="true" 
                 data-placeholder="توضیحات خود را اینجا بنویسید..."></div>
          </div>
        </div>
        
        <div class="gallery-form-group gallery-createPostModal-form-group">
          <label class="gallery-form-label">رسانه‌های پست</label>
          <div id="gallery-mediaPreviewContainer" class="gallery-media-preview-container"></div>
          <div class="gallery-upload-area" id="gallery-uploadArea">
            <div class="gallery-upload-content">
              <i class="ri-upload-cloud-fill fa-3x"></i>
              <h5 class="text-muted">فایل‌های جدید را اینجا بکشید</h5>
              <p class="text-muted mb-3">یا کلیک کنید تا از کامپیوتر خود انتخاب کنید</p>
              <button type="button" class="gallery-btn-outline-primary" id="gallery-selectMediaBtn">
                <i class="ri-folder-open-line"></i> انتخاب فایل‌های جدید
              </button>
              <p class="text-muted mt-2 small">
                فرمت‌های پشتیبانی شده: JPG، PNG، GIF، MP4، WebM، MOV<br>
                <strong>حداکثر اندازه:</strong> تصاویر 2MB، ویدیوها 10MB
              </p>
            </div>
          </div>
          <input type="file" id="gallery-fileInput" multiple accept="image/*,video/*" style="display: none;">
          <div class="gallery-media-count" id="gallery-mediaCount"></div>
          <div id="gallery-uploadErrors" class="gallery-upload-errors" style="display: none;"></div>
        </div>
        
        <div class="gallery-form-group gallery-createPostModal-form-group-2">
          <button type="button" class="gallery-btn-primary gallery-btn-lg" id="gallery-deletePostBtn" style="background: #dc3545; border-color: #dc3545;">
            حذف پست
          </button>
          <button type="submit" class="gallery-btn-primary gallery-btn-lg">
            ذخیره تغییرات
          </button>
        </div>
      </form>
    </div>
  `;

  const commentForm = document.getElementById("gallery-commentForm");
  if (commentForm) {
    commentForm.style.display = "none";
  }

  overlay.classList.add("active");
  overlay.classList.add("gallery-highoverlay");

  // Initialize edit form
  initializeEditForm();
}

function initializeEditForm() {
  // Fill current post description
  const descriptionEditor = document.getElementById("gallery-postDescription");
  if (descriptionEditor) {
    descriptionEditor.innerHTML = currentPost.description;
  }

  // Display current media files
  displayCurrentMedia();

  // Initialize rich text toolbar
  initializeRichTextToolbar();

  // Initialize file upload
  initializeFileUpload();

  // Initialize form submission
  initializeFormSubmission();

  // Initialize delete functionality
  initializeDeleteFunctionality();

  // Add upload error styles
  addUploadErrorStyles();
}

function displayCurrentMedia() {
  const mediaPreview = document.getElementById("gallery-mediaPreviewContainer");
  const mediaCount = document.getElementById("gallery-mediaCount");

  if (!mediaPreview) return;

  mediaPreview.innerHTML = "";

  currentPost.slides.forEach((media, index) => {
    const wrapper = document.createElement("div");
    wrapper.classList.add("gallery-media-preview");
    wrapper.dataset.index = index;

    // Create media element
    const mediaEl = document.createElement(
      media.type === "image" ? "img" : "video"
    );
    mediaEl.src = media.src;
    if (media.type === "video") {
      mediaEl.controls = true;
      mediaEl.muted = true;
    }

    // Create delete button with proper styling and icon
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("gallery-media-delete-btn");
    deleteBtn.type = "button";
    deleteBtn.title = "حذف این رسانه";
    deleteBtn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="15" y1="9" x2="9" y2="15"></line>
        <line x1="9" y1="9" x2="15" y2="15"></line>
      </svg>
    `;

    // Add click event for delete
    deleteBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      removeMediaFromPost(index);
    });

    // Create media type badge
    const typeBadge = document.createElement("div");
    typeBadge.classList.add("gallery-media-type-badge");
    typeBadge.textContent = media.type === "image" ? "IMG" : "VID";

    // Create overlay for better visibility of delete button
    const overlay = document.createElement("div");
    overlay.classList.add("gallery-media-overlay");

    // Assemble the wrapper
    wrapper.appendChild(mediaEl);
    wrapper.appendChild(overlay);
    wrapper.appendChild(deleteBtn);
    wrapper.appendChild(typeBadge);

    mediaPreview.appendChild(wrapper);
  });

  // Update media count
  if (mediaCount) {
    mediaCount.textContent = `${currentPost.slides.length} فایل رسانه‌ای`;
    mediaCount.style.display = currentPost.slides.length > 0 ? "block" : "none";
  }

  // Add CSS styles dynamically if not already added
  addMediaPreviewStyles();
}

function addMediaPreviewStyles() {
  // Check if styles already exist
  if (document.getElementById("gallery-media-preview-styles")) return;

  const style = document.createElement("style");
  style.id = "gallery-media-preview-styles";
  style.textContent = `
    .gallery-media-preview {
      position: relative;
      overflow: hidden;
      border-radius: 8px;
      transition: all 0.3s ease;
    }

    .gallery-media-preview:hover {
      transform: scale(1.02);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    }

    .gallery-media-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.3);
      opacity: 0;
      transition: opacity 0.3s ease;
      pointer-events: none;
    }

    .gallery-media-preview:hover .gallery-media-overlay {
      opacity: 1;
    }

    .gallery-media-delete-btn {
      position: absolute;
      top: 8px;
      right: 8px;
      background: rgba(220, 53, 69, 0.9);
      border: none;
      border-radius: 50%;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      opacity: 0;
      transform: scale(0.8);
      transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      backdrop-filter: blur(10px);
      z-index: 10;
    }

    .gallery-media-delete-btn:hover {
      background: rgba(220, 53, 69, 1);
      transform: scale(1.1);
      box-shadow: 0 4px 15px rgba(220, 53, 69, 0.4);
    }

    .gallery-media-preview:hover .gallery-media-delete-btn {
      opacity: 1;
      transform: scale(1);
    }

    .gallery-media-delete-btn svg {
      width: 18px;
      height: 18px;
      color: white;
      filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
    }

    .gallery-media-type-badge {
      position: absolute;
      top: 8px;
      left: 8px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 10px;
      font-weight: bold;
      text-transform: uppercase;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .gallery-media-preview img,
    .gallery-media-preview video {
      transition: transform 0.3s ease;
    }

    .gallery-media-preview:hover img,
    .gallery-media-preview:hover video {
      transform: scale(1.05);
    }

    /* Animation for delete confirmation */
    .gallery-media-preview.deleting {
      animation: gallery-deleteAnimation 0.5s ease-out forwards;
    }

    @keyframes gallery-deleteAnimation {
      0% {
        opacity: 1;
        transform: scale(1);
      }
      50% {
        opacity: 0.5;
        transform: scale(0.9);
      }
      100% {
        opacity: 0;
        transform: scale(0.8);
        height: 0;
        margin: 0;
        padding: 0;
      }
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
      .gallery-media-delete-btn {
        width: 28px;
        height: 28px;
        top: 6px;
        right: 6px;
      }

      .gallery-media-delete-btn svg {
        width: 16px;
        height: 16px;
      }

      .gallery-media-type-badge {
        top: 6px;
        left: 6px;
        padding: 2px 6px;
        font-size: 9px;
      }
    }
  `;

  document.head.appendChild(style);
}

function addUploadErrorStyles() {
  // Check if styles already exist
  if (document.getElementById("gallery-upload-error-styles")) return;

  const style = document.createElement("style");
  style.id = "gallery-upload-error-styles";
  style.textContent = `
    .gallery-upload-errors {
      margin-top: 12px;
      padding: 12px;
      background: #fff5f5;
      border: 1px solid #fed7d7;
      border-radius: 6px;
      color: #c53030;
      font-size: 14px;
    }

    .gallery-upload-error-item {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      padding: 8px;
      background: white;
      border-radius: 4px;
      border-left: 4px solid #e53e3e;
    }

    .gallery-upload-error-item:last-child {
      margin-bottom: 0;
    }

    .gallery-upload-error-icon {
      width: 16px;
      height: 16px;
      margin-left: 8px;
      color: #e53e3e;
      flex-shrink: 0;
    }

    .gallery-upload-error-text {
      flex: 1;
    }

    .gallery-upload-error-filename {
      font-weight: 600;
      color: #2d3748;
    }

    .gallery-upload-success {
      margin-top: 12px;
      padding: 12px;
      background: #f0fff4;
      border: 1px solid #9ae6b4;
      border-radius: 6px;
      color: #2f855a;
      font-size: 14px;
    }
  `;

  document.head.appendChild(style);
}

// File validation functions
function validateFileSize(file) {
  const isImage = file.type.startsWith("image/");
  const isVideo = file.type.startsWith("video/");

  if (isImage && file.size > FILE_SIZE_LIMITS.image) {
    return {
      valid: false,
      error: `تصویر "${file.name}" بزرگتر از 2MB است (${formatFileSize(
        file.size
      )})`,
    };
  }

  if (isVideo && file.size > FILE_SIZE_LIMITS.video) {
    return {
      valid: false,
      error: ` ویدیو "${file.name}" بزرگتر از 10MB است (${formatFileSize(
        file.size
      )})`,
    };
  }

  return { valid: true };
}

function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

async function generateFileHash(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      // Simple hash based on file content, size, and name
      const content = e.target.result;
      const hash = btoa(
        file.name + file.size + file.lastModified + content.slice(0, 1000)
      );
      resolve(hash);
    };
    reader.readAsDataURL(file);
  });
}

async function checkForDuplicates(newFiles) {
  const duplicates = [];
  const existingHashes = [];

  // Generate hashes for existing media
  for (const media of currentPost.slides) {
    if (media.file) {
      const hash = await generateFileHash(media.file);
      existingHashes.push(hash);
    } else {
      // For existing media without file object, use src as identifier
      existingHashes.push(media.src);
    }
  }

  // Check new files for duplicates
  for (const file of newFiles) {
    const hash = await generateFileHash(file);

    // Check against existing media
    if (existingHashes.includes(hash)) {
      duplicates.push({
        file,
        error: `فایل "${file.name}" قبلاً اضافه شده است`,
      });
      continue;
    }

    // Check against other new files
    const duplicateInNewFiles = newFiles.filter(
      (f) => f !== file && f.name === file.name && f.size === file.size
    );
    if (duplicateInNewFiles.length > 0) {
      duplicates.push({
        file,
        error: `فایل "${file.name}" تکراری است`,
      });
    }
  }

  return duplicates;
}

function displayUploadErrors(errors) {
  const errorContainer = document.getElementById("gallery-uploadErrors");
  if (!errorContainer || errors.length === 0) {
    if (errorContainer) errorContainer.style.display = "none";
    return;
  }

  const errorHTML = errors
    .map(
      (error) => `
    <div class="gallery-upload-error-item">
      <svg class="gallery-upload-error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="15" y1="9" x2="9" y2="15"></line>
        <line x1="9" y1="9" x2="15" y2="15"></line>
      </svg>
      <div class="gallery-upload-error-text">
        <div class="gallery-upload-error-filename">${
          error.file ? error.file.name : "فایل نامشخص"
        }</div>
        <div>${error.error}</div>
      </div>
    </div>
  `
    )
    .join("");

  errorContainer.innerHTML = `
    <div style="margin-bottom: 12px; font-weight: 600;">
      خطاهای آپلود (${errors.length} فایل):
    </div>
    ${errorHTML}
  `;
  errorContainer.style.display = "block";

  // Auto-hide after 10 seconds
  setTimeout(() => {
    if (errorContainer) {
      errorContainer.style.display = "none";
    }
  }, 10000);
}

function displayUploadSuccess(count) {
  const errorContainer = document.getElementById("gallery-uploadErrors");
  if (!errorContainer) return;

  errorContainer.innerHTML = `
    <div class="gallery-upload-success">
      <svg style="width: 16px; height: 16px; margin-left: 8px; display: inline-block;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22,4 12,14.01 9,11.01"></polyline>
      </svg>
      ${count} فایل با موفقیت اضافه شد!
    </div>
  `;
  errorContainer.style.display = "block";

  // Auto-hide after 3 seconds
  setTimeout(() => {
    if (errorContainer) {
      errorContainer.style.display = "none";
    }
  }, 3000);
}

function removeMediaFromPost(index) {
  const mediaPreview = document.querySelector(
    `.gallery-media-preview[data-index="${index}"]`
  );

  if (confirm("آیا از حذف این رسانه مطمئن هستید؟")) {
    // Add delete animation
    if (mediaPreview) {
      mediaPreview.classList.add("deleting");

      // Wait for animation to complete before removing
      setTimeout(() => {
        currentPost.slides.splice(index, 1);
        displayCurrentMedia();

        // If no media left, show warning
        if (currentPost.slides.length === 0) {
          alert("هشدار: پست باید حداقل یک رسانه داشته باشد!");
        }
      }, 500);
    } else {
      // Fallback if element not found
      currentPost.slides.splice(index, 1);
      displayCurrentMedia();

      if (currentPost.slides.length === 0) {
        alert("هشدار: پست باید حداقل یک رسانه داشته باشد!");
      }
    }
  }
}

function initializeRichTextToolbar() {
  const toolbar = document.querySelector(".gallery-rich-text-toolbar");
  if (!toolbar) return;

  toolbar.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      e.preventDefault();
      const command = e.target.dataset.command;
      if (command) {
        document.execCommand(command, false, null);
        e.target.classList.toggle("active");
      }
    }
  });
}

function initializeFileUpload() {
  const fileInput = document.getElementById("gallery-fileInput");
  const selectBtn = document.getElementById("gallery-selectMediaBtn");
  const uploadArea = document.getElementById("gallery-uploadArea");

  if (selectBtn && fileInput) {
    selectBtn.addEventListener("click", () => {
      fileInput.click();
    });
  }

  if (fileInput) {
    fileInput.addEventListener("change", handleFileSelection);
  }

  if (uploadArea) {
    uploadArea.addEventListener("dragover", (e) => {
      e.preventDefault();
      uploadArea.classList.add("dragover");
    });

    uploadArea.addEventListener("dragleave", () => {
      uploadArea.classList.remove("dragover");
    });

    uploadArea.addEventListener("drop", (e) => {
      e.preventDefault();
      uploadArea.classList.remove("dragover");
      const files = Array.from(e.dataTransfer.files);
      addNewMediaFiles(files);
    });
  }
}

function handleFileSelection(e) {
  const files = Array.from(e.target.files);
  addNewMediaFiles(files);
  // Clear the input so the same file can be selected again
  e.target.value = "";
}

async function addNewMediaFiles(files) {
  const errors = [];
  const validFiles = [];

  // Filter valid file types
  const supportedFiles = files.filter((file) => {
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      errors.push({
        file,
        error: "فرمت فایل پشتیبانی نمی‌شود. فقط تصاویر و ویدیوها مجاز هستند.",
      });
      return false;
    }
    return true;
  });

  // Validate file sizes
  for (const file of supportedFiles) {
    const sizeValidation = validateFileSize(file);
    if (!sizeValidation.valid) {
      errors.push({
        file,
        error: sizeValidation.error,
      });
    } else {
      validFiles.push(file);
    }
  }

  // Check for duplicates
  const duplicates = await checkForDuplicates(validFiles);
  errors.push(...duplicates);

  // Remove duplicates from valid files
  const finalValidFiles = validFiles.filter(
    (file) => !duplicates.some((dup) => dup.file === file)
  );

  // Display errors if any
  if (errors.length > 0) {
    displayUploadErrors(errors);
  }

  // Process valid files
  if (finalValidFiles.length > 0) {
    let processedCount = 0;

    finalValidFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newMedia = {
          type: file.type.startsWith("image/") ? "image" : "video",
          src: e.target.result,
          file: file,
          hash: null, // Will be set later if needed
        };

        currentPost.slides.push(newMedia);
        processedCount++;

        // Update display when all files are processed
        if (processedCount === finalValidFiles.length) {
          displayCurrentMedia();
          displayUploadSuccess(finalValidFiles.length);
        }
      };

      reader.onerror = () => {
        errors.push({
          file,
          error: "خطا در خواندن فایل",
        });
        processedCount++;

        if (processedCount === finalValidFiles.length) {
          displayCurrentMedia();
          if (errors.length > 0) {
            displayUploadErrors(errors);
          }
        }
      };

      reader.readAsDataURL(file);
    });
  }

  // Show message if no valid files
  if (finalValidFiles.length === 0 && errors.length === 0) {
    alert("هیچ فایل معتبری برای آپلود انتخاب نشد.");
  }
}

function initializeFormSubmission() {
  const form = document.getElementById("gallery-postForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    savePostChanges();
  });
}

function savePostChanges() {
  const descriptionEditor = document.getElementById("gallery-postDescription");

  if (!descriptionEditor) return;

  // Validate that post has at least one media file
  if (currentPost.slides.length === 0) {
    alert("پست باید حداقل یک تصویر یا ویدیو داشته باشد!");
    return;
  }

  // Update post description
  const newDescription = descriptionEditor.innerText.trim();
  if (newDescription.length === 0) {
    alert("لطفاً توضیحات پست را وارد کنید!");
    return;
  }

  currentPost.description = newDescription;

  // Update modal content
  updateModalContent();

  // Recreate swiper with new slides
  createSwiperSlides();
  initializeSwiper();

  // Show success message
  alert("تغییرات با موفقیت ذخیره شد!");

  // Hide overlay
  hideOverlay();
}

function initializeDeleteFunctionality() {
  const deleteBtn = document.getElementById("gallery-deletePostBtn");
  if (!deleteBtn) return;

  deleteBtn.addEventListener("click", (e) => {
    e.preventDefault();
    deletePost();
  });
}

function deletePost() {
  if (!confirm("آیا از حذف این پست مطمئن هستید؟ این عمل قابل بازگشت نیست!")) {
    return;
  }

  // Find post index in posts array
  const postIndex = posts.findIndex((p) => p.id === currentPost.id);

  if (postIndex > -1) {
    // Remove from posts array
    posts.splice(postIndex, 1);

    // Remove from DOM
    const postElement = document.querySelector(
      `.gallery-post-item[data-post="${currentPost.id}"]`
    );
    if (postElement) {
      postElement.remove();
    }

    // Close modal
    closeModal();

    // Show success message
    alert("پست با موفقیت حذف شد!");

    // Update grid layout if needed
    updatePostGrid();
  }
}

function updatePostGrid() {
  // Re-initialize post grid after deletion
  const remainingPosts = document.querySelectorAll(".gallery-post-item");
  remainingPosts.forEach((item, index) => {
    item.dataset.post = index;
  });

  // Re-attach event listeners
  initializePostGrid();
}