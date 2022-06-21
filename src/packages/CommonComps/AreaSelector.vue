<template>
  <el-popover
    placement="bottom-start"
    width="645"
    trigger="manual"
    :visible-arrow="false"
    :popper-class="`mp-common-comps-area-selector-comp-popper-class mt-${h}`"
    v-model="visible">
    <!-- :append-to-body="false" -->
    <div class="mp-popover-content" v-loading="loading" v-clickoutside="onCloseClick">
      <p class="header">
        <span class="title">{{title}}</span>
        <span class="selected">
          <i v-for="(it, i) in localSelectedList" :key="it + i">{{it}}</i>
        </span>
        <span class="icons">
          <i class="el-icon-refresh-left" title="重置" @click="reset" :class="{disabled:this.curDisplayLevel===1}"></i>
          <i class="el-icon-close" @click="onVisibleClick"></i>
        </span>
      </p>
      <div class="content">
        <span v-if="curAreaDisplayList.length === 0 && !loading" class="empty">暂无数据</span>
        <!-- <span v-if="loading" class="empty">正在加载中...</span> -->
        <div v-if="areaData" class="list">
          <span v-for="it in curAreaDisplayList" :key="it.ID" @click="select(it)" :class="{active: it.ID===curActiveID}">{{it.Name}}</span>
        </div>
      </div>
    </div>
    <div slot="reference" @click="onVisibleClick" class="mp-common-comps-area-selector-comp-wrap" :style="`height:${h}px;line-height:${h-2}px`">
      <span v-if="selectedList.length === 0">{{placeholder}}</span>
      <span class="selected">{{selectedList.join(' ')}}</span>
      <!-- <span class="selected" v-for="(it, i) in selectedList" :key="it + i">{{it}}</span> -->
    </div>
  </el-popover>
</template>

<script>
import Clickoutside from 'element-ui/src/utils/clickoutside';

