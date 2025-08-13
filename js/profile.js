document.addEventListener("DOMContentLoaded", () => {
  fetch("/js/profile-data.json")
    .then((response) => response.json())
    .then((data) => {
      const userData = data.user;

      // 1) بارگذاری داده‌های ذخیره‌شده (در صورتی که قبلاً ویرایش شده)
      const saved = JSON.parse(localStorage.getItem("profileData") || "{}");

      // 2) ساخت نهاییِ داده برای نمایش (ترجیح localStorage به JSON)
      const finalData = {
        first_name: saved.firstName || userData.first_name,
        last_name: saved.lastName || userData.last_name,
        bio: saved.bio || userData.bio,
        username: userData.username,
        profile_photo_url: saved.profilePicture || userData.profile_photo_url,
        is_private:
          saved.isPrivate != null ? saved.isPrivate : userData.is_private,
      };

      // 3) تأخیر صفر برای تضمین آماده بودن DOM
      setTimeout(() => {
        // المان‌های پروفایل
        const firstNameEl = document.getElementById("firstName");
        const lastNameEl = document.getElementById("lastName");
        const profileBioEl = document.getElementById("profileBio");
        const profilePicEl = document.getElementById("profilePicture");
        const usernameEl = document.getElementById("username");

        // المان‌های فرم ویرایش
        const editFirstName = document.getElementById("editFirstName");
        const editLastName = document.getElementById("editLastName");
        const editBio = document.getElementById("editBio");
        const previewPic = document.getElementById("previewPicture");

        // المان‌های حریم خصوصی
        const toggleBtn = document.getElementById("togglePrivacy");
        const privacyStatus = document.getElementById("privacyStatus");

        if (
          !firstNameEl ||
          !lastNameEl ||
          !profileBioEl ||
          !profilePicEl ||
          !usernameEl ||
          !editFirstName ||
          !editLastName ||
          !editBio ||
          !previewPic
        ) {
          console.warn("برخی المان‌ها در DOM پیدا نشدند. لطفاً بررسی کنید.");
          return;
        }

        // 4) مقداردهی اولیه از finalData
        firstNameEl.textContent = finalData.first_name;
        lastNameEl.textContent = finalData.last_name;
        profileBioEl.textContent = finalData.bio;
        profilePicEl.src = finalData.profile_photo_url;
        usernameEl.textContent = finalData.username;

        editFirstName.value = finalData.first_name;
        editLastName.value = finalData.last_name;
        editBio.value = finalData.bio;
        previewPic.src = finalData.profile_photo_url;

        // وضعیت اولیه حریم خصوصی
        let isPrivate = finalData.is_private;
        if (toggleBtn && privacyStatus) {
          privacyStatus.textContent = isPrivate ? "خصوصی" : "عمومی";
          toggleBtn.addEventListener("click", () => {
            isPrivate = !isPrivate;
            privacyStatus.textContent = isPrivate ? "خصوصی" : "عمومی";
          });
        }

        // 5) ثبت تغییرات در کلیک دکمه Save
        const saveBtn = document.getElementById("saveProfile");
        if (saveBtn) {
          saveBtn.addEventListener("click", () => {
            // به‌روزرسانی نمایش اصلی
            firstNameEl.textContent = editFirstName.value;
            lastNameEl.textContent = editLastName.value;
            profileBioEl.textContent = editBio.value;
            profilePicEl.src = previewPic.src;
            if (privacyStatus) {
              privacyStatus.textContent = isPrivate ? "خصوصی" : "عمومی";
            }

            // ذخیره در localStorage
            const newProfile = {
              firstName: editFirstName.value,
              lastName: editLastName.value,
              bio: editBio.value,
              profilePicture: previewPic.src,
              isPrivate: isPrivate,
            };
            localStorage.setItem("profileData", JSON.stringify(newProfile));

            // فراخوانی مجدد برای به‌روزرسانی گالری (در صورت وجود)
            if (typeof loadProfileFromStorage === "function") {
              loadProfileFromStorage();
            }
          });
        }
      }, 0);
    })
    .catch((error) => console.error("Error loading profile data:", error));
});

