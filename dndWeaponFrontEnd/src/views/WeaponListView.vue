<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import WeaponList from '@/components/WeaponList.vue';
import GlobalMixin from '@/mixins/global-mixin';
import Weapon from '@/models/Weapon';
import AutoSearch from '@/components/AutoSearch.vue';
import Comments from '@/models/Comments';

@Component({
  components: { AutoSearch, WeaponList },
})
export default class WeaponListView extends Mixins(GlobalMixin) {
  weapons: Array<Weapon> = [];

  // isDisabled = false;

  mounted() {
    this.getWeapons();
  }

  handleDelete(deletedWeapon: Comments) {
    // ensure we have the latest up-to date student list
    const index = this.weapons.findIndex((w: any) => w.weaponID === deletedWeapon.weaponID);
    if (index >= 0) {
      this.weapons.splice(index, 1);
    }
  }

  async getWeapons() {
    // this.isDisabled = true;
    this.weapons = await this.callAPI(this.WEAPON_API);
    // this.isDisabled = false;
  }
}
</script>

<template>
  <div>
    <b-card class="mb-5 align-items-center">
      <AutoSearch min-search-length="3"/>
    </b-card>
    <b-overlay
      :show="isDisabled"
      opacity=".25"
    >
      <WeaponList v-for="weapon in weapons" @deleted="handleDelete" :key="weapon.weaponID" :weapon="weapon" class="m-3"/>
    </b-overlay>
  </div>
</template>

<style scoped>

</style>
