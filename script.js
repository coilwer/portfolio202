// Fill in these values. An empty value hides the element that uses it.
var CONFIG = {
  formUrl: "",   // full Google Form link ending in /viewform
  email: "plotnikovsana60@gmail.com",     // e.g. name@example.com
  github: "coilwer",    // GitHub username
  telegram: "coilwer",  // Telegram username, without @
  cv: "",        // URL of the PDF CV
  repo: "",      // GitHub repository URL of this site
  youtubeId: ""  // YouTube video id
};
// Client testimonials as { quote, name, role, metric }. They appear under the Results facts when filled.
var TESTIMONIALS = [];
// Projects as { name, description, repo, demo, tags, caseStudy }. The Projects section appears when filled.
var PROJECTS = [{
  name: "Task List",
  description: "A task list in plain JavaScript: add, complete and delete tasks, filter by status. Data is saved in the browser.",
  repo: "https://github.com/coilwer/task-list",
  demo: "https://coilwer.github.io/task-list/",
  tags: ["JavaScript", "localStorage", "GitHub Pages"],
  caseStudy: true
}];

(function () {
  var R = document.documentElement;
  var $ = function (id) { return document.getElementById(id); };
  var get = function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } };
  var set = function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} };
  var esc = function (s) { return String(s || "").replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var GLX = null; // set by initGL()

  // Theme (the initial value is set by the inline script in <head>)
  function paintTheme(t) {
    R.setAttribute("data-theme", t);
    $("tc").setAttribute("content", t === "dark" ? "#050505" : "#e9e6e2");
    if (GLX) GLX.theme();
  }
  paintTheme(R.getAttribute("data-theme") || "dark");
  $("theme").onclick = function () {
    var t = R.getAttribute("data-theme") === "dark" ? "light" : "dark";
    paintTheme(t);
    set("theme", t);
  };

  // Liquid chrome background: one fullscreen fragment shader, drawn at low resolution.
  // If WebGL is missing or fails, the page falls back to a plain CSS gradient (class "nogl").
  function initGL() {
    var cv = $("gl"), gl = null;
    try { gl = cv.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" }); } catch (e) {}
    if (!gl) { R.classList.add("nogl"); return; }
    var VS = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
    var FS = [
      "#ifdef GL_FRAGMENT_PRECISION_HIGH", "precision highp float;", "#else", "precision mediump float;", "#endif",
      "uniform vec2 uR,uM;uniform float uT,uS,uL;uniform vec3 uA,uB;",
      "float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}",
      "float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);",
      " return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}",
      "float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<3;i++){v+=a*noise(p);p=p*2.03+vec2(17.1,9.2);a*=.5;}return v;}",
      "float field(vec2 p){float t=uT*.06;",
      " vec2 q=vec2(fbm(p+vec2(0.,t)),fbm(p+vec2(5.2,1.3)-t));",
      " vec2 r=vec2(fbm(p+1.5*q+vec2(1.7,9.2)+t*1.3),fbm(p+1.5*q+vec2(8.3,2.8)-t));",
      " return fbm(p+1.3*r);}",
      "void main(){",
      " vec2 uv=gl_FragCoord.xy/uR;",
      " vec2 p=(uv-.5)*vec2(uR.x/uR.y,1.)*1.1+vec2(0.,uS*.00035)+(uM-.5)*.2;",
      " float e=.012,c=field(p);",
      " float dx=field(p+vec2(e,0.))-c,dy=field(p+vec2(0.,e))-c;",
      " vec3 n=normalize(vec3(-dx/e*.42,-dy/e*.42,1.));",
      " vec3 rr=reflect(vec3(0.,0.,-1.),n);",
      " float env=.05+.5*smoothstep(.1,.95,rr.y*.6+.5);",
      " env+=.6*pow(smoothstep(.16,0.,abs(rr.y-.38+.25*rr.x)),3.);",
      " env+=.3*pow(smoothstep(.12,0.,abs(rr.x+.55*rr.y+.1)),4.);",
      " float l=pow(clamp(env,0.,1.),1.7);",
      " l*=mix(.25,1.,smoothstep(1.35,.2,length(uv-.5)*1.5));",
      " vec3 col=mix(uA,uB,clamp(l*uL,0.,1.));",
      " col+=(hash(gl_FragCoord.xy+uT)-.5)*.012;",
      " gl_FragColor=vec4(col,1.);}"
    ].join("\n");
    function sh(type, src) {
      var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
      return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
    }
    var vs = sh(gl.VERTEX_SHADER, VS), fs = sh(gl.FRAGMENT_SHADER, FS);
    var pr = vs && fs ? gl.createProgram() : null;
    if (pr) { gl.attachShader(pr, vs); gl.attachShader(pr, fs); gl.linkProgram(pr); }
    if (!pr || !gl.getProgramParameter(pr, gl.LINK_STATUS)) { R.classList.add("nogl"); return; }
    gl.useProgram(pr);
    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(pr, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    var U = {};
    ["uR", "uM", "uT", "uS", "uL", "uA", "uB"].forEach(function (k) { U[k] = gl.getUniformLocation(pr, k); });
    var mx = .5, my = .5, tx = .5, ty = .5, t0 = 0, last = 0, raf = 0, sS = 0;
    function size() {
      var k = innerWidth < 720 ? .35 : .5;
      cv.width = Math.max(2, Math.round(innerWidth * k));
      cv.height = Math.max(2, Math.round(innerHeight * k));
      gl.viewport(0, 0, cv.width, cv.height);
      gl.uniform2f(U.uR, cv.width, cv.height);
    }
    function theme() {
      var dark = R.getAttribute("data-theme") !== "light";
      if (dark) { gl.uniform3f(U.uA, .016, .016, .018); gl.uniform3f(U.uB, .86, .85, .83); gl.uniform1f(U.uL, .5); }
      else { gl.uniform3f(U.uA, .55, .54, .52); gl.uniform3f(U.uB, .97, .96, .95); gl.uniform1f(U.uL, 1); }
      if (reduce) draw(7);
    }
    function draw(t) {
      gl.uniform1f(U.uT, t);
      if (reduce) sS = window.pageYOffset || 0;
      gl.uniform1f(U.uS, sS);
      gl.uniform2f(U.uM, mx, my);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    function frame(ts) {
      raf = requestAnimationFrame(frame);
      if (ts - last < 24) return; // ~40 fps: smooth enough for a slow liquid, and sharp at half resolution
      last = ts;
      mx += (tx - mx) * .06; my += (ty - my) * .06;
      sS += ((window.pageYOffset || 0) - sS) * .08; // ease the scroll offset so the liquid glides instead of stepping
      draw(ts / 1000 + t0);
    }
    function start() { if (!raf && !reduce) raf = requestAnimationFrame(frame); }
    function stop() { if (raf) cancelAnimationFrame(raf); raf = 0; }
    addEventListener("resize", function () { size(); if (reduce) draw(7); });
    addEventListener("pointermove", function (e) { tx = e.clientX / innerWidth; ty = 1 - e.clientY / innerHeight; }, { passive: true });
    document.addEventListener("visibilitychange", function () { document.hidden ? stop() : start(); });
    cv.addEventListener("webglcontextlost", function (e) { e.preventDefault(); stop(); R.classList.add("nogl"); });
    GLX = { theme: theme };
    size(); theme();
    if (reduce) draw(7); else start();
  }
  initGL();

  // Motion: skill marquee, rotating headline, card spotlight, sphere parallax, scroll progress
  var SK = ["Front-end", "HTML", "CSS", "JavaScript", "React", "Git", "GitHub"];
  [["mq1", SK], ["mq2", SK.slice().reverse()]].forEach(function (m) {
    var h = "";
    for (var i = 0; i < 4; i++) h += m[1].map(function (s) { return '<span class="mi">' + s + '<i class="sp"></i></span>'; }).join("");
    $(m[0]).firstChild.innerHTML = h;
  });
  var WORDS = { en: ["clean web interfaces.", "responsive layouts.", "accessible pages.", "React components."], ru: ["чистые веб-интерфейсы.", "адаптивные макеты.", "доступные страницы.", "React-компоненты."] }, wi = 0, rot = $("rot");
  if (!reduce) setInterval(function () {
    rot.style.opacity = 0;
    setTimeout(function () { wi = (wi + 1) % 4; rot.textContent = WORDS[lang][wi]; rot.style.opacity = 1; }, 350);
  }, 2800);
  var stage = $("stage");
  document.addEventListener("pointermove", function (e) {
    var c = e.target.closest && e.target.closest(".card");
    if (c) { var r = c.getBoundingClientRect(); c.style.setProperty("--mx", (e.clientX - r.left) + "px"); c.style.setProperty("--my", (e.clientY - r.top) + "px"); }
    if (!reduce && stage) {
      stage.style.setProperty("--px", ((e.clientX / innerWidth) * 2 - 1).toFixed(3));
      stage.style.setProperty("--py", ((e.clientY / innerHeight) * 2 - 1).toFixed(3));
    }
  });
  addEventListener("scroll", function () {
    var d = document.documentElement;
    $("prog").style.transform = "scaleX(" + d.scrollTop / Math.max(1, d.scrollHeight - innerHeight) + ")";
  }, { passive: true });

  // Language: EN / RU. Texts are matched by their English wording.
  var RU = {
    "Skip to content": "К содержимому", "Stack": "Стек", "Projects": "Проекты", "Results": "Отзывы", "Contact": "Контакты",
    "About": "Обо мне", "About me": "Обо мне", "Portfolio": "Портфолио", "Skills": "Навыки", "What I do": "Чем занимаюсь", "Process": "Процесс",
    "Open to internship": "Ищу стажировку",
    "Front-end development": "Front-end разработка", "Responsive interfaces": "Адаптивные интерфейсы",
    "I build": "Я создаю",
    "Oleksandr Plotnikov. Self-taught, working with HTML, CSS, JavaScript, React, Git and GitHub. Looking for an internship.": "Oleksandr Plotnikov. Самоучка, работаю с HTML, CSS, JavaScript, React, Git и GitHub. Ищу стажировку.",
    "Contact me": "Написать мне", "View the case": "Смотреть кейс", "Download CV": "Скачать резюме", "Scroll": "Вниз",
    "Self-taught": "Самоучка",
    "Hi! I'm Oleksandr": "Привет! Я Oleksandr",
    "Nice to meet you. I'm a self-taught front-end developer. I learn from video courses, documentation and by building real things, and I work with HTML, CSS, JavaScript, React, Git and GitHub.": "Приятно познакомиться. Я front-end разработчик-самоучка. Учусь по видеокурсам, документации и на реальных проектах, работаю с HTML, CSS, JavaScript, React, Git и GitHub.",
    "This portfolio shows what I can do today: clean layouts, plain JavaScript and careful details. I'm still learning and looking for an internship where I can grow. If that sounds good, write to me.": "В этом портфолио то, что я умею сейчас: аккуратная вёрстка, чистый JavaScript и внимание к деталям. Я продолжаю учиться и ищу стажировку, где смогу расти. Если вам это подходит, напишите мне.",
    "Responsive layouts": "Адаптивные макеты", "Accessible pages": "Доступные страницы", "Plain JavaScript apps": "Приложения на чистом JavaScript", "Git and GitHub Pages": "Git и GitHub Pages",
    "Front-end, self-taught.": "Front-end, самоучка.",
    "Learned through video courses, documentation and hands-on practice.": "Учусь по видеокурсам, документации и на практике.",
    "HTML & CSS": "HTML и CSS",
    "Semantic markup, flexbox and grid, responsive layouts and light and dark themes, like this page.": "Семантическая вёрстка, flexbox и grid, адаптивные макеты и светлая и тёмная темы, как на этой странице.",
    "DOM, events and state without a framework. My first project has tasks, filters and localStorage.": "DOM, события и состояние без фреймворка. В моём первом проекте есть задачи, фильтры и localStorage.",
    "Component-based interfaces. The next step after plain JavaScript.": "Интерфейсы из компонентов. Следующий шаг после чистого JavaScript.",
    "Git & GitHub": "Git и GitHub",
    "Version control, repositories and publishing on GitHub Pages.": "Контроль версий, репозитории и публикация на GitHub Pages.",
    "Accessibility": "Доступность",
    "Visible focus, labels, aria attributes and reduced-motion support are part of every page I build.": "Видимый фокус, подписи, aria-атрибуты и поддержка reduced-motion есть на каждой моей странице.",
    "Selected projects.": "Избранные проекты.",
    "Next project": "Следующий проект",
    "A second project in React, to compare it with plain JavaScript.": "Второй проект на React, чтобы сравнить его с чистым JavaScript.",
    "Results so far.": "Результаты на сегодня.",
    "No client reviews yet, so here are facts you can check.": "Отзывов клиентов пока нет, поэтому вот факты, которые можно проверить.",
    "Live project": "Рабочий проект", "Task List, published on GitHub Pages.": "Task List, опубликован на GitHub Pages.",
    "Frameworks": "Фреймворков", "My first project uses only HTML, CSS and JavaScript.": "Мой первый проект написан только на HTML, CSS и JavaScript.",
    "Languages": "Языка", "This site works in English and Russian.": "Сайт работает на английском и русском.",
    "Core tools": "Базовых инструмента", "HTML, CSS, JavaScript and Git are what I work with now.": "Сейчас я работаю с HTML, CSS, JavaScript и Git.",
    "How I work.": "Как я работаю.", "The same simple routine for every page.": "Один и тот же простой порядок для каждой страницы.",
    "Plan": "План", "Clarify the goal, the content and who will use the page.": "Уточняю цель, содержание и то, кто будет пользоваться страницей.",
    "Build": "Сборка", "Write semantic markup first, then style it, starting from phones.": "Сначала семантическая вёрстка, потом стили, начиная с телефонов.",
    "Check": "Проверка", "Test with a keyboard and on small screens, then publish on GitHub Pages.": "Проверяю с клавиатуры и на малых экранах, затем публикую на GitHub Pages.",
    "Questions.": "Вопросы.", "Short answers before we talk.": "Короткие ответы до разговора.",
    "What kind of internship are you looking for?": "Какую стажировку вы ищете?",
    "Front-end, in any format: remote or on-site, full or part time.": "Front-end, в любом формате: удалённо или в офисе, полный или неполный день.",
    "What can you do right now?": "Что вы умеете уже сейчас?",
    "Build responsive, accessible pages with HTML, CSS and JavaScript, and publish them with Git and GitHub Pages.": "Делать адаптивные доступные страницы на HTML, CSS и JavaScript и публиковать их через Git и GitHub Pages.",
    "What are you learning next?": "Что вы изучаете дальше?",
    "React. My next project will use it, so I can compare it with plain JavaScript.": "React. Мой следующий проект будет на нём, чтобы сравнить с чистым JavaScript.",
    "Which languages do you write in?": "На каких языках вы общаетесь?",
    "English and Russian. This site works in both.": "Английский и русский. Сайт работает на обоих.",
    "Ready to talk?": "Готовы поговорить?",
    "Send a short message through the form, or use the contacts below.": "Напишите короткое сообщение через форму или воспользуйтесь контактами ниже.",
    "Write to me by email, Telegram or GitHub.": "Напишите мне на почту, в Telegram или GitHub.", "Open application form": "Открыть форму",
    "Looking for a front-end internship. Open to any format.": "Ищу стажировку по front-end. Рассмотрю любой формат.",
    "Oleksandr Plotnikov · Front-end Developer": "Oleksandr Plotnikov · Front-end разработчик",
    "Privacy Policy": "Политика конфиденциальности", "Cookie Policy": "Политика cookie", "← Back to home": "← На главную"
  };
  RU["A task list in plain JavaScript: add, complete and delete tasks, filter by status. Data is saved in the browser."] = "Список задач на чистом JavaScript: добавление, выполнение и удаление задач, фильтр по статусу. Данные сохраняются в браузере.";
  RU["Code"] = "Код"; RU["Live demo"] = "Демо"; RU["Case study"] = "Кейс"; RU["Source code of this site"] = "Исходный код этого сайта";
  var lang = get("lang") === "ru" ? "ru" : "en";
  function applyLang() {
    var w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT), n;
    while ((n = w.nextNode())) {
      if (/^(SCRIPT|STYLE)$/.test(n.parentNode.nodeName)) continue;
      if (n._o === undefined) { var t = n.nodeValue.trim(); if (!RU.hasOwnProperty(t)) continue; n._o = n.nodeValue; n._t = t; }
      n.nodeValue = lang === "ru" ? n._o.replace(n._t, RU[n._t]) : n._o;
    }
    R.lang = lang;
    rot.textContent = WORDS[lang][wi];
    $("lang").textContent = lang === "ru" ? "EN" : "RU";
    if (!$("home").hidden) document.title = "Oleksandr Plotnikov — " + (lang === "ru" ? "Front-end разработчик" : "Front-end Developer");
  }
  $("lang").onclick = function () { lang = lang === "ru" ? "en" : "ru"; set("lang", lang); applyLang(); };
  applyLang();

  // Routing: #/privacy, #/cookies, #/case are pages; other hashes scroll on the home page
  var pages = ["privacy", "cookies", "case"];
  function jump() { R.style.scrollBehavior = "auto"; window.scrollTo(0, 0); R.style.scrollBehavior = ""; }
  function route() {
    var h = location.hash.slice(1).replace(/^\//, "");
    var isPage = pages.indexOf(h) > -1;
    $("home").hidden = isPage;
    pages.forEach(function (p) { $(p).hidden = h !== p; });
    document.title = isPage ? $(h).querySelector("h1").textContent + " — Oleksandr Plotnikov" : "Oleksandr Plotnikov — " + (lang === "ru" ? "Front-end разработчик" : "Front-end Developer");
    if (isPage) { var t = $(h).querySelector("h1"); t.setAttribute("tabindex", "-1"); t.focus({ preventScroll: true }); jump(); }
    else if (!h) jump();
    else if ($(h)) $(h).scrollIntoView();
  }
  addEventListener("hashchange", route);
  $("skip").addEventListener("click", function (e) {
    e.preventDefault();
    var t = document.querySelector("main > :not([hidden])");
    t.setAttribute("tabindex", "-1"); t.focus({ preventScroll: true }); t.scrollIntoView();
  });

  // Application form (shown only when CONFIG.formUrl is set)
  function renderForm() {
    var box = $("form");
    box.innerHTML = "";
    $("formtxt").hidden = !CONFIG.formUrl;
    $("noform").hidden = !!CONFIG.formUrl;
    if (!CONFIG.formUrl) return;
    if (/docs\.google\.com\/forms/.test(CONFIG.formUrl)) {
      var f = document.createElement("iframe");
      f.className = "form";
      f.title = "Application form";
      f.loading = "lazy";
      f.src = CONFIG.formUrl + (CONFIG.formUrl.indexOf("?") > -1 ? "&" : "?") + "embedded=true";
      box.appendChild(f);
    } else {
      box.innerHTML = '<a class="btn" target="_blank" rel="noopener" href="' + esc(CONFIG.formUrl) + '">Open application form</a>';
    }
  }

  // Optional elements
  // Contacts: enter a username or address in CONFIG, the table is built here
  var links = [];
  if (CONFIG.email) links.push(["Email", "mailto:" + CONFIG.email, CONFIG.email]);
  if (CONFIG.github) links.push(["GitHub", "https://github.com/" + CONFIG.github, "github.com/" + CONFIG.github]);
  if (CONFIG.telegram) links.push(["Telegram", "https://t.me/" + CONFIG.telegram, "@" + CONFIG.telegram]);
  if (links.length) {
    $("contacts").innerHTML = '<div class="cth">Contact</div>' + links.map(function (l) {
      var ext = /^https:/.test(l[1]) ? ' target="_blank" rel="noopener noreferrer"' : "";
      return '<a class="cr" href="' + esc(l[1]) + '"' + ext + "><span>" + l[0] + "</span><b>" + esc(l[2]) + "</b></a>";
    }).join("");
    $("contacts").hidden = false;
  }
  document.querySelectorAll(".em").forEach(function (n) { n.textContent = CONFIG.email; });
  var ld = document.querySelector('script[type="application/ld+json"]');
  var data = JSON.parse(ld.textContent);
  if (CONFIG.email) data.email = CONFIG.email;
  data.sameAs = links.filter(function (l) { return /^https:/.test(l[1]); }).map(function (l) { return l[1]; });
  ld.textContent = JSON.stringify(data);
  if (CONFIG.cv) { $("cv").href = CONFIG.cv; $("cv").hidden = false; }
  if (CONFIG.repo) { $("repo").href = CONFIG.repo; $("repo").hidden = false; }
  if (PROJECTS.length) {
    var ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>';
    var num = function (i) { return (i < 9 ? "0" : "") + (i + 1); };
    $("projlist").innerHTML = PROJECTS.map(function (p, i) {
      var a = [];
      if (p.repo) a.push('<a href="' + esc(p.repo) + '" target="_blank" rel="noopener noreferrer">Code</a>');
      if (p.demo) a.push('<a href="' + esc(p.demo) + '" target="_blank" rel="noopener noreferrer">Live demo</a>');
      if (p.caseStudy) a.push('<a href="#/case">Case study</a>');
      var tags = (p.tags || []).map(function (t) { return '<span class="tag">' + esc(t) + "</span>"; }).join("");
      var go = p.demo ? '<a class="go" href="' + esc(p.demo) + '" target="_blank" rel="noopener noreferrer" aria-label="Live demo: ' + esc(p.name) + '">' + ARROW + "</a>" : "";
      return '<article class="chap glass rv"><div class="pv" aria-hidden="true"><i class="wd"><b></b><b></b><b></b></i><span class="rw done"></span><span class="rw"></span><span class="rw"></span></div>' + go +
        '<h3>' + esc(p.name) + '</h3><p>' + esc(p.description) + '</p>' +
        (tags ? '<div class="tags">' + tags + '</div>' : '') +
        (a.length ? '<div class="metric">' + a.join(" · ") + '</div>' : '') +
        '<span class="no" aria-hidden="true">' + num(i) + '</span></article>';
    }).join("") +
      '<article class="chap glass next rv"><h3>Next project</h3><p>A second project in React, to compare it with plain JavaScript.</p><span class="no" aria-hidden="true">' + num(PROJECTS.length) + '</span></article>';
    $("projects").hidden = false;
    document.querySelector("[data-projects]").hidden = false;
  }
  if (CONFIG.youtubeId) {
    var vid = $("vid");
    vid.hidden = false;
    vid.onclick = function () {
      var f = document.createElement("iframe");
      f.src = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(CONFIG.youtubeId) + "?autoplay=1";
      f.allow = "accelerometer; autoplay; encrypted-media; picture-in-picture";
      f.allowFullscreen = true;
      f.title = "Video";
      vid.innerHTML = "";
      vid.appendChild(f);
    };
  }
  // Results: the fact cards are always shown; testimonials are added below them when filled
  if (TESTIMONIALS.length) {
    $("quotes").innerHTML = TESTIMONIALS.map(function (t) {
      return '<article class="card glass"><blockquote>“' + esc(t.quote) + '”</blockquote><div class="metric">' + esc(t.metric) + '</div><div class="by"><strong>' + esc(t.name) + '</strong><span>' + esc(t.role) + '</span></div></article>';
    }).join("");
    $("quotes").hidden = false;
  }

  applyLang();

  // Reveal on scroll
  var rv = document.querySelectorAll(".rv");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) {
          var el = e.target; el.classList.add("in"); io.unobserve(el);
          setTimeout(function () { el.classList.remove("rv", "in"); }, 1100);
        } });
    }, { threshold: 0.12 });
    rv.forEach(function (el) { io.observe(el); });
  } else {
    rv.forEach(function (el) { el.classList.add("in"); });
  }

  renderForm();
  applyLang();
  route();
})();

