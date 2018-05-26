<template>
    <div class="app">
        <navbar></navbar>
        <div class="body container grid-xl">
            <div class="columns col-gapless">
                <toolbar class="toolbar column" :zoom="zoom"></toolbar>
                <div class="viewport column">
                    <viewport :zoom="zoom"></viewport>
                    <div class="zoom-wrap">
                        <slider @input="dozoom" :value="zoom" :step="1" :tuning="false" />
                        <div class="zoom-value">{{ zoom }}%</div>
                    </div>
                </div>
                <panel class="control-panel column"></panel>
            </div>
        </div>
        <uploader :upload="upload" :uploadOption="uploadOption"></uploader>
        <toast></toast>
    </div>
</template>
<script>
    import Vue from 'vue'
    import store from '../store'
    import widget from '../plugins/widget'
    import navbar from './navbar.vue'
    import toolbar from './toolbar.vue'
    import panel from './panel/index.vue'
    import viewport from './viewport/index.vue'
    import slider from './slider.vue'
    import toast from './toast.vue'
    import uploader from './uploader.vue'
    import popbox from './popbox.vue'
    import icon from './icon.vue'

    import loadSprite from '../utils/load-sprite'
    export default {
      name: 'vue-page-designer',
      store,
      components: {
        icon, // 右侧参数面板
        navbar, // 顶部导航栏
        toolbar, // 左侧菜单栏
        panel, // 右侧参数面板
        slider, // 右侧参数面板
        toast, // 右侧参数面板
        uploader, // 右侧参数面板
        popbox, // 右侧参数面板
        viewport // 页面画布
      },
      props: {
        value: Object,
        widgets: Object,
        upload: Function,
        uploadOption: Object
      },
      beforeCreate () {
            // TODO: custom svg path by config
        loadSprite('//unpkg.com/vue-page-designer/dist/icons.svg', 'svgspriteit')
      },
      created () {
            // 注册 widgets
        Vue.use(widget, {
          widgets: this.widgets
        })
            // Initialiser les données existantes
        if (this.value) {
          store.replaceState(this.value)
        }
        store.$on('save', () => {
          this.$emit('save', store.state)
        })
      },
      mounted () {
            // Initialiser le composant sélectionné (la page en tant que composants sélectionnés initiaux)
        this.$store.commit('initActive')
      },

      methods: {
        dozoom (val) {
          this.$store.commit('zoom', val)
        }
      },

      computed: {
        zoom () {
          return this.$store.state.zoom
        }
      }
    }
</script>

<style lang="scss">
    .body {
        width: 100%;
        height: calc(100% - 54px);
        overflow: hidden;
        flex-direction: row;
        &.container {
            padding: 0;
        }
    }
    .columns {
        height: 100%;
    }
    .toolbar,
    .viewport,
    .control-panel {
        height: 100%;
    }
    .toolbar {
        background: #fff;
        user-select: none;
        box-sizing: content-box;
        &.column {
            flex: none;
            width: 120px;
        }
    }
    .viewport {
        position: relative;
        overflow: hidden;
    }
    .control-panel {
        background: #fff;
        user-select: none;
        &.column {
            flex: none;
            width: 300px;
        }
    }
    .zoom-wrap {
        width: 200px;
        height: 30px;
        position: absolute;
        bottom: 20px;
        right: 20px;
        opacity: 0;
        transition: opacity 0.3s;
    }
    .viewport:hover .zoom-wrap {
        opacity: 1;
    }
    .zoom-value {
        position: absolute;
        top: 4px;
        left: -36px;
    }
    #svgspriteit {
        position: absolute;
        z-index: -1;
        opacity: 0;
    }
</style>