class InstagramProfile {
  constructor() {
    // مقدار پیش‌فرض
    this.profileData = {
      firstName: "نام",
      lastName: "خانوادگی",
      bio: "This is the bio section. Write something cool here!",
      profilePicture: "/placeholder.svg?height=90&width=90",
      username: "کاربر نمونه",
      isPrivate: false,
    };
    this.isFollowing = false;
    this.currentUserId = window.currentUserId;
    this.profileUserId = window.profileUserId;
    this.isOwnProfile = this.currentUserId === this.profileUserId;

    // مرحله اصلی (init همه چیز را بعد از گرفتن دیتا انجام می‌دهد)
    this.init();
  }

  async init() {
    await this.loadProfileData();
    this.initializeElements();
    this.bindEvents();
    this.updateUI();

    this.loadProfileFromStorage();
  }

  initializeElements() {
    this.profilePicture = document.getElementById("profilePicture");
    this.firstName = document.getElementById("firstName");
    this.lastName = document.getElementById("lastName");
    this.profileBio = document.getElementById("profileBio");
    this.buttonSection = document.getElementById("buttonSection");
    this.profileToggle = document.getElementById("profileToggle");
    this.followStatus = document.getElementById("followStatus");
    this.username = document.getElementById("username");
    this.privacyStatus = document.getElementById("editPrivacyStatus");
    this.editModal = document.getElementById("editModal");
    this.closeModal = document.getElementById("closeModal");
    this.editFirstName = document.getElementById("editFirstName");
    this.editLastName = document.getElementById("editLastName");
    this.editBio = document.getElementById("editBio");
    this.profilePictureInput = document.getElementById("profilePictureInput");
    this.previewPicture = document.getElementById("previewPicture");
    this.cancelEdit = document.getElementById("cancelEdit");
    this.saveProfile = document.getElementById("saveProfile");
    this.editTogglePrivacy = document.getElementById("editTogglePrivacy");
  }

  async loadProfileData() {
    const savedData = localStorage.getItem("profileData");
    if (savedData) {
      try {
        this.profileData = { ...this.profileData, ...JSON.parse(savedData) };
      } catch (e) {
        localStorage.removeItem("profileData");
        await this.loadProfileDataFromJson();
      }
    } else {
      await this.loadProfileDataFromJson();
    }
  }

  async loadProfileDataFromJson() {
    try {
      const response = await fetch("/js/profile-data.json");
      if (!response.ok) throw new Error("profile-data.json not found!");
      const data = await response.json();
      if (data && data.user) {
        this.profileData = {
          firstName: data.user.first_name || "نام",
          lastName: data.user.last_name || "خانوادگی",
          bio: data.user.bio || "",
          profilePicture:
            data.user.profile_photo_url ||
            "/placeholder.svg?height=90&width=90",
          username: data.user.username || "کاربر نمونه",
          isPrivate: !!data.user.is_private,
        };
        localStorage.setItem("profileData", JSON.stringify(this.profileData));
      }
    } catch (e) {
      // اگر نشد همان مقدار پیش‌فرض می‌ماند
      console.warn("Load from JSON failed:", e.message);
    }
  }

  saveProfileData() {
    localStorage.setItem("profileData", JSON.stringify(this.profileData));
  }

  loadProfileFromStorage() {
    this.firstName.textContent = this.profileData.firstName;
    this.lastName.textContent = this.profileData.lastName;
    this.profileBio.textContent = this.profileData.bio;
    this.profilePicture.src = this.profileData.profilePicture;
    if (this.username) this.username.textContent = this.profileData.username;
    const galleryUsername = document.getElementById("galleryUsername");
    if (galleryUsername) {
      galleryUsername.textContent = this.profileData.username;
    }

    document.querySelectorAll(".gallery-user-avatar").forEach((el) => {
      el.style.backgroundImage = `url(${this.profileData.profilePicture})`;
      el.style.backgroundSize = "cover";
      el.style.backgroundPosition = "center";
    });
  }

