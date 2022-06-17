import axios from 'axios';

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
    }
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
          console.log(doc);
          ctx.commit('updateDoc', doc);
        });
    },
  },
})