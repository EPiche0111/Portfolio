<script lang="ts">
import { Vue, Component, Mixins } from 'vue-property-decorator';
import { validate, ValidationError } from 'class-validator';
import Weapon from '@/models/Weapon';
import WeaponViolation from '@/models/WeaponViolation';
import GlobalMixin from '@/mixins/global-mixin';
import router from '@/router';

@Component({})
export default class WeaponForm extends Mixins(GlobalMixin) {
  tempWeapon = new Weapon()

  weapon: Weapon | undefined;

  mounted() {
    if (!this.$store.state.token) {
      alert('Please login to create a weapon');
      this.$router.back();
    }
    this.getWeapon();
  }

  async getWeapon() {
    if (this.$route.params.id) {
      this.tempWeapon = await this.callAPI(`${this.WEAPON_API}/${this.$route.params.id}`);
      const dice = this.tempWeapon.damageDice.split('d');
      // eslint-disable-next-line prefer-destructuring
      this.diceQty = dice[0];
      this.damageDice = `d${dice[1]}`;
    }
  }

  violation: WeaponViolation = new WeaponViolation();

  damageDice= '';

  diceQty= '';

  weaponCategory= [
    { value: 'Simple', text: 'Simple' },
    { value: 'Martial', text: 'Martial' },
  ];

  damageType= [
    { value: 'Acid', text: 'Acid' },
    { value: 'Bludgeoning', text: 'Bludgeoning' },
    { value: 'Cold', text: 'Cold' },
    { value: 'Fire', text: 'Fire' },
    { value: 'Force', text: 'Force' },
    { value: 'Lightning', text: 'Lightning' },
    { value: 'Necrotic', text: 'Necrotic' },
    { value: 'Piercing', text: 'Piercing' },
    { value: 'Poison', text: 'Poison' },
    { value: 'Psychic', text: 'Psychic' },
    { value: 'Radiant', text: 'Radiant' },
    { value: 'Slashing', text: 'Thunder' },
  ];

  properties= [
    { value: { propertyID: 1, property: 'ammunition' }, text: 'Ammunition' },
    { value: { propertyID: 2, property: 'finesse' }, text: 'Finesse' },
    { value: { propertyID: 3, property: 'heavy' }, text: 'Heavy' },
    { value: { propertyID: 4, property: 'light' }, text: 'Light' },
    { value: { propertyID: 5, property: 'loading' }, text: 'Loading' },
    { value: { propertyID: 6, property: 'monk' }, text: 'Monk' },
    { value: { propertyID: 7, property: 'reach' }, text: 'Reach' },
    { value: { propertyID: 8, property: 'special' }, text: 'Special' },
    { value: { propertyID: 9, property: 'thrown' }, text: 'Thrown' },
    { value: { propertyID: 10, property: 'two-handed' }, text: 'Two-Handed' },
    { value: { propertyID: 11, property: 'versatile' }, text: 'Versatile' },
  ];

  get nameState() {
    return this.violation.name ? false : null;
  }

  get weaponCategoryState() {
    return this.violation.weaponCategory ? false : null;
  }

  get weaponRangeState() {
    return this.violation.weaponRange ? false : null;
  }

  get damageDiceState() {
    return this.violation.damageDice ? false : null;
  }

  get damageTypeState() {
    return this.violation.damageType ? false : null;
  }

  get propertiesState() {
    return this.violation.properties ? false : null;
  }

  get weightState() {
    return this.violation.weight ? false : null;
  }

  get minRangeState() {
    return this.violation.minRange ? false : null;
  }

  get maxRangeState() {
    return this.violation.maxRange ? false : null;
  }

  get descriptionState() {
    return this.violation.description ? false : null;
  }

  async saveWeapon() {
    if (!this.tempWeapon.user) {
      this.tempWeapon.user = this.$store.state.userId;
    }
    this.tempWeapon.damageDice = this.diceQty + this.damageDice;
    if (this.tempWeapon.weaponRange === 'Melee') {
      this.tempWeapon.minRange = undefined;
      this.tempWeapon.maxRange = undefined;
    }
    // Reset Violation object incased there are not errors to display
    this.violation = new WeaponViolation();

    // DONE validate the student data before sending the fetch request -i.e. client side validation
    const errors = await validate(this.tempWeapon);
    console.log(errors);
    if (errors.length > 0) {
      const temp: WeaponViolation = new WeaponViolation();
      errors.forEach((vio: ValidationError) => {
        Object.assign(temp, {
          [vio.property]: vio.constraints![Object.keys(vio.constraints!)[0]],
        });
      });
      this.violation = temp;
    } else {
      // this.$refs.buttonSave.animate = true;
      const idString = this.tempWeapon.weaponID || '';
      const url = this.WEAPON_API + (this.isNew ? '' : `/${this.tempWeapon.weaponID}`);
      const method = this.isNew ? 'post' : 'put';
      this.callAPI(url, method, this.tempWeapon); // returns a promise object
      await router.replace({ path: '/weapon-selection' });
    }
  }

  get isNew(): boolean {
    // if studentID is null, 0 , '' then it's a new student not an existing student
    return !this.weapon || !this.weapon.weaponID;
  }
}
</script>

