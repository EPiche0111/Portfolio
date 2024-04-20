<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import LoginSignup from '@/components/LoginSignup.vue';
import GlobalMixin from '@/mixins/global-mixin';
import UserOptions from '@/components/UserOptions.vue';

@Component({
  components: { LoginSignup, UserOptions },
})
export default class UserAccount extends GlobalMixin {
}
</script>

<template>
  <div>
    <user-options v-if="isLoggedIn"/>
    <login-signup v-else/>
  </div>
</template>

<style scoped>

</style>
