
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
(function () {

    class Article extends HTMLElement {
        constructor(){
            super();
            this.innerHTML = "HOLA FUNCIONA";
        }
    }

    customElements.define("article-item", Article);

})();
//# sourceMappingURL=bundle.js.map
