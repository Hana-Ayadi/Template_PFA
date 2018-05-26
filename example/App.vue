<template>
    <div id="des">
        <vue-page-designer/>
    </div>
</template>

<script>
    import widgets from '../src/plugins/widget'
    import vuePageDesigner from 'vue-page-designer'
    import '../node_modules/vue-page-designer/dist/vue-page-designer.css'
    import store from '../src/store'
    export default {
      data () {
        return {
          value: null,
          widgets,
          uploadOption: {
            url: 'https://jsonplaceholder.typicode.com/photos'
          }
        }
      },

      created () {
        let data = window.localStorage.getItem('vpd-data')
        if (data) {
          this.value = JSON.parse(data)
        }
      },

      methods: {
        handleSave (data) {
          console.log('saving:', data)
          window.localStorage.setItem('vpd-data', JSON.stringify(data))
        },
        handleUpload (files) {
          console.log('uploading:', files)
          return new Promise(resolve => {
            resolve({
              files: files,
              status: 200
            })
          })
        }
      },
      components: {
        vuePageDesigner
      },
      store
    }
</script>

<style>
    #app {
        height: 100%;
    }

    .app header.navbar {
        display: none;
    }
    .body.container {
        height: 566px;
    }
</style>