<template>
  <div>
    <b-card>
      <b-row>
        <b-col>
          <b-form-group
            label="Weapon Name:"
            label-size="lg"
            :invalid-feedback="violation.name"
            :state="nameState">
            <b-input-group>
              <b-form-input
                :state="nameState"
                placeholder="Weapon Name"
                v-model="tempWeapon.name"
                trim/>
            </b-input-group>
          </b-form-group>
        </b-col>
        <b-col>
          <b-form-group
            label="Description: (Optional)"
            label-size="lg"
            :state="descriptionState"
            :invalid-feedback="violation.description">
            <b-form-textarea
              :state="descriptionState"
              placeholder="Enter Description here..."
              v-model="tempWeapon.description"
              rows="3"
              max-rows="6"
            />
          </b-form-group>
        </b-col>
      </b-row>

      <b-form-group
        label="Weapon Category:"
        label-for="weaponCategory"
        label-size="lg"
        label-cols-sm="3"
        label-cols-lg="2"
        content-cols-sm="4"
        content-cols-lg="2"
        :invalid-feedback="violation.weaponCategory"
        :state="weaponCategoryState">
        <b-form-select
          id="weaponCategory"
          v-model="tempWeapon.weaponCategory"
          :options="weaponCategory"
          :state="weaponCategoryState"/></b-form-group>
      <b-form-group
        label="Weapon Range:"
        label-size="lg"
        label-for="weaponRange"
        :invalid-feedback="violation.weaponRange"
        :state="weaponRangeState"
        label-cols-sm="3"
        label-cols-lg="2"
        content-cols-sm="4"
        content-cols-lg="2">
        <b-radio-group id="weaponRange" v-model="tempWeapon.weaponRange" :options="['Melee', 'Range']" :state="weaponRangeState"/>
      </b-form-group>
      <b-form-group
        label="Damage:"
        label-size="lg"
      >
        <b-form-group
          :state="damageDiceState"
          :invalid-feedback="violation.damageDice"
        >
          <b-form-group
            label="Dice Type:"
            label-cols-sm="3"
            label-cols-lg="2"
            content-cols-sm
            content-cols-lg="7">
            <b-radio-group
              v-model="damageDice"
              :state="damageDiceState"
              :options="['d4', 'd6', 'd8', 'd10', 'd12', 'd20']"/>
          </b-form-group>
          <b-form-group
            label="Quantity of Dice:"
            label-cols-sm="3"
            label-cols-lg="2"
            content-cols-sm="2"
            content-cols-lg="1">
            <b-form-input
              v-model="diceQty"
              :state="damageDiceState"
              type="number"
              min="1"
            /></b-form-group>
          <b-form-text>Damage Dice: {{diceQty + damageDice}}</b-form-text>
        </b-form-group>
        <b-form-group
          label="Damage Type:"
          :invalid-feedback="violation.damageType"
          :state="damageTypeState"
          label-cols-sm="3"
          label-cols-lg="2"
          content-cols-sm="4"
          content-cols-lg="2">
          <b-form-select
            v-model="tempWeapon.damageType"
            :options="damageType"
            :state="damageTypeState"/></b-form-group>
        <b-form-group/>
      </b-form-group>
      <b-form-group
        label="Properties: (Optional)"
        :invalid-feedback="violation.properties + ''"
        :state="propertiesState"
        label-size="lg"
      >
        <b-form-checkbox-group
          v-model="tempWeapon.properties"
          :options="properties"
          :state="propertiesState"/>
      </b-form-group>
      <b-form-group
        label="Range:"
        label-size="lg"
        v-if="tempWeapon.weaponRange === 'Range'"
      >
        <b-row>
          <b-col>
            <b-form-group
              label="Minimum:"
              :invalid-feedback="violation.minRange + ''"
              :state="minRangeState"
              label-cols-sm="3"
              label-cols-lg="2"
              content-cols-sm="3"
              content-cols-lg="2">
              <b-form-input
                type="number"
                min="0"
                v-model.number="tempWeapon.minRange"
                :state="minRangeState"
              /></b-form-group>
          </b-col>
          <b-col>
            <b-form-group
              label="Maximum:"
              :invalid-feedback="violation.maxRange + ''"
              :state="maxRangeState"
              label-cols-sm="3"
              label-cols-lg="2"
              content-cols-sm="3"
              content-cols-lg="2">
              <b-form-input
                type="number"
                min="0"
                v-model.number="tempWeapon.maxRange"
                :state="maxRangeState"
              /></b-form-group>
          </b-col>
        </b-row>

      </b-form-group>
      <b-form-group
        label="Weight:"
        label-size="lg"
        :invalid-feedback="violation.weight + ''"
        :state="weightState"
        label-cols-sm="3"
        label-cols-lg="2"
        content-cols-sm="2"
        content-cols-lg="1">
        <b-form-input
          type="number"
          min="0"
          v-model.number="tempWeapon.weight"
          :state="weightState"
        /></b-form-group>
      <b-button-group class="float-right">
        <b-button variant="primary" @click="saveWeapon">Save / Submit</b-button>
      </b-button-group>
    </b-card>
  </div>
</template>

<style scoped>

</style>
