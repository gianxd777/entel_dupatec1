/* ================= CONFIG ================= */
const WA = "51902715491";
const DEBUG = location.search.includes("fotos"); // abre index.html?fotos para ver el nombre de foto que espera cada equipo

const PLANES = [
  { p: "49.90", gb: "120 GB", f: ["120 GB alta velocidad", "WhatsApp, Messenger, Instagram y Facebook ilimitados"] },
  { p: "59.90", gb: "160 GB", f: ["160 GB alta velocidad", "Apps ilimitadas"] },
  { p: "69.90", gb: "250 GB", f: ["250 GB alta velocidad", "Apps ilimitadas"] },
  { p: "79.90", gb: "ILIMITADO", top: true, f: ["Internet ilimitado", "Apps ilimitadas", "Conectividad satelital con Starlink"] },
  { p: "89.90", gb: "ILIMITADO", top: true, f: ["Internet ilimitado", "Apps ilimitadas", "Conectividad satelital con Starlink", "Mejor cobertura en llamadas: América, Europa y Asia"] }
];

// [nombre, precio liberado (contado), precio efectiva, foto opcional]
// Foto: pon la imagen en la carpeta img/ con el nombre del equipo en minúsculas y con guiones
// (ej: "HONOR X5D 128" -> img/honor-x5d-128.webp  (también acepta .jpg o .png))
// O escribe la ruta/URL en el 4to campo.
const PRODUCTOS = [
  ["HONOR PLAY 20 C", 599, 650, ""],
  ["HONOR PLAY 10", 509, 600, ""],
  ["HONOR X5C PLUS 256", 720, 780, ""],
  ["HONOR X5C 128 GB", 639, 750, ""],
  ["HONOR X5D 128", 659, 750, ""],
  ["HONOR X6B 128", 828, 820, ""],
  ["HONOR X6E 128", 830, 900, ""],
  ["HONOR X6E 256", 860, 950, ""],
  ["HONOR X6C 256", 749, 850, ""],
  ["HONOR X7E", 939, 909, ""],
  ["HONOR X7D", 828, 920, ""],
  ["HONOR X9D", 1380, 1550, ""],
  ["MAGIC 8 LITE 256 GB", 1620, 1650, ""],
  ["MAGIC 8 LITE 512 GB", 1780, 1750, ""],
  ["HONOR 600", 2249, 2500, ""],
  ["SAMSUNG A07 64GB", 569, 650, ""],
  ["SAMSUNG A07 128GB", 650, 780, ""],
  ["SAMSUNG A17 128 GB", 839, 930, ""],
  ["SAMSUNG A17 256GB", 939, 1050, ""],
  ["SAMSUNG A56 256 GB", 1639, 1700, ""],
  ["SAMSUNG A57 256 GB", 1900, 1900, ""],
  ["SAMSUNG A37 256 GB", 1700, 1750, ""],
  ["REDMI 15C", 729, 800, ""],
  ["REDMI NOTE 15 128 GB", 869, 990, ""],
  ["REDMI NOTE 15 256 GB", 1029, 1050, ""],
  ["REDMI NOTE 15 PRO 256 GB", 1280, 1390, ""],
  ["REDMI NOTE 15 PRO PLUS 256GB", 1820, 1850, ""],
  ["REDMI NOTE 17 128 GB", 999, 1100, ""],
  ["TABLET SAMSUNG", 680, null, ""],
  ["BÁSICO TECLAS (SOLO CLARO)", 89, null, ""],
  ["UMIDIGI 64GB", 330, null, ""],
  ["SKY", 200, null, ""]
];

/* ================= UTILIDADES ================= */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const irWA = t => window.open(`https://wa.me/${WA}?text=${encodeURIComponent(t)}`, "_blank");

function marca(n) {
  if (/^(HONOR|MAGIC)/.test(n)) return "HONOR";
  if (n.startsWith("SAMSUNG") || n.startsWith("TABLET")) return "SAMSUNG";
  if (n.startsWith("REDMI")) return "REDMI";
  return "OTROS";
}
function caracteristicas(n) {
  const m = n.match(/(\d+)\s*gb/i), l = [];
  if (m) l.push(`Almacenamiento: ${m[1]} GB`);
  l.push(n.includes("SOLO CLARO") ? "Solo operador Claro" : "Liberado para cualquier operador");
  l.push("Equipo nuevo con garantía");
  return l;
}
function slug(s) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
function ph(p) {
  return `<div class="ph"><b>${marca(p[0])}</b><span>${p[0]}</span>${DEBUG ? `<small>img/${slug(p[0])}.webp</small>` : ""}</div>`;
}
function imgHTML(p, k) {
  const base = p[3] ? "" : `img/${slug(p[0])}`;
  const src = p[3] || base + ".webp";
  return `<img src="${src}" alt="${p[0]}" loading="lazy" data-s="${base}" data-n="${p[3] ? 9 : 1}" data-k="${k}" onerror="imgFail(this)">`;
}
function imgFail(i) {
  const n = +i.dataset.n, ex = ["webp", "jpg", "png"];
  if (n < ex.length) { i.dataset.n = n + 1; i.src = i.dataset.s + "." + ex[n]; }
  else i.outerHTML = ph(PRODUCTOS[i.dataset.k]);
}

