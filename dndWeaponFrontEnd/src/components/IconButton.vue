<template>
  <b-button :variant="variant" :disabled="disabled" @click="$emit('click')">
    <b-icon :icon="icon"/>
  </b-button>
</template>

<script lang="ts">

import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class IconButton extends Vue {
  @Prop() private readonly variant! : string;

  @Prop() private readonly disabled! : boolean;

  @Prop({ default: 'app' }) private readonly icon! : string;
}
</script>
