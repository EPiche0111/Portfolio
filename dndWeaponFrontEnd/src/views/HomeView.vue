<template>
  <div class="home" >
    <b-jumbotron header="DnD Weapon Creator" lead="Welcome to D&D Weapon Creator"/>
    <b-card
      title="View weapons"
      border-variant="dark"
      img-left
      img-src="dragon.png"
      class="mb-5 align-items-center text-center">
      <b-card-text>View and comment on expansive library
        of weapons created by our users.</b-card-text>
      <b-button href="#/weapon-selection" variant="primary">View Weapons</b-button>
    </b-card>
    <b-card
      title="Create weapons"
      border-variant="dark"
      img-right
      img-src="paladin.png"
      img-alt="Paladin"
      class="mb-5 align-items-center text-center">
      <b-card-text>Use our weapon creator to design your very own dungeons and dragons\
        weapon that you can you use in your very own campaign.</b-card-text>
      <b-button href="#/weapon-creation" variant="primary">Create Weapon</b-button>
    </b-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from '@/components/HelloWorld.vue';
import IconButton from '@/components/IconButton.vue'; // @ is an alias to /src

@Component({
  components: {
    IconButton,
    HelloWorld,
  },
})
export default class HomeView extends Vue {
  // eslint-disable-next-line class-methods-use-this
  showMessage(msg:string):void {
    alert(msg);
  }
}
</script>
