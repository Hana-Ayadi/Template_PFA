<template>
  <input type="file" accept="image/png, image/jpeg, image/gif,.ppt, .pptx"
         :multiple="multiple ? 'multiple' : false"
         id="uploader2"
         name="upload[photo]"
         @change="handleUpload"

        >
</template>

<script>
  export default {
    props: {
      upload: Function,
      uploadOption: Object
    },
    data () {
      return {
        multiple: false, // 是否允许上传多张
        uploader: null, // input file
        cb: null // 回调函数
      }
    },
    files: [],
    mounted () {
      this.uploader2 = document.getElementById('uploader2')
      console.log('mounted')
      /**
       * 在全局通信中介上注册上传图片自定义事件
       * 所有需要上传图片的地方均可调用
       *
       * 调用方法：
       * this.$store.$emit('upload', function (payload) {/.../})
       * @param payload { Array } 图片上传、下载完成后的一个包含所有图片对象的数组
       * @param multiple { Boolean } 是否上传多张，默认为 false
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
        // Traitement d'ajout d'image, événement déclencheur：change
      handleUpload () {
        console.log('hello from handle')
        var files = this.uploader2.files
            // console.log(files.length)
        if (!files || files.length === 0) return
        files = Array.prototype.slice.call(this.uploader2.files)
        let uploadFn = this.upload || this.defaultUpload
        uploadFn(files).then(res => {
          console.log('status: ', res.status)
          console.log('hello1')
                // 图片下载队列完成后执行回调
          new Promise(resolve => {
            this.handleLoadQueue(resolve, res.files)()
          }).then(payload => {
            this.cb(payload)
          })
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
          }).then(response => { console.log(response.text()) }, () => null)
        } else {
          alert('error while uploading')
        }
      },
        /**
         * 处理下载队列
         * 图片按顺序下载完一张再下载下一张，以确保图片数组按上传的顺序排列
         */
      handleLoadQueue (resolve, files) {
        var i = 0
        var len = files.length
        var payload = []
        var download = () => {
                // 接入后端后，files 应改为回调参数
                // url = files[i]
          var url = window.URL.createObjectURL(files[i])
          new Promise(resolve => {
            this.getImageWidth(url, resolve)
          }).then(size => {
            payload.push({
              width: size.w,
              height: size.h,
              top: this.top,
              url: url, // Adresse d'aperçu de l'image
              src: 'images/' + files[i].name // Adresse réelle de l'image
            })
                    // 所有图片下载完毕，跳到下一步，否则继续下载
            if (++i === len) {
              resolve(payload)
            } else {
              download()
            }
          })
        }
        return download
      }
    }}
</script>