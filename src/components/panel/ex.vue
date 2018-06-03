<template>
    <div id="app">
        <VueDragResize :isActive="true" :w="200" :h="200" v-on:resizing="resize"
                       v-on:dragging="resize" :style="{visibility: visible}" id="video" :visible="visible">
            <p>top : {{ top }} х left: {{ left }} </p>
            <p>width : {{ width }} х height :{{ height }}</p>
            <video ref="videoRef" src="http://iandevlin.github.io/mdn/video-player/video/tears-of-steel-battle-clip-medium.mp4" id="video-container" width="100%" controls></video>
        </VueDragResize>
        <button @click="hello">hello</button>
    </div>
</template>

<script>
  import VueDragResize from 'vue-drag-resize';
  import store from '../../store'
  export default {
    store,
    name: 'app',

    components: {
      VueDragResize
    },
    props: ['visible'],
    data() {
      return {
        width: 0,
        height: 0,
        top: 0,
        left: 0
      }
    },
    mounted () {
      document.getElementById("video").style.visibility="hidden";
    },
    methods: {
      hello(){
       // document.getElementById("video").style.visibility = "visible";
        this.$store.commit('setVisibility', 'visible')
        document.getElementById("video").style.visibility="visible";
        console.log("visi"+this.$store.visible)
      },
      resize(newRect) {
        this.width = newRect.width;
        this.height = newRect.height;
        this.top = newRect.top;
        this.left = newRect.left;
      }
    }
  }
</script>