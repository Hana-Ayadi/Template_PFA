<template>
    <div id="app">
        <v-app id="inspire">
            <v-layout column>
                <v-flex xs12 sm6 offset-sm3>
                    <img>
                        <v-container fluid grid-list-md>
                            <v-layout row wrap>
                                <v-flex
                                        v-bind="{ [`xs${card.flex}`]: true }"
                                        v-for="card in cards"
                                        :key="card.title"
                                >
                                    <v-card>
                                        <img
                                                :src="card.src"
                                                height="50px"
                                                width="150px"
                                                @click="showImage(card.src)"
                                        />
                                            <v-container fill-height fluid>
                                                <v-layout fill-height>
                                                    <v-flex xs12 align-end flexbox>
                                                        <span class="headline white--text" v-text="card.title"></span>
                                                    </v-flex>
                                                </v-layout>
                                            </v-container>
                                    </v-card>
                                </v-flex>
                            </v-layout>
                        </v-container>
                </v-flex>
            </v-layout>
        </v-app>
    </div>
</template>

<script>
  import store from '../../store'
  export default {
    store,
    data: () => ({
      showForm: false,
      cards: [
        { title: 'Diapo 1', src: '../../../assets/Diapo1.jpg', flex: 12 },
        { title: 'Diapo 2', src: '../../../assets/Diapo2.png', flex: 12 },
        { title: 'Diapo 3', src: '../../../assets/Diapo3.png', flex: 12 },
        { title: 'Diapo 4', src: '../../../assets/Diapo4.png', flex: 12 },
        { title: 'Diapo 5', src: '../../../assets/Diapo5.png', flex: 12 }
      ]
    }),
    methods: {
      showImage(title){
        document.getElementById("image1").style.backgroundImage='url('+title+')'
        this.$store.commit('setCurrentImage', title)
      }
    }
  }
</script>
<style scoped>

</style>