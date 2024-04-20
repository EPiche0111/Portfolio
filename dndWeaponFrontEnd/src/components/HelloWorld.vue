<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <IconButton
      variant="danger"
      icon="suit-spade-fill"
    >Fun Button</IconButton>
    <p>
      For a guide and recipes on how to configure / customize this project,<br>
      check out the
      <a href="https://cli.vuejs.org" target="_blank" rel="noopener">vue-cli documentation</a>.
    </p>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import IconButton from '@/components/IconButton.vue';

@Component({
  components: { IconButton },
})
export default class HelloWorld extends Vue {
  @Prop() private msg!: string;
}
</script>
