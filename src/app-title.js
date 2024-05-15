class AppTitle extends HTMLElement {
  constructor() {
    super();
    this.shadowDOM = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowDOM.innerHTML = `
      <style>
       h1 {
        color: white;
        font-size: 3rem;
       }
      </style>
      
      <h1>Cuaca</h1>
    `;
  }
}

customElements.define("app-title", AppTitle);