export default {
  directives: {
    Clickoutside,
  },
  props: {
    h: {
      type: Number,
      default: 30,
    },
    placeholder: {
      type: String,
      default: '请选择省/市/区',
    },
    value: {
      type: Object,
      default: () => ({}),
    },
    defaultProps: {
      type: Object,
      default: () => ({
        RegionalIDLabel: 'RegionalID',
        RegionalNameLabel: 'RegionalName',
        CityIDLabel: 'CityID',
        CityNameLabel: 'CityName',
        CountyIDLabel: 'CountyID',
        CountyNameLabel: 'CountyName',
      }),
    },
  },
  data() {
    return {
      visible: false,
      areaData: null,
      loading: false,
      curAreaDisplayList: [],
      localValue: null,
    };
  },
  computed: {
    title() { // 提示标题
      if (this.curDisplayLevel === 1) {
        return '选择省份/自治区';
      }
      if (this.curDisplayLevel === 2) {
        return '选择城市/地区';
      }
      if (this.curDisplayLevel === 3) {
        return '选择区县';
      }
      return '';
    },
    localSelectedList() { // 弹窗中展示的省市区列表
      return this.getSelectedList(this.localValue);
    },
    selectedList() { // 实际选中的省市区列表
      return this.getSelectedList(this.value);
    },
    curDisplayLevel() {
      if (this.visible && this.value && typeof this.value === 'object' && Array.isArray(this.curAreaDisplayList) && this.curAreaDisplayList.length > 0) {
        const { Level } = this.curAreaDisplayList[0];
        return Level;
      }
      return '';
    },
    curActiveID() { // 弹窗中当前被选中的省|市|区ID
      if (this.curDisplayLevel === 1) {
        return this.localValue[this.defaultProps.RegionalIDLabel];
      }
      if (this.curDisplayLevel === 2) {
        return this.localValue[this.defaultProps.CityIDLabel];
      }
      if (this.curDisplayLevel === 3) {
        return this.localValue[this.defaultProps.CountyIDLabel];
      }
      return '';
    },
  },
  methods: {
    setAreaData(data, parent, isNew = true) { // 设置区域列表数据
      this.curAreaDisplayList = data;
      if (!isNew) return;
      if (parent.ID === -1) {
        this.areaData = data;
      } else {
        const t = this.getChildTargetItem(parent);
        if (t) {
          t.children = data;
        }
      }
    },
    getChildTargetItem(parent) { // 获取到指定目标
      if (Array.isArray(this.areaData)) {
        if (parent.Level === 1) {
          return this.areaData.find(it => it.ID === parent.ID);
        }
        if (parent.Level === 2 && (parent.ParentID || parent.ParentID === 0)) {
          const level1 = this.areaData.find(it => it.ID === parent.ParentID);
          if (level1 && level1.children) {
            return level1.children.find(it => it.ID === parent.ID);
          }
        }
      }
      return null;
    },
    async getAddressIDList(parent = { ID: -1 }) { // 获取数据
      if (parent.Level >= 3) return [];
      // 缓存
      if (parent.ID === -1 && Array.isArray(this.areaData) && this.areaData.length > 0) {
        this.setAreaData(this.areaData, parent, false);
        return this.areaData;
      }
      const t = this.getChildTargetItem(parent);
      if (t && t.children && t.children.length > 0) {
        this.setAreaData(t.children, parent, false);
        return t.children;
      }
      // 无缓存时 网络请求数据
      this.loading = true;
      const resp = await this.api.getAddressIDList(parent.ID).catch(() => null);
      this.loading = false;
      if (resp && resp.data.Status === 1000) {
        this.setAreaData(resp.data.Data, parent);
        return resp.data.Data;
      }
      return [];
    },
    select(it) { // 点击选择事件
      let temp;
      switch (it.Level) {
        case 1:
          temp = it.ID === this.localValue[[this.defaultProps.RegionalIDLabel]] ? this.localValue : {
            [this.defaultProps.RegionalIDLabel]: it.ID,
            [this.defaultProps.RegionalNameLabel]: it.Name,
            [this.defaultProps.CityIDLabel]: '',
            [this.defaultProps.CityNameLabel]: '',
            [this.defaultProps.CountyIDLabel]: '',
            [this.defaultProps.CountyNameLabel]: '',
          };
          break;
        case 2:
          temp = it.ID === this.localValue[[this.defaultProps.CityIDLabel]] ? this.localValue : {
            ...this.localValue,
            [this.defaultProps.CityIDLabel]: it.ID,
            [this.defaultProps.CityNameLabel]: it.Name,
            [this.defaultProps.CountyIDLabel]: '',
            [this.defaultProps.CountyNameLabel]: '',
          };
          break;
        case 3:
          temp = {
            ...this.localValue,
            [this.defaultProps.CountyIDLabel]: it.ID,
            [this.defaultProps.CountyNameLabel]: it.Name,
          };
          break;
        default:
          break;
      }
      if (it.Level === 3) {
        this.$emit('input', temp); // 最后一步才需要
        this.visible = false;
        return;
      }
      this.localValue = temp;
      this.getAddressIDList(it);
    },
    onVisibleClick() { // 展开|关闭 事件
      if (!this.visible) {
        this.getAddressIDList();
        this.localValue = { ...this.value };
        this.curAreaDisplayList = this.areaData || [];
      }
      this.visible = !this.visible;
    },
    onCloseClick() {
      if (this.visible) {
        this.onVisibleClick();
      }
    },
    getSelectedList(obj) { // 获取省市区展示列表
      if (obj) {
        const RegionalName = obj[this.defaultProps.RegionalNameLabel];
        const CityName = obj[this.defaultProps.CityNameLabel];
        const CountyName = obj[this.defaultProps.CountyNameLabel];
        return [RegionalName, CityName, CountyName].filter(it => it);
      }
      return [];
    },
    reset() {
      this.localValue = { ...this.value };
      this.curAreaDisplayList = this.areaData || [];
    },
    async init() {
      await this.getAddressIDList();
      if (!this.areaData) return;
      // 下面处理只传递ID未传递的Name的情况
      const RegionalID = this.value[this.defaultProps.RegionalIDLabel];
      const RegionalName = this.value[this.defaultProps.RegionalNameLabel];
      const CityID = this.value[this.defaultProps.CityIDLabel];
      const CityName = this.value[this.defaultProps.CityNameLabel];
      const CountyID = this.value[this.defaultProps.CountyIDLabel];
      const CountyName = this.value[this.defaultProps.CountyNameLabel];

      if ((!RegionalID && RegionalID !== 0) || (!CityID && CityID !== 0) || (!CountyID && CountyID !== 0)) return;
      if (RegionalName && CityName && CountyName) return;
      const Regional = this.areaData.find(it => it.ID === RegionalID);
      if (Regional) {
        const cityList = await this.getAddressIDList(Regional);
        const City = cityList.find(it => it.ID === CityID);
        if (City) {
          const countyList = await this.getAddressIDList(City);
          const County = countyList.find(it => it.ID === CountyID);
          if (County) {
            const temp = {
              ...this.value,
              [this.defaultProps.RegionalNameLabel]: Regional.Name,
              [this.defaultProps.CityNameLabel]: City.Name,
              [this.defaultProps.CountyNameLabel]: County.Name,
            };
            this.$emit('input', temp);
          }
        }
      }
    },
  },
  mounted() {
    this.init();
  },
};
</script>
<style lang='scss'>
.mp-common-comps-area-selector-comp-wrap {
  width: 100%;
  border: 1px solid #e4e4e4;
  border-radius: 5px;
  box-sizing: border-box;
  cursor: text;
  color: #ddd;
  padding: 0 15px;
  overflow: hidden;
  text-overflow: ellipsis;
  .selected {
    color: #585858;
    white-space: nowrap;
    // & + .selected {
    //   margin-left: 5px;
    // }
  }
  &:hover {
    border-color: #aaa;
    transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  }
}
.is-error .mp-common-comps-area-selector-comp-wrap {
  border-color: #ff3769;
}
.mp-common-comps-area-selector-comp-popper-class {
  padding: 0;
  > .mp-popover-content {
    border: 1px solid #e4e4e4;
    > p.header {
      border-bottom: 1px solid #eee;
      height: 48px;
      padding: 10px 20px;
      line-height: 27px;
      box-sizing: border-box;
      position: relative;
      padding-right: 60px;
      > span {
        &.title {
          color: #999;
          display: inline-block;
          vertical-align: top;
          width: 128px;
          font-size: 13px;
        }
        &.selected {
          color: #ff3769;
          font-size: 13px;
          display: inline-block;
          max-width: 430px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          > i {
            & + i {
              margin-left: 10px;
            }
          }
        }
        &.icons {
          position: absolute;
          right: 3px;
          i {
            font-size: 17px;
            cursor: pointer;
            margin-right: 8px;
            &:hover {
              color: #428dfa
            }
            &:active {
              color: darken(#428dfa, 30);
            }
            &.disabled {
              color: #cbcbcb;
              cursor: not-allowed;
              pointer-events: none;
            }
          }
        }
      }
    }
    > div.content {
      padding: 10px 20px;
      padding-right: 5px;
      padding-bottom: 15px;
      line-height: 28px;
      min-height: 137px;
      box-sizing: border-box;
      > .empty {
        font-size: 12px;
        color: #cbcbcb;
      }
      > .list {
        > span {
          color: #333;
          font-size: 13px;
          margin-right: 15px;
          display: inline-block;
          cursor: pointer;
          transition: 0.13s cubic-bezier(0.645, 0.045, 0.355, 1);
          &:hover {
            color: #428dfa
          }
          &.active {
            color: #428dfa;
            font-weight: 700;
          }
        }
      }
    }
  }
}
@for $i from 10 through 100 {
  .mp-common-comps-area-selector-comp-popper-class.mt-#{$i} {
    margin-top: -#{$i}px !important;
  }
}
</style>
