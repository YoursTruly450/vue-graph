<template>
  <div class="graph-view">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      id="graph"
    >
    </svg>
  </div>
</template>

<script>
import * as d3 from 'd3';

export default {
  name: 'GraphMain',
  components: {},
  props: {
    doc: { type: Array },
  },
  data() {
    return {
      svgContainer: null,
    };
  },
  created() {},
  mounted() {
    this.svgContainer = d3.select('#graph');
    this.svgContainer.attr('width', this.$el.clientWidth).attr('height', this.$el.clientHeight);

    window.addEventListener('resize', this.onResizeWindow);
  },
  beforeDestroy() {
    window.removeEventListener('resize');
  },
  methods: {
    onResizeWindow() {
      this.svgContainer.attr('width', this.$el.clientWidth).attr('height', this.$el.clientHeight);
    },
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/graph/graph-view.scss';
</style>
