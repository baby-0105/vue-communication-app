<template>
  <div class="flex h-screen">
    <div class="flex flex-col justify-between w-full bg-gray-800 text-white pt-3 px-4 overflow-scroll md:w-1/4"
         :class="{ 'hidden': hiddenMenu }">
      <div>
        <div class="flex justify-between items-center">
          <h1 class="font-semibold leading-tight text-2xl md:text-xl">Communication app</h1>
          <Notification />
        </div>
        <div class="flex items-center">
          <span class="bg-yellow-400 rounded-full w-3 h-3 mr-2"></span>
          <span class="opacity-50 text-lg md:text-md">{{ user.email }}</span>
        </div>
        <div class="mt-5 flex justify-between items-center">
          <div class="font-bold opacity-50 text-lg">チャンネル</div>
          <span @click="channelModal = true">➕</span>
          <channelModal v-show="channelModal"
                        :channel="channel"
                        @close-channel-modal="channelModal = false"
                        @add-channel="addChannel">
          </channelModal>
        </div>
        <div class="opacity-50 mt-1 text-xl" v-for="channel in channels" :key="channel.id" @click="channelMessage(channel)"># {{ channel.channel_name }}</div>
        <div class="mt-5 flex justify-between items-center">
          <div class="font-bold opacity-50 text-lg">ダイレクトメッセージ</div>
          <span @click="messageModal = true">➕</span>
        </div>
        <messageModal v-show="messageModal"
                      :users="users"
                      :message="message"
                      @close-message-modal="messageModal = false">
        </messageModal>
        <div class="flex items-center" v-for="user in users" :key="user.user_id">
          <span class="ml-1 rounded-full w-3 h-3 mr-2" :class="[isOnline(user) ? 'bg-yellow-400' : 'bg-gray-600']"></span>
          <span class="opacity-50 text-xl" @click="directMessage(user)">{{ user.email }}</span>
        </div>
      </div>
      <div class="text-center my-5">
        <button class=" py-1 px-2 bg-white text-black rounded" @click="signOut">サインアウト</button>
      </div>
    </div>
    <div class="flex-grow bg-gray-100 h-screen md:block" :class="{ 'hidden': hiddenMessage }">
      <header class="border-b">
        <div class="flex justify-between m-3">
          <div class="font-bold text-lg">
            <span class="mr-2" @click="showMenu" :class="{ 'hidden': hiddenMessage }"><font-awesome-icon class="text-xl opacity-50" icon="bars" /></span> {{ channel_name }}
          </div>
          <div>
            <button class="py-1 px-2 bg-gray-800 text-white rounded md:px-4" @click="signOut">サインアウト</button>
          </div>
        </div>
      </header>
      <main class="home-message-main overflow-y-scroll" @dragenter="dragEnter" @dragleave="dragLeave" @drop.prevent="dropFile" @dragover.prevent>
        <div class="h-full flex flex-col mx-6 relative">
          <div class="flex-grow overflow-y-scroll" id="message_bottom">
            <div class="mt-2 mb-4 flex" v-for="message in messages" :key="message.key" style="pointer-events: none">
              <Avator :user="message.user" />
              <div class="ml-2">
                <div class="font-bold">{{ message.user }}</div>
                <div>{{ message.content }}</div>
                <div v-if="message.url">
                  <img :src="message.url" width="360px" />
                </div>
              </div>
            </div>
          </div>
          <div class="border border-gray-900 rounded mb-4">
            <textarea class="w-full pt-4 pl-8 outline-none" :placeholder="placeholder" v-model="message"></textarea>
            <div class="bg-gray-100 p-2">
              <button class="bg-green-900 text-sm text-white font-bold py-1 px-2 rounded" @click="sendMessage">送信</button>
            </div>
          </div>
          <div class="h-full bg-white z-10 absolute w-full flex justify-center items-center" v-show="file_upload_overlay" style="pointer-events: none">
            <p class="font-bold text-4xl">クラウド上へアップロードする</p>
          </div>
        </div>
      </main>
    </div>
    <div class="z-10 fixed top-0 left-0 h-full w-full flex items-center justify-center" style="background-color:rgba(0,0,0,0.5)" v-show="file_upload_modal" @click="closefileUploadModal">
      <div class="z-20 bg-white text-gray-900 w-1/3 rounded-md" @click.stop>
        <div class="w-full h-2">
          <div class="bg-green-900 h-full block" style="width:0%" ref="progress_bar"></div>
        </div>
        <div class="flex flex-col p-6">
          <div class="flex justify-between items-center">
            <h2 class="text-3xl font-black leading-loose">ファイルをアップロードする</h2>
            <span class="text-4xl" @click="closefileUploadModal">×</span>
          </div>
          <div class="my-3">
            <textarea class="w-full rounded border-gray-900 border-solid border p-3" placeholder="ファイルに関するメッセージを追加する" v-model="file_message" />
          </div>
          <div class="bg-gray-200 p-3 border border-gray-400 rounded mb-4">
            <div class="bg-white p-3">
              <span class="text-xs" v-text="file.name"></span>
            </div>
          </div>
          <div class="flex justify-end items-center">
            <button class="px-8 py-2 rounded bg-green-900 font-bold text-white" @click="fileUpload">アップロード</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase"
import Notification from "../components/icons/Notification";
import Avator from "../components/Avator";
import ChannelModal from "../components/modal/ChannelModal";
import MessageModal from "../components/modal/MessageModal";

