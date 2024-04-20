<!-- This component will be used to handle signup and login for the sight. -->
<script lang="ts">
import { Component, Prop } from 'vue-property-decorator';
import { validate, ValidationError } from 'class-validator';
import { ref } from 'vue';
import SignUpViolation from '@/models/SignUpViolation';
import LoginViolation from '@/models/LoginViolation';
import GlobalMixin from '@/mixins/global-mixin';
import User from '@/models/User';
import LoginCredentials from '@/models/LoginCredentials';
import store from '@/store';

@Component({})
export default class LoginSignup extends GlobalMixin {
  // An object that will hold validation violations that occur during sign-up
  signUpViolation: SignUpViolation = new SignUpViolation();

  // An object that will hold validation violations that occur during login.
  loginViolation: LoginViolation = new LoginViolation();

  // An object to temporarily hold signUp info
  tempUser: User = new User();

  // An object to hold login Credentials.
  tempCredentials: LoginCredentials = new LoginCredentials();

  /**
   *This method will handle login attempts when the user clicks the login button on
   * the login dropdown.
   */
  async loginHandler() {
    // Set login form to busy
    this.setBusy(true);
    // Clears past violations
    this.loginViolation = new LoginViolation();
    this.signUpViolation = new SignUpViolation();
    // validates the temporary user.
    const errors = await validate(this.tempCredentials);
    // If there are login validations.
    if (errors.length > 0) {
      // creates a temporary validation object that will be assigned to the loginViolation object
      const tempViolation: LoginViolation = new LoginViolation();
      // for each violation in errors
      errors.forEach((violation: ValidationError) => {
        // assign them to the temp violation object
        Object.assign(tempViolation, {
          [violation.property]: violation.constraints?.[Object.keys(violation.constraints)[0]],
        });
      });
      // Assigns new violations
      this.loginViolation = tempViolation;
    } else {
      // If there are no violations
      console.log('no violations');

      // uses fetch to post the user's credentials and receive a token.
      const response = await fetch(`${this.BASE_API}login`, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        body: JSON.stringify({
          username: this.tempCredentials.emailOrUsername,
          password: this.tempCredentials.password,
        }),
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'X-Request-With': 'XmlHttpRequest',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
          'Access-Control-Allow-Headers': 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
        },
        redirect: 'follow',
      });
      // Gets the response credentials
      const credentials = await response.json();
      // If the credentials have a token, username, and id.
      if (credentials?.token && credentials?.username && credentials?.userId) {
        // Store the token
        store.commit('setToken', credentials?.token);
        // Get the user's id and name
        store.commit('setUserId', credentials.userId);
        store.commit('setUsername', credentials.username);
      } else { // If the credentials do not have a token
        // Set error message
        const errorMsg = 'User Not Found';
        // Assign it to the loginViolations objet.
        this.loginViolation.emailOrUsername = errorMsg;
        this.loginViolation.password = errorMsg;
      }
    }
    this.setBusy(false);
  }

  /**
   * This method will handle signup attempts when the user clicks the signup button on the signup dropdown.
   */
  async signUpHandler() {
    this.setBusy(true);
    this.loginViolation = new LoginViolation();
    this.signUpViolation = new SignUpViolation();

    const errors = await validate(this.tempUser);
    // If there are login validations.
    if (errors.length > 0) {
      // creates a temporary validation object that will be assigned to the loginViolation object
      const tempViolation: SignUpViolation = new SignUpViolation();
      // for each violation in errors
      errors.forEach((violation: ValidationError) => {
        // assign them to the temp violation object
        Object.assign(tempViolation, {
          [violation.property]: violation.constraints?.[Object.keys(violation.constraints)[0]],
        });
      });
      // If passwords do not match.
      if (this.tempUser.password !== this.tempUser.confirmPassword) {
        // Set validation for confirm password to the correct error string.
        tempViolation.confirmPassword = 'Passwords must match';
      }
      // Assigns new violations
      this.signUpViolation = tempViolation;
    } else {
      // If there are no violations
      console.log('no violations');

      // uses fetch to post the user's credentials and receive a token.
      const response = await fetch(`${this.BASE_API}user`, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        body: JSON.stringify(this.tempUser),
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'X-Request-With': 'XmlHttpRequest',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
          'Access-Control-Allow-Headers': 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
        },
        redirect: 'follow',
      });
      // Gets the new user's data form the response
      const newUser = await response.json();
      // if the user has the basic qualities of the user
      if (newUser?.username && newUser?.password) {
        // Set up LoginCredentials for the user
        this.tempCredentials = new LoginCredentials();
        this.tempCredentials.emailOrUsername = newUser.username;
        this.tempCredentials.password = newUser.password;
        // Log the user in
        await this.loginHandler();
        // Close the modal.
        this.$bvModal.hide('modal-sign-up');
      } else { // if the user was not creator
        this.signUpViolation.email = newUser.error;
        this.signUpViolation.username = newUser.error;
        this.signUpViolation.password = newUser.error;
        this.signUpViolation.confirmPassword = newUser.error;
      }

      console.log(newUser);
      // If the credentials have a token, username, and id.
    }

    this.setBusy(false);
  }
}
</script>

