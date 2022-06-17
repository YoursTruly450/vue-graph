<template>
  <div class="graph-view">
    {{links}}
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
  computed: {
    links() {
      let arr = [];
      if (this.doc.length > 0 && this.doc[0]['@graph']) {
        const nodes = this.doc[0]['@graph'];
        if (nodes.length > 0) {
          nodes.forEach((link, index) => {
            const source = {
              id: link['@id'],
              index,
            };
            Object.keys(link).forEach((key) => {
              if (key !== '@id') {
                let target;
                if (key !== 'lego:hasAttribute') {
                  target = {
                    id: key,
                    index: nodes.findIndex((el) => el['@id'] === key),
                  }
                  arr.push({ source, target, value: key, group: 'attribute' });
                } else {
                  link[key].forEach((attribute) => {
                    const id = attribute['@id'];
                    target = {
                      id,
                      index: nodes.findIndex((el) => el['@id'] === id),
                    };
                    arr.push({ source, target, value: id, group: 'main' });
                  })
                }
              }
            })
          });
        }
      }
      console.log(arr);
      return arr;
    },
    nodes() {
      return [];
    },
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
