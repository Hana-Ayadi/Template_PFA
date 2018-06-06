<template>
    <div class="menu-bar">
        <details open>
            <summary><icon name="list" />Actions</summary>
            <ul class="widget-list columns" @mousedown="updateSrollTop">
                <li class="menu-item column col-6" @click="showVideo">
                    <img src="../../assets/video.png">
                    <span class="menu-caption">Video</span>
                </li>
                <li class="menu-item column col-6" @click="connect()" id="connectButton">
                    <img src="../../assets/connecter.png">
                    <span class="menu-caption">Connecter</span>
                </li>
                <li class="menu-item column col-6" @click="call()" id="otherClients">
                    <img src="../../assets/appeler.png">
                    <span class="menu-caption">Appeler</span>
                </li>
                <li class="menu-item column col-6" @click="sendMessage()" id="sendMessageArea" width="">
                    <img src="../../assets/message.png">
                    <span class="menu-caption">Message</span>
                </li>
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
            return {  msg: 'Welcome to Your Vue.js App',
                onceOnly: true,
                selfEasyrtcid: '',
                haveSelfVideo: false,
                listUser : {}}
        },
        created(){
            eventHub.$on('getList',this.getList);
            eventHub.$on('sendStuffWS',this.sendStuffWS);
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
            sendStuffWS (otherEasyrtcid,text) {
                console.log(otherEasyrtcid);
                console.log(text);
                if (text.replace(/\s/g, '').length === 0) { // Don't send just whitespace
                    return
                }

                console.log('-----------------');

                easyrtc.sendDataWS(otherEasyrtcid, 'message', text)
                this.addToConversation('Me', 'message', text)
                document.getElementById('sendMessageText').value = ''
            },
            getList(){
                return this.listUser;
            },
            showVideo(){
                this.$store.commit('setVisibility', 'visible')
                document.getElementById("video").style.visibility="visible";
            },
            sendMessage(){
                self.sendStuffWS(easyrtcid)
            },
            call(){
                self.performCall(easyrtcid)
            },
            addWidget (e, item) {
                this.$store.dispatch('addWidget', item)
            },
            clearConnectList () {
                var otherClientDiv = document.getElementById('otherClients')
                while (otherClientDiv.hasChildNodes()) {
                    otherClientDiv.removeChild(otherClientDiv.lastChild)
                }
            },
            addToConversation (who, msgType, content) {
                // Escape html special characters, then add linefeeds.
                content = content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
                content = content.replace(/\n/g, '<br />')
                document.getElementById('conversation').innerHTML +=
                    '<b>' + who + ':</b>&nbsp;' + '<image src=' + content + ' /> <br />'
            },
            convertListToButtons (roomName, occupants, isPrimary) {
                this.clearConnectList()
                var otherClientDiv = document.getElementById('test_id')
                console.log(otherClientDiv);
                var sendMessage = document.getElementById('sendMessage')
                window.listUser = occupants;

                eventHub.$emit('setListUser',occupants);

                var self = this
                for (var easyrtcid in occupants) {
                    var button = document.createElement('button')
                    sendMessage.onclick = (function (easyrtcid) {
                        return function () {
                            self.sendStuffWS(easyrtcid)
                        }
                    }(easyrtcid))
                    button.onclick = (function (easyrtcid) {
                        return function () {
                            self.performCall(easyrtcid)
                        }
                    }(easyrtcid))

                    var label = document.createTextNode('Call ' + easyrtc.idToName(easyrtcid))
                    button.appendChild(label)
                    otherClientDiv.appendChild(button)
                }
            },
            loginSuccess (easyrtcid) {
                this.disable('connectButton')
                this.enable('otherClients')
                this.selfEasyrtcid = easyrtcid
                document.getElementById('iam').innerHTML = 'I am ' + easyrtc.cleanId(easyrtcid)
                easyrtc.showError('noerror', 'logged in')
            },
            loginFailure (errorCode, message) {
                easyrtc.showError(errorCode, message)
            },
            connect () {
                console.log('connect');
                easyrtc.setSocketUrl('//localhost:8084')
                easyrtc.enableAudio(document.getElementById('shareAudio').checked)
                easyrtc.enableVideo(document.getElementById('shareVideo').checked)
                easyrtc.enableDataChannels(true)
                easyrtc.setPeerListener(this.addToConversation)
                easyrtc.setRoomOccupantListener(this.convertListToButtons)
                easyrtc.connect('easyrtc.instantMessaging', this.loginSuccess, this.loginFailure)
                easyrtc.connect('easyrtc.audioVideo', this.loginSuccess, this.loginFailure)
                if (this.onceOnly) {
                    easyrtc.getAudioSinkList(function (list) {
                        for (let ele of list) {
                            addSinkButton(ele.label, ele.deviceId)
                        }
                    })
                    this.onceOnly = false
                }
            },
            disable (domId) {
                document.getElementById(domId).disabled = 'disabled'
            },
            enable (domId) {
                document.getElementById(domId).disabled = ''
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
    .control-panel.column{-webkit-box-flex:0;-ms-flex:none;flex:none;width:320px}
</style>
