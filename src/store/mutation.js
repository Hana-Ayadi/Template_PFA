const generate = require('nanoid/generate')

export default {
    // ?????????
  select (state, payload) {
    state.uuid = payload.uuid
    if (payload.uuid === -1) {
      state.activeElement = state.page
      state.type = 'page'
    } else {
      let widget = state.widgets.find(w => w.uuid === payload.uuid)
      state.activeElement = widget
      state.type = widget.type
    }
  },

    // ?? mousemove ??????
  initmove (state, payload) {
    state.startX = payload.startX
    state.startY = payload.startY
    state.originX = payload.originX
    state.originY = payload.originY
    state.moving = true
  },

    // ??????
  stopmove (state) {
    state.moving = false
  },

    // ????
  move (state, payload) {
    var target = state.activeElement
    var dx = payload.x - state.startX
    var dy = payload.y - state.startY
    var left = state.originX + Math.floor(dx * 100 / state.zoom)
    var top = state.originY + Math.floor(dy * 100 / state.zoom)

    target.left = left > 0 ? left : 0
    target.top = top > 0 ? top : 0
  },

    // ??????
  resize (state, payload) {
    var dx = payload.x - state.startX
    var dy = payload.y - state.startY
    var value

    if (payload.type === 'right') {
      value = state.originX + Math.floor(dx * 100 / state.zoom)
      state.activeElement.width = value > 10 ? value : 10
      return
    }

    if (payload.type === 'down') {
      value = state.originX + Math.floor(dy * 100 / state.zoom)
      state.activeElement.height = value > 10 ? value : 10
      return
    }

    if (payload.type === 'left') {
      var left = state.originX + Math.floor(dx * 100 / state.zoom)
      var width = state.originY - Math.floor(dx * 100 / state.zoom)
      state.activeElement.left = left > 0 ? left : 0
      state.activeElement.width = width > 10 ? width : 10
      return
    }

    if (payload.type === 'up') {
      var top = state.originX + Math.floor(dy * 100 / state.zoom)
      var height = state.originY - Math.floor(dy * 100 / state.zoom)
      state.activeElement.top = top > 0 ? top : 0
      state.activeElement.height = height > 10 ? height : 10
    }
  },

    // ????
  copy (state, payload) {
    if (state.type !== 'page') {
      var copy = Object.assign({}, state.activeElement, {top: state.top, uuid: generate('1234567890abcdef', 10)})

            // ?????????????,?????????
      if (state.activeElement.isContainer) {
        var name = state.activeElement.name
        if (name) {
                    // ?????????
          var copyName = name.split('-')[0] + '-' + state.counter
          copy.name = copyName

                    // ???????????
          for (var i = 0, len = state.widgets.length; i < len; i++) {
            if (state.widgets[i].belong === name) {
              state.widgets.push(
                                Object.assign({}, state.widgets[i], { belong: copyName })
                            )
            }
          }

          state.counter += 1
        }
      }

      state.widgets.push(copy)
    }
  },

    // ?????? top ?
  updateSrollTop (state, top) {
    state.top = top
  },

    // ????
  zoom (state, val) {
    state.zoom = val
  },

    // ???????
  initActive (state) {
    state.activeElement = state.page
  },

    // ??????
  delete (state) {
    var type = state.type
    if (type === 'page') return

        // ????????,??????????
    if (state.activeElement.isContainer) {
      var name = state.activeElement.name

      for (var i = 0; i < state.widgets.length; i++) {
        if (state.widgets[i].belong === name) {
          state.widgets.splice(i, 1)
        }
      }
    }

        // ????
    state.widgets.splice(state.index, 1)

        // ?? activeElement
    state.activeElement = state.page
        // state.type = 'page'
    state.uuid = -1
  },

    // ????
  addWidget (state, { data: data = null, item }) {
    let def = { top: state.top, uuid: generate('1234567890abcdef', 10) }
    let setting = JSON.parse(JSON.stringify(item.setting))

    if (setting.isContainer) {
      setting.name = def.uuid
    }

    if (data) {
      data.forEach(function (val) {
        state.widgets.push(Object.assign(setting, val, def))
      })
    } else {
      state.widgets.push(Object.assign(setting, def))
    }
  },

    // ????
  replaceImage (state, payload) {
    state.activeElement.width = payload[0].width
    state.activeElement.url = payload[0].url
  },

    // ???????
  addContainerBackPic (state, payload) {
    state.activeElement.backPic = payload[0].url
    state.activeElement.backPicUrl = payload[0].src
    state.activeElement.width = payload[0].width
    state.activeElement.height = payload[0].height
  },

    // ?????
  addBackPic (state, payload) {
    state.activeElement.backPic = payload[0].url
    state.activeElement.backPicUrl = payload[0].src
  },

    // ????
  addAnimation (state) {
    state.animation.push({
      name: '',
      duration: 3,
      delay: 0,
      iteration: 1,
      timing: 'linear',
      direction: 'normal',
      fill: 'none',
      keyframes: [
        {
          stop: 0,
          css: ''
        }
      ]
    })
  },

    // ????? keyframe
  addkeyframe (state, name) {
    state.animation.map(val => {
      if (val.name === name) {
        val.keyframes.push({
          stop: 0,
          css: ''
        })
      }
    })
  },

    // ????????
  setAnimation (state, status) {
    state.playState = status
  },

    // ????????
  setCurrentImage (state, status) {
    state.currentImage = status
  },
  addImage (state, status) {
    // console.log(state.swiperSlides)
    state.swiperSlides.push(status)
    console.log(status)
  },
  setVisibility (state, status) {
    state.visible = status
  },
    // ????
  updateData (state, {uuid, key, value}) {
    let widget = state.widgets.find(w => w.uuid === uuid)
    widget[key] = value
  }
}