/* Extra motion: hero recedes on scroll, and a quiet section index in the corner. */
(function () {
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var stage = document.getElementById("stage");
  var idx = document.createElement("div");
  idx.className = "sidx";
  idx.setAttribute("aria-hidden", "true");
  document.body.appendChild(idx);
  var queued = false, lastKey = "";

  function sections() {
    return [].slice.call(document.querySelectorAll("main section.sec[id]")).filter(function (s) {
      return s.id !== "home" && s.offsetParent !== null;
    });
  }

  function update() {
    queued = false;
    var y = scrollY, vh = innerHeight || 1;
    if (stage && !reduce) {
      var p = Math.min(1, Math.max(0, y / (vh * 0.9)));
      stage.style.setProperty("--sc", p.toFixed(3));
    }
    var list = sections(), cur = null, n = 0;
    list.forEach(function (s, i) {
      if (s.getBoundingClientRect().top < vh * 0.4) { cur = s; n = i + 1; }
    });
    var show = !!cur && y > vh * 0.6;
    idx.classList.toggle("on", show);
    if (show) {
      var pill = cur.querySelector(".pill");
      var key = n + (pill ? pill.textContent : "");
      if (key !== lastKey) {
        lastKey = key;
        idx.textContent = "";
        var b = document.createElement("b");
        b.textContent = (n < 10 ? "0" : "") + n;
        idx.appendChild(b);
        idx.appendChild(document.createTextNode(" / " + (pill ? pill.textContent : "")));
      }
    }
  }

  function request() {
    if (!queued) { queued = true; requestAnimationFrame(update); }
  }

  addEventListener("scroll", request, { passive: true });
  addEventListener("resize", request);
  addEventListener("hashchange", request);
  update();
})();