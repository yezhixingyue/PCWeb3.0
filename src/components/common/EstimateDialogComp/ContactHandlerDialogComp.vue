<template>
  <article>
    <section>
      <!-- <span>售后</span> -->
      <CommonDialogComp
        :visible.sync="visible"
        @cancle="visible = false"
        @open='onOpen'
        @closed='visible = false'
        submitText='确定'
        :showCancel='false'
        @submit='visible = false'
        width='800px'
        >
        <el-form label-position="left" ref="form" :model="form" class="estimate">
          <el-form-item label="服务评分：">
            <el-rate  show-text :texts="['非常差', '差', '一般', '好', '非常好',]"></el-rate>
          </el-form-item>
          <el-form-item label="服务结果：">
            <div class="result">
              <span class="action">问题已解决</span>
              <span>问题未解决</span>
            </div>
          </el-form-item>
          <el-form-item label="服务标签：">
            <CheckButton
              @CheckChange="problemType"
              :checkList="[{Title:'aa',ID:1}]"
              LabelKey="Title"
              ValueKey="ID"
            ></CheckButton>
          </el-form-item>
          <el-form-item label="填写评价：">
            <el-input
              style="width:590px"
              type="textarea"
              :rows="3"
              placeholder="请输入内容"
              maxlength="300"
              show-word-limit>
            </el-input>
          </el-form-item>
        </el-form>
      </CommonDialogComp>
    </section>
  </article>
</template>

<script>
import CommonDialogComp from '@/packages/CommonDialogComp';
import CheckButton from '@/components/common/CheckButton.vue';
import { imgUrl } from '@/assets/js/setup';

export default {
  components: {
    CommonDialogComp,
    CheckButton,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      baseUrl: imgUrl,
      form: {
        name: 0,
        region: '',
      },
    };
  },
  methods: {
    onOpen() {},
    problemType() {},
  },

};
</script>

<style lang='scss'>
  .estimate{
    .el-rate{
      margin-top: 10px;
    }
    .result{
      display: flex;
      span{
        padding: 0px 10px;
        border-radius: 10px;
        border: 1px solid #aaa;
        height: 32px;
        line-height: 32px;
        margin-top: 3px;
        margin-right: 10px;
      }
      .action{
        border: 1px solid #26BCF9;
        color: #26BCF9;
      }
    }
    .check-button{
      display: flex;
      flex-wrap: wrap;
      height: 40px;
      align-items: center;
      li{
        width: 80px;
        height: 2em;
        line-height: 2em;
        padding: 0 10px;
        margin-right: 10px;
        border: 1px solid #26bcf9;
        border-radius: 5px;
        text-align: center;
      }
      .action{
        color: #26bcf9;
        background-color: #d9eff7;
      }
    }
    .upload{
      display: flex;
      flex-direction: column;
      .el-upload-dragger{
        width: 100%;
        height: 100% ;
      }
    }
  }
</style>
