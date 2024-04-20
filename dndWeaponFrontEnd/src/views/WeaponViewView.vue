<script lang="ts">
import { Vue, Component, Mixins } from 'vue-property-decorator';
import { validate, ValidationError } from 'class-validator';
import GlobalMixin from '@/mixins/global-mixin';
import Weapon from '@/models/Weapon';
import IconButton from '@/components/IconButton.vue';
import CommentsList from '@/components/CommentsList.vue';
import Comments from '@/models/Comments';
import CommentViolation from '@/models/CommentViolation';
import router from '@/router';

@Component({
  components: { CommentsList, IconButton },
})
export default class WeaponViewView extends Mixins(GlobalMixin) {
  weapon = new Weapon();

  tempComment = new Comments();

  comments : Array<Comments> = [];

  // isDisabled = false;
  showCreate = false

  violation = new CommentViolation();

  $refs!: { commentList: CommentsList };

  get commentState() {
    return this.violation.comment ? false : null;
  }

  mounted() {
    this.getWeaponAndComments();
  }

  async getWeaponAndComments() {
    // this.isDisabled = true;
    this.weapon = await this.callAPI(`${this.WEAPON_API}/${this.$route.params.id}`);
    this.comments = await this.callAPI(`${this.WEAPON_API}/${this.$route.params.id}/comments`);
    console.log(this.comments);
    // this.isDisabled = false;
  }

  createModal() {
    this.showCreate = true;
  }

  handleDelete(deletedComment: Comments) {
    // ensure we have the latest up-to date student list
    const index = this.comments.findIndex((c: any) => c.commentID === deletedComment.commentID);
    if (index >= 0) {
      this.comments.splice(index, 1);
    }
  }

  async createComment() {
    this.tempComment.user = this.$store.state.userId;
    this.tempComment.weaponID = this.weapon.weaponID;
    this.violation = new CommentViolation();
    // DONE validate the student data before sending the fetch request -i.e. client side validation
    const errors = await validate(this.tempComment);
    console.log(errors);
    if (errors.length > 0) {
      const temp: CommentViolation = new CommentViolation();
      errors.forEach((vio: ValidationError) => {
        Object.assign(temp, {
          [vio.property]: vio.constraints![Object.keys(vio.constraints!)[0]],
        });
      });
      this.violation = temp;
    } else {
      // this.$refs.buttonSave.animate = true;
      const idString = this.tempComment.commentID || '';
      console.log(this.tempComment);
      const url = `${this.WEAPON_API}/${this.tempComment.weaponID}/comments`;
      const method = 'Post';
      this.callAPI(url, method, this.tempComment); // returns a promise object
    }
  }

  showConfirmDelete = false

  deleteConfirm() {
    this.showConfirmDelete = true; // show the modal confirm message
    // IMPORTANT- the b-modal built-in "ok" "and "cancel" buttons automatically close/hide the modal
    // closing the modal automatically updates the showConfirmDelete
  }

  async deleteWeapon() {
    this.callAPI(`${this.WEAPON_API}/${this.weapon.weaponID}`, 'delete');
    await router.replace({ path: '/weapon-selection' });
  }
}
</script>

<template>
  <div>
    <b-card no-body class="mb-3">
      <template #header>
        <h4 class="mb-0">{{weapon.name}}<IconButton :disabled="weapon.user.userID !== $store.state.userId" icon="trash-fill" variant="danger" @click="deleteConfirm" class="m-1" v-b-tooltip.hover.bottom="'Delete'"/>
        </h4>
      </template>
      <!--      <b-list-group flush>-->
      <!--        <b-list-group-item>Cras justo odio</b-list-group-item>-->
      <!--        <b-list-group-item>Dapibus ac facilisis in</b-list-group-item>-->
      <!--        <b-list-group-item>Vestibulum at eros</b-list-group-item>-->
      <!--      </b-list-group>-->

      <b-card-body>
        <b-card-text>Creator: {{weapon.user.username}}</b-card-text>
        <b-card-text>Weapon Category: {{weapon.weaponCategory}}</b-card-text>
        <b-card-text v-if="weapon.properties?.length > 0">
          Properties:
          <span v-for="property in weapon.properties" :key="property.propertyID">
            {{property.property}}
          </span>
        </b-card-text>
        <b-card-text>Weapon Damage: {{weapon.damageDice}} {{weapon.damageType}}</b-card-text>
        <b-card-text>
          Weapon Range: {{weapon.weaponRange}} <span v-if="weapon.weaponRange === 'Range'">Min: {{weapon.minRange ? weapon.minRange : 0}} Max: {{weapon.maxRange ? weapon.maxRange : 0}}</span>
        </b-card-text>
        <b-card-text>Weight: {{weapon.weight}}lb</b-card-text>
        <b-card-text v-if="weapon.description">Description: <br>{{weapon.description}}</b-card-text>
        <b-card-text><span v-if="comments.length > 0">Comments:</span><b-link :disabled="!$store.state.token" @click="createModal" class="card-link float-right">+ New Comment</b-link></b-card-text>
      </b-card-body>
      <hr v-if="comments.length > 0">
      <CommentsList ref="commentList" @deleted="handleDelete" v-for="comment in comments" :key="comment.commentID" :comment="comment" class="m-3"/>
    </b-card>
    <b-modal
      title="Create Comment"
      ok-variant="primary"
      cancel-variant="warning"
      @ok="createComment"
      v-model="showCreate">
      <!--    using slots -- https://vuejs.org/v2/guide/components-slots.html
          slot defined in b-modal -- https://bootstrap-vue.org/docs/components/modal#comp-ref-b-modal-slots
          modify the buttons that appear in the footer of the modal using pre-defined slots-->

      <template #modal-ok>
        <!-- change the OK button to say Delete instead and add a trash can icon-->
        <b-icon-chat-right-text-fill /> Post
      </template>

      <template #modal-cancel>
        <!-- add a X icon to the cancel button-->
        <b-icon-x-square-fill /> Cancel
      </template>
      <b-form-group
        :state="commentState"
        :invalid-feedback="violation.comment">
        <b-form-textarea
          placeholder="Enter Comment Here..."
          rows="3"
          max-rows="6"
          :state="commentState"
          v-model="tempComment.comment"
        />
      </b-form-group>
    </b-modal>
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
