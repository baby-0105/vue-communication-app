<template>
  <div class="bg-gradient-to-r from-purple-800 to-yellow-600 flex flex-col h-screen overflow-scroll">
    <header class="flex justify-between p-4 border-b items-center">
      <h1 class="font-semibold text-lg leading-tight md:text-xl">Communication app</h1>
      <button class="py-1 px-4 border-2 border-green-800 rounded">
        <router-link to="/signin">サインイン</router-link>
      </button>
    </header>
    <div class="flex-auto mb-16">
      <h1 class="text-center font-bold pt-12 text-3xl md:text-5xl">Slackライクなチャットアプリ<br>Communication app</h1>
      <div class="flex justify-center mt-16">
        <div class="w-4/5 border bg-white md:w-3/5">
          <div class="my-12 text-center">
            <h2 class="text-4xl font-bold">ユーザー登録</h2>
            <p class="my-4">
              <span class="font-semibold">メールアドレス</span>と
              <span class="font-semibold">パスワード</span>を入力してください。
            </p>
            <form @submit.prevent="registerUser">
              <!-- <div class="mb-2">
                <input type="text" placeholder="ユーザー名" class="text-xl w-3/5 p-3 border rounded" v-model="name" />
              </div> -->
              <div class="mb-2">
                <input type="email" placeholder="メールアドレス" class="text-xl w-3/5 p-3 border rounded" v-model="email" />
              </div>
              <div class="mb-2">
                <input type="password" class="text-xl w-3/5 p-3 border rounded" placeholder="パスワード" v-model="password" />
              </div>
              <span class="text-red-500" v-for="(error, index) in errors" :key="index">{{ error }}</span>
              <button type="submit" class="text-xl w-3/5 bg-green-800 text-white py-2 mb-5 rounded">登録する</button>
              <router-link class="text-blue-700 block hover:underline" to="/signin">サインインする</router-link>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import firebase from 'firebase'

  export default {
    data() {
      return {
        email: "",
        password: "",
        // name: "",
        errors: []
      };
    },
    methods: {
      registerUser() {
        firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
          .then(response => {
            const user = response.user;

            firebase.database().ref("users").child(user.uid)
              .set({
                user_id: user.uid,
                email: user.email
              })
              .then(() => {
                this.$router.push('/')
              })
              .catch(e => {
                console.log(e)
                alert('ユーザーの登録できませんでした')
              })
          })
          .catch(e => {
            console.log(e);
            if (e.code == "auth/email-already-in-use") {
              this.errors.push("入力したメールアドレスは登録済みです。");
            } else {
              this.errors.push(
                "入力したメールアドレスかパスワードに問題があります。"
              );
            }
          })
      }
    }
  }
</script>