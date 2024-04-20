<script lang="ts">
import {
  Vue, Component, Mixins, Prop,
} from 'vue-property-decorator';
import { validate, ValidationError } from 'class-validator';
import IconButton from '@/components/IconButton.vue';
import GlobalMixin from '@/mixins/global-mixin';
import Comments from '@/models/Comments';
import router from '@/router';
import CommentViolation from '@/models/CommentViolation';

@Component({
  components: { IconButton },
})
export default class CommentsList extends Mixins(GlobalMixin) {
  @Prop({ type: Comments }) readonly comment: any

  tempComment = new Comments();

  showConfirmDelete = false

  showEdit = false

  violation:CommentViolation = new CommentViolation()

  mounted() {
    this.tempComment = this.comment;
  }

  editModal() {
    this.showEdit = true;
  }

  get commentState() {
    return this.violation.comment ? false : null;
  }

  async editComment() {
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
      const url = `${this.WEAPON_API}/${this.comment.weaponID}/comments/${this.comment.commentID}`;
      const method = 'PUT';
      this.callAPI(url, method, this.tempComment); // returns a promise object
    }
  }

  deleteConfirm() {
    this.showConfirmDelete = true; // show the modal confirm message
    // IMPORTANT- the b-modal built-in "ok" "and "cancel" buttons automatically close/hide the modal
    // closing the modal automatically updates the showConfirmDelete
  }

  deleteComment() {
    this.showConfirmDelete = false;
    this.callAPI(`${this.WEAPON_API}/${this.comment.weaponID}/comments/${this.comment.commentID}`, 'delete')
      .then((res) => {
        this.$emit('deleted', this.comment);// tell parent student was deleted
      })
      .catch(() => {
        this.$emit('reset', this.comment);
      });
    // .finally(() => {
    //   this.setBusy(false);// tell parent that this component is no longer waiting for the api
    // });
  }
}

</script>

<template>
  <div>
    <b-overlay :show="showConfirmDelete" rounded="sm">
      <b-card class="pl-5" :aria-hidden="showConfirmDelete ? 'true' : null">
        <b-card-title>{{comment.user.username}}</b-card-title>
        <b-card-text>{{comment.comment}}</b-card-text>
        <b-button-group class="float-right" >
          <b-button variant="success" :disabled="comment.user.userID !== $store.state.userId" @click="editModal" class="mr-1">Edit</b-button>
          <b-button variant="danger" :disabled="comment.user.userID !== $store.state.userId" @click="deleteConfirm" class="ml-1">Delete</b-button>
        </b-button-group>
      </b-card>

      <template #overlay>
        <div class="text-center">
          <p id="cancel-label">Are you sure you want to delete this comment</p>
          <b-button
            variant="danger"
            size="sm"
            class="mr-1"
            @click="deleteComment"
          >
            Confirm
          </b-button>
          <b-button
            variant="warning"
            size="sm"
            class="ml-1"
            @click="showConfirmDelete = false"
          >
            Cancel
          </b-button>
        </div>
      </template>
    </b-overlay>
    <b-modal
      title="Edit Comment"
      ok-variant="success"
      cancel-variant="warning"
      @ok="editComment"
      v-model="showEdit">
      <!--    using slots -- https://vuejs.org/v2/guide/components-slots.html
      slot defined in b-modal -- https://bootstrap-vue.org/docs/components/modal#comp-ref-b-modal-slots
      modify the buttons that appear in the footer of the modal using pre-defined slots-->

      <template #modal-ok>
        <!-- change the OK button to say Delete instead and add a trash can icon-->
        <b-icon-pencil-fill /> Change
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
  </div>
</template>

<style scoped>

</style>
