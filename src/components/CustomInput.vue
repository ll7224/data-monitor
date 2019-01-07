<template>
    <div>
        <Input ref="input"
               v-show="!nameToShow"
               @on-enter="showName"
               @on-blur="showName"
               :value="currentValue"
               :placeholder="placeholder"
               @input="handleInput"/>
        <span class="ivu-input ivu-input-default" v-show="nameToShow" @click="resetName">
      {{nameToShow}}
    </span>
    </div>
</template>

<script>
export default {
  name: "SkynetCustomInput",
  props: {
    placeholder: String,
    nameToShow: {
      type: String,
      required: true
    },
    value: {
      required: true
    }
  },
  data() {
    return {
      currentValue: this.value
    };
  },
  methods: {
    showName() {
      this.$emit("showName");
    },
    resetName() {
      this.$emit("resetName");
      this.focus();
    },
    handleInput(value) {
      this.$emit("input", value);
      this.currentValue = value;
      this.$emit("change", value);
    },
    focus() {
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    }
  },
  beforeUpdate() {
    if (this.currentValue !== this.value) {
      this.currentValue = this.value;
      this.focus();
    }
  }
};
</script>
