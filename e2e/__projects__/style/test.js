// TODO: Support styles
//
import { nextTick, createApp, h, createComponent } from 'vue'

// import Stylus from './components/Stylus.vue'
// import Scss from './components/Scss.vue'
// import Sass from './components/Sass.vue'
import Less from './components/Less.vue'
//import PostCss from './components/PostCss.vue'
//import External from './components/External.vue'

function mount(Component, props, slots) {
  const html = document.getElementsByTagName('html')[0]
  html.innerHTML = ''
  const head = document.createElement('head')
  html.appendChild(head)
  const body = document.createElement('body')
  html.appendChild(body)

  const styleElems = Component.styles.map(style => {
    const elem = document.createElement('style')
    elem.innerText = style
    return elem
  })
  styleElems.forEach(styleElem => head.appendChild(styleElem))
  const el = document.createElement('div')
  body.appendChild(el)

  el.id = 'app'

  const Parent = {
    render() {
      return h(Component, props, slots)
    }
  }
  const app = createApp(Parent)
  app.mount(el)
  console.log(el.id)
  return app
}

test('processes Less', async () => {
  const app = mount(Less)
  await nextTick()
  const container = app._container
  const cs = window.getComputedStyle(app._container)
  console.log(container.classList)
  //expect(cs['background-color']).toBe('#4D926F');
})

xtest('processes PostCSS', () => {
  mount(PostCss)
  // expect(wrapper.is('section')).toBeTruthy()
  // expect(wrapper.vm.$style.a).toEqual('a')
  // expect(wrapper.vm.$style.b).toEqual('b')
})

xtest('processes Sass', () => {
  mount(Sass)
  // expect(wrapper.vm.$style.a).toEqual('a')
  // expect(wrapper.vm.$style.b).toEqual('b')
  // expect(wrapper.vm.$style.c).toEqual('c')
  // expect(wrapper.vm.$style.light).toBeUndefined()
})

xtest('processes SCSS with resources', () => {
  mount(Scss)
  // expect(wrapper.vm.$style.a).toEqual('a')
  // expect(wrapper.vm.$style.b).toEqual('b')
  // expect(wrapper.vm.$style.c).toEqual('c')
})

xtest('process Stylus', () => {
  mount(Stylus)
  // expect(wrapper.vm).toBeTruthy()
  // expect(wrapper.vm.css.a).toEqual('a')
  // expect(wrapper.vm.$style.b).toEqual('b')
})

xtest('process External', () => {
  mount(External)
  // expect(wrapper.vm).toBeTruthy()
  // expect(wrapper.vm.$style.xtestClass).toEqual('xtestClass')
  // expect(wrapper.vm.css.a).toEqual('a')
})
