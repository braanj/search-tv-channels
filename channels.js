/**
 * Initializes the application by adding styles, external scripts, and event listeners.
 */
function init() {
  const style = `
    .channels-list .channels ul,
    .country-list ul,
    .continent-list-nav ul {
      display: flex;
      gap: 0.75rem;
      list-style: none;
      margin: 0;
      padding-left: 0;
      flex-wrap: wrap;
    }
    .country-list ul {
      flex-direction: column;
    }

    .country-list ul li,
    .continent-list-nav ul li {
      border-radius: 5px;
      padding: 0.5rem 1rem;
      cursor: pointer;
    }
    .country-list ul li,
    .continent-list-nav ul li {
      background-color: #fff;
      transition: all 225ms ease-in-out;
    }
    .country-list ul li::first-letter,
    .continent-list-nav ul li::first-letter {
      text-transform: uppercase;
    }
    .country-list ul li:hover,
    .continent-list-nav ul li:hover {
      background-color: #000;
      color: #fff;
    }

    .country-channels-container {
      display: grid;
      grid-template-columns: 25% auto;
      gap: 1rem;
      min-height: 300px;
    }
    
    .continent-list-nav {
      margin-bottom: 1rem;
    }
    .channels-container {
      background-image: url(https://picsum.photos/id/352/3264/2176.webp);
      background-size: cover;
      background-position: center center;
      padding: 1rem;
    }
    .continent-list-nav,
    .country-channels-container .channels-list,
    .country-channels-container .country-list {
      backdrop-filter: blur(5px);
      background-color: #ffffff50;
      backdrop-filter: blur(10px);
      border-radius: 5px;
      padding: 1rem;
      max-height: 600px;
      overflow-y: scroll;
      position: relative;
    }
    .search-bar {
      background-color: #fff;
      display: flex;
      padding-right: 3rem;
      border-radius: 5px;
      position: sticky;
      top: 0;
      z-index: 99;
      border: 1px solid #000000;
    }
    .search-bar::before {
      content: "";
      position: absolute;
      top: -1rem;
      left: -1rem;
      width: calc(100% + 2rem);
      height: calc(100% + 2rem);
      z-index: -1;
      backdrop-filter: blur(5px);
      background-color: #ffffff95;
    }
    .search-bar .search {
      width: 100%;
      outline: none;
      border: none;
      padding: 1rem;
      box-sizing: border-box;
      border-radius: 5px;
    }
    .search-bar .search-icon {
      position: absolute;
      right: 0;
      top: 50%;
      height: 100%;
      transform: translateY(-50%);
      background-color: #000;
      padding: 1rem;
      box-sizing: border-box;
      color: #fff;
      display: flex;
      align-items: center;
      border-end-end-radius: 5px;
      border-start-end-radius: 5px;
    }
    .country-channels-container .country-list ul,
    .channels-list .channels .category {
      margin-top: 2rem;
    }
    .channels-list .channels ul li {
      padding: 1rem;
      border-radius: 5px;
      backdrop-filter: blur(5px);
      background-color: #ffffff80;
    }

    @media screen and (max-width: 786px) {
      .country-channels-container {
        grid-template-columns: 1fr;
      }
      .country-channels-container .country-list {
        max-height: 300px;
      }
    }

  `;
  const styleElm = document.createElement("style");
  styleElm.appendChild(document.createTextNode(style));
  document.head.appendChild(styleElm);

  const linkElm = document.createElement("link");
  linkElm.rel = "stylesheet";
  linkElm.href =
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css";

  const scriptElm = document.createElement("script");
  scriptElm.src = "https://cdn.jsdelivr.net/npm/vue@2";

  document.head.appendChild(linkElm);
  document.head.appendChild(scriptElm);

  window.addEventListener("scroll", handleScroll);
}

