<template>
  <div class="flex flex-col h-screen">
    <header class="flex justify-between p-4 border-b items-center">
      <h1 class="font-semibold text-xl leading-tight">Communication app</h1>
      <button class="py-1 px-4 border-2 border-green-800 rounded">
        <router-link to="/signin">サインイン</router-link>
      </button>
    </header>
    <div class="bg-gray-100 flex-auto">
      <div class="flex justify-center mt-16">
        <div class="w-2/5 border bg-white">
          <div class="my-12 text-center">
            <h2 class="text-4xl font-bold">ユーザー登録</h2>
            <p class="my-4">
              <span class="font-semibold">メールアドレス</span>と
              <span class="font-semibold">パスワード</span>を入力してください。
            </p>
            <form @submit.prevent="registerUser">
              <div class="mb-2">
                <input type="email" placeholder="メールアドレス" class="text-xl w-3/5 p-3 border rounded" v-model="email" />
              </div>
              <div class="mb-2">
                <input type="password" class="text-xl w-3/5 p-3 border rounded" placeholder="パスワード" v-model="password" />
              </div>
              <span class="text-red-500" v-for="(error, index) in errors" :key="index">{{ error }}</span>
              <button type="submit" class="text-xl w-3/5 bg-green-800 text-white py-2 rounded">登録する</button>
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