  bindEvents() {
    this.profileToggle.addEventListener("click", () =>
      this.toggleProfileView()
    );
    this.closeModal.addEventListener("click", () => this.closeEditModal());
    this.cancelEdit.addEventListener("click", () => this.closeEditModal());
    this.saveProfile.addEventListener("click", () => this.saveProfileChanges());
    this.profilePictureInput.addEventListener("change", (e) =>
      this.handleImageUpload(e)
    );
    if (this.editTogglePrivacy) {
      this.editTogglePrivacy.addEventListener("click", () =>
        this.togglePrivacy()
      );
    }
    this.editModal.addEventListener("click", (e) => {
      if (e.target === this.editModal) {
        this.closeEditModal();
      }
    });
    // محدودیت 100 کاراکتر برای بیو
    this.editBio.addEventListener("input", () => {
      if (this.editBio.value.length > 100) {
        this.editBio.value = this.editBio.value.slice(0, 100);
        this.showErrorMessage("حداکثر 100 کاراکتر مجاز است.");
      }
    });
    // شمارنده کاراکترهای بیو داخل textarea
    const bioCounter = document.getElementById("bioCounter");
    if (bioCounter) {
      const updateBioCounter = () => {
        let length = this.editBio.value.length;
        if (length > 100) {
          this.editBio.value = this.editBio.value.slice(0, 100);
          length = 100;
        }
        bioCounter.textContent = `${length}/100`;
      };
      this.editBio.addEventListener("input", updateBioCounter);
      updateBioCounter();
    }
  }

  toggleProfileView() {
    this.isOwnProfile = !this.isOwnProfile;
    if (this.isOwnProfile) {
      this.isFollowing = false;
    }
    this.updateUI();
  }

  updateUI() {
    this.updateButtons();
    this.updateToggleButton();
    this.updateGalleryVisibility();
    this.updateEditButton();
  }

  updateButtons() {
    if (this.isOwnProfile) {
      this.buttonSection.innerHTML = `
        <button class="profile-btn" onclick="instagramProfile.openEditModal()">
             ویرایش پروفایل
        </button>
        <button class="profile-btn" onclick="instagramProfile.openCreatePostModal()">
             افزودن پست
        </button>
      `;
    } else {
      const buttonClass = this.isFollowing ? "لغو دنبال کردن" : "دنبال کردن";
      const buttonText = this.isFollowing ? "لغو دنبال کردن" : "دنبال کردن";

      this.buttonSection.innerHTML = `
        <button class="profile-btn ${buttonClass}" onclick="instagramProfile.toggleFollow()">
             ${buttonText}
        </button>
      `;
    }
  }

  updateToggleButton() {
    if (this.isOwnProfile) {
      this.profileToggle.innerHTML = `<i class="ri-group-line"></i>`;
      // const gallery=document.querySelector(".gallery-container")
      // gallery.style.display='block'
    } else {
      this.profileToggle.innerHTML = `<i class="ri-user-line"></i>`;
      // const gallery=document.querySelector(".gallery-container")
      // gallery.style.display='none'
    }
  }

  updateGalleryVisibility() {
    const gallery = document.querySelector(".gallery-container");
    // اگر صاحب پروفایل است یا پروفایل عمومیست یا دنبال کرده باشد
    const shouldShow =
      this.isOwnProfile || !this.profileData.isPrivate || this.isFollowing;
    gallery.style.display = shouldShow ? "block" : "none";
  }

  updateEditButton() {
    const editButton = document.querySelector(".gallery-action-off");
    if (!editButton) return;

    if (this.isOwnProfile) {
      editButton.style.display = "block";
    } else {
      editButton.style.display = "none";
    }
  }

  toggleFollow() {
    this.isFollowing = !this.isFollowing;
    this.updateUI();
  }

  openEditModal() {
    // مقداردهی اولیه مدال از profileData
    this.editFirstName.value = this.profileData.firstName;
    this.editLastName.value = this.profileData.lastName;
    this.editBio.value = this.profileData.bio;
    this.previewPicture.src = this.profileData.profilePicture;
    this.updatePrivacyStatusView(this.profileData.isPrivate);

    // Reset file input
    this.profilePictureInput.value = "";

    this.editModal.classList.add("active");
    document.body.style.overflow = "hidden";

    // Focus on first input
    setTimeout(() => this.editFirstName.focus(), 100);
  }

  closeEditModal() {
    this.editModal.classList.remove("active");
    document.body.style.overflow = "auto";
    this.profilePictureInput.value = "";
  }

  handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        this.showErrorMessage("لطفاً یک فایل تصویر معتبر انتخاب کنید.");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        this.showErrorMessage(
          "لطفاً تصویری با حجم کمتر از 2 مگابایت انتخاب کنید."
        );
        return;
      }
      this.previewPicture.style.opacity = "0.5";
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewPicture.src = e.target.result;
        this.previewPicture.style.opacity = "1";
        this.showInfoMessage(
          "پیش‌ نمایش تصویر به‌روزرسانی شد! برای اعمال، روی «اعمال تغییرات» کلیک کنید."
        );
      };
      reader.onerror = () => {
        this.showErrorMessage("خطا در خواندن فایل تصویر.");
        this.previewPicture.style.opacity = "1";
      };
      reader.readAsDataURL(file);
    }
  }

  togglePrivacy() {
    this.profileData.isPrivate = !this.profileData.isPrivate;
    this.updatePrivacyStatusView(this.profileData.isPrivate);
  }

  updatePrivacyStatusView(isPrivate) {
    // آیکون‌ها
    const iconHtml = isPrivate
      ? `<i class="ri-lock-line" style="color:#c0392b;font-size:1.25em;vertical-align:middle"></i>`
      : `<i class="ri-lock-unlock-line" style="color:#2196f3;font-size:1.25em;vertical-align:middle"></i>`;

    // متن و آیکون دکمه
    const btnText = isPrivate ? ` خصوصی` : ` عمومی`;

    // جایگذاری در اسپن آیکون (کنار دکمه)
    const statusIcon = document.getElementById("editPrivacyStatusIcon");
    if (statusIcon) statusIcon.innerHTML = iconHtml;

    // جایگذاری متن و آیکون دکمه تغییر وضعیت
    if (this.editTogglePrivacy) this.editTogglePrivacy.innerHTML = btnText;
  }

  saveProfileChanges() {
    this.saveProfile.classList.add("loading");
    this.saveProfile.textContent = "در حال ذخیره‌سازی...";
    this.saveProfile.disabled = true;

    setTimeout(() => {
      const firstName = this.editFirstName.value.trim();
      const lastName = this.editLastName.value.trim();
      const bio = this.editBio.value.trim();

      if (!firstName) {
        this.showErrorMessage("لطفاً نام خود را وارد کنید.");
        this.resetSaveButton();
        return;
      }
      if (bio.length > 100) {
        this.showErrorMessage("توضیحات نباید بیشتر از 100 کاراکتر باشد.");
        this.resetSaveButton();
        return;
      }
      if (bio.length > 100) {
        this.showErrorMessage("توضیحات نباید بیشتر از 100 کاراکتر باشد.");
        this.resetSaveButton();
        return;
      }

      this.profileData.firstName = firstName;
      this.profileData.lastName = lastName;
      this.profileData.bio = bio;

      if (this.profilePictureInput.files[0]) {
        this.profileData.profilePicture = this.previewPicture.src;
      }
      // مقدار isPrivate همینجا قبلاً ست شده و تغییری نیاز ندارد

      this.saveProfileData();
      this.loadProfileFromStorage();
      +(
        // بروزرسانی نمایش گالری براساس حالت جدید خصوصی/عمومی
        (+this.updateGalleryVisibility())
      );
      this.resetSaveButton();
      this.closeEditModal();
      this.showSuccessMessage("پروفایل با موفقیت به‌روزرسانی شد! 🎉");
    }, 800);
  }

  resetSaveButton() {
    this.saveProfile.classList.remove("loading");
    this.saveProfile.textContent = "اعمال تغییرات";
    this.saveProfile.disabled = false;
  }

  showErrorMessage(message) {
    this.showMessage(message, "error");
  }
  showInfoMessage(message) {
    this.showMessage(message, "info");
  }
  showSuccessMessage(message) {
    this.showMessage(message, "success");
  }

  showMessage(text, type = "success") {
    const existingMessages = document.querySelectorAll(".toast-message");
    existingMessages.forEach((msg) => msg.remove());
    const message = document.createElement("div");
    message.className = `toast-message ${type}`;
    message.textContent = text;
    const colors = {
      success: { bg: "#4CAF50", shadow: "rgba(76, 175, 80, 0.3)" },
      error: { bg: "#f44336", shadow: "rgba(244, 67, 54, 0.3)" },
      info: { bg: "#2196F3", shadow: "rgba(33, 150, 243, 0.3)" },
    };
    message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type].bg};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        z-index: 1001;
        box-shadow: 0 4px 12px ${colors[type].shadow};
        animation: slideInSuccess 0.4s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    document.body.appendChild(message);
    setTimeout(() => {
      if (message.parentNode) {
        message.style.animation = "slideOutSuccess 0.3s ease";
        setTimeout(() => message.remove(), 300);
      }
    }, 4000);
  }
  openCreatePostModal() {
    const createPostModal = document.getElementById("createPostModal");
    createPostModal.classList.add("active");
    document.body.style.overflow = "hidden";

    // Initialize create post functionality
    this.initializeCreatePost();
  }

  closeCreatePostModal() {
    const createPostModal = document.getElementById("createPostModal");
    createPostModal.classList.remove("active");
    document.body.style.overflow = "auto";

    // Reset form
    this.resetCreatePostForm();
  }

  initializeCreatePost() {
    // Initialize create post variables
    this.selectedMedia = [];

    // Get create post elements
    this.createPostElements = {
      // title: document.getElementById("postTitle"),
      description: document.getElementById("postDescription"),
      fileInput: document.getElementById("fileInput"),
      uploadArea: document.getElementById("uploadArea"),
      selectMediaBtn: document.getElementById("selectMediaBtn"),
      mediaPreviewContainer: document.getElementById("mediaPreviewContainer"),
      mediaCount: document.getElementById("mediaCount"),
      postForm: document.getElementById("postForm"),
      richTextButtons: document.querySelectorAll(".rich-text-toolbar button"),
      closeCreatePostModal: document.getElementById("closeCreatePostModal"),
    };

    // Bind create post events
    this.bindCreatePostEvents();
  }

  bindCreatePostEvents() {
    // Close modal events
    this.createPostElements.closeCreatePostModal.addEventListener("click", () =>
      this.closeCreatePostModal()
    );

    // Rich text editor functionality
    this.createPostElements.richTextButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        const command = button.dataset.command;
        document.execCommand(command, false, null);
        button.classList.toggle("active");
        this.createPostElements.description.focus();
      });
    });

    // File input handler
    this.createPostElements.fileInput.addEventListener("change", (e) => {
      this.handleFiles(e.target.files);
    });

    // Upload area click handlers
    this.createPostElements.selectMediaBtn.addEventListener("click", (e) => {
      e.preventDefault();
      this.createPostElements.fileInput.click();
    });

    this.createPostElements.uploadArea.addEventListener("click", (e) => {
      e.preventDefault();
      this.createPostElements.fileInput.click();
    });

    // Drag and drop functionality
    this.createPostElements.uploadArea.addEventListener("dragover", (e) => {
      e.preventDefault();
      e.currentTarget.classList.add("dragover");
    });

    this.createPostElements.uploadArea.addEventListener("dragleave", (e) => {
      e.preventDefault();
      e.currentTarget.classList.remove("dragover");
    });

    this.createPostElements.uploadArea.addEventListener("drop", (e) => {
      e.preventDefault();
      e.currentTarget.classList.remove("dragover");
      this.handleFiles(e.dataTransfer.files);
    });

    // Form submission
    this.createPostElements.postForm.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handlePostSubmission();
    });

    // Close modal when clicking outside
    document
      .getElementById("createPostModal")
      .addEventListener("click", (e) => {
        if (e.target.id === "createPostModal") {
          this.closeCreatePostModal();
        }
      });
  }

  handleFiles(files) {
    Array.from(files).forEach((file) => {
      const isDuplicate = this.selectedMedia.some(
        (media) => media.name === file.name && media.size === file.size
      );
      if (isDuplicate) {
        this.showInfoMessage(`فایل "${file.name}" قبلاً اضافه شده است.`);
        return;
      }

      if (file.type.startsWith("image/")) {
        if (file.size > 2 * 1024 * 1024) {
          this.showErrorMessage(
            `حجم عکس "${file.name}" نباید بیشتر از ۲ مگابایت باشد.`
          );
          return;
        }
        this.processFile(file);
      } else if (file.type.startsWith("video/")) {
        if (file.size > 10 * 1024 * 1024) {
          this.showErrorMessage(
            `حجم ویدیو "${file.name}" نباید بیشتر از 10 مگابایت باشد.`
          );
          return;
        }
        this.processFile(file);
      } else {
        this.showErrorMessage(`نوع فایل پشتیبانی نمی‌شود: ${file.name}`);
      }
    });
  }

  processFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const mediaData = {
        id: Date.now() + Math.random(),
        file: file,
        src: e.target.result,
        name: file.name,
        type: file.type.startsWith("image/") ? "image" : "video",
        size: file.size,
        duration: null,
      };

      if (mediaData.type === "video") {
        this.getVideoDuration(mediaData);
      } else {
        this.selectedMedia.push(mediaData);
        this.renderMediaPreviews();
      }
    };
    reader.readAsDataURL(file);
  }

  getVideoDuration(mediaData) {
    const video = document.createElement("video");
    video.src = mediaData.src;
    video.onloadedmetadata = () => {
      mediaData.duration = video.duration;
      this.selectedMedia.push(mediaData);
      this.renderMediaPreviews();
    };
  }

  renderMediaPreviews() {
    this.createPostElements.mediaPreviewContainer.innerHTML = "";

    if (this.selectedMedia.length > 0) {
      this.createPostElements.mediaPreviewContainer.style.display = "grid";
      this.createPostElements.uploadArea.style.display = "none";

      this.selectedMedia.forEach((media) => {
        const previewElement = this.createMediaPreview(media);
        this.createPostElements.mediaPreviewContainer.appendChild(
          previewElement
        );
      });

      // Add "Add More" button
      const addMoreButton = this.createAddMoreButton();
      this.createPostElements.mediaPreviewContainer.appendChild(addMoreButton);

      this.updateMediaCount();
    } else {
      this.createPostElements.mediaPreviewContainer.style.display = "none";
      this.createPostElements.uploadArea.style.display = "block";
      this.createPostElements.mediaCount.style.display = "none";
    }
  }

  createMediaPreview(media) {
    const previewDiv = document.createElement("div");
    previewDiv.className = "media-preview";
    previewDiv.dataset.id = media.id;

    if (media.type === "image") {
      previewDiv.innerHTML = `
              <img src="${media.src}" alt="${media.name}">
              <div class="media-type-badge">IMG</div>
              <button type="button" class="remove-media" onclick="instagramProfile.removeMedia('${media.id}')">
                  <i class="ri-close-line"></i>
              </button>
          `;
    } else {
      const duration = media.duration
        ? this.formatDuration(media.duration)
        : "";
      previewDiv.innerHTML = `
              <video src="${media.src}" muted preload="metadata"></video>
              <div class="media-type-badge">VIDEO</div>
              ${duration ? `<div class="video-duration">${duration}</div>` : ""}
              <button type="button" class="video-overlay" onclick="instagramProfile.toggleVideo('${
                media.id
              }')">
                  <i class="ri-play-line"></i>
              </button>
              <button type="button" class="remove-media" onclick="instagramProfile.removeMedia('${
                media.id
              }')">
                 <i class="ri-close-line"></i>
              </button>
          `;
    }

    return previewDiv;
  }

  createAddMoreButton() {
    const addMoreDiv = document.createElement("div");
    addMoreDiv.className = "media-preview";
    addMoreDiv.style.cssText =
      "border: 2px dashed #dbdbdb; cursor: pointer; display: flex; align-items: center; justify-content: center;";
    this.createPostElements.fileInput.value = ""; // پاک کردن مقدار قبلی
    addMoreDiv.onclick = () => this.createPostElements.fileInput.click();
    addMoreDiv.innerHTML = `
          <div style="text-align: center;">
              <i class="ri-add-line style="font-size: 24px; color: #8e8e8e; margin-bottom: 8px; display: block;"></i>
              <p style="color: #8e8e8e; margin: 0; font-size: 12px;">بیشتر اضافه کنید</p>
          </div>
      `;
    return addMoreDiv;
  }

  removeMedia(mediaId) {
    this.selectedMedia = this.selectedMedia.filter(
      (media) => media.id != mediaId
    );
    this.renderMediaPreviews();
  }

  toggleVideo(mediaId) {
    const mediaPreview = document.querySelector(`[data-id="${mediaId}"]`);
    const video = mediaPreview.querySelector("video");
    const overlay = mediaPreview.querySelector(".video-overlay");

    if (video.paused) {
      video.play();
      overlay.classList.add("playing");
    } else {
      video.pause();
      overlay.classList.remove("playing");
    }
  }

  updateMediaCount() {
    const imageCount = this.selectedMedia.filter(
      (m) => m.type === "image"
    ).length;
    const videoCount = this.selectedMedia.filter(
      (m) => m.type === "video"
    ).length;
    const totalSize = this.selectedMedia.reduce((sum, m) => sum + m.size, 0);

    let countText = "";
    if (imageCount > 0 && videoCount > 0) {
      countText = `${imageCount} عکس و ${videoCount} ویدیو انتخاب شده است`;
    } else if (imageCount > 0) {
      countText = `${imageCount} عکس انتخاب شده است`;
    } else if (videoCount > 0) {
      countText = `${videoCount} ویدیو انتخاب شده است`;
    }

    countText += ` (${this.formatFileSize(totalSize)})`;
    this.createPostElements.mediaCount.textContent = countText;
    this.createPostElements.mediaCount.style.display = "block";
  }

  formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  }

  formatDuration(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  handlePostSubmission() {
    const description = this.createPostElements.description.innerHTML.trim();

    if (
      !description ||
      description === this.createPostElements.description.dataset.placeholder
    ) {
      this.showErrorMessage("لطفا توضیحات را وارد کنید");
      this.createPostElements.description.focus();
      return;
    }

    if (this.selectedMedia.length === 0) {
      this.showErrorMessage("لطفا حداقل یک تصویر یا ویدیو انتخاب کنید");
      return;
    }

    // ✅ ساخت پست جدید
    const newPost = {
      id: Date.now(),
      slides: this.selectedMedia.map((media) => ({
        type: media.type,
        src: media.src,
      })),
      description: description,
      likes: 0,
      comments: [],
    };

    // ✅ اضافه کردن فقط یک پست با چند اسلاید
    const galleryGrid = document.querySelector(".gallery-posts-grid");
    if (galleryGrid) {
      const slideIndicator =
        newPost.slides.length > 1
          ? `<div class="gallery-slide-indicator">1/${newPost.slides.length}</div>`
          : "";

      const mainMedia = newPost.slides[0];
      const postHTML = `
      <div class="gallery-post-item" data-post="${newPost.id}">
        ${
          mainMedia.type === "image"
            ? `<img src="${mainMedia.src}" alt="Post Cover" />`
            : `<video src="${mainMedia.src}" muted></video>`
        }
        <div class="gallery-post-overlay">
          <div class="gallery-overlay-stat">
              <svg viewBox="0 0 24 24">
                <path
                  d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                ></path>
              </svg>
            <span>0</span>
          </div>
          <div class="gallery-overlay-stat">
              <svg viewBox="0 0 24 24">
                <path
                  d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                ></path>
              </svg>
            <span>0</span>
          </div>
        </div>
        ${slideIndicator}
      </div>
    `;

      galleryGrid.insertAdjacentHTML("afterbegin", postHTML);
      this.showSuccessMessage("پست با موفقیت ایجاد شد! 🎉");
    }

    // ❗ اگر از window.posts استفاده می‌کنید، اینجا اضافه‌اش کن
    if (window.posts) {
      window.posts.unshift(newPost);
    }

    this.closeCreatePostModal();
  }

  resetCreatePostForm() {
    if (this.createPostElements) {
      // this.createPostElements.title.value = ""
      this.createPostElements.description.innerHTML = "";
      this.createPostElements.fileInput.value = "";
      this.selectedMedia = [];
      this.createPostElements.mediaPreviewContainer.style.display = "none";
      this.createPostElements.uploadArea.style.display = "block";
      this.createPostElements.mediaCount.style.display = "none";

      // Reset rich text buttons
      this.createPostElements.richTextButtons.forEach((button) => {
        button.classList.remove("active");
      });
    }
  }
}

// Initialize the Instagram profile when the page loads
let instagramProfile;
document.addEventListener("DOMContentLoaded", () => {
  instagramProfile = new InstagramProfile();
});
