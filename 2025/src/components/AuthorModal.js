class AuthorModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.isOpen = false;

    const template = document.createElement("template");
    template.innerHTML = `
      <style>
        @import "https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css";
      </style>
      <div class="modal hidden fixed inset-0 z-10 flex justify-center items-center bg-black bg-opacity-30 backdrop-blur-md" id="modal">
        <div class="modal-content flex flex-col gap-4 bg-white p-5 rounded max-w-md w-full rounded-lg">
          <span class="close cursor-pointer text-gray-500 text-2xl font-bold" id="closeButton">&times;</span>
          <img class="rounded-full size-24 h-40 object-cover mx-auto mb-4 border-4 border-indigo-700" id="authorAvatar" >
          <h2 class="text-lg font-bold text-gray-600" id="authorName"></h2>
          <p class="text-sm text-justify" id="authorBio"></p>
           <p class="text-indigo-500 text-sm mb-2 italic">
            Nacido el: <span id="authorBirthdate"></span>
          </p>
        </div>
      </div>
    `;
    this.template = template;
  }

  connectedCallback() {
    this.shadowRoot.appendChild(this.template.content.cloneNode(true));
    this.shadowRoot.getElementById("closeButton").addEventListener("click", () => {
      this.close();
    });
  }

  open(authorData) {
    this.shadowRoot.getElementById("authorName").textContent = authorData.name;
    this.shadowRoot.getElementById("authorBio").textContent = authorData.bio;
    this.shadowRoot.getElementById("authorAvatar").src = authorData.avatar;
  
    const dates = { year: 'numeric', month: 'long', day: 'numeric' };
  
    const formattedBirthdate = authorData.birthdate 
      ? new Date(authorData.birthdate).toLocaleDateString('es-ES', dates) 
      : "No especificado";
    this.shadowRoot.getElementById("authorBirthdate").textContent = formattedBirthdate;
    
    const avatarImg = this.shadowRoot.getElementById("authorAvatar");
    console.log("que muestra", authorData.avatar)
    if (authorData.avatar) {
      avatarImg.src = authorData.avatar;
      avatarImg.alt = `Foto de ${authorData.name}`;
    } else {
      avatarImg.src = "https://via.placeholder.com/150";
      avatarImg.alt = "Imagen no disponible";
    }
  
    this.shadowRoot.getElementById("modal").style.display = "flex";
  }
  

  close() {
    this.shadowRoot.getElementById("modal").style.display = "none";
  }
}

customElements.define("author-modal", AuthorModal);
