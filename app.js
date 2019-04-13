Vue.component('cell-component', {
  template: '#cell-template',
  props: {
    option: {
      type: String
    },
    position: {
      type: Object
    }
  },
  data() {
    return {
      className: '',
      value: null,
      isFinish: false,
      isInit: false
    }
  },
  methods: {
    toggleCell(type) {
      if(this.$data.className === '')
        this.$data.className = type;
      else if(this.$data.className === type)
        this.$data.className = '';    
      
      if(type === 'finish')
        this.$data.isFinish = !this.$data.isFinish;
      if(type === 'init')
        this.$data.isInit = !this.$data.isInit;
      }
  }
})

var app = new Vue({
  el: '#app',
  data: {
    table: [],
    dimension: 20,
    option: 'block',
    isComplete: false
  },
  // Create a table
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
    /**
     * Search the exit
     * @param {Number} value Iteration
     */
    search(value) {
      for (let index = 0; index < this.$children.length; index++) {
        const cell = this.$children[index];
        if(cell.className === 'block')
          continue;
        
        if(cell.value === null && cell.className === 'init' && !cell.isFinish) {
          cell.value = value;
          cell.className = 'visited';
          this.updateNear(cell.position.i + 1, cell.position.j);
          this.updateNear(cell.position.i - 1, cell.position.j);
          this.updateNear(cell.position.i, cell.position.j + 1);
          this.updateNear(cell.position.i, cell.position.j - 1);
        } else if(cell.value === null && cell.className === 'init' && cell.isFinish) {
          this.$data.isComplete = true;
          cell.value = value;
        }
      }

      this.changeNextToInit();

      if(this.$data.isComplete || value > 1000) {
        if(value>1000)
          console.error('Infinite loop :(')
        this.drawRoute();
        this.clear();
      } else {
        this.$nextTick(() => {
          setTimeout(() => {
            this.search(value+1);
          }, 200);
        })
      }      
    },
    /**
     * Change all 
     */
    changeNextToInit() {
      for (let index = 0; index < this.$children.length; index++) {
        const cell = this.$children[index];
        if(cell.className === 'next') {
          cell.className = 'init';
        }
      }
    },
    /**
     * To get the next cell
     * @param {Number} i row
     * @param {Number} j Col
     */
    updateNear(i, j) {
      for (let index = 0; index < this.$children.length; index++) {
        const cell = this.$children[index];
        if(cell.className === 'block')
          continue;
          
        if(cell.value === null && cell.position.i === i && cell.position.j === j) {
          cell.className = 'next';
        }
      }
    },
    /**
     * Draw the best route
     */
    drawRoute() {
      for (let index = 0; index < this.$children.length; index++) {
        const cell = this.$children[index];
        if(cell.value !== null && cell.isFinish) {
          cell.className = 'finish';
          this.comeBack(cell.position.i + 1, cell.position.j, cell.value - 1);
          this.comeBack(cell.position.i - 1, cell.position.j, cell.value - 1);
          this.comeBack(cell.position.i, cell.position.j + 1, cell.value - 1);
          this.comeBack(cell.position.i, cell.position.j - 1, cell.value - 1);
        }
      }
    },
    /**
     * Come back for the short route
     * @param {Number} i row
     * @param {Number} j col
     * @param {Number} value Iteration
     */
    comeBack(i, j, value) {
      if(value < 0)
        return;

      for (let index = 0; index < this.$children.length; index++) {
        const cell = this.$children[index];
        if(cell.className === 'block')
          continue;
          
        if(cell.value !== null && cell.className === 'visited' && cell.value === value &&
          cell.position.i === i && cell.position.j === j) {
          if(cell.value === 0) {
            cell.className = 'init';
            return;
          }
          cell.className = 'complete';
          this.comeBack(i + 1, j, value - 1);
          this.comeBack(i - 1, j, value - 1);
          this.comeBack(i, j + 1, value - 1);
          this.comeBack(i, j - 1, value - 1);
        }
      }
      
    },
    /**
     * Clear the table
     */
    clear() {
      for (let index = 0; index < this.$children.length; index++) {
        const cell = this.$children[index];
        if(cell.className === 'visited' || (cell.className === 'init' && cell.value === null)) {
          cell.className = '';
        }
      }
    }
  }
})