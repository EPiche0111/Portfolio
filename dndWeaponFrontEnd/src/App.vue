<template>
  <div id="app">
    <b-navbar class="mb-4 border border-bottom" >
      <b-navbar-brand href="/" class="display-1">Dnd Weapon Creator</b-navbar-brand>
      <b-navbar-nav>
        <b-nav-item to="/" exact-active-class="active" >Home</b-nav-item> |
        <b-nav-item to="/weapon-creation" exact-active-class="active"> Create </b-nav-item> |
        <b-nav-item to="/weapon-selection" exact-active-class="active"> Weapon Selection </b-nav-item>
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto">
        <user-account/>
      </b-navbar-nav>
    </b-navbar>
    <router-view class="container-xl"/>
  </div>
</template>
<script setup lang="ts">
import UserAccount from '@/components/UserAccount.vue';
</script>
