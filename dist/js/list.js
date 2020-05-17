Vue.component('key-list', {
  props: {},
  template: `
    <div>
      <button v-on:click="addKey">Add Keyword</button>
      <ol>
        <li v-for="(listItem, index)  in list" :key="listItem.id">
          {{ listItem.keyword }}
          <button v-on:click="show(index)">Options</button>
          <button v-show="listItem.seen" v-on:click="changeKey(index)">Edit</button>
          <button v-show="listItem.seen" v-on:click="deleteItem(index)">Delete</button>
        </li>
      </ol>
    </div>
  `,
  data() {
    return {
      number: 0,
      list: [ {id:'002', keyword:'nya', path:'./audio/sth.ogg', seen: false} ],
      selectedItem: 0
    }
  },
  methods: {
    addKey: function () {
      window.location = "./record.html";
    },

    show: function (index) {
      this.selectedItem = index;
      this.list[this.selectedItem].seen = !this.list[this.selectedItem].seen;
    },

    changeKey: function (index) {
      this.selectedItem = index;
      var newKey = prompt('Change Keyword', '');
      if (newKey == null || newKey == '') {
        console.log('Nth entered');
      } else {
        this.list[this.selectedItem].keyword = newKey;        
      }
      $.ajax({
        type: "GET",
        url: "./changeKey",
        data: {
          id: this.list[this.selectedItem].id, 
          key: newKey
        },
        success: function (result) {
          console.log(result);
        }
      });
    },

    deleteItem: function(index) {
      $.ajax({
        type: "GET",
        url: "./deleteKey",
        data: {
          id: this.list[this.selectedItem].id
        },
      });

      $.ajax({
        type: "GET",
        url: "./keyword",
        data: '',
        success: (result) => {
          result.forEach(element => {
            element.seen = false;
          })
          this.list = result;
          console.log(this.list);
        },
        error: function () {console.log("failed");}
      });
    }
  },
  mounted: function () {
    $.ajax({
      type: "GET",
      url: "./keyword",
      data: '',
      success: (result) => {
        result.forEach(element => {
          element.seen = false;
        })
        this.list = result;
        console.log(this.list);
      },
      error: function () {console.log("failed");}
    });
  }
})

var app = new Vue({
  el: "#keyword-list",
})
