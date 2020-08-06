
let actibeEffect

// 收集依赖的类
class Dep{
  constructor(){
    this.subs = new Set()
  }
  depend(){
    // 收集依赖
    if(actibeEffect){
      this.subs.add(actibeEffect)
    }
  }
  notofy(){
    // 数据变化通知执行
    console.log('set');
    this.subs.forEach(effect => effect())
  }
}
const dep = new Dep()   // 在vue3里是一个大map




function effect(fn) {
  actibeEffect = fn
  fn()
}
// ref大概的原理
function ref(val){
  let _value = val
  // ref中最基本的拦截 .value 的操作
  let state = {
    get value(){
      // 获取值，收集依赖
      dep.depend()
      return _value
    },
    set value(newValue){
      // 修改值，通知触发
      _value = newValue
      dep.notofy()
    }
  }
  return state
}
let state = ref(0)

effect(()=>{
  // 这个函数内部，依赖state的变化
  console.log(state.value);
})

setInterval(()=>{
  state.value++
},1000)