export default {
  name: 'Home',
  components: {
    Notification,
    Avator,
    ChannelModal,
    MessageModal,
  },
  data() {
    return {
      user: "",
      users: [],
      channel_name: "",
      message: "",
      messages: [],
      placeholder: "",
      channels: [],
      channel: "",
      channel_id: "",
      channelModal: false,
      messageModal: false,
      connectionRef: firebase.database().ref("connections"),
      connection_key: "",
      connections: [],
      file_upload_overlay: false,
      file_upload_modal: false,
      file_message: "",
      file: "",
      url: "",
      hiddenMenu: false,
      hiddenMessage: true,
      showMessage: false,
    }
  },
  methods: {
    signOut() {
      this.connectionRef.child(this.connection_key).remove();
      firebase.auth().signOut()
      this.$router.push("/signin")
    },
    directMessage(user) {
      this.messages = [];
      this.user = firebase.auth().currentUser;

      this.user.uid > user.user_id
        ? (this.channel_id = `${this.user.uid} - ${user.user_id}`)
        : (this.channel_id = `${user.user_id} - ${this.user.uid}`);

      this.channel_name = user.email
      this.placeholder = `${user.email} へのメッセージ`

      if(this.hiddenMessage) {
        this.hiddenMenu = true
        this.hiddenMessage = false
      }

      if(this.channel_id != "") {
        firebase.database().ref("messages").child(this.channel_id).off()
      }

      firebase.database().ref("messages").child(this.channel_id).on("child_added", snapshot => {
        this.messages.push(snapshot.val());
        this.$nextTick(() => {
          let message_bottom = document.getElementById("message_bottom");

          message_bottom.scrollTop = message_bottom.scrollHeight;
        })
      })
    },
    sendMessage() {
      const newMessage = firebase.database().ref("messages").child(this.channel_id).push(),
            key_id     = newMessage.key;

      let content = "";

      if(this.url == "") {
        content = this.message;
      } else {
        content = this.file_message;
      }

      newMessage.set({
        key: key_id,
        content: content,
        user: this.user.email,
        url: this.url,
        createdAt: firebase.database.ServerValue.TIMESTAMP
      })

      this.url == "" ? this.message = "" : this.file_message == ""
      this.url = "";
    },
    addChannel(channel) {
      const newChannel = firebase.database().ref("channel").push(),
            key_id     = newChannel.key;

      newChannel
      .set({
        channel_name: channel,
        id: key_id
      })
      .then(() => {
        this.channelModal = false
      })
    },
    channelMessage(channel) {
      this.messages = [];
      this.channel_name = "#" + channel.channel_name;
      this.channel_id = channel.id

      if(this.channel_id != "") {
        firebase.database().ref("messages").child(this.channel_id).off();
      }

      if(this.hiddenMessage) {
        this.hiddenMenu = true
        this.hiddenMessage = false
      }

      firebase.database().ref("messages").child(channel.id).on("child_added", snapshot => {
        this.messages.push(snapshot.val())
      })
    },
    showMenu() {
      if(!this.hiddenMessage) {
        this.hiddenMenu = false
        this.hiddenMessage = true
      }
    },
    isOnline(user) {
      if(user.status == "online") {
        return true;
      } else {
        return false;
      }
    },
    dragEnter() {
      this.file_upload_overlay = true
    },
    dragLeave() {
      this.file_upload_overlay = false
    },
    dropFile() {
      this.file = event.dataTransfer.files[0]
      this.file_upload_modal = true;
      this.file_upload_overlay = false
    },
    closefileUploadModal() {
      this.file_upload_modal = false
    },
    fileUpload() {
      const storageRef = firebase.storage().ref("images/" + this.file.name),
            uploadTask = storageRef.put(this.file);

      uploadTask.on(
        "state_changed",
        snapshot => {
          let percentage =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          this.$refs.progress_bar.style.width = `${percentage}%`;
        },
        error => {
          console.log(error);
        },
        () => {
          storageRef.getDownloadURL().then(url => {
            this.url = url;
            this.sendMessage();
            this.fileUploadModal = false;
          });
        }
      );
    }
  },
  mounted() {
    this.user = firebase.auth().currentUser;

    firebase.database().ref("users").on("child_added", snapshot => {
      let user = snapshot.val();

      if(this.user.uid == user.user_id) {
        user.status = "online";
      } else {
        user.status = "offline";
      }
      this.users.push(user)
    })

    firebase.database().ref("channel").on("child_added", snapshot => {
      this.channels.push(snapshot.val())
    })

    firebase.database().ref(".info/connected").on("value", snapshot => {
      if(snapshot.val() == true) {
        let ref = this.connectionRef.push();
        this.connection_key = ref.key;

        ref.onDisconnect().remove();
        ref.set({
          user_id: this.user.uid,
          key: this.connection_key
        })
      }
      else { console.log("non connected") }
    })

    firebase.database().ref("connections").on("child_added", snapshot => {
      let new_connection = snapshot.val();
      this.connections.push(new_connection);

      let user = this.users.find(
        user => user.user_id === new_connection.user_id
      );

      if (user != undefined) {
        user.status !== "online";
      }
    })

    firebase.database().ref("connections").on("child_removed", snapshot => {
      let remove_connection = snapshot.val();

      this.connections = this.connections.filter(
        connection => connection.key !== remove_connection.key
      );

      let index = this.connections.findIndex(connection => {
        return connection.user_id === remove_connection.user_id;
      });

      if (index === -1) {
        let user = this.users.find(
          user => user.user_id == remove_connection.user_id
        );
        user.status = "offline";
      }
    })
  },
  beforeDestroy() {
    firebase.database().ref("users").off()
    firebase.database().ref("message").child(this.channel_id).off()
    firebase.database().ref(".info/connected").off()
  }
}
</script>

<style scoped>
  .home-message-main {
    height: 89%;
  }
</style>