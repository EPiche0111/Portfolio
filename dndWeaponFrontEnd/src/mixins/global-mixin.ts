/* eslint-disable max-len */
/**
 * Mixins are a flexible way to distribute reusable functionalities for Vue components.
 * https://vuejs.org/v2/guide/mixins.html
 * The following mixin will only be imported to ALL components in this project (even the 3rd party components)
 * all the following methods and variables will be available to ALL components as this mixin will be imported in main.js
 */

// mixins.js
import {
  Component, Prop, Vue, Watch,
} from 'vue-property-decorator';
import store from '@/store';

// TODO add the addresses for our routes
const BASE_API = 'http://localhost:3004/';
const WEAPON_API = `${BASE_API}weapons`;

const FETCH_HEADERS:any = {
  'Content-Type': 'application/json; charset=utf-8',
  'X-Request-With': 'XmlHttpRequest',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
  'Access-Control-Allow-Headers': 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
};

@Component
export default class GlobalMixin extends Vue {
  @Prop(Boolean) readonly debug!:boolean

  @Prop(Boolean) readonly disabled!:boolean

  // immutable constant data variables
  BASE_API = BASE_API

  WEAPON_API = WEAPON_API

  // regular data variable
  isBusy = false

  token = '';

  // Declared as computed property getter
  get isDisabled():boolean {
    return this.isBusy || this.disabled;
  }

  // Used to get whether the user has already logged in or not
  get isLoggedIn(): boolean {
    return store.state.token?.length > 0;
  }

  @Watch('token')
  tokenWatch(newToken: string) {
    localStorage.token = newToken;
  }

  mounted() { // when ANY component loads
    if (this.debug) {
      // output the props and data variables to the console
      console.log(this.$props);
      console.log(this.$data);
      this.token = localStorage.token;
    }
  }

  // method to set the internal isBusy and emit to the parent component the busy state
  setBusy(state:boolean) {
    this.isBusy = state;
    this.$emit('busy', state);
  }

  // setter for the client's token
  setToken(token: string) {
    this.token = token;
    this.$emit('loggedIn', this.isLoggedIn);
  }

  // Getter for the client's token
  getToken() {
    return this.token;
  }

  // function that will determine which request method and how to send the data to the api
  callAPI(url:string, method = 'get', dataToSend = {}) {
    const fetchOptions: any = {
      method: 'GET',
      credentials: 'include', // allows api to set cookies in the browser
      referrerPolicy: 'strict-origin-when-cross-origin',
      headers: { ...FETCH_HEADERS },
    };
    // ensure valid/allowed request methods
    // eslint-disable-next-line no-param-reassign
    method = method.toUpperCase();
    if (['POST', 'PUT', 'DELETE'].includes(method)) {
      fetchOptions.method = method;
      fetchOptions.headers.Authorization = `Bearer ${this.$store.state.token}`;
    }
    // convert JS object to JSON string – GET request cannot have a body property so append it to the URL
    if (fetchOptions.method !== 'GET') fetchOptions.body = JSON.stringify(dataToSend);
    // eslint-disable-next-line no-param-reassign
    else if (Object.keys(dataToSend).length) url += `?${(new URLSearchParams(dataToSend)).toString()}`;

    // return a promise we can use .then, .catch and .finally in our component
    return fetch(url, fetchOptions)
      .then(async (res) => {
        const resInfo:any = { url: res.url, status: res.status, statusText: res.statusText };
        if (res.status === 204) return Promise.resolve(resInfo);
        if (res.ok) return res.json();

        const error = new Error(`${res.status}: ${res.statusText}`);
        resInfo.data = await res.json();
        throw Object.assign(error, resInfo);
      });
  }
}
