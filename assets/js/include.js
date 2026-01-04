// Sistema de inclusión de partials (robusto)
class IncludeHTML {
  constructor() {
    this.partials = {};
    this.started = false;
  }

  async init() {
    if (this.started) return; // evita doble inicialización
    this.started = true;

    await this.loadPartials();
    this.renderPartials();
    this.dispatchLoadedEvent();
  }

  async loadPartials() {
    const partialElements = document.querySelectorAll("[data-include]");
    const partialPromises = [];

    for (const element of partialElements) {
      const url = element.getAttribute("data-include");
      if (url && !this.partials[url]) {
        partialPromises.push(this.fetchPartial(url));
      }
    }

    await Promise.all(partialPromises);
  }

  async fetchPartial(url) {
    try {
      const response = await fetch(url, { cache: "no-cache" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const html = await response.text();
      this.partials[url] = html;
    } catch (error) {
      console.error(`Error cargando ${url}:`, error);

      // Mensaje claro (solo si estás en file:// o falló el fetch)
      const isFile = location.protocol === "file:";
      this.partials[url] = `
        <div style="padding:16px;margin:16px 0;border:2px dashed #dc3545;border-radius:12px;background:#f8d7da;color:#721c24;font-family:system-ui, -apple-system, Segoe UI, Roboto, Inter, Arial;">
          <p style="margin:0 0 8px;"><strong>No se pudo cargar:</strong> ${url}</p>
          <p style="margin:0 0 12px;">
            ${isFile
              ? "Estás abriendo el archivo con <code>file://</code>. Usá un servidor local (Live Server, XAMPP, etc.) para que <code>fetch()</code> funcione."
              : "El archivo no existe o la ruta no coincide. Revisá que la carpeta y el nombre sean correctos."}
          </p>
          <button onclick="location.reload()" style="background:#dc3545;color:white;border:none;padding:10px 14px;border-radius:10px;cursor:pointer;">
            Recargar
          </button>
        </div>
      `;
    }
  }

  renderPartials() {
    document.querySelectorAll("[data-include]").forEach((element) => {
      const url = element.getAttribute("data-include");
      if (!url || !this.partials[url]) return;

      element.innerHTML = this.partials[url];

      // Ejecutar scripts dentro del partial (si los hay)
      const scripts = element.querySelectorAll("script");
      scripts.forEach((script) => {
        const newScript = document.createElement("script");

        // Copiar atributos primero
        Array.from(script.attributes).forEach((attr) => {
          newScript.setAttribute(attr.name, attr.value);
        });

        if (script.src) {
          newScript.src = script.src;
        } else {
          newScript.textContent = script.textContent;
        }

        script.parentNode.replaceChild(newScript, script);
      });

      // Remover el atributo para no reprocesar
      element.removeAttribute("data-include");
    });
  }

  dispatchLoadedEvent() {
    const event = new CustomEvent("partials:loaded", {
      detail: { partials: Object.keys(this.partials) },
    });
    window.dispatchEvent(event);
    window.dispatchEvent(new Event("includes:loaded"));
  }

  async reloadPartial(url) {
    delete this.partials[url];
    await this.fetchPartial(url);
    this.renderPartials();
  }
}

// Inicializar SOLO una vez (evita doble init)
(function boot() {
  if (window.includeHTML && window.includeHTML.started) return;

  window.includeHTML = new IncludeHTML();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => window.includeHTML.init(), { once: true });
  } else {
    window.includeHTML.init();
  }
})();
