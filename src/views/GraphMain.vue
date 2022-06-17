<template>
  <div class="graph-main">
    <div class="doc-list">
      <h2 class="doc-list__header">Список графов</h2>
      <div class="doc-list__search">
        <input
          type="text"
          v-model="searchGraph"
          class="doc-list__input"
          placeholder="Искать ..."
        >
      </div>
      <div
        class="doc-list__container"
        v-if="docList.length > 0"
      >
        <div
          class="doc-list__doc"
          v-for="doc in docList"
          :key="doc.id"
          @click="selectDoc(doc)"
        >
          <svg data-v-34be2947="" data-v-059ce220="" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 16 13" aria-labelledby="folder" role="presentation" class="icon"><!----><g data-v-34be2947=""><path id="folde" d="M4.748,0c0.235,0 0.437,0.025 0.606,0.074c0.169,0.05 0.32,0.111 0.453,0.184c0.133,0.073 0.252,0.154 0.356,0.242c0.104,0.089 0.21,0.17 0.317,0.243c0.106,0.073 0.221,0.134 0.344,0.183c0.122,0.05 0.264,0.075 0.426,0.075l7.754,0c0.141,0 0.271,0.026 0.391,0.078c0.12,0.052 0.225,0.124 0.317,0.215c0.091,0.091 0.162,0.196 0.215,0.316c0.052,0.12 0.078,0.25 0.078,0.391l0,10.006l-16.01,0l0,-11.006c0,-0.141 0.026,-0.271 0.078,-0.391c0.053,-0.12 0.124,-0.226 0.215,-0.317c0.092,-0.091 0.197,-0.163 0.317,-0.215c0.12,-0.052 0.25,-0.078 0.391,-0.078l3.752,0Zm-3.752,1.001l0,1l3.752,0c0.125,0 0.235,-0.012 0.328,-0.035c0.094,-0.023 0.18,-0.057 0.258,-0.102c0.079,-0.044 0.155,-0.096 0.231,-0.156c0.076,-0.06 0.158,-0.129 0.246,-0.207c-0.088,-0.078 -0.17,-0.147 -0.246,-0.207c-0.076,-0.06 -0.152,-0.112 -0.231,-0.157c-0.078,-0.044 -0.164,-0.078 -0.258,-0.101c-0.093,-0.024 -0.203,-0.035 -0.328,-0.035l-3.752,0Zm14.008,1l-7.754,0c-0.162,0 -0.304,0.025 -0.426,0.074c-0.123,0.05 -0.238,0.111 -0.344,0.184c-0.107,0.073 -0.213,0.154 -0.317,0.242c-0.104,0.089 -0.223,0.17 -0.356,0.243c-0.133,0.073 -0.284,0.134 -0.453,0.184c-0.169,0.049 -0.371,0.074 -0.606,0.074l-3.752,0l0,8.005l14.008,0l0,-9.006Z" style="fill: rgb(255, 255, 255); fill-rule: nonzero;"></path></g></svg>
          {{doc.name}}
        </div>
      </div>
      <div class="doc-list__container" v-else>
        Ничего не найдено
      </div>
    </div>
    <graph-view
      :doc="doc"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import GraphView from '../components/GraphView.vue';

export default {
  name: 'GraphMain',
  components: {
    GraphView,
  },
  data() {
    return {
      searchGraph: '',
    };
  },
  computed: {
    ...mapGetters(['docListGetter', 'docGetter']),
    docList() {
      return this.searchGraph === '' ? this.docListGetter : this.docListGetter.filter((doc) => doc.name.includes(this.searchGraph));
    },
    doc() {
      return this.docGetter;
    }
  },
  created() {
    this.fetchDocList();
  },
  methods: {
    ...mapActions(['fetchDocList', 'fetchDoc']),
    selectDoc(doc) {
      this.fetchDoc(doc.name);
    },
  },
}
</script>

<style lang="scss" scoped>
  @import '@/assets/graph/graph-main.scss';
</style>
