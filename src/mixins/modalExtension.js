export default {
  data() {
    return {
      modalLoading: true
    };
  },
  methods: {
    preventModalClose() {
      this.modalLoading = false;
      setTimeout(() => {
        this.modalLoading = true;
      }, 0);
    }
  }
};
