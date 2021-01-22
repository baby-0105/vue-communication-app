<template>
  <div id="app" class="z-10 fixed top-0 left-0 h-full w-full flex items-center justify-center"
      style="background-color:rgba(0,0,0,0.5)"
      @click="$emit('close-message-modal')">
    <div class="z-20 bg-white text-gray-900 w-2/3 rounded-md max-h-96 overflow-scroll" @click.stop>
      <div class="flex flex-col p-6">
        <div class="flex justify-between items-center">
          <h2 class="text-xl md:text-3xl font-black leading-loose">新しくメッセージを送るユーザーを登録する</h2>
          <span class="text-4xl" @click="$emit('close-message-modal')">×</span>
        </div>
        <p>メールアドレスで検索してください。（※まだ検索機能のみしかついていない）</p>
        <input class="block p-1 my-3 text-black outline-black" type="text" placeholder="ユーザー検索をする" v-model="keyword">
        <div v-for="user in filteredUsers" :key="user.id" v-show="keyword != ''">
          <div class="py-1 flex justify-between items-center">
            <div class="flex items-center">
              <p class="mr-2"><Avator :user="message.user" /></p>
              <p v-text="user.email"></p>
            </div>
            <span>➕</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Avator from "../Avator";

  export default {
    name: "MessageModal",
    components: { Avator },
    props: ["users", "message"],
    data() {
      return {
        keyword: '',
      }
    },
    computed: {
      filteredUsers: function() {
        let users = [];

        for(let i in this.users) {
          let user = this.users[i];

          if(user.email.indexOf(this.keyword) !== -1) {
            users.push(user);
          }
        }

        return users;
      }
    },
  }
</script>