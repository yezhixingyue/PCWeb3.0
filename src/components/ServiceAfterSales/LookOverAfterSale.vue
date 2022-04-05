<template>
  <div class="look-over-after-sale">
    <!-- <el-button @click="visible=true">查看售后政策</el-button>
    <el-button @click="visible=true">联系客服</el-button> -->
    <el-tooltip class="item" effect="dark" content="查看售后政策" placement="top">
      <i @click="visible=true" class="el-icon-edit"></i>
    </el-tooltip>
    <el-tooltip class="item" effect="dark" content="联系客服" placement="top">
      <i @click="visible=true" class="el-icon-edit"></i>
    </el-tooltip>
    <CommonDialogComp
      title="售后政策"
      :visible.sync="visible"
      @cancle="visible = false"
      @open='onOpen'
      @closed='visible = false'
      submitText='确定'
      :showCancel='false'
      @submit='visible = false'
      >
      <div slot="title" class="title">aaa</div>
      <div class="text">
        <h3>• 售后政策1</h3>
        <p>这里是售后服务部制定的售后政策，这里是售后服务部制定的售后政策，这里是售后服务部制定的售后政策，这里是售后服务部制定的售后政策。</p>
        <h3>• 售后政策2</h3>
        <p>这里是售后服务部制定的售后政策，这里是售后服务部制定的售后政策，这里是售后服务部制定的售后政策，这里是售后服务部制定的售后政策。</p>
        <h3>• 售后政策3</h3>
        <p>这里是售后服务部制定的售后政策，这里是售后服务部制定的售后政策，这里是售后服务部制定的售后政策，这里是售后服务部制定的售后政策。</p>
      </div>
      </CommonDialogComp>
  </div>
</template>

<script>
import CommonDialogComp from '@/packages/CommonDialogComp';

export default {
  data() {
    return {
      visible: false,
    };
  },
  components: {
    CommonDialogComp,
  },
  methods: {
    onOpen() {},
  },
};
</script>

<style lang='scss'>
.look-over-after-sale{
  .title{
    font-size: 30px;
    font-weight: 700;
    text-align: center;
  }
  .item{
    margin-left: 25px;
    margin-top: 10px;
    i{
      width: 25px;
      height: 25px;
      margin-left: 25px;
    }
  }
  .text{
    h3{
      margin-top: 50px;
      color: #333;
      font-size: 18px;
      font-weight: 700;
    }
    p{
      margin-top: 16px;
      color: #555;
      font-size: 16px;
      font-weight: 700;
      line-height: 32px;
    }
  }
}
</style>
