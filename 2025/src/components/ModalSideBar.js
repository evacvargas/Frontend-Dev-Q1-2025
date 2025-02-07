import { capitalizeTheFirstLetter } from "../utils/utils.js";

class ModalSideBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    const template = document.createElement("template");
    template.innerHTML = `
      <style>
        @import "https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css";
        .modal {
          transform: translateX(100%);
          transition: transform 0.3s ease-in-out;
        }
        .modal.open {
          transform: translateX(0);
        }
        .content {
        display: -webkit-box;
        -webkit-line-clamp: 6; 
        -webkit-box-orient: vertical;
        }
      </style>
      <div class="modal flex flex-col gap-4 fixed bg-gray-200 top-0 right-0 z-10 h-full w-1/2 shadow-xl p-6 overflow-auto text-justify bg-opacity-95 backdrop-blur-md" id="sideModal">
        <button class="text-gray-500 text-2xl font-bold absolute top-4 right-4" id="closeButton">&times;</button>
        <h2 class="text-xl font-bold mb-2 text-indigo-700" id="title"></h2>
        <img src="" alt="Imagen del artículo" class="object-cover rounded-lg w-4/5 m-auto rounded-lg shadow-md" id="articleImage">
        <div class="bg-white shadow-md p-6 rounded-lg">
          <p class="text-gray-600">
            <span class="font-bold"> Descripción: </span>
            <span id="description"/>
          </p>
        </div>

        <div class="relative">
          <p class="content text-gray-600 overflow-hidden max-h-[10rem]" id="content" ></p>
          <button class="text-indigo-700 mt-2 font-bold italic" id="showMore">Mostrar más contenido...</button>
        </div>

        <p class="text-indigo-500 text-sm">Publicado: <span id="publishedAt"></span></p>
        <p class="text-indigo-500 text-sm">Por: <span id="company"></span></p>
        <p class="text-gray-600 font-bold size-lg cursor-pointer" id="modalAuthor"></p>
      </div>
    `;
    this.template = template;
  }

  connectedCallback() {
    this.shadowRoot.appendChild(this.template.content.cloneNode(true));
    this.shadowRoot.getElementById("closeButton").addEventListener("click", () => this.close());
    this.shadowRoot.getElementById("showMore").addEventListener("click", () => this.toggleContent());
  }

  open({ article, author }) {
    const title = article?.title ? capitalizeTheFirstLetter(article.title) : "Artículo sin título";
    this.shadowRoot.getElementById("title").textContent = title;
    this.shadowRoot.getElementById("articleImage").src = article?.image || "No hay imagen";
    this.shadowRoot.getElementById("description").textContent = article?.description || "No hay descripcion disponible";
    this.shadowRoot.getElementById("content").textContent = article?.content || "No hay contenido disponible";
    this.shadowRoot.getElementById("publishedAt").textContent = article?.publishedAt || "Fecha desconocida";
    this.shadowRoot.getElementById("company").textContent = article?.company || "Fecha desconocida";
    
    const authorElement = this.shadowRoot.getElementById("modalAuthor");
    authorElement.textContent = author?.name || "Autor desconocido";
    
    authorElement.onclick = () => {
      const authorModal = document.querySelector("author-modal");
      if (authorModal) {
        authorModal.open(author);
      } else {
        console.error("El modal del autor no se encontró en el DOM.");
      }
    };

    const modal = this.shadowRoot.getElementById("sideModal");
    modal.classList.add("open");
  }

  close() {
    this.shadowRoot.getElementById("sideModal").classList.remove("open");
  }

  toggleContent() {
    const content = this.shadowRoot.getElementById("content");
    const showMoreButton = this.shadowRoot.getElementById("showMore");
    
    if (content.style.display === "block") {
      content.style.display = "-webkit-box";
      showMoreButton.textContent = "Mostrar más contenido...";
    } else {
      content.style.display = "block";
      showMoreButton.textContent = "Mostrar menos";
    }
  }
}

customElements.define("side-modal", ModalSideBar);
