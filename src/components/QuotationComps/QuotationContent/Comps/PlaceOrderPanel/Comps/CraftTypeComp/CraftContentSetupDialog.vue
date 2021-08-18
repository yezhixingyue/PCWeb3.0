<template>
  <el-dialog
    :visible.sync="localVisible"
    :title="dialogTitle"
    custom-class="set-craft-dia mp-place-order-panel-comp-craft-type-item-dialog-comp-wrap"
    v-dialogDrag
    @open="onOpen"
    @closed="onClosed"
  >
    <header slot="title">
      <i class="iconfont icon-shezhi is-primary-blue"></i>
      <span>{{ dialogTitle }}</span>
    </header>
    <main v-if="localSetupData && showMain">
      <ElementTypeComp
        v-for="it in ElementList"
        :key="it.ID"
        :Property="it"
        :needInit="!setupData"
        :value="getElementVal(it)"
        @input="handleElementChange($event, it)"
      />
      <ElementGroupTypeComp
        v-for="it in GroupList"
        :key="it.ID"
        :Property="it"
        :needInit="!setupData"
        :value="getGroupVal(it)"
        @input="handleGroupChange($event, it)"
      />
    </main>
    <footer>
      <el-button type="primary" @click="onSubmit">确定</el-button>
      <el-button @click="localVisible = false">取消</el-button>
    </footer>
  </el-dialog>
</template>

<script>
import ElementTypeComp from '../ElementTypeComp.vue';
import ElementGroupTypeComp from '../ElementGroupTypeComp.vue';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    Craft: {
      type: Object,
      default: () => ({}),
    },
    setupData: {
      type: Object,
      default: null,
    },
  },
  components: {
    ElementTypeComp,
    ElementGroupTypeComp,
  },
  computed: {
    localVisible: {
      get() {
        return this.visible;
      },
      set(bool) {
        this.$emit('update:visible', bool);
      },
    },
    dialogTitle() {
      return this.Craft && this.Craft.ShowName
        ? `${this.Craft.ShowName}参数设置`
        : '工艺参数设置';
    },
    ElementList() {
      return this.Craft?.ElementList || [];
    },
    GroupList() {
      return this.Craft?.GroupList || [];
    },
  },
  data() {
    return {
      localSetupData: null,
      showMain: false,
    };
  },
  methods: {
    onSubmit() {
      this.$emit('submit', this.localSetupData);
    },
    generateInitSetupData() {
      // 生成及初始化设置数据
      const ElementList = this.ElementList.map((it) => ({
        ElementID: it.ID,
        CustomerInputValues: [],
      }));
      const GroupList = this.GroupList.map((it) => ({
        GroupID: it.ID,
        List: [],
      }));
      const temp = {
        CraftID: this.Craft.ID,
        ElementList,
        GroupList,
      };
      this.localSetupData = temp;
    },
    onOpen() {
      if (!this.setupData) this.generateInitSetupData();
      else {
        // 如果有服务器数据编辑还原操作的时候必须考虑排序的问题
        this.localSetupData = JSON.parse(JSON.stringify(this.setupData));
      }
      this.showMain = true;
    },
    onClosed() {
      this.showMain = false;
    },
    getElementVal({ ID }) {
      const t = this.localSetupData.ElementList.find(
        (it) => it.ElementID === ID,
      );
      return t ? t.CustomerInputValues : [];
    },
    getGroupVal({ ID }) {
      const t = this.localSetupData.GroupList.find((it) => it.GroupID === ID);
      return t ? t.List : [];
    },
    handleElementChange(CustomerInputValues, el) {
      const t = this.localSetupData.ElementList.find(
        (it) => it.ElementID === el.ID,
      );
      if (t) {
        t.CustomerInputValues = CustomerInputValues;
      }
    },
    handleGroupChange(List, group) {
      const t = this.localSetupData.GroupList.find(
        (it) => it.GroupID === group.ID,
      );
      if (t) {
        t.List = List;
      }
    },
  },
};
</script>
<style lang='scss'>
.el-dialog__wrapper {
  > .el-dialog.set-craft-dia.mp-place-order-panel-comp-craft-type-item-dialog-comp-wrap {
    width: unset;
    width: auto\0;
    min-width: 450px;
    display: table;
    border-radius: 5px;
    > .el-dialog__header {
      > header {
        height: 14px;
        line-height: 14px;
      }
    }
    > .el-dialog__body {
      margin-left: 20px;
      margin-right: 20px;
      padding-bottom: 25px;
      margin-left: 15px\0;
      margin-right: 15px\0;
      > main {
        .mp-place-order-content-element-type-show-item-comp-wrap {
          > label {
            width: unset;
          }
        }
        > .mp-place-order-content-element-type-show-item-comp-wrap {
          margin-bottom: 15px;
        }
      }
      > footer {
        text-align: center;
        margin-top: 58px;
        > button {
          height: 35px;
          width: 120px;
          line-height: 33px;
          padding: 0;
          & + button {
            margin-left: 45px;
          }
        }
      }
    }
  }
}
</style>
