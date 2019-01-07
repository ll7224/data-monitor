<template>
    <div :class="tagContainerClasses"
         @focus="focus()"
         @click="focus()">
        <span class="description" v-if="description">{{ description }}</span>
        <div v-if="!disabled">
            <Tag v-for="(tag) in tags"
                 :key="tag.uniqueName"
                 :name="tag.uniqueName"
                 :class="tagClassName(tag.getError())"
                 checkable
                 @on-close="handleClose"
                 :closable="!disabled"
            >
                {{ tag.name ? `${tag.name} (${tag.code})` : tag.code }}
            </Tag>
            <Input
                    v-if="!disabled"
                    ref="input"
                    class="add-new"
                    :placeholder="placeholder"
                    @on-enter="handleCodeInputted"
                    @on-blur="handleCodeInputted"
                    :disabled="isLoading || disabled"
                    v-model="currentInput"/>
            <SkynetLoading v-if="isLoading" class="loading"/>
        </div>
    </div>
</template>

<script type='text/jsx'>
import SkynetLoading from "@/components/SkynetLoading.vue";
import { ERROR } from "@/utils/constant";

export default {
  name: "SkynetTagInput",
  components: {
    SkynetLoading
  },
  props: {
    placeholder: {
      type: String,
      default: ""
    },
    validateInput: {
      type: Function,
      required: true
    },
    errorMap: Object,
    disabled: {
      type: Boolean,
      default: false
    },
    description: String,
    value:
      Array[
        {
          code: {
            type: String,
            default: []
          },
          name: String
        }
      ]
  },
  data() {
    return {
      isLoading: false,
      currentInput: "",
      tags: this.value.map(this.rebuildTag)
    };
  },
  computed: {
    tagContainerClasses() {
      return {
        "tag-input-container": true,
        "ivu-input": true,
        disabled: this.disabled
      };
    },
    errorTags() {
      return this.tags.filter(tag => tag.getError());
    }
  },
  watch: {
    value(newValue) {
      this.tags = newValue ? newValue.map(this.rebuildTag) : [];
    }
  },
  methods: {
    rebuildTag(tag, index, tags) {
      const isDuplicated =
        tags.slice(0, index).findIndex(item => item.code === tag.code) > -1;
      const rebuiltTag = {
        ...tag,
        uniqueName: `${tag.code}-${index}`,
        isDuplicated
      };
      rebuiltTag.getError = () => {
        if (rebuiltTag.error) {
          return rebuiltTag.error;
        } else if (rebuiltTag.isWrongCode) {
          return this.errorMap.wrongCode || ERROR.INPUT;
        } else if (rebuiltTag.isDuplicated) {
          return this.errorMap.duplicated || ERROR.INPUT_DUPLICATED;
        }
        return false;
      };
      return rebuiltTag;
    },
    tagClassName(isError) {
      return isError && "error";
    },
    refresh() {
      this.tags = this.tags.map(this.rebuildTag);
      this.$emit("input", this.tags);
      this.$nextTick(() => {
        this.focus();
      });
    },
    handleClose(data, uniqueName) {
      this.tags = this.tags.filter(t => t.uniqueName !== uniqueName);
      this.refresh();
    },
    handleCodeInputted() {
      const value = this.currentInput;
      if (value) {
        this.currentInput = "";
        this.isLoading = true;

        let newTag;
        this.validateInput(value)
          .then(tag => {
            newTag = tag;
          })
          .catch(tagError => {
            newTag = {
              code: value,
              isWrongCode: true,
              error: tagError.message
            };
          })
          .finally(() => {
            this.tags.push(newTag);
            this.isLoading = false;
            this.refresh();
          });
      }
    },
    focus() {
      if (this.$refs.input) this.$refs.input.focus();
    },
    hasError() {
      return this.errorTags.length > 0;
    },
    markTagIsWrong(code) {
      this.tags = this.tags.map(tag => ({
        ...tag,
        isWrongCode: tag.isWrongCode || tag.code === code
      }));
    }
  },
  created() {}
};
</script>
<style lang='scss'>
@import "../assets/styles/var";

.description {
  color: #4a4f5d;
}

.tag-input-container {
  font-size: 14px;
  user-select: none;
  height: auto;
  overflow: auto;
  .add-new {
    display: inline-block;
    width: 200px;
    input {
      border: none;
      outline: none;
      padding-right: 0;
    }
    .ivu-input:focus {
      border: none;
      outline: none;
      box-shadow: none;
    }
    .ivu-input-disabled {
      background-color: #f3f3f3;
    }
  }

  &.disabled {
    background-color: #f3f3f3;
    &.ivu-input:hover {
      border-color: #f3f3f3;
    }
  }

  .error {
    background-color: $--color-danger;
    color: white;
  }
}
</style>
