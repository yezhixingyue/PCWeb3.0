<template>
  <CommonDialogComp
    class="mp-pc-service-after-sales-see-estimate-wrap"
    title="售后评价"
    :visible.sync="visible"
    @cancle="cancle"
    @open='onOpen'
    @closed='closed'
    submitText='确定'
    :showCancel='false'
    @submit='submit'
    width='800px'
    top='5vh'
    >
    <div slot="title" class="title">aaa</div>
    <el-form label-position="left" ref="form" :model="SeeEstimate" class="see-estimate">
      <template v-if="SeeEstimate">
        <el-form-item label="服务评分：">
          <el-rate disabled show-text v-model="SeeEstimate.Score" :texts="['非常差', '差', '一般', '好', '非常好',]"></el-rate>
        </el-form-item>
        <el-form-item label="服务结果：">
          <div class="result">
            <span v-if="SeeEstimate.Result === 1">问题已解决</span>
            <span v-else>问题未解决</span>
          </div>
        </el-form-item>
        <el-form-item label="服务标签：">
          <div class="images">
            {{SeeEstimate.LabelTitle.join()}}
          </div>
        </el-form-item>
        <el-form-item label="填写评价：">
          <div class="images" style="line-height: 32px;padding-top:4px">
            <span>{{SeeEstimate.EvaluateContent || '未填写评价'}}</span>
          </div>
        </el-form-item>
        <el-form-item label="评价晒图：">
          <div class="images" v-if="SeeEstimate.EvaluatePicList.length">
            <el-image v-for="item in SeeEstimate.EvaluatePicList" :key="item"
              :src="baseUrl + item"
              fit="cover"></el-image>
          </div>
          <span v-else>未上传图片</span>
        </el-form-item>
      </template>
    </el-form>
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '@/packages/CommonDialogComp';
import { imgUrl } from '@/assets/js/setup';

export default {
  components: {
    CommonDialogComp,
  },

  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    AfterSaleCode: {
      type: Number,
    },
  },

  data() {
    return {
      baseUrl: imgUrl,
      SeeEstimate: null,
    };
  },
  methods: {
    onOpen() {},
    cancle() {
      this.closed();
    },
    closed() {
      this.$emit('closed');
    },
    submit() {
      this.$emit('submit');
    },
  },
  watch: {
    visible(n) {
      if (n) {
        this.api.getOrderAfterSaleEvaluateDetail(this.AfterSaleCode).then(res => {
          if (res.data.Status === 1000) {
            this.SeeEstimate = res.data.Data;
          }
        });
      }
    },
  },
  mounted() {
    // console.log(this.AfterSaleCode);
  },
};
</script>

<style lang='scss'>
.mp-pc-service-after-sales-see-estimate-wrap {

  width: 100%;
  background-color: rgba($color: #000000, $alpha: 0.5);
  .el-dialog__body{
    padding: 30px;
  }
  .el-dialog__header{
    padding-left: 30px;
  }
  .el-dialog__header::after{
    width: calc(100% - 60px);
    left: 30px;
  }
  .see-estimate{
    min-height: calc(400px);
    .el-form-item{
      .el-form-item__label{
        font-weight: 700;
      }
      margin-bottom: 8px;
    }
    .el-rate{
      margin-top: 10px;
    }
    .images{
      display: flex;
      flex-wrap: wrap;
      box-sizing: border-box;
      // padding-right: 50px;
      .el-image{
        width: 100px;
        height: 100px;
        margin-right: 20px;
        margin-bottom: 20px;
      }
    }
  }
}
</style>
