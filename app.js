Vue.component('cell-component', {
  template: '#cell-template',
  props: {
    option: {
      type: String
    }
  },
  data() {
    return {
      className: '',
      value: null
    }
  },
  methods: {
    toggleCell(type) {
      if(this.$data.className == '')
        this.$data.className = type;
      else if(this.$data.className == type)
        this.$data.className = '';

      /*if(type.includes(['init', 'finish'])) {
        this.$emit('')
      }*/
    },
    toggleInit() {
      /*for (let i = 0; i < this.$data.table.length; i++) {
        for (let j = 0; j < this.$data.table[i].length; j++) {
          const cell = this.$data.table[i][j];
          if(cell.class == 'init')
            cell.class = '';
        }        
      }*/
    }
  }
})

const store = {

}

var app = new Vue({
  el: '#app',
  data: {
    table: [],
    dimension: 5,
    option: ''
  },
  beforeMount () {
    const table = [];
    for (let i = 0; i < this.$data.dimension; i++) {
      table[i] = [];
      for (let j = 0; j < this.$data.dimension; j++) {
        table[i][j] = null;
      }       
    }
    this.$data.table = table;
  },
  methods: {
    start() {
      alert(1);
    }
  }
})