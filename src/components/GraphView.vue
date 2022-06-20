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
      svg: null,
      container: null,
      forceSimulation: null,
      link: null,
      node: null,
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
            const source = this.nodes[index];
            link.targets.forEach((item) => {
              const target = this.nodes.find((el) => el.id === item);
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
            const source = this.nodes[link.source];
            const target = this.nodes[index];
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
    graphData() {
      return { nodes: this.nodes, links: this.links };
    },
  },
  created() {},
  mounted() {
    this.svg = d3.select('#graph');
    this.svg.attr('width', this.$el.clientWidth).attr('height', this.$el.clientHeight);
    
    window.addEventListener('resize', this.onResizeWindow);

    this.updateGraph();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResizeWindow);
  },
  methods: {
    onResizeWindow() {
      this.svg.attr('width', this.$el.clientWidth).attr('height', this.$el.clientHeight);
    },
    updateGraph() {
      const width = this.$el.clientWidth;
      const height = this.$el.clientHeight;

      this.container = this.svg.append('g');

      this.svg.call(
        d3.zoom()
          .scaleExtent([.1, 4])
          .on('zoom', (d) => { this.container.attr('transform', d.transform) })
      );

      console.log(this.graphData);
      let forceSimulation = d3.forceSimulation(this.graphData.nodes)
        .force('charge', d3.forceManyBody().strength(-3000))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('x', d3.forceX(width / 2).strength(1))
        .force('y', d3.forceY(height / 2).strength(1))
        .force('link', d3.forceLink(this.graphData.links).id((d) => d.id).distance(50).strength(1))
        .on('tick', ticked);

      let link = this.container.append('g').attr('class', 'links')
        .selectAll('line')
        .data(this.graphData.links)
        .enter()
        .append('line')
        .attr('stroke', '#aaa')
        .attr('stroke-width', '1px');

      let node = this.container.append('g').attr('class', 'nodes')
        .selectAll('g')
        .data(this.graphData.nodes)
        .enter()
        .append('circle')
        .attr('r', 5)
        .attr('fill', function (d) { return d.group === 'node' ? 'red' : 'green' })
        .call(d3.drag()
          .on('start', started)
          .on('drag', dragged)
          .on('end', ended)
        );

      function ticked () {
        node.call(updateNode)
        link.call(updateLink)
      }

      function updateLink (link) {
        link.attr('x1', function (d) { return fixna(d.source.x) })
          .attr('y1', function (d) { return fixna(d.source.y) })
          .attr('x2', function (d) { return fixna(d.target.x) })
          .attr('y2', function (d) { return fixna(d.target.y) })
      }

      function updateNode (node) {
        node.attr('transform', function (d) {
          return 'translate(' + fixna(d.x) + ',' + fixna(d.y) + ')'
        })
      }

      function fixna (x) {
        if (isFinite(x)) return x;
        return 0;
      }

      // drag
      function started (event, d) {
        if (!event.active) {
          forceSimulation.alphaTarget(0.8).restart()
        }
        d.fx = d.x
        d.fy = d.y
      }
      function dragged (event, d) {
        d.fx = event.x
        d.fy = event.y
      }
      function ended (event, d) {
        if (!event.active) {
          forceSimulation.alphaTarget(0)
        }
        d.fx = null
        d.fy = null
      }
    },

  },
  watch: {
    // graphData: {
    //   deep: true,
    //   handler(nv) {
    //     this.updateGraph(nv);
    //   },
    // },
    doc() {
      this.svg.selectAll('g').remove();
      this.updateGraph();
    }
  },
}
</script>

<style lang="scss" scoped>
  @import '@/assets/graph/graph-view.scss';
</style>
