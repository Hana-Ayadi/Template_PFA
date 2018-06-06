<template>
    <div id="app" v-cloak>
        <div id="test_id">
            <div></div>
        </div>
        <ul class="users">
            <transition-group name='user'>
                <li v-for='u in users' :key='u.id' mode="out-in">{{u.name}}</li>
            </transition-group>
        </ul>

    </div>
</template>

<script>
    class User {
        constructor(name) {
            this.name = name;
            this.id = ++User.id;
        }
    }

    User.id = 0;

    export default {
        data() {
            return{
                users: [new User('manel')],
                confirmModal: false,
                selectedUser: null
            }
        },
        methods: {
            addUser() {
                let user = this.$refs.newuser.value;
                if (user) {
                    this.users.push(new User(user));
                    this.$refs.newuser.value = "";
                }
            },
            shuffle() {
                this.users.sort(() => Math.random() > 0.5);
            },
            setListUser(users) {
                console.log(users);

            }
        },
        created () {
            console.log("---------");
            eventHub.$on('setListUser',this.setListUser);
            this.users.push(new User('Guillaume'))
            this.users.push(new User('Vianney'))
            this.users.push(new User('Justin'))

        }
    }
</script>
<style lang="scss">

    body {
        font-family: sans-serif;
        // color: white;
    }

    [v-cloak] {
        display: none;
    }

    .users {
        list-style: none;
        margin: 0;
        padding: 0;
        margin: 1em 0;
        line-height: 2;
    }

    .users li {
        padding: 4px 2em;
        display: flex;
        justify-content: space-between;
        background: rgba(0, 0, 0, .2);
        margin-bottom: 6px;
    }

    .users li:nth-of-type(even) {
        background: rgba(0, 0, 0, .2);
    }

    .users li:nth-of-type(odd) {
        background: rgba(0, 0, 0, .4);
    }
    .user-enter {
        opacity: 0;
        transform: translateY(-5px);
    }

    .user-enter-active {
        transition: .3s;
    }

    .user-leave-active {
        opacity: 0;
        transform: translateX(50px);
        transition: .3s;
    }

    .user-move {
        transition: .5s;
    }

    .appear-enter {
        opacity: 0;
    }

</style>