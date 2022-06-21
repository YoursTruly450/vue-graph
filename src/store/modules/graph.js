import axios from 'axios';
import { cloneDeep } from 'lodash';

export default ({
  state: {
    docList: [],
    doc: [],
	},
	getters: {
    docListGetter(state) {
      return state.docList;
    },

    docGetter(state) {
      return state.doc;
    }
	},
	mutations: {
    updateDocList(state, docList) {
      state.docList = docList;
    },

    updateDoc(state, doc) {
      state.doc = doc;
    },

    addNode(state, { node, attr }) {
      let index = state.doc[0]['@graph'].findIndex((doc) => doc['@id'] === node.id);
      if (index === -1) {
        state.doc[0]['@graph'].push({ '@id': node.id });
        index = state.doc[0]['@graph'].length - 1;
      }
      const obj = state.doc[0]['@graph'].find((doc) => doc['@id'] === node.id);
      state.doc[0]['@graph'].push({ '@id': attr.name });
      if (Object.prototype.hasOwnProperty.call(obj, 'lego:hasAttribute')) {
        state.doc[0]['@graph'][index]['lego:hasAttribute'].push({ '@id': attr.name });
      } else {
        state.doc[0]['@graph'][index]['lego:hasAttribute'] = [{ '@id': attr.name, 'lego:hasAttribute': [] }];
      }
      state.doc = cloneDeep(state.doc);
    },

    addAttribute(state, { node, attr }) {
      let index = state.doc[0]['@graph'].findIndex((doc) => doc['@id'] === node.id);
      if (index === -1) {
        state.doc[0]['@graph'].push({ '@id': node.id });
        index = state.doc[0]['@graph'].length - 1;
      }
      state.doc[0]['@graph'][index][attr.name] = [{ '@value': attr.value }];
      state.doc = cloneDeep(state.doc);
    },
	},
  actions: {
    fetchDocList(ctx) {
      const url = 'yargy_rules/';
      return axios({
        method: 'GET',
        url: url
      })
        .then((response) => {
          const docList = response.data;
          ctx.commit('updateDocList', docList);
        });
    },

    fetchDoc(ctx, docType) {
      if (!docType) return;
      const url = `get_graph?doc_type=${docType}`;
      return axios({
        method: 'GET',
        url: url,
      })
        .then((response) => {
          const doc = response.data;
          ctx.commit('updateDoc', doc);
        });
    },

    addDocNode(ctx, { node, attr }) {
      ctx.commit('addNode', { node, attr });
    },

    addNodeAttribute(ctx, { node, attr }) {
      ctx.commit('addAttribute', { node, attr });
    },
  },
})