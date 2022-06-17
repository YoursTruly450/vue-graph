<template>
  <div class="graph-view">
    {{nodes}}
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
    nodes() {
      let arr =[];
      if (this.doc.length > 0 && this.doc[0]['@graph']) {
        const nodes = this.doc[0]['@graph'];
        arr = nodes.map((el, index) => {
          const targets = el['lego:hasAttribute'] ? el['lego:hasAttribute'].map((target) => target['@id']) : [] ;
          return {
            id: el['@id'],
            index,
            group: 'node',
            targets,
          }
        });
        const attr = [];
        nodes.forEach((el, index) => {
          Object.keys(el).forEach((key) => {
            if (key !== '@id' && key !== 'lego:hasAttribute') {
              const id = key;
              const value = el[key][0]['@value'];
              const group = 'attribute';
              arr.push({ id, value, source: index, group });
            } else if(key === 'lego:hasAttribute') {
              el[key].forEach((item) => {
                const id = item['@id'];
                if(arr.findIndex((a) => a.id === id) === -1) {
                  const group = 'node';
                  arr.push({ id, group });
                }
              })
            }
          });
        });
        arr= arr.concat(attr);
      }
      return arr;
    },
    links() {
      let arr = [];
      if (this.nodes.length > 0) {
        this.nodes.forEach((link, index) => {
          if(link.targets && link.targets.length > 0)  {
            const source = {
              index,
              id: link.id
            };
            link.targets.forEach((item) => {
              const target = {
                index: this.nodes.findIndex((el) => el.id === item),
                id: item,
              }
              const ind = arr.length;
              arr.push({
                index: ind,
                source,
                target,
                name: item,
              });
            });
          }
          if(link.source || link.source === 0) {
            const source = {
              index: link.source,
              id: this.nodes[link.source].id
            };
            const target = {
              index,
              id: link.id
            };
            const ind = arr.length;
            arr.push({
              index: ind,
              source,
              target,
              name: link.id
            });
          }
        });
      }
      return arr;
    },
  },
  created() {},
  mounted() {
    this.svgContainer = d3.select('#graph');
    this.svgContainer.attr('width', this.$el.clientWidth).attr('height', this.$el.clientHeight);

    window.addEventListener('resize', this.onResizeWindow);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResizeWindow);
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
