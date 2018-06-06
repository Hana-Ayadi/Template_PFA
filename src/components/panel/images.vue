<template>
    <div id="app">
        <swiper :options="swiperOption">
            <swiper-slide v-for="(slide, index) in swiperSlides" :key="index" >
                <img  :src="slide"
                      @click="showImage(index)" id="im" />
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
            <div class="swiper-button-next swiper-button-white" slot="button-next"></div>
            <div class="swiper-button-prev swiper-button-white" slot="button-prev"></div>
        </swiper>
    </div>

</template>

<script>
    import store from '../../store'
    export default {
      store,
      data () {
        return {
          swiperOption: {
            slidesPerView: 3,
            spaceBetween: 30,
            pagination: {
              el: '.swiper-pagination',
              clickable: true
            },
            navigation: {
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev'
            }
          },
          swiperSlides: store.state.swiperSlides
        }
      },
      methods: {
        showImage (index) {
          var title = store.state.swiperSlides[index]
          document.getElementById('image1').src = title
          this.$store.commit('setCurrentImage', title)
            var occupants = window.listUser;
            console.log(occupants);
            for (var easyrtcid in occupants) {

                console.log(easyrtcid);

                eventHub.$emit('sendStuffWS',easyrtcid,title);


            }
        }
      }
    }
</script>
<style scoped>
    .swiper-slide {
        text-align: center;
        font-size: 18px;
        background: #444!important;
    }
    .swiper-slide img {
        width: auto;
        height: auto;
        max-width: 100%;
        max-height: 100%;

        left: 50%;
        top: 50%;
    }
</style>