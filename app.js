const root = document.documentElement;
const btn = document.getElementById("theme");
const isDark = () => root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
const paintButton = () => {
  const label = isDark() ? "Light theme" : "Dark theme";
  btn.lastElementChild.textContent = label;
  btn.setAttribute("aria-label", label);
};

btn.onclick = (e) => {
  const next = isDark() ? "light" : "dark";
  const apply = () => {
    root.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch {}
    paintButton();
  };
  if (!document.startViewTransition || matchMedia("(prefers-reduced-motion: reduce)").matches) return apply();
  const r = btn.getBoundingClientRect();
  root.style.setProperty("--x", (e.clientX || r.left + r.width / 2) + "px");
  root.style.setProperty("--y", (e.clientY || r.top + r.height / 2) + "px");
  document.startViewTransition(() => { root.classList.add("ink"); apply(); }).finished.finally(() => root.classList.remove("ink"));
};

const views = [...document.querySelectorAll(".view")];
const links = [...document.querySelectorAll("nav a")];
function route(moveFocus) {
  const id = views.some((v) => v.id === location.hash.slice(1)) ? location.hash.slice(1) : "home";
  views.forEach((v) => (v.hidden = v.id !== id));
  links.forEach((a) => a.toggleAttribute("aria-current", a.hash === "#" + id));
  if (moveFocus) document.getElementById(id).querySelector("h1").focus();
}
addEventListener("hashchange", () => route(true));
route(false);
paintButton();
