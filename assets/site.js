(function () {
  const path = window.location.pathname.replace(/\/+$/, "");
  document.querySelectorAll(".navbar .nav-link").forEach(a => {
    const href = (a.getAttribute("href") || "").replace(/\/+$/, "");
    if (!href) return;
    if ((href === "/" && (path === "" || path === "/")) || (href !== "/" && path.endsWith(href))) {
      a.classList.add("active");
    }
  });

  const LINKS = {
    // básicos
    whatsapp: "https://wa.me/5547984719854",
    formGeral: "https://forms.gle/1XNh7gpLMoJcjhqWA",

    // pastas principais do Drive (gerais)
    driveKwai: "https://drive.google.com/drive/folders/PASTAKWAI",
    driveTiktok: "https://drive.google.com/drive/folders/PASTATIKTOK",
    driveKako: "https://drive.google.com/drive/folders/PASTAKAKO",
    driveCrush: "https://drive.google.com/drive/folders/PASTACRUSH",

    // HUB KWAI (cole links de PDFs/subpastas específicas)
    kwaiPoliticas: ".kwai/regulamento",
    kwaiMigracao: "https://forms.gle/51zngB2m3mAhASBX7",
    kwaiComeceAqui: "https://drive.google.com/drive/folders/PASTA_OU_PDF_COMECE_AQUI",
    kwaiCursos: "https://drive.google.com/drive/folders/PASTA_CURSOS_KWAI",
    kwaiAcademia: "https://drive.google.com/drive/folders/PASTA_ACADEMIA_STREAMER",
    kwaiEventos: "https://drive.google.com/drive/folders/PASTA_EVENTOS_KWAI",
    kwaiPremiacoes: "https://drive.google.com/drive/folders/PASTA_PREMIACOES",
    kwaiFerramentas: "https://drive.google.com/drive/folders/PASTA_FERRAMENTAS",
    kwaiRelatorios: "https://drive.google.com/drive/folders/PASTA_RELATORIOS",
    kwaiPortfolio: "https://drive.google.com/drive/folders/PASTA_PORTFOLIO"
  };

  document.querySelectorAll("[data-link]").forEach(el => {
    const key = el.getAttribute("data-link");
    if (!LINKS[key]) return;
    el.setAttribute("href", LINKS[key]);
  });
})();