function tarjeta(p, precio, btn, k, rib = "") {
  const m = marca(p[0]), idx = PRODUCTOS.indexOf(p);
  return `
  <article class="prod tilt b-${m}" style="--d:${Math.min(k, 14) * 45}ms">
    <div class="foto">${imgHTML(p, idx)}${rib}<span class="badge">${m}</span></div>
    <div class="info">
      <h4>${p[0]}</h4>
      <ul>${caracteristicas(p[0]).map(c => `<li>${c}</li>`).join("")}</ul>
      <div class="precio">${precio}</div>
      <button class="btn wa rip" data-i="${idx}">${btn}</button>
    </div>
  </article>`;
}

function catalogo({ grid, chips, lista, precio, btn, click, ribbon = "" }) {
  const G = $(grid), C = $(chips);
  const marcas = ["TODOS", ...new Set(lista.map(p => marca(p[0])))];
  let f = "TODOS";
  const dibujar = () => {
    C.innerHTML = marcas.map(m => `<button class="chip rip ${m === f ? "sel" : ""}" data-m="${m}">${m}</button>`).join("");
    $$(".chip", C).forEach(b => b.onclick = () => { f = b.dataset.m; dibujar(); });
    const l = lista.filter(p => f === "TODOS" || marca(p[0]) === f);
    G.innerHTML = l.map((p, k) => tarjeta(p, precio(p), btn, k, ribbon)).join("");
    $$(".btn", G).forEach(b => b.onclick = () => click(PRODUCTOS[b.dataset.i]));
  };
  dibujar();
}

/* ================= NAVEGACIÓN ================= */
let nav = ["home"];

function ir(id, push = true) {
  if (push) nav.push(id);
  $$(".view").forEach(v => v.classList.toggle("active", v.id === id));
  $("#btnAtras").classList.toggle("hidden", nav.length <= 1);
  window.scrollTo({ top: 0 });
  if (!push) return;
  if (id === "lista") iniciarLista();
  if (id === "contadoCat") pintarContado();
  if (id === "cuotasCat") pintarCuotas();
}
function inicio() { nav = ["home"]; ir("home", false); }
function atras() {
  const cur = nav[nav.length - 1];
  if (cur === "lista" && W.length > 1) { wBack(); return; }
  if (nav.length > 1) { nav.pop(); ir(nav[nav.length - 1], false); }
}
$("#btnAtras").onclick = atras;
$("#logo").onclick = inicio;
$$("[data-go]").forEach(b => b.onclick = () => ir(b.dataset.go));

/* ================= LISTA BLANCA ================= */
const wz = $("#wizard");
let S, W = [];
const F = { dni: "", imei: "", ok: false }; // lo que escribió el usuario (se conserva al retroceder)

function paso(fn) { W.push({ fn, snap: JSON.stringify(S) }); fn(); }
function wBack() { W.pop(); const p = W[W.length - 1]; S = JSON.parse(p.snap); p.fn(); }

function render(titulo, html) {
  wz.innerHTML = `<button class="atras wizard-back" id="wBack">← Atrás</button><h3>${titulo}</h3>${html}`;
  wz.classList.remove("anim"); void wz.offsetWidth; wz.classList.add("anim");
  $("#wBack").onclick = atras;
}
function opciones(arr, cb) {
  const box = document.createElement("div");
  box.className = "opts";
  arr.forEach(([v, t]) => {
    const b = document.createElement("button");
    b.className = "opt rip"; b.innerHTML = t; b.onclick = () => cb(v);
    box.appendChild(b);
  });
  wz.appendChild(box);
}
function botonContinuar(cb) {
  const b = document.createElement("button");
  b.className = "btn rip"; b.textContent = "Continuar"; b.onclick = cb;
  wz.appendChild(b);
}

function iniciarLista() {
  S = { dni: "", n: 1, i: 1, res: [], imei: "", ctx: "", op: "", tipo: "", motivo: "" };
  W = [];
  paso(stepDni);
}

