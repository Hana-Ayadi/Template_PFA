<template>
  <div class="menu-bar">
    <details open>
      <summary><icon name="list" />Actions Disponible</summary>
      <ul class="widget-list columns" @mousedown="updateSrollTop">
        <li class="menu-item column col-6" @click="(e) => {addWidget(e, item)}" v-for="item in widgets" :key="item.name">
          <icon :svg="item.icon" :title="item.title" />
          <span class="menu-caption">{{item.title}}</span>
        </li>
      </ul>
    </details>

  </div>
</template>

<script>
    import widget from '../plugins/widget'
    import { move } from '../mixins'
    import { cumulativeOffset, checkInView } from '../utils/offset'

    export default {
        mixins: [move],
        props: ['zoom'],
        data () {
            return {}
        },
        computed: {
            widgets () {
                return widget.getWidgets()
            },
            layers () {
                return this.$store.state.widgets
            },
            activeElement () {
                return this.$store.state.activeElement
            }
        },
        methods: {

            addWidget (e, item) {
                this.$store.dispatch('addWidget', item)
            },
            updateSrollTop () {
                var top = document.getElementById('viewport').scrollTop / this.zoom * 100
                this.$store.commit('updateSrollTop', top)
            },

            activeLayer (e, item) {
                this.$store.commit('select', {
                    uuid: item.uuid
                })
                let viewport = document.querySelector('#viewport')
                let target = viewport.querySelector(`[data-uuid='${item.uuid}']`)
                if (target && !checkInView(target)) {
                    viewport.scrollTop = (cumulativeOffset(target).top - 50) * this.zoom / 100
                }
            },

            getWidgetTitle (type) {
                return this.widgets[type].title || ''
            }
        }
    }
</script>

<style lang="scss">
  @import '../_variables.scss';
  .menu-bar {
    ul {
      list-style: none;
      margin: 0;
    }
    details {
      padding: 10px;
    }
    summary {
      padding: 5px 0;
      border-bottom: 1px solid #f5f5f5;
      .svg-icon {
        margin-right: 5px;
      }
    }
  }
  .widget-list {
    padding: 0;
  }
  .menu-item {
    text-align: center;
    cursor: pointer;
    padding: 15px 0 8px;
    transition: all 0.2s;
    position: relative;
    &:hover {
      transform: scale(1.2);
    }
    .svg-icon {
      font-size: 24px;
    }
    .menu-caption {
      display: block;
      font-size: 12px;
      width: 100%;
    }
  }
  .layer-list {
    padding: 10px;
    li {
      text-align: left;
      cursor: pointer;
      white-space: nowrap;
      line-height: 24px;
      padding-left: 5px;
      &:hover {
        background: #f5f5f5;
      }
      &::before {
        content: '› ';
      }
      &.layer-active {
        color: $light-color;
        background: $primary-color;
      }
    }
  }
</style>
