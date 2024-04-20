<script lang="ts">
import {
  Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { validate, ValidationError } from 'class-validator';
import GlobalMixin from '@/mixins/global-mixin';
import store from '@/store';
import User from '@/models/User';
import UpdateViolation from '@/models/UpdateViolation';
import LoginCredentials from '@/models/LoginCredentials';
import SignUpViolation from '@/models/SignUpViolation';

@Component({})
export default class UserOptions extends GlobalMixin {
  // a value to show and hide the overlay
  show = false;

  // an object to hold the temporary user information
  tempUser: User = new User();

  // UpdateViolation
  updateViolation = new UpdateViolation();

  // This method handles the logout.
  handleLogout() {
    store.commit('setToken', undefined);
    store.commit('setUserId', undefined);
    store.commit('setUsername', undefined);
    store.commit('setAdmin', false);
  }

  editHandler() {
    this.$bvModal.show('modal-edit-user');
    // use a get user to fill the users info except password
  }

  // This method will be used to handle updates.
  async updateHandler() {
    this.setBusy(true);
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
      this.updateViolation = tempViolation;
    } else {
      // If there are no violations
      console.log('no violations');

      // uses fetch to post the user's credentials and receive a token.
      const response = await fetch(`${this.BASE_API}user/${store.state.userId}`, {
        method: 'PUT',
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
      console.log(newUser);
      // if the user has the basic qualities of the user
      if (newUser?.username && newUser?.password) {
      //   // Set up LoginCredentials for the user
      //   this.tempCredentials = new LoginCredentials();
      //   this.tempCredentials.emailOrUsername = newUser.username;
      //   this.tempCredentials.password = newUser.password;
      //   // Log the user in
      //   await this.loginHandler();
      //   // Close the modal.
      //   this.$bvModal.hide('modal-sign-up');
      } else { // if the user was not creator
        //   this.signUpViolation.email = newUser.error;
        //   this.signUpViolation.username = newUser.error;
        //   this.signUpViolation.password = newUser.error;
        //   this.signUpViolation.confirmPassword = newUser.error;
      }
    }

    this.setBusy(false);
  }

  // This method will handle deletes
  async deleteHandler() {
    this.setBusy(true);
    const response = await fetch(`${this.BASE_API}user/${store.state.userId}`, {
      method: 'DELETE',
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
        Authorization: `Bearer ${store.state.token}`,
      },
      redirect: 'follow',
    });
    // close the modals and logout
    this.$bvModal.hide('modal-edit-user');
    this.handleLogout();
    this.setBusy(false);
  }

  cancelHandler() {
    this.setBusy(true);
    this.$bvModal.hide('modal-edit-user');
    this.setBusy(false);
  }
}
</script>

<template>
  <b-dropdown
    right
    :text="$store.state.username"
    variant="outline-success"
    class="m-2">
    <b-dropdown-item-button @click="editHandler">Edit Account</b-dropdown-item-button>
    <b-dropdown-item @click="handleLogout">Logout</b-dropdown-item>

    <!-- This modal will appear when the user clicks the "Don't have an account? Click here!" option of the b-dropdown -->
    <b-modal
      id="modal-edit-user"
      ref="editModal"
      title="Update Account"
      hide-footer
      no-stacking
    >
      <b-form-group
        label="Username"
        :invalid-feedback="updateViolation.username"
        :state="updateViolation.username ? false : null"
      >
        <b-form-input
          :state="updateViolation.username ? false : null"
          placeholder="username"
          v-model="tempUser.username"
        />
      </b-form-group>
      <b-form-group
        label="Email"
        :invalid-feedback="updateViolation.email"
        :state="updateViolation.email ? false : null">
        <b-form-input
          :state="updateViolation.email ? false : null"
          placeholder="email"
          v-model="tempUser.email"/>
      </b-form-group>
      <b-form-group
        label="Password"
        :invalid-feedback="updateViolation.password"
        :state="updateViolation.password ? false : null">
        <b-form-input
          :state="updateViolation.password ? false : null"
          v-model="tempUser.password"/>
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
        @click="updateHandler"
      >
        Update
      </b-button>
      <b-button
        :disabled="isDisabled"
        v-b-modal.modal-confirm-delete
      >
        Delete
      </b-button>
      <b-button
        :disabled="isDisabled"
        @click="cancelHandler"
      >
        Cancel
      </b-button>
    </b-modal>
    <b-modal
      id="modal-confirm-delete"
      ref="delModal"
      title="Delete Account"
      ok-variant="danger"
      @ok="deleteHandler">
      <div>Are you sure you want to delete your account?</div>
    </b-modal>
  </b-dropdown>
</template>

<style scoped>

</style>