function stepDni() {
  render("Datos del titular", `
    <div class="alerta rojo">🚫 Prohibida la suplantación de identidad. El registro solo lo puede hacer el titular.</div>
    <label class="lbl">Ingresa tu DNI</label>
    <input id="dni" type="text" inputmode="numeric" maxlength="8" placeholder="DNI del titular (8 dígitos)" value="${F.dni}">
    <label class="check"><input type="checkbox" id="chk" ${F.ok ? "checked" : ""}>
      <span>Declaro que soy el titular y que los datos ingresados son verdaderos.</span></label>
    <div id="err" class="error"></div>`);
  botonContinuar(() => {
    const v = $("#dni").value.trim();
    if (!/^\d{8}$/.test(v)) { $("#err").textContent = "Ingresa un DNI válido de 8 dígitos."; return; }
    if (!$("#chk").checked) { $("#err").textContent = "Debes confirmar que eres el titular."; return; }
    F.dni = v; F.ok = true; S.dni = v;
    paso(stepCuantos);
  });
}

function stepCuantos() {
  render("¿Cuántos IMEI deseas registrar?", "");
  opciones([[1, "1 IMEI"], [2, "2 IMEI"]], n => { S.n = n; S.i = 1; paso(stepSenal); });
}

function stepSenal() {
  render(`¿Tu IMEI ${S.i} tiene señal?`, "");
  opciones([[true, "Sí"], [false, "No"]], s => paso(s ? stepImei : stepMotivo));
}

function terminarImei(texto) {
  S.res.push(`IMEI ${S.i}: ${texto}`);
  S.imei = ""; S.ctx = "";
  if (S.i < S.n) { S.i++; paso(stepSenal); } else paso(stepResumen);
}

/* ---- NO tiene señal ---- */
function stepMotivo() {
  render("Motivo de bloqueo", "");
  opciones([[1, "Falta registrar en lista blanca"], [2, "Robo"], [3, "IMEI clonado"]], m => {
    if (m === 1) paso(stepFalta);
    else { S.motivo = m === 2 ? "Robo" : "IMEI clonado"; paso(stepBloqueo); }
  });
}
function stepFalta() {
  render("Falta registrar en lista blanca",
    `<div class="alerta amarillo">✅ Sí hay opción de registrar, pero el desbloqueo dura aproximadamente de 25 a 30 días.</div>`);
  botonContinuar(() => { S.ctx = "Falta registrar en lista blanca (desbloqueo 25-30 días)"; paso(stepPlanes); });
}
function stepBloqueo() {
  render(S.motivo, `<div class="alerta rojo">⚠️ No se podrá desbloquear este equipo.</div>`);
  botonContinuar(() => terminarImei(`${S.motivo} - no se puede desbloquear`));
}

/* ---- planes (compartido) ---- */
function stepPlanes() {
  render("Elige tu plan", `<p class="sub">Adquirir una línea nueva de Entel</p>
    <div class="planes">${PLANES.map((p, k) => `
      <div class="plan rip ${p.top ? "top" : ""}" role="button" tabindex="0" data-p="${p.p}" style="--d:${k * 70}ms">
        <div class="pp">S/ ${p.p}<small> /mes</small></div>
        <span class="gb">${p.gb}</span>
        <ul>${p.f.map(x => `<li>${x}</li>`).join("")}</ul>
        <span class="sel-btn">Elegir plan</span>
      </div>`).join("")}</div>`);
  $$(".plan", wz).forEach(c => c.onclick = () =>
    terminarImei(`${S.ctx} - Línea nueva Entel plan S/ ${c.dataset.p}`));
}

