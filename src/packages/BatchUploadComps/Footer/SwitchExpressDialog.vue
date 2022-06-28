<template>
  <CommonDialogComp
    title="更改订单配送方式"
    submitText="确定"
    :visible.sync="localVisible"
    width="620px"
    top="20vh"
    @open="onOpen"
    @submit="submit"
    @cancle="localVisible=false"
    class="mp-batch-upload-switch-express-comp-dialog-wrap"
   >
    <ExpressSelectComp
      hiddenMpzj
      :ExpressList="ExpressList"
      v-model="Express"
      @change="onChange"
    />
    <div class="remark">
      <span class="label">注：</span>
      <div class="list">
        <p>1. 点击确定后，本次选中的{{multipleSelection.length}}个订单会更换成上面选择的配送方式</p>
        <p>2. 如果订单地址无法使用新配送方式，将会更改失败 ( 维持原状 )</p>
      </div>
    </div>
  </CommonDialogComp>
</template>

<script>
import { mapState } from 'vuex';
import { projectType } from '@/assets/js/setup';
import CommonDialogComp from '../../CommonDialogComp';
import ExpressSelectComp from '../../ConsigneeAddressSetpComp/ExpressSelectComp.vue';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    multipleSelection: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    CommonDialogComp,
    ExpressSelectComp,
  },
  computed: {
    ...mapState('common', ['ExpressList']),
    localVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit('update:visible', val);
      },
    },
  },
  data() {
    return {
      Express: {
        First: '',
        Second: '',
      },
      curExpressItem: null,
    };
  },
  methods: {
    onOpen() {
      // this.Express = {
      //   First: '',
      //   Second: '',
      // };
      // this.curExpressItem = null;
    },
    onChange(e) {
      this.curExpressItem = e;
    },
    setErrorMsg(title, msg, callback) {
      if (projectType === 'pc') {
        this.messageBox.failSingleError({
          title,
          msg,
          successFunc: callback,
          failFunc: callback,
        });
      } else {
        this.messageBox.failSingleError(title, msg, callback, callback);
      }
    },
    submit() {
      if (this.Express.First === '' || this.Express.Second === '' || !this.curExpressItem) {
        this.setErrorMsg('操作失败', '请先选中配送方式');
        return;
      }
      let errNum = 0;
      this.multipleSelection.forEach(it => {
        const { ExpressList } = it.result;
        if (ExpressList.includes(this.Express.Second)) {
          const _it = it;
          _it.Express = { ...this.Express };
        } else {
          errNum += 1;
        }
      });
      if (errNum === 0) {
        this.localVisible = false;
      } else {
        const cb = () => {
          this.localVisible = false;
        };
        const ex = this.curExpressItem && this.curExpressItem.Name ? `“${this.curExpressItem.Name}”` : '';
        const msg = `【${errNum}】 个订单更改${ex}失败，请核对！`;
        this.setErrorMsg('提示', msg, cb, cb);
      }
    },
  },
  mounted() {
    this.$store.dispatch('common/getExpressList');
  },
};
</script>
<style lang='scss'>
.mp-batch-upload-switch-express-comp-dialog-wrap {
  .el-dialog__body {
    padding-left: 85px;
    padding-top: 50px;
    height: 120px;
    > .remark {
      margin-top: 20px;
      font-size: 13px;
      color: #989898;
      line-height: 30px;
      > .label {
        display: inline-block;
        width: 70px;
        text-align: right;
        margin-right: 6px;
        vertical-align: top;
      }
      > div {
        display: inline-block;
        width: 360px;
        font-size: 12px;
        p {
          line-height: 18px;
          margin-top: 6px;
        }
      }
    }
  }
}
</style>
