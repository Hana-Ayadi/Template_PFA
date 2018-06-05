<template>
    <input type="file" accept="image/png, image/jpeg, image/gif,.ppt, .pptx"
           :multiple="multiple ? 'multiple' : false"
           id="uploader2"
           name="upload[photo]"
           @change="handleUpload"

    >
</template>

<script>
    import store from '../store'
    export default {
      store,
      props: {
        upload: Function,
        uploadOption: Object
      },
      data () {
        return {
          multiple: false, // ????????
          uploader: null, // input file
          cb: null // ????
        }
      },
      files: [],
      mounted () {
        this.uploader2 = document.getElementById('uploader2')
        console.log('mounted')
            /**
             * this.$store.$emit('upload', function (payload) {/.../})
             * @param payload { Array }
             * @param multiple { Boolean } ??????,??? false
             */
        this.$store.$on('upload', (cb, multiple) => {
          this.multiple = !!multiple
          this.cb = cb
          setTimeout(() => {
            this.uploader2.click()
          }, 0)
        })
      },
      methods: {
            // Traitement d'ajout d'image, événement déclencheur:change
        handleUpload () {
          console.log('hello from handle')
          var files = this.uploader2.files
                // console.log(files.length)
          if (!files || files.length === 0) return
          files = Array.prototype.slice.call(this.uploader2.files)
          let uploadFn = this.upload || this.defaultUpload
          uploadFn(files).then(res => {
            // console.log('status: ', res.status)
            console.log('hello1')
          })
        },
        defaultUpload (files) {
          console.log('helllo')
          if (this.uploadOption.url) {
            console.log('uploading')
            var data = new FormData()
            files.forEach(file => data.append('upload[photo]', file))
            return fetch(this.uploadOption.url, {
              method: 'POST',
              body: data
            }).then(response => {
              response.text().then(function (value) {
                store.commit('addImage', value)
                // console.log(value)
              })
              // this.$store.commit('addImage', response.statusText)
            }, () => null)
          } else {
            console.log('errrrrrrrrrrrrrrr')
            alert('error while uploading')
          }
        }
      }}
</script>