<template>
  <!-- A drop down form to handle the login -->
  <b-dropdown
    right
    text="Login"
    variant="outline-primary"
    class="m-2">
    <b-dropdown-form style="width: 360px;">
      <!-- The form will take in a username or email and a password. -->
      <b-form-group
        label="Username / Email"
        :invalid-feedback="loginViolation.emailOrUsername"
        :state="loginViolation.emailOrUsername ? false : null">
        <b-form-input
          size="sm"
          placeholder="weaponCreator@email.com or UserName123"
          v-model="tempCredentials.emailOrUsername"
          :state="loginViolation.emailOrUsername ? false : null"/>
      </b-form-group>
      <b-form-group
        label="Password"
        :invalid-feedback="loginViolation.password"
        :state="loginViolation.password ? false : null">
        <b-form-input
          type="password"
          size="sm"
          placeholder="Password"
          v-model="tempCredentials.password"
          :state="loginViolation.password ? false : null"/>
      </b-form-group>
      <b-button
        variant="primary"
        size="small"
        @click="loginHandler"
        :disabled="isDisabled">
        Login
      </b-button>
    </b-dropdown-form>
    <b-dropdown-divider/>
    <b-dropdown-item-button v-b-modal.modal-sign-up>Don't have an account? Click here!</b-dropdown-item-button>

    <!-- This modal will appear when the user clicks the "Don't have an account? Click here!" option of the b-dropdown -->
    <b-modal
      id="modal-sign-up"
      ref="signupModal"
      title="Sign-Up"
      hide-footer
    >
      <b-form-group
        label="Username"
        :invalid-feedback="signUpViolation.username"
        :state="signUpViolation.username ? false : null"
      >
        <b-form-input
          :state="signUpViolation.username ? false : null"
          placeholder="username"
          v-model="tempUser.username"
        />
      </b-form-group>
      <b-form-group
        label="Email"
        :invalid-feedback="signUpViolation.email"
        :state="signUpViolation.email ? false : null">
        <b-form-input
          :state="signUpViolation.email ? false : null"
          placeholder="email"
          v-model="tempUser.email"/>
      </b-form-group>
      <b-form-group
        label="Password"
        :invalid-feedback="signUpViolation.password"
        :state="signUpViolation.password ? false : null">
        <b-form-input
          :state="signUpViolation.password ? false : null"
          v-model="tempUser.password"/>
      </b-form-group>
      <b-form-group
        label="Confirm Password"
        :invalid-feedback="signUpViolation.confirmPassword"
        :state="signUpViolation.confirmPassword ? false : null">
        <b-form-input
          :state="signUpViolation.confirmPassword ? false : null"
          v-model="tempUser.confirmPassword"/>
      </b-form-group>
      <b-form-group>
        <b-form-checkbox
          v-model="tempUser.admin"
          name="admin check"
          :value="true"
          :unchecked-value="false">
          admin
        </b-form-checkbox>
      </b-form-group>
      <b-button
        :disabled="isDisabled"
        @click="signUpHandler"
      >
        Sign-Up
      </b-button>
    </b-modal>
  </b-dropdown>
</template>

<style scoped>

</style>
