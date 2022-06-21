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
      
      this.forceSimulation = d3.forceSimulation(this.graphData.nodes)
        .force('charge', d3.forceManyBody().strength(-24000))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('x', d3.forceX(width / 2).strength(1))
        .force('y', d3.forceY(height / 2).strength(1))
        .force('link', d3.forceLink(this.graphData.links).id((d) => d.id).distance(150).strength(1))
        .on('tick', this.ticked);

      this.link = this.container.append('g').attr('class', 'links')
        .selectAll('line')
        .data(this.graphData.links)
        .enter()
        .append('line')
        .attr('stroke', '#aaa')
        .attr('stroke-width', '1px');

      this.node = this.container
        .append('g')
        .attr('class', 'nodes')
        .selectAll('nodes')
        .data(this.graphData.nodes)
        .enter()
        .append('g')
        .attr('transform', function (d) {
          let cirX = d.x;
          let cirY = d.y;
          return 'translate(' + cirX + ',' + cirY + ')';
        })
        .attr('style', 'cursor: pointer;')
        .call(d3.drag()
          .on('start', this.dragStarted)
          .on('drag', this.dragged)
          .on('end', this.dragEnded)
        );

      this.node
        .append('circle')
        .attr('r', this.setNodeSize)
        .attr('class', 'node')
        .attr('fill', function (d) { return d.group === 'node' ? 'rgb(46, 137, 183)' : 'rgb(47, 153, 60)' })
        .on('mouseover', this.nodeHover)
        .on('mouseout', this.nodeUnhover)
        .on('click', this.nodeClick);

      this.node
        .append('text')
        .attr('class', 'label-node')
        .attr('x', 20)
        .attr('y', -30)
        .attr('dx', this.setTextOffsetX)
        .attr('dy', 5)
        .attr('style', 'font-size: 12px; line-height: 12px; fill: #fff; pointer-events: none;')
        .text(this.setNodeText);
    },
    dragStarted(event, d) {
      if (!event.active) {
        this.forceSimulation.alphaTarget(0.8).restart();
      }
      d.fx = d.x;
      d.fy = d.y;
    },
    dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    },
    dragEnded(event, d) {
      if (!event.active) {
        this.forceSimulation.alphaTarget(0);
      }
      d.fx = null;
      d.fy = null;
    },
    ticked() {
      this.node.call(this.updateNode);
      this.link.call(this.updateLink);
    },
    updateLink(link) {
      link.attr('x1', (d) => { return this.fixna(d.source.x) })
        .attr('y1', (d) => { return this.fixna(d.source.y) })
        .attr('x2', (d) => { return this.fixna(d.target.x) })
        .attr('y2', (d) => { return this.fixna(d.target.y) })
    },
    updateNode(node) {
      node.attr('transform', (d) => {
        return 'translate(' + this.fixna(d.x) + ',' + this.fixna(d.y) + ')';
      })
    },
    fixna(x) {
      if (isFinite(x)) return x;
      return 0;
    },
    setNodeSize(node) {
      if (node.group === 'attribute') return 15;
      return 20;
    },
    setNodeText(node) {
      return node.id.split(':')[1];
    },
    setTextOffsetX(node) {
      return - node.id.split(':')[1].toString().length * 2.5;
    },
    nodeHover(event) {
      event.target.style = 'transform: scale(1.2); opacity: 0.9;';
    },
    nodeUnhover(event) {
      event.target.style = 'transform: scale(1 / 1.2); opacity: 1;';
    },
    nodeClick(event, node) {
      if(node.group === 'node') {
        this.$emit('openDialog', node);
      }
    },
    updateNodes() {

      this.forceSimulation.nodes(this.graphData.nodes);
      this.forceSimulation.force('link').links(this.graphData.links);
      
      console.log(this.node);
      this.node = this.node.data(this.graphData.nodes, function (d) { return d.id });
      console.log(this.node);
      this.node.exit().remove();
      console.log(this.node);
      this.node = this.node
        .enter()
        .append('g')
        .attr('style', 'cursor: pointer;')
        .attr('transform', function (d) {
          let cirX = d.x;
          let cirY = d.y;
          return 'translate(' + cirX + ',' + cirY + ')';
        })
        .call(d3.drag()
          .on('start', this.dragStarted)
          .on('drag', this.dragged)
          .on('end', this.dragEnded)
        )
        .merge(this.node);
      console.log(this.node);

      // this.node = this.node
      //   .append('circle')
      //   .attr('r', this.setNodeSize)
      //   .attr('class', 'node')
      //   .attr('fill', function (d) { return d.group === 'node' ? 'rgb(46, 137, 183)' : 'rgb(47, 153, 60)' })
      //   .on('mouseover', this.nodeHover)
      //   .on('mouseout', this.nodeUnhover)
      //   .on('click', this.nodeClick)
      //   .merge(this.node);
      
      // this.node
      //   .append('text')
      //   .attr('class', 'label-node')
      //   .attr('x', 20)
      //   .attr('y', -30)
      //   .attr('dx', this.setTextOffsetX)
      //   .attr('dy', 5)
      //   .attr('style', 'font-size: 12px; line-height: 12px; fill: #fff; pointer-events: none;')
      //   .text(this.setNodeText);

      this.link = this.link.data(this.graphData.links, function (d) {
        return d.source.id + '-' + d.target.id;
      });
      this.link.exit().remove();
      this.link = this.link
        .enter()
        .append('line')
        .attr('stroke', '#aaa')
        .attr('stroke-width', '1px')
        .merge(this.link);

      this.forceSimulation.nodes(this.graphData.nodes);
      this.forceSimulation.force('link').links(this.graphData.links);
    },
  },
  watch: {
    doc(nv, ov) {
      if (ov.length === 0 || (ov.length > 0 && nv[0]['@id'] !== ov[0]['@id'])) {
        this.svg.selectAll('g').remove();
        this.updateGraph();
      } else {
        this.updateNodes();
      }
    }
  },
}
</script>

<style lang="scss" scoped>
  @import '@/assets/graph/graph-view.scss';
</style>
