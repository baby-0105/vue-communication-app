<template>
  <div class="z-10 fixed top-0 left-0 h-full w-full flex items-center justify-center"
      style="background-color:rgba(0,0,0,0.5)"
      @click="$emit('close-channel-modal')">
  <div class="z-20 bg-white text-gray-900 w-2/3 rounded-md" @click.stop>
    <div class="flex flex-col p-6">
      <div class="flex justify-between items-center">
        <h2 class="text-xl md:text-3xl font-black leading-loose">チャンネルを作成する</h2>
        <span class="text-4xl" @click="$emit('close-channel-modal')">×</span>
      </div>
      <p>グループチャットを行う場所です。(例: #マーケティング)</p>
      <div class="mt-8 font-semibold">名前</div>
      <div class="my-3">
        <input type="text" class="w-full rounded border-gray-900 border-solid border p-3" v-model="channelName" />
      </div>
      <div class="flex justify-center">
        <button class="px-8 py-2 rounded bg-green-900 font-bold text-white" @click="addChannel">作成</button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
  export default {
    name: "ChannelModal",
    props: ['channel'],
    data() {
      return {
        channelName: '',
      }
    },
    methods: {
      addChannel() {
        this.$emit('add-channel', this.channelName)
        this.channelName = ''
      }
    },
    watch: {
      channel: {
        immediate: true,
        handler(value) {
          this.channelName = value;
        }
      }
    }
  }
</script>