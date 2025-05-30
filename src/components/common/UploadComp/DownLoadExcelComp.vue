<template>
  <el-button type='primary' class="mp-common-download-to-excel-comp-wrap" :class="{link: link}" @click="onClick" :disabled="disabled">
    {{ btnText }}
  </el-button>
</template>

<script>
import { ConvertTimeFormat } from '@/assets/js/utils/ConvertTimeFormat';

export default {
  props: {
    /**
     * 下载表格配置对象
     */
    configObj: {
      type: Object,
      default: () => ({
        condition: {}, // 当前条件
        count: 0, // 当前数据总数
        fileDefaultName: '客户订单流水', // 导出文件默认名称
        fileDate: { First: '', Second: '' }, // 导出的时间区间
        downFunc() {}, // 下载函数
        maxNumber: 0, // 最大支持导出数量
        tipTitle: '',
        withoutSuffixTime: false, // 是否不添加后缀时间
      }),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    link: {
      type: Boolean,
      default: false,
    },
    btnText: {
      type: String,
      default: '导出Excel',
    },
    warningTipTitle: {
      type: String,
      default: '确定导出Excel数据吗?',
    },
  },
  methods: {
    onClick() {
      // eslint-disable-next-line max-len
      if (((this.configObj.condition.Page && this.configObj.condition.Page === 1) || !this.configObj.condition.Page) && this.configObj.count === 0) {
        this.messageBox.warnSingleError({ msg: '[ 当前条件没有可导出的数据 ]', title: '暂无数据' });
        return;
      }

      if (this.configObj.maxNumber && this.configObj.count > this.configObj.maxNumber) {
        this.messageBox.warnSingleError({ msg: `每次最多可导出${this.configObj.maxNumber}条${this.configObj.tipTitle || '数据'}`, title: '导出失败' });
        return;
      }

      this.messageBox.warnCancelNullMsg({
        title: this.warningTipTitle,
        successFunc: this.handleDownFunc,
      });
      // this.handleDownFunc();
    },
    async handleDownFunc() {
      const config = JSON.parse(JSON.stringify(this.configObj.condition)); // 获取经过处理过的请求头配置对象

      delete config.Page;
      delete config.PageSize;
      const res = await this.configObj.downFunc(config);

      if (res.status !== 200) {
        this.messageBox.failSingleError({ title: '导出失败', msg: `[ 失败原因：${res.statusText} ]` });
        return;
      }
      const { data } = res;
      const blobData = new Blob([data]);
      let fileName = this.configObj.fileDefaultName;

      if (!this.configObj.withoutSuffixTime) {
        const _d = ConvertTimeFormat(new Date());
        fileName += `(截止到${_d}日全部订单)`;
      }

      if (this.configObj.fileDate && !this.configObj.withoutSuffixTime) {
        const { First, Second } = this.configObj.fileDate;
        if (First && Second) {
          const f = First.split('T')[0];
          let _second = '';
          if (new Date(Second) > new Date()) {
            const PlaceDate = this.$store.getters['timeSelectModule/TodayDate'];
            _second = PlaceDate.Second;
          } else {
            _second = Second;
          }
          const t2 = _second ? ConvertTimeFormat(new Date(new Date(_second.replace('Z', '')).getTime())) : '';
          if (f) fileName = `${this.configObj.fileDefaultName}(${f}至${t2})`;
        }
      }

      fileName += '.xls';
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blobData, fileName);
      } else {
        const url = window.URL.createObjectURL(blobData, { type: 'application/vnd.ms-excel' });
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = url;

        link.setAttribute('download', `${fileName}`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        link.onload = () => {
          window.URL.revokeObjectURL(url);
        };
      }
    },
  },
};
</script>

<style lang='scss'>
.mp-common-download-to-excel-comp-wrap.link {
  padding: 0;
  border: none;
  background-color: rgba($color: #000000, $alpha: 0) !important;
  color: #428dfa;

  &:hover {
    opacity: 0.8;
  }
  &:active {
    color: #0b58ca;
    opacity: 1;
  }
  &.is-disabled {
    color: #cbcbcb;
    opacity: 1;
  }
}
</style>
