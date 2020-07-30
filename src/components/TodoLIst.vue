<template>
  <div class="todolist">
    <input :class="top>500?'fixed':''" type="text" v-model="state.newTodos" @keyup.enter="addNewTodo">
    <!-- {{top}} -->
    <ul>
      <li v-for="todo in state.todos" :key="todo.id">{{todo.title}}</li>
    </ul>
  </div>
</template>
<script>
import {reactive} from 'vue'
import scroll from '../scroll'
export default {
  setup(){
      //reactive作用是让对象变为响应式
      const state = reactive({
        newTodos:'',
        todos:[
          {id:'1',title:'吃饭',computed:false},
          {id:'2',title:'睡觉',computed:false},
          {id:'3',title:'打豆豆',computed:false},
          {id:'4',title:'打豆豆',computed:false},
          {id:'5',title:'打豆豆',computed:false},
          {id:'6',title:'打豆豆',computed:false},
          {id:'7',title:'打豆豆',computed:false},
          {id:'8',title:'打豆豆',computed:false},
        ]
      })
      const addNewTodo=()=>{
          const val = state.newTodos
          if(!val){
            return
          }
          state.todos.push({
            id:state.todos.length+1,title:val,computed:false
          })
          state.newTodos = ''
      }
      const {top} = scroll()
      return {state,addNewTodo,top}
  }
}
</script>

<style>
li{
  height: 100px;
}
.fixed{
  position: fixed;
  top: 50px;
  left:50%
}
</style>