<template>
  <div class="holder" id="viewport">
    <div class="screen"
      @dblclick="replaceImage"
      :style="{
        backgroundColor: backgroundColor,
        height: height + 'px',
        transform: 'scale(' + zoom / 100 + ')'
      }">

      <!-- Composant -->

        <!-- require('../../../assets/'+backgroundID+'.png') -->

        <component id="image1"
                   :is="val.type"
                   :data-title="val.type"
                   class="layer"
                   :class="{'g-active': id === val.uuid}"
                   v-for="val in widgetStore"
                   :key="val.uuid"
                   :val="val"
                   :h="750"
                   :w="750"
                   :data-type="val.type"
                   :data-uuid="val.uuid"
                   :playState="playState"
                   :style="{backgroundImage: 'url('+currentImage+')'}"
        >
            <!-- require('../../../assets/'+backgroundID+'.png') -->
            <component
                    v-if="val.isContainer"
                    :is="child.type"
                    :data-title="child.type"
                    class="layer layer-child"
                    :class="{'g-active': id === child.uuid}"
                    v-for="child in getChilds(val.name)"
                    :key="child.uuid"
                    :val="child"
                    :h="height"
                    :w="750"
                    :data-type="child.type"
                    :data-uuid="child.uuid"
                    :playState="playState"
            />
        </component>
        <VueDragResize :isActive="true"  v-on:resizing="resize" :w="200" :h="200"
                       v-on:dragging="resize" :style="{visibility: visible}" id="video" :visible="visible" >
            <h4>top : {{ top }} х left: {{ left }} </h4>
            <h4>width : {{ width }} х height :{{ heightRec }}</h4>
            <proj :width="width" :left="left" :height="heightRec" :top ="top"></proj>

        </VueDragResize>

      <!-- Ligne de référence -->
      <ref/>

      <!-- Contrôleur de taille -->
      <control/>
    </div>
  </div>
</template>

<!-- Initialize Swiper -->
<script>
  import Vue from 'vue'
  import proj from '../panel/proj'
  import VueDragResize from 'vue-drag-resize'
import store from '../../store'
import ref from './ref-lines.vue'
import control from './size-control.vue'
import { move } from '../../mixins'
import VueAwesomeSwiper from 'vue-awesome-swiper'

// require styles
import 'swiper/dist/css/swiper.css'

Vue.use(VueAwesomeSwiper /* { default global options } */)

export default {
  name: 'viewport',
  components: {
    ref: ref, // Ligne de référence
    control: control, // Contrôle de taille
    VueDragResize: VueDragResize,
    proj: proj
  },

  mixins: [move],

  props: ['zoom', 'currentImage', 'visible'],

  data () {
    return {
      swiperOption: {
        pagination: {
          el: '.swiper-pagination',
          type: 'progressbar'
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
          loop: true
        }
      },
      width: 0,
      heightRec: 0,
      top: 0,
      left: 0,
      swiperSlides: [1, 2, 3, 4, 5]
    }
  },

  mounted () {
    document.getElementById('video').style.visibility = 'hidden'
    // this.$refs.videoRef.play();
  setInterval(() => {
    console.log('simulate async data')
    if (this.swiperSlides.length < 10) {
      this.swiperSlides.push(this.swiperSlides.length + 1)
    }
  }, 3000)
  // Utiliser l'agent d'événement pour surveiller l'opération sélectionnée du composant
  document
      .getElementById('viewport')
      .addEventListener('mousedown', this.handleSelection, false)

    // Clavier attaché vers le haut, le bas, la gauche et la droite pour le mouvement des composants
    document.addEventListener(
      'keydown',
      e => {
        e.stopPropagation()
        var target = this.$store.state.activeElement

        // 左
        if (e.keyCode === 37 && target.left) {
          target.left -= 1
          return
        }
        // 上
        if (e.keyCode === 38 && target.top) {
          e.preventDefault()
          target.top -= 1
          return
        }
        // 右
        if (e.keyCode === 39 && target.left) {
          target.left += 1
          return
        }

        // 下
        if (e.keyCode === 40 && target.top) {
          e.preventDefault()
          target.top += 1
        }
      },
      true
    )
  },

  methods: {
    resize (newRect) {
      this.width = newRect.width
      this.heightRec = newRect.height
      this.top = newRect.top
      this.left = newRect.left
  },
    handleSelection (e) {
      var target = e.target
      var type = target.getAttribute('data-type')

      if (type) {
        var uuid = target.getAttribute('data-uuid')

        // Définir l'élément sélectionné
        this.$store.commit('select', {
          uuid: uuid || -1
        })

        // 绑定移动事件：只有从属于 page 的，除背景图以外的元件才能移动
        target = this.$store.state.activeElement
        if (target.belong === 'page' && target.dragable) {
          this.initmovement(e) // 参见 mixins
        }
      } else {
        // 取消选中元素
        this.$store.commit('select', {
          uuid: -1
        })
      }
    },

    // Remplacer l'image
    replaceImage (e) {
      if (this.$store.state.activeElement.isUpload) {
        this.$store.$emit('upload', payload => {
          this.$store.commit('replaceImage', payload)
        })
      }
    },

    // Obtenir des composants enfants
    getChilds (name) {
      return this.$store.state.widgets.filter(
        item => item.belong === name
      )
    }
  },

  computed: {
    // Composant ajouté
    widgetStore () {
      return this.$store.state.widgets.filter(item => item.belong === 'page')
    },

    // 画布高度
    height () {
      return this.$store.state.page.height
    },

    // 页面背景色
    backgroundColor () {
      return this.$store.state.page.backgroundColor
    },

    // 选中项id
    id () {
      // var type = this.$store.state.type
      // var index = this.$store.state.index
      // index = index >= 0 ? index : ''
      // return type + index
      return this.$store.state.uuid
    },

    // 动画播放状态
    playState () {
      return this.$store.state.playState
    }
  }
}
</script>

<style scoped>


.holder {
  display: flex;
  justify-content: center;
  height: 100%;
  overflow: auto;
  font-size: 0;
  border: 1px solid #f5f5f5;
  border-width: 0 1px;
  background-image: linear-gradient(
      45deg,
      #f5f5f5 25%,
      transparent 0,
      transparent 75%,
      #f5f5f5 0
    ),
    linear-gradient(
      45deg,
      #f5f5f5 25%,
      transparent 0,
      transparent 75%,
      #f5f5f5 0
    );
  background-position: 0 0, 13px 13px;
  background-size: 26px 26px;
}
.screen {
  width: 950px;
  margin: 25px auto;
  transform-origin: center top;
  position: relative;
}
</style>
