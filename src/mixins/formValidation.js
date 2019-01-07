import Vue from "vue";
import { keys, isEmpty } from "lodash";
import SkynetErrorTip from "@/components/ErrorTip.vue";
import { ERROR } from "@/utils/constant";
export default {
  methods: {
    markInvalidField(fieldName, errorMessage) {
      this.$refs[fieldName].validateState = "error";
      this.$refs[fieldName].validateMessage = errorMessage;
    },
    markInvalidForm(formModal, error) {
      keys(formModal).forEach(fieldName => {
        if (error[fieldName]) {
          this.markInvalidField(fieldName, error[fieldName]);
        }
      });
    },
    checkIsAllNumber(rule, value, callback) {
      if (!/^[0-9]+$/.test(value)) {
        callback(new Error(ERROR.INPUT));
      }
      callback();
    },
    showGlobalError(errorMessage) {
      //TODO: 加全局唯一显示
      const ErrorTipConstructor = Vue.extend(SkynetErrorTip);
      const instance = new ErrorTipConstructor({
        data: { errorMessage }
      });
      const component = instance.$mount();
      document.body.appendChild(component.$el);
    },
    submitErrorHandler(error, formModal) {
      if (error && error.status === 400 && !isEmpty(error.data)) {
        this.markInvalidForm(formModal, error.data);
      } else {
        this.showGlobalError();
      }
    },
    deleteErrorHandler(error) {
      this.showGlobalError(error.errorMessage);
    },
    validateTagInput(rule, value, callback) {
      const errors = value
        .map(tag => tag.error && tag.error())
        .filter(error => error);
      if (errors.length > 0) {
        callback(new Error(errors[0]));
      }
      callback();
    },
    focusInput(inputInstance) {
      this.$nextTick(() => {
        inputInstance.focus();
      });
    },
    preventDefault(e) {
      e.preventDefault();
    }
  }
};