/* ---- SÍ tiene señal ---- */
function stepImei() {
  render(`Ingresa tu IMEI ${S.i}`, `
    <p class="sub">Lo puedes ver marcando <b>*#06#</b></p>
    <input id="imei" type="text" inputmode="numeric" maxlength="15" placeholder="IMEI (15 dígitos)" value="${F.imei}">
    <div id="err" class="error"></div>`);
  botonContinuar(() => {
    const v = $("#imei").value.trim();
    if (!/^\d{15}$/.test(v)) { $("#err").textContent = "El IMEI debe tener 15 dígitos."; return; }
    F.imei = v; S.imei = v;
    paso(stepQue);
  });
}
function stepQue() {
  render("¿Qué deseas hacer?", `<div class="alerta amarillo">📌 Para poder hacer el registro debes ser Entel. En caso contrario no se podrá hacer el registro.</div>`);
  opciones([["nueva", "Elegir una línea nueva de Entel"], ["porta", "Cambiarme a Entel (Portabilidad)"]], t => {
    if (t === "nueva") { S.ctx = S.imei; paso(stepPlanes); } else paso(stepOperador);
  });
}
function stepOperador() {
  render("Portabilidad a Entel", `<p class="sub">¿De qué operador vienes?</p>`);
  opciones([["Movistar", "Movistar"], ["Claro", "Claro"], ["Bitel", "Bitel"]], op => { S.op = op; paso(stepTipo); });
}
function stepTipo() {
  render(`Tu línea en ${S.op}`, "");
  opciones([
    ["postpago", "Soy de " + S.op + " postpago<small>(pago mensual)</small>"],
    ["prepago", "Soy de " + S.op + " prepago<small>(solo hago recargas)</small>"]
  ], t => { S.tipo = t; paso(stepPromo); });
}
function stepPromo() {
  render(`🎉 Promo portabilidad desde ${S.op}`,
    `<div class="alerta verde">Plan ilimitado S/ 79.90 a mitad de precio: <b>S/ 39.90 por 6 meses</b>.</div>`);
  botonContinuar(() => terminarImei(`${S.imei} - Portabilidad desde ${S.op} (${S.tipo}), plan ilimitado S/ 39.90 x 6 meses (luego S/ 79.90)`));
}

/* ---- resumen ---- */
function stepResumen() {
  render("✅ Resumen de tu solicitud", `
    <p>DNI del titular: <b>${S.dni}</b></p>
    <ul class="resumen">${S.res.map(r => `<li>${r}</li>`).join("")}</ul>`);
  const e = document.createElement("div");
  e.className = "opts";
  e.innerHTML = `<button class="btn wa rip" id="enviar">Enviar por WhatsApp</button><button class="opt rip" id="otra">Nueva solicitud</button>`;
  wz.appendChild(e);
  $("#enviar").onclick = () => irWA(`Hola, quiero registro en lista blanca.\nDNI del titular: ${S.dni}\n${S.res.join("\n")}`);
  $("#otra").onclick = () => { F.imei = ""; iniciarLista(); };
}

/* ================= CONTADO ================= */
let modo = "tienda";
$$("[data-modo]").forEach(b => b.onclick = () => { modo = b.dataset.modo; ir("contadoCat"); });

function pintarContado() {
  $("#boxEnvio").classList.toggle("hidden", modo !== "online");
  $("#modoTxt").textContent = modo === "online" ? "🚚 Compra online · envíos a nivel nacional" : "🏬 Compra en tienda";
  catalogo({
    grid: "#gridContado", chips: "#chipsContado", lista: PRODUCTOS,
    precio: p => `S/ ${p[1]}`, btn: "Comprar por WhatsApp",
    click: p => {
      const det = `Modelo: ${p[0]}\nCaracterísticas: ${caracteristicas(p[0]).join(", ")}\nPrecio contado liberado: S/ ${p[1]}`;
      if (modo === "tienda") return irWA(`Hola, quiero comprar en tienda:\n${det}`);
      const lugar = $("#lugarEnvio").value.trim();
      if (!lugar) { alert("Escribe tu lugar de envío primero."); $("#lugarEnvio").focus(); window.scrollTo({ top: 0, behavior: "smooth" }); return; }
      irWA(`Hola, quiero comprar online:\n${det}\nLugar de envío: ${lugar}`);
    }
  });
}

/* ================= CUOTAS ================= */
let prov = "entel";
const NOMBRES = { entel: "Entel", payjoy: "Payjoy", efectiva: "Efectiva", alocredi: "Alo Crédi" };
const LOGOS = { entel: "entel", payjoy: "Payjoy", efectiva: "Efectiva", alocredi: "Alo Crédi" };
const NOTAS = {
  entel: "Compra en cuotas con Entel.",
  payjoy: "Compra en cuotas con Payjoy. Precio referencial al contado liberado para cualquier operador.",
  efectiva: "Compra en cuotas con Efectiva. Precio Efectiva.",
  alocredi: "Compra en cuotas con Alo Crédi. Pulsa Cotizar y te atendemos por WhatsApp. Precio referencial al contado liberado."
};
$$("[data-prov]").forEach(b => b.onclick = () => { prov = b.dataset.prov; ir("cuotasCat"); });