function handleScroll() {
  Vue.component("continent-component", {
    /**
     * Vue component options.
     * @props {Array} continents - Array of continents.
     * @props {Array} countries - Array of countries.
     * @data {string} selectedContinent - Currently selected continent.
     * @data {string} selectedCountry - Currently selected country.
     * @data {string} query - Search query for channels.
     * @data {string} countryQuery - Search query for countries.
     * @data {Array} channelsCategories - Categories of channels.
     * @data {string} empty - Empty string placeholder.
     * @mounted - Lifecycle hook called after the component is mounted.
     * @methods {Function} selectContinent - Updates the selected continent.
     * @methods {Function} selectCountry - Updates the selected country.
     * @methods {Function} selectedCountryChannels - Fetches channels for the selected country.
     */
    props: ["continents", "countries"],
    template: `
    <div class="channels-container wrapper">      
      <div class="continent-list-nav">
        <ul>
          <li key="all">
            <span @click="selectContinent('all')">All</span>
          </li>
          <li v-for="continent in continents" :key="continent" @click="selectContinent(continent)">
            <span>{{ continent }}</span>
          </li>
        </ul>
      </div>

      <div class="country-channels-container">
        <div class="country-list">
          <div class="search-bar">
            <input type="text" name="countryQuery" v-model="countryQuery" class="search" placeholder="Search for country...">
            <span class="search-icon">
              <i class="fa fa-search" aria-hidden="true"></i>
            </span>
          </div>
          <ul>
            <template v-for="country in countries" :key="country.name">
              <li 
                v-if="(selectedContinent === country.continent || selectedContinent === 'all') && (country.name.toLowerCase().includes(countryQuery) || countryQuery === '')"
                @click="selectCountry(country)"
                class="country d-none"
              >{{ country.name }}</li>
            </template>
          </ul>
        </div>
        <div class="channels-list">
          <div class="search-bar">
            <input type="text" name="search" v-model="query" class="search" placeholder="Search for channel...">
            <span class="search-icon">
              <i class="fa fa-search" aria-hidden="true"></i>
            </span>
          </div>

          <div>{{ empty }}</div>
          
          <div class="channels" v-if="channelsCategories">
            <div class="category" v-for="(category, index) in channelsCategories" :key="index">
              <p>
                <strong>{{ index }} : {{ category.length }}</strong>
              </p>
              <ul v-if="category.length">
                <template v-for="(channel, key) in category" :key="key">
                  <li 
                    class="country d-none"
                    v-if="channel.name.toLowerCase().includes(query) || query === ''"
                  >
                    {{ channel.name }}
                  </li>
                </template>
              <ul>
          </div>
          </div>
        </div>
      </div>
    </div>
  `,
    data() {
      return {
        selectedContinent: "all",
        selectedCountry: "",
        query: "",
        countryQuery: "",
        channelsCategories: [],
        empty: "",
      };
    },
    mounted() {
      this.countries.map((country) => {
        this.selectedCountryChannels(country.continent, country.name);
      });
    },
    methods: {
      selectContinent(continent) {
        this.selectedContinent = continent;

        if (this.selectedContinent === "all") {
          this.countries.map((country) => {
            console.log(country);
            this.selectedCountryChannels(country.continent, country.name);
          });
        }
      },
      selectCountry(country) {
        this.selectedCountry = country;

        this.selectedCountryChannels(
          this.selectedCountry.continent,
          this.selectedCountry.name
        );
      },
      selectedCountryChannels(continent, country) {
        const options = {
          method: "GET",
          headers: {
            accept: "application/json",
          },
        };

        fetch(
          `https://laarajsalaheddine.me/channels/${continent.toLowerCase()}/${country.toLowerCase()}.json`,
          options
        ).then(async (response) => {
          if (response.ok) {
            this.channelsCategories = await response.json();
          }
        });
      },
    },
  });

  const app = new Vue({
    /**
     * Vue instance options.
     * @el {string} "#app" - Element selector for mounting the Vue instance.
     * @data {Array} continents - Array of continents.
     * @data {Array} countries - Array of countries.
     * @mounted - Lifecycle hook called after the component is mounted.
     */
    el: "#app",
    data: {
      continents: ["Europe", "USA", "Canada", "Arabe", "Latino", "Australia"],
      countries: [
        { name: "France", continent: "Europe" },
        { name: "United Kingdom", continent: "Europe" },
        { name: "Belgium", continent: "Europe" },
        { name: "Spain", continent: "Europe" },
        { name: "Germany", continent: "Europe" },
        { name: "Netherlands", continent: "Europe" },
        { name: "Portugal", continent: "Europe" },
        { name: "Ireland", continent: "Europe" },
        { name: "Italy", continent: "Europe" },
        { name: "Turkey", continent: "Europe" },
        { name: "Albania", continent: "Europe" },
        { name: "EXYU", continent: "Europe" },
        { name: "Hebrew", continent: "Europe" },
        { name: "Armenia", continent: "Europe" },
        { name: "Austria", continent: "Europe" },
        { name: "Bosnia", continent: "Europe" },
        { name: "Bulgaria", continent: "Europe" },
        { name: "Croatia", continent: "Europe" },
        { name: "Cyprus", continent: "Europe" },
        { name: "Czech", continent: "Europe" },
        { name: "Denmark", continent: "Europe" },
        { name: "Estonia", continent: "Europe" },
        { name: "Finland", continent: "Europe" },
        { name: "Greece", continent: "Europe" },
        { name: "Latvia", continent: "Europe" },
        { name: "Lithuania", continent: "Europe" },
        { name: "Macedonia", continent: "Europe" },
        { name: "Malta", continent: "Europe" },
        { name: "Montenegro", continent: "Europe" },
        { name: "Norway", continent: "Europe" },
        { name: "Poland", continent: "Europe" },
        { name: "Romania", continent: "Europe" },
        { name: "Russia", continent: "Europe" },
        { name: "Serbia", continent: "Europe" },
        { name: "Slovakia", continent: "Europe" },
        { name: "Slovenia", continent: "Europe" },
        { name: "Sweden", continent: "Europe" },
        { name: "Switzerland", continent: "Europe" },
        { name: "Ukraine", continent: "Europe" },
        { name: "Hungary", continent: "Europe" },
        { name: "Kurdish", continent: "Europe" },
        { name: "generale", continent: "USA" },
        { name: "belgium", continent: "Arabe" },
        { name: "germany", continent: "Arabe" },
        { name: "belgium", continent: "Canada" },
        { name: "germany", continent: "Canada" },
        { name: "belgium", continent: "Latino" },
        { name: "germany", continent: "Latino" },
        { name: "belgium", continent: "Australia" },
        { name: "germany", continent: "Australia" },
      ],
    },
    async mounted() {
      const componentInstance = new Vue({
        render: (h) =>
          h("continent-component", {
            props: { continents: this.continents, countries: this.countries },
          }),
      });

      componentInstance.$mount();
      this.$el.appendChild(componentInstance.$el);
    },
  });

  window.removeEventListener("scroll", handleScroll);
}

init();
