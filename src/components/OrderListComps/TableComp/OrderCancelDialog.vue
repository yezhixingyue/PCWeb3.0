<template>
  <el-dialog
    :visible.sync="localVisible"
    width="460px"
    custom-class="mp-order-cancel-dialog"
    v-dialogDrag
    :close-on-click-modal='false'
    :close-on-press-escape='false'
    destroy-on-close
    append-to-body
  >
    <section class="content">
      <header>
        <h2><i class="el-icon-question"></i> 确认取消该订单吗？</h2>
      </header>

      <main>
        <ul v-if="OrderItem">
          <li>
            <label for="">订单号：</label>
            <div>
              <span>{{ OrderItem.OrderID }}</span>
            </div>
          </li>

          <li>
            <label for="">订单信息：</label>
            <div>
              <span>{{OrderItem.ProductName}}</span>
              <span v-if="OrderItem.HaveKind && OrderItem.KindCount">{{OrderItem.KindCount}}款</span>
              <span v-if="OrderItem.HaveNumber && OrderItem.ProductAmount">{{OrderItem.ProductAmount}}{{OrderItem.Unit || ''}}</span>
              <span>{{(OrderItem.CraftList || []).join('、')}}</span>
              <span>{{(OrderItem.SizeList || []).join('、')}}</span>
            </div>
          </li>

          <li>
            <label for="">文件内容：</label>
            <div>
              <span>{{ OrderItem.Content }}</span>
            </div>
          </li>
        </ul>
      </main>

      <footer>
        <el-button type="primary" @click="onSubmit">确认</el-button>
        <el-button class="cancel-btn" @click="localVisible = false">取消</el-button>
      </footer>
    </section>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    OrderItem: {
      type: Object,
      default: null,
    },
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
  },
  methods: {
    onSubmit() {
      if (!this.OrderItem) return;

      this.$emit('submit', this.OrderItem.OrderID);
    },
  },
};
</script>
<style lang='scss'>
  .mp-order-cancel-dialog {
    border-radius: 5px;
    > .el-dialog__header {
      padding: 0;

      .el-dialog__headerbtn {
        top: 10px;
        right: 15px;
      }
    }
    > .el-dialog__body {
      .content {
        display: block;

        > header {
          text-align: center;
          padding-top: 4px;
          h2 {
            i {
              color: #f4a307;
              font-size: 40px;
              vertical-align: -7px;
              margin-right: 2px;
            }
            line-height: 40px;
            font-weight: 700;
            font-size: 20px;
            color: #444;
          }
        }

        > main {
          min-height: 120px;

          > ul {
            padding-top: 19px;
            padding-bottom: 10px;
            > li {
              font-size: 12px;
              color: #444;
              margin-bottom: 15px;

              > label {
                width: 100px;
                font-weight: 700;
                text-align: right;
                display: inline-block;
              }

              > div {
                display: inline-block;
                width: 320px;
                vertical-align: top;

                > span {
                  margin-right: 6px;
                }
              }
            }
          }
        }

        > footer {
          text-align: center;
          button {
            width: 120px;
            height: 35px;
            margin: 0 20px;
            padding: 0;
          }
        }
      }
    }
  }
</style>
