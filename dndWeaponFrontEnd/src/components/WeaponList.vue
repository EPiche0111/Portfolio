<script lang="ts">
import {
  Vue, Component, Prop, Mixins,
} from 'vue-property-decorator';
import { decode } from 'jsonwebtoken';
import IconButton from '@/components/IconButton.vue';
import Weapon from '@/models/Weapon';
import GlobalMixin from '@/mixins/global-mixin';
import router from '@/router';

@Component({
  components: { IconButton },
})
export default class WeaponList extends Mixins(GlobalMixin) {
  @Prop({ type: Weapon }) readonly weapon: any

  viewWeapon() {
    router.replace({ path: `/weapon-view/${this.weapon.weaponID}` });
  }

  editWeapon() {
    router.replace({ path: `/weapon-creation/${this.weapon.weaponID}` });
  }

  showConfirmDelete = false

  deleteConfirm() {
    this.showConfirmDelete = true; // show the modal confirm message
    // IMPORTANT- the b-modal built-in "ok" "and "cancel" buttons automatically close/hide the modal
    // closing the modal automatically updates the showConfirmDelete
  }

  deleteWeapon() {
    this.callAPI(`${this.WEAPON_API}/${this.weapon.weaponID}`, 'delete')
      .then((res) => {
        this.$emit('deleted', this.weapon);// tell parent student was deleted
      })
      .catch(() => {
        this.$emit('reset', this.weapon);
      });
    // .finally(() => {
    //   this.setBusy(false);// tell parent that this component is no longer waiting for the api
    // });
  }
}
</script>

<template>
  <div>
    <b-card class="pl-5">
      <b-card-title>Weapon: {{weapon.name}}</b-card-title>
      <b-card-text>Creator: {{weapon.user.username}}</b-card-text>
      <b-row>
        <b-col>
          <b-card-text>Category: {{weapon.weaponCategory}}</b-card-text>
        </b-col>
        <b-col>
          <b-card-text>Range type: {{weapon.weaponRange}}</b-card-text>
        </b-col>
        <b-col>
          <b-card-text>Damage Dice: {{weapon.damageDice}}</b-card-text>
        </b-col>
        <b-col>
          <IconButton icon="eye-fill" variant="primary" @click="viewWeapon" class="m-1" v-b-tooltip.hover.bottom="'View'"/>
          <IconButton :disabled="weapon.user.userID !== $store.state.userId" icon="pencil-fill" variant="success" @click="editWeapon" class="m-1" v-b-tooltip.hover.bottom="'Edit'"/>
          <IconButton :disabled="weapon.user.userID !== $store.state.userId" icon="trash-fill" variant="danger" @click="deleteConfirm" class="m-1" v-b-tooltip.hover.bottom="'Delete'"/>

        </b-col>
      </b-row>

    </b-card>
    <b-modal
      title="Weapon Delete Warning"
      ok-variant="danger"
      cancel-variant="warning"
      @ok="deleteWeapon"
      v-model="showConfirmDelete">
      <!--    using slots -- https://vuejs.org/v2/guide/components-slots.html
      slot defined in b-modal -- https://bootstrap-vue.org/docs/components/modal#comp-ref-b-modal-slots
      modify the buttons that appear in the footer of the modal using pre-defined slots-->

      <template #modal-ok>
        <!-- change the OK button to say Delete instead and add a trash can icon-->
        <b-icon-trash-fill /> Delete
      </template>

      <template #modal-cancel>
        <!-- add a X icon to the cancel button-->
        <b-icon-x-square-fill /> Cancel
      </template>
      Username you are about to delete Your {{weapon.name}} Are you sure about this?
    </b-modal>
  </div>
</template>

<style scoped>

</style>
