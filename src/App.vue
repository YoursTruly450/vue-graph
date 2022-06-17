<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
  @import '@/assets/main.scss';

  html, body {
    display: block;
    width: 100vw;
    height: 100vh;
    @include font-type(14px, 18px, #fffafa, normal);
    background-color: #222;
  }

  html, body, h1, h2, section, nav, input, select, p, a, div, ul, li {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  a {
    text-decoration: none;
    color: #ffffff;
  }

  ::-webkit-scrollbar {
    width: 5px;
    height: 5px;
    background-color: transparent;
  }

  ::-webkit-scrollbar-thumb {
    width: 5px;
    background-color: #023020;
    border-radius: 5px;
  }

  ::-webkit-scrollbar-track {
    width: 0px;
    background-color: #000000;
    border-radius: 5px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: #629727;
  }
</style>
