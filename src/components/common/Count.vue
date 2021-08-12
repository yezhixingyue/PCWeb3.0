<template>
  <div class="count-wrap">
        <slot></slot>
        <div class="mp-pagination-wrap">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            hide-on-single-page
            :page-size="pageSize"
            :pager-count='5'
            layout="prev, pager, next, jumper"
            :total="count">
          </el-pagination>
        </div>
        <span class="count" :class="DownLoadConfigObj?'exc':''"
          >共检索出<i class="is-pink is-font-16">{{count}}</i>条记录</span>
        <DownLoadExcelComp :configObj="DownLoadConfigObj" v-if="DownLoadConfigObj" />
</div>
</template>

<script>
import DownLoadExcelComp from '@/components/common/UploadComp/DownLoadExcelComp.vue';

export default {
  components: {
    DownLoadExcelComp,
  },
  props: {
    /**
     * 是否显示左侧加载中
     */
    showLoading: {
      type: Boolean,
      default: false,
    },
    /**
     * 数据总条数
     */
    count: {
      type: Number,
      default: 0,
    },
    /**
     * 页面发生变化时的回调函数
     */
    handlePageChange: {
      type: Function,
      default: () => {},
    },
    /**
     * 监听页面变化，当其为1时修改当前页面为1
     */
    watchPage: {},
    pageSize: {
      default: 30,
      type: Number,
    },
    /**
     * 导出excel相关信息
     */
    DownLoadConfigObj: {
      type: Object,
      default: null,
    },
  },
  watch: {
    watchPage: {
      handler(newVal) {
        this.$nextTick(() => {
          if (this.currentPage === newVal) return;
          this.currentPage = newVal;
        });
      },
      immediate: true,
    },
  },
  methods: {
    handleCurrentChange(val) {
      this.handlePageChange(val);
    },
  },
  data() {
    return {
      currentPage: 1,
    };
  },
  // computed: {
  //   currentPage1: {
  //     get() {
  //       return 10;
  //     },
  //     set(newVal) {
  //     //  // console.log(newVal);
  //     },
  //   },
  // },
  created() {
    if (this.$route.query.Page) this.currentPage = +this.$route.query.Page;
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/var.scss";
.count-wrap{
  text-align: center;
  display: block;
  padding: 0;
  padding-left: 25px;
  font-size: 12px;
  line-height: 45px;
  padding-right: 72px;
  padding-top: 0px;
  width: 100%;
  height: 45px;
  box-sizing: border-box;
  border-top: none;
  position: relative;
  // display: flex;
  // justify-content: flex-end;
  font-size: 13px;
  color: $--color-text-regular;
  background-color: $--color-white;
  user-select: none;
  overflow: hidden;
  .loading-box{
    text-align: left;
  }
  .count{
    color: #888;
    position: absolute;
    right: 25px;
    i {
        margin: 0 3px;
    }
    &.exc {
      right: 182px;
    }
  }
  > button {
    position: absolute;
    right: 0;
    top: 2px;
    width: 140px;
    height: 40px;
  }
  .mp-pagination-wrap{
    display: inline-block;
    .el-pagination{
      padding-top: 8px;
      color: $--color-text-table-time;
      font-weight: 400;
      .btn-prev, .btn-next{
        position: relative;
        > i {
          &::before{
            content: '';
            position: absolute;
            width: 10px;
            top: 6px;
            height: 15px;
            background: url('../../assets/images/left-arrow.png') center no-repeat;
          }
        }
        &:disabled{
          > i::before {
            background: url('../../assets/images/left-disabled.png') center no-repeat;
          }
        }
      }
      .btn-next{
        > i::before {
            background: url('../../assets/images/right-arrow.png') center no-repeat;
          }
        &:disabled{
          > i::before {
            background: url('../../assets/images/right-disabled.png') center no-repeat;
          }
        }
      }
      .el-pager{
        > li{
          height: 28px;
          padding: 0 3px;
          margin-left: 15px;
          box-sizing: border-box;
          font-size: 14px;
          min-width: 28px;
          border-radius: 5px;
          cursor: pointer;
          &.active, &.active:hover {
            background-color: $--color-primary;
            color: $--color-white;
          }
          &:hover {
            background-color: rgba($color: $--color-primary, $alpha: .15);
            color: $--color-text-table-time;
          }
          &.el-icon.more.el-icon-more:before,
          &.el-icon.more.el-icon-d-arrow-right:before,
          &.el-icon.more.el-icon-d-arrow-left:before  {
            content: "...";
            font-size: 20px;
            position: relative;
            top: -5px;
            color: $--color-text-table-time;
          }
        }
      }
      .el-pagination__jump{
        color: $--color-text-table-time;
        margin-left: 14px;
        > .el-input{
          margin: 0 10px;
          min-width: 32px;
          height: 28px;
          padding: 0;
        }
      }
    }
  }
}
</style>
