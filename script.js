const currentYear = document.querySelector("#current-year");
const revealItems = document.querySelectorAll(".reveal");

currentYear.textContent = new Date().getFullYear();

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealItems.forEach((item) => revealObserver.observe(item));

const cursorGlow = document.querySelector(".cursor-glow");
window.addEventListener("pointermove", (event) => {
  cursorGlow.style.left = `${event.clientX}px`;
  cursorGlow.style.top = `${event.clientY}px`;
});

const projectDetails = {
  "mind-weather": {
    name: "마음날씨",
    description: "감정을 날씨에 빗대어 기록하고 돌아보는 모바일 게임입니다.",
    role: "게임 기획, 핵심 플레이 루프 설계, 인터랙션 프로토타이핑",
    technologies: "Unity, C#, Figma",
    achievement: "예시 성과: 감정 기록 과정을 간단한 일일 플레이 경험으로 구성했습니다."
  },
  "flow-studio": {
    name: "Flow Studio",
    description: "창작 작업의 진행 상황을 한눈에 살펴보는 대시보드 시스템입니다.",
    role: "사용자 흐름 설계, 대시보드 정보 구조 및 화면 프로토타입 제작",
    technologies: "Figma, JavaScript, HTML, CSS",
    achievement: "예시 성과: 주요 작업 상태를 한 화면에서 확인하는 구조를 제안했습니다."
  },
  "origin-coffee": {
    name: "Origin Coffee",
    description: "커피의 산지와 이야기를 탐험하는 브랜드 경험 및 월드 빌딩 프로젝트입니다.",
    role: "브랜드 콘셉트 개발, 세계관 구성, 시각 방향성 정리",
    technologies: "Illustrator, Figma, Procreate",
    achievement: "예시 성과: 브랜드의 핵심 이야기를 일관된 시각 콘셉트로 정리했습니다."
  }
};

const projectCards = document.querySelectorAll(".project-card");
const projectModal = document.querySelector("#project-modal");
const modalCloseButton = projectModal.querySelector(".project-modal__close");
let activeProjectCard = null;
let previousBodyOverflow = "";

// 선택한 프로젝트의 예시 정보를 모달에 표시하고 닫기 버튼으로 포커스를 옮깁니다.
function openProjectModal(projectCard) {
  const project = projectDetails[projectCard.dataset.projectId];
  if (!project) {
    return;
  }

  activeProjectCard = projectCard;
  document.querySelector("#project-modal-title").textContent = project.name;
  document.querySelector("#project-modal-description").textContent = project.description;
  document.querySelector("#project-modal-role").textContent = project.role;
  document.querySelector("#project-modal-technologies").textContent = project.technologies;
  document.querySelector("#project-modal-achievement").textContent = project.achievement;
  projectModal.hidden = false;
  previousBodyOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";
  projectCard.setAttribute("aria-expanded", "true");
  modalCloseButton.focus();
}

// 모달을 닫고 열기 전 프로젝트 카드로 키보드 포커스를 되돌립니다.
function closeProjectModal() {
  if (projectModal.hidden) {
    return;
  }

  projectModal.hidden = true;
  document.body.style.overflow = previousBodyOverflow;
  activeProjectCard.setAttribute("aria-expanded", "false");
  activeProjectCard.focus();
  activeProjectCard = null;
}

// ESC로 닫고 Tab 키 포커스가 모달 바깥으로 나가지 않도록 합니다.
function handleProjectModalKeydown(event) {
  if (event.key === "Escape") {
    closeProjectModal();
    return;
  }

  if (event.key !== "Tab") {
    return;
  }

  const focusableElements = projectModal.querySelectorAll("button:not([disabled])");
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
  }
}

projectCards.forEach((card) => {
  card.addEventListener("click", () => openProjectModal(card));
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openProjectModal(card);
    }
  });
});

modalCloseButton.addEventListener("click", closeProjectModal);
projectModal.addEventListener("click", (event) => {
  if (event.target === projectModal) {
    closeProjectModal();
  }
});
projectModal.addEventListener("keydown", handleProjectModalKeydown);

const contactForm = document.querySelector("#contact-form");
const contactFormStatus = document.querySelector("#contact-form-status");
const contactName = contactForm.querySelector('[name="name"]');
const contactEmail = contactForm.querySelector('[name="email"]');
const contactMessage = contactForm.querySelector('[name="message"]');

contactForm.addEventListener("input", (event) => {
  event.target.setCustomValidity("");
  contactFormStatus.textContent = "";
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  [contactName, contactEmail, contactMessage].forEach((field) => {
    field.setCustomValidity("");
    field.value = field.value.trim();
  });

  if (!contactName.value) {
    contactName.setCustomValidity("이름을 입력해 주세요.");
  }
  if (!contactEmail.value) {
    contactEmail.setCustomValidity("이메일을 입력해 주세요.");
  } else if (!contactEmail.validity.valid) {
    contactEmail.setCustomValidity("올바른 이메일 주소를 입력해 주세요.");
  }
  if (!contactMessage.value) {
    contactMessage.setCustomValidity("메시지를 입력해 주세요.");
  }

  if (!contactForm.checkValidity()) {
    contactForm.reportValidity();
    contactFormStatus.textContent = "입력값을 확인해 주세요.";
    return;
  }

  contactFormStatus.textContent = "입력값이 올바릅니다. 실제 이메일은 전송되지 않습니다.";
});
