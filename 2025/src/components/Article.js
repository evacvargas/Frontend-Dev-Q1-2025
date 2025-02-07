import { fetchAuthorById } from '../services/api.js';
import './AuthorModal.js';
import './ModalSideBar.js';
import { capitalizeTheFirstLetter } from "../utils/utils.js";


class Article extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._expanded = false;

    const template = document.createElement("template");
    template.innerHTML = `
      <style>
        @import "https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css";
        .article-card {
          cursor: pointer;
        }
      </style>
      <div class="bg-gray-100 p-6 max-w-sm mx-auto rounded-xl shadow-md space-y-4 border border-gray-200 article-card hover:scale-105 hover:shadow-lg transition-transform duration-200" id="articleCard">
        <img src="" alt="Imagen del artículo" class="object-cover rounded-lg shadow-md" id="articleImage">
        <h2 class="text-xl font-bold text-center text-indigo-700" id="articleTitle"></h2>
        <p class="text-gray-600 text-justify" id="articleDescription"></p>
        <p class="text-gray-500 italic font-bold text-xs" id="articleCompany"></p>
      </div>
    `;

    this.template = template;
  }

  connectedCallback() {
    this.shadowRoot.appendChild(this.template.content.cloneNode(true));
    this.updateContent(); 

    this.shadowRoot.getElementById("articleCard").addEventListener("click", async () => {
      const authorData = await this.fetchAuthor(this.authorId);
      const modal = document.querySelector("side-modal");

      if (modal) {
        modal.open({
          article: {
            title: this.title,
            description: this.description,
            company: this.company,
            image: this.image,
            content: this.content,
            publishedAt: this.publishedAt
          },
          author: authorData
        });
      } else {
        console.error("El modal no se encontró");
      }
    });
    
  }


  get title() {
    return this.getAttribute("title") || "Título por defecto";
  }

  set title(value) {
    const formattedTitle = capitalizeTheFirstLetter(value);
    this.setAttribute("title", formattedTitle);
    this.shadowRoot.getElementById("articleTitle").textContent = formattedTitle;
  }

  get description() {
    return this.getAttribute("description") || "Descripción por defecto";
  }

  set description(value) {
    this.setAttribute("description", value);
    this.shadowRoot.getElementById("articleDescription").textContent = value;
  }

  get company() {
    return this.getAttribute("articleCompany") || "Compañía por defecto";
  }

  set company(value) {
    this.setAttribute("company", value);
    this.shadowRoot.getElementById("articleCompany").textContent = value;
  }

  get image() {
    return this.getAttribute("image") || "";
  }

  set image(value) {
    this.setAttribute("image", value);
    this.shadowRoot.getElementById("articleImage").src = value;
  }

  get expanded() {
    return this._expanded;
  }

  get authorId() {
    return this.getAttribute("authorId");
  }

  get content() {
    return this.getAttribute("content") || "Contenido por defecto";
  }

  set content(value) {
    this.setAttribute("content", value);
  }

  get publishedAt() {
    return this.getAttribute("publishedAt") || "Fecha no disponible";
  }

  set publishedAt(value) {
    this.setAttribute("publishedAt", value);
  }

  formatPublishedAt(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', options);
  }

  set expanded(value) {
    this._expanded = value;
    this.toggleContent();
  }

  updateContent() {
    this.title = this.title;
    this.description = this.description;
    this.company = this.company;
    this.image = this.image;
    this.content = this.content;
    this.publishedAt = this.formatPublishedAt(this.publishedAt);
  }

  async fetchAuthor(authorId) {
    const authorData = await fetchAuthorById(authorId);
    if (authorData) {
      return authorData;
    } else {
      console.error("No se pudo obtener la información del autor.");
      return null;
    }
  }
}

customElements.define("article-item", Article);
