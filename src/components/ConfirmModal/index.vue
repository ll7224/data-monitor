<template>
  <Modal
    :title="title"
    v-model="shouldShow"
    :loading="loading"
    @on-ok="submit"
  >
    <p>{{ content }}</p>
  </Modal>
</template>
<script>
export default {
  props: {
    title: String,
    content: String,
    action: Function,
    shouldShow: Boolean,
    onSuccess: Function,
    onFail: Function
  },
  data() {
    return {
      loading: true
    };
  },
  methods: {
    showConfirmModal() {
      this.shouldShow = true;
    },
    submit() {
      this.action()
        .then(() => {
          this.loading = true;
          this.onSuccess();
          this.shouldShow = false;
        })
        .catch(error => {
          this.preventConfirmModalClose();
          this.onFail(error);
        });
    },
    preventConfirmModalClose() {
      this.loading = false;
      setTimeout(() => {
        this.loading = true;
      }, 0);
    }
  }
};
</script>
<style lang="stylus" scoped>

</style>
