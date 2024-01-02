<template>
  <el-dialog
    :visible.sync="localVisible"
    :append-to-body="true"
    custom-class="mp-pc-third-unbind-dialog-comp-wrap"
    top="25vh"
    width="500px">
    <span>解绑{{ ThirdTypeTitle }}后你将无法使用{{ ThirdTypeTitle }}登录名片之家·印把子，你确定要解绑吗？</span>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submit">确定</el-button>
      <el-button @click="localVisible = false">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import ThirdCodeHandler, { ThirdTypeEnum } from '@/assets/js/ClassType/ThirdCodeHandler';
import { getNameFromListByIDs } from '@/assets/js/utils/utils';
import getEnumList from '@/assets/js/utils/getEnumList';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    ThirdType: {
      type: Number,
      default: -1,
    },
  },
  computed: {
    localVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit('update:visible', val);
      },
    },
    ThirdTypeTitle() {
      const ThirdTypeEnumList = getEnumList(ThirdTypeEnum);
      return getNameFromListByIDs(this.ThirdType, ThirdTypeEnumList);
    },
  },
  methods: {
    handleUnBindSuccess(info) {
      const cb = () => {
        this.localVisible = false;
        this.$store.commit('common/handleThirdBind', { isBind: false, info });
      };

      cb();
      this.$message({ message: '解绑成功', type: 'success' });
    },
    submit() {
      ThirdCodeHandler.setThirdUnbind(this.handleUnBindSuccess, this.ThirdType);
    },
  },
};
</script>
<style lang='scss'>
.mp-pc-third-unbind-dialog-comp-wrap {
  height: 266px;
  background: url('../../../../assets/images/AccountAndSecurity/unbind-dialog.png') no-repeat 0 0/100% 100%;

  .el-dialog__header {
    .el-dialog__headerbtn .el-icon {
      font-size: 19px;
      color: #428dfa;
      font-weight: 700;
      opacity: 0.5;
      transition: opacity 0.1s ease-in-out;

      &:hover {
        opacity: 0.8;
      }

      &:active {
        opacity: 1;
      }
    }
  }

  .el-dialog__body {
    height: 160px;
    padding-top: 123px;
    box-sizing: border-box;
    text-align: center;
    color: #444;
  }

  .el-dialog__footer {
    text-align: center;
    button {
      font-size: 12px;
      width: 100px;
      height: 33px;
      padding: 0;

      & + .el-button {
        margin-left: 35px;
      }
    }
  }
}
</style>
