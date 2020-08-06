const effectStack = []
let trackMap= new WeakMap() // 存储所有的reactive，所有key对应的依赖
function track(target,key) {
// 收集依赖 
// reactive 可能有多个，每一个可能又有N个属性，所以我们用一个map管理
  const effect = effectStack[effectStack.length-1]
  if (effect) {
    let depMap = trackMap.get(target)
    if (!depMap) {
      // 如果没有，那就是第一次调用的时候，给他初始化
      depMap = new Map()
      trackMap.set(target,depMap)
    }
    let dep = depMap.get(key)
    if(!dep){
      dep = new Set()
      depMap.set(key,dep)
    }
    // 都有，就添加一个需要触发的依赖
    dep.add(effect)
    effect.deps.push(dep)
  }
}
function trigger(target,key,info) {
  // 触发更新
  let depMap = trackMap.get(target)
  if (!depMap) {
    return
  }
  const effects = new Set()
  const computedRunners = new Set()

  if (key) {
    let deps = depMap.get(key)
    deps.forEach(effect =>{
      if (effect.computed) {
        computedRunners.add(effect)
      }else{
        effects.add(effect)
      }
    })
  }
  computedRunners.forEach(computed => computed())
  effects.forEach(effect => effect())
}

function effect(fn,option={}) {
  // {lazy:false,computed:false}
  // 副作用
  // computed 是一个特殊的effect
  let e = createReactiveEffect(fn,option)
  if (!option.lazy) {
    // lazy决定是不是首次执行
    e()
  }
  return e
}
function computed(fn) {
  // computed 是一个特殊的effect
  const runner = effect(fn,{computed:true,lazy:true})
  return{
    effect:runner,
    get value(){
      return runner()
    }
  }
}

const baseHandler = {
  get(target,key){  
    const res = target[key]  // 图方便，真正应该是用reflect更合理
    // 收集一下依赖
    track(target,key)
    return res
  },
  set(target,key,val){
    const info = {oldValue:target[key],newValue:val}
    target[key] = val  // 应该是reflect set
    // 触发更新
    trigger(target,key,info)
  }
  // has
  // onkeys
}
function reactive(target) {
  // 把传进来的对象变为响应式
  const observerd = new Proxy(target,baseHandler)
  return observerd
  
}
function run(effect,fn,args) {
  if(effectStack.indexOf(effect)===-1){
    try{
      effectStack.push(effect) 
      return fn(...args)
    }finally{
      effectStack.pop()
    }
  }
}
function createReactiveEffect(fn,options) {
   const effect = function effect(...args) {
     return run(effect,fn,args)
   }
   // 为了后续清理以及缓存
   effect.deps = []
   effect.computed = options.computed
   effect.lazy = options.lazy
   return effect
}

