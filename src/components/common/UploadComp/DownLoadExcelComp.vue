<template>
  <el-button type='primary' class="mp-common-download-to-excel-comp-wrap" @click="onClick">
    导出Excel
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
      }),
    },
  },
  methods: {
    onClick() {
      // eslint-disable-next-line max-len
      if (((this.configObj.condition.Page && this.configObj.condition.Page === 1) || !this.configObj.condition.Page) && this.configObj.count === 0) {
        this.messageBox.warnSingleError({ msg: '[ 当前条件没有可导出的数据 ]', title: '暂无数据' });
        return;
      }
      this.messageBox.warnCancelNullMsg({
        title: '确定导出Excel数据吗?',
        successFunc: this.handleDownFunc,
      });
      // this.handleDownFunc();
    },
    async handleDownFunc() {
      const config = JSON.parse(JSON.stringify(this.configObj.condition)); // 获取经过处理过的请求头配置对象

      delete config.Page;
      delete config.PageSize;
      // // console.log('导出-1', 'fileName----fileName');
      const res = await this.configObj.downFunc(config);
      // // console.log('导出-2', 'fileName----fileName', res);

      // // console.log(res, config);
      if (res.status !== 200) {
        this.messageBox.failSingleError({ title: '导出失败', msg: `[ 失败原因：${res.statusText} ]` });
        return;
      }
      // // console.log('导出-3', 'fileName----fileName');
      const { data } = res;
      const blobData = new Blob([data]);
      // // console.log('blob', 'fileName----fileName');
      const _d = ConvertTimeFormat(new Date());
      let fileName = `${this.configObj.fileDefaultName}(截止到${_d}日全部订单).xls`;
      if (this.configObj.fileDate) {
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
          const t2 = _second ? ConvertTimeFormat(new Date(new Date(_second).getTime() - 24 * 60 * 60 * 1000)) : '';
          if (f) fileName = `${this.configObj.fileDefaultName}(${f}至${t2}).xls`;
        }
      }
      // // console.log(fileName, 'fileName----fileName');
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
</style>