function pintarCuotas() {
  $("#provBanner").className = `banner p-${prov}`;
  $("#provBanner").innerHTML = `<span class="plogo">${LOGOS[prov]}</span><span class="psub">${NOTAS[prov]}</span>`;
  const lista = prov === "efectiva" ? PRODUCTOS.filter(p => p[2] !== null) : PRODUCTOS;
  catalogo({
    grid: "#gridCuotas", chips: "#chipsCuotas", lista,
    ribbon: `<span class="ribbon p-${prov}">${NOMBRES[prov]}</span>`,
    precio: p => prov === "efectiva" ? `S/ ${p[2]}` : prov === "entel" ? "Consultar" : `S/ ${p[1]}`,
    btn: prov === "alocredi" ? "Cotizar" : "Comprar en cuotas",
    click: p => {
      const pr = prov === "efectiva" ? `S/ ${p[2]} (precio Efectiva)` : prov === "entel" ? "por cotizar" : `S/ ${p[1]} (contado liberado)`;
      irWA(`Hola, quiero ${prov === "alocredi" ? "cotizar" : "comprar en cuotas"} con ${NOMBRES[prov]}:\nModelo: ${p[0]}\nCaracterísticas: ${caracteristicas(p[0]).join(", ")}\nPrecio: ${pr}`);
    }
  });
}

/* ================= EFECTOS ================= */
// ripple al tocar
document.addEventListener("pointerdown", e => {
  const el = e.target.closest(".btn,.opt,.chip,.card,.prov,.plan");
  if (!el) return;
  const r = el.getBoundingClientRect(), d = Math.max(r.width, r.height), s = document.createElement("span");
  s.className = "r";
  s.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - r.left - d / 2}px;top:${e.clientY - r.top - d / 2}px`;
  el.appendChild(s);
  setTimeout(() => s.remove(), 600);
});
// inclinación 3D (solo con mouse)
document.addEventListener("pointermove", e => {
  if (e.pointerType !== "mouse") return;
  const t = e.target.closest(".tilt");
  if (!t) return;
  const r = t.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
  t.style.transform = `perspective(700px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-5px)`;
});
document.addEventListener("pointerout", e => {
  const t = e.target.closest && e.target.closest(".tilt");
  if (t && !t.contains(e.relatedTarget)) t.style.transform = "";
});
// teclado en planes
document.addEventListener("keydown", e => {
  if (e.key === "Enter" && e.target.classList.contains("plan")) e.target.click();
});





/* ================= CARRUSEL ================= */
const WA_BANNER = "51933088912";
// Para agregar una imagen nueva: copia una línea, pon la ruta y el mensaje
const BANNERS = [
  { img: "img/banner1.jpg", msg: "Hola, vi su publicidad de Páginas web a medida y quiero cotizar." },
  { img: "img/banner2.jpg", msg: "Hola, vi su publicidad de Cableado profesional y quiero solicitar el servicio." }
];

(function () {
  const track = $("#carTrack"), dots = $("#carDots"), box = $("#carrusel");
  let i = 0, timer;

  track.innerHTML = BANNERS.map(b => `
    <div class="car-slide" data-msg="${b.msg}">
      <div class="fondo" style="background-image:url('${b.img}')"></div>
      <img src="${b.img}" alt="Publicidad">
      <span class="cta">💬 Escríbenos</span>
    </div>`).join("");
  dots.innerHTML = BANNERS.map((_, k) => `<button data-k="${k}" aria-label="Imagen ${k + 1}"></button>`).join("");

  function ver(n) {
    i = (n + BANNERS.length) % BANNERS.length;
    track.style.transform = `translateX(-${i * 100}%)`;
    $$("button", dots).forEach((d, k) => d.classList.toggle("on", k === i));
  }
  function auto() { clearInterval(timer); timer = setInterval(() => ver(i + 1), 5000); }

  $("#carPrev").onclick = () => { ver(i - 1); auto(); };
  $("#carNext").onclick = () => { ver(i + 1); auto(); };
  $$("button", dots).forEach(d => d.onclick = () => { ver(+d.dataset.k); auto(); });

  // clic en la imagen -> WhatsApp 933088912
  let movio = false;
  $$(".car-slide", track).forEach(s => s.onclick = () => {
    if (movio) return;
    window.open(`https://wa.me/${WA_BANNER}?text=${encodeURIComponent(s.dataset.msg)}`, "_blank");
  });

  // deslizar con el dedo
  let x0 = null;
  box.addEventListener("touchstart", e => { x0 = e.touches[0].clientX; movio = false; }, { passive: true });
  box.addEventListener("touchend", e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) { movio = true; ver(i + (dx < 0 ? 1 : -1)); auto(); setTimeout(() => movio = false, 300); }
    x0 = null;
  });

  // pausa con el mouse encima
  box.onmouseenter = () => clearInterval(timer);
  box.onmouseleave = auto;

  ver(0); auto();
})();