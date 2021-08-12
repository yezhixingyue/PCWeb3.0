<template>
  <el-dialog
    :visible="visible"
    v-if="visible"
    top='6vh'
    title="承接印品协议书"
    width="900px"
    v-dialogDrag
    destroy-on-close
    :before-close='handleBeforeDiaClose'
    custom-class="mp-register-agreement-wrap"
   >
   <article>
     <header>郑州名片之家电子商务有限公司（简称“名片之家”）系依法成立的从事商业印刷服务的企业,将严格按照国家《印刷业管理条例》
       等法律法规以及相关规章制度的规定承接印刷业务；现郑重告知：各位合作伙伴（包括自然人和法人、个体工商户等委托人）认真阅读以下条款，并同意按照本协议行使权利履行义务。</header>
     <section>
       <header>第一条：告知书</header>
       <div>
         <p>名片之家拒绝承接、印刷包含如下内容的印刷品，如您提交的印刷品涉及以下内容，造成的损失全部由您个人承担。</p>
         <ul>
           <li>1、含有反对宪法确定的基本原则内容的;</li>
           <li>2、含有危害国家统一、主权和领土完整内容的(如:台独,港独，疆独等);</li>
           <li>3、含有泄露国家秘密、危害国家安全或者损害国家荣誉和利益内容的;</li>
           <li>4、含有煽动民族仇恨、民族歧视,破坏民族团结或者侵害民族风俗、习惯内容的;</li>
           <li>5、含有宣扬邪教内容的;</li>
           <li>6、含有扰乱、破坏社会稳定和秩序内容的（如:代开发票等);</li>
           <li>7、含有宣扬赌博、暴力或者教唆犯罪内容的;</li>
           <li>8、含有侮辱、诋毁或者诽谤他人，侵害他人合法权益内容的;</li>
           <li>9、含有危害社会公德或者民族优秀文化传统内容的;</li>
           <li>10、含有敏感内容的(如:文革时期、越南战争时期、核试验时期资料等);</li>
           <li>11、含有传销、疑似传销、保健品夸大治疗效果内容的;</li>
           <li>12、含有涉黄的名片或不干胶、彩页不接内容的（如:有明显诱惑、酒店上门服务、找美女帅哥、会所休闲喝茶、养生SPA、高端养生、私人订制暗示等);</li>
           <li>13、不能提供合法有效证件的含有明确版权信息、宗教类画册的;</li>
           <li>14、不能提供商标注册证和所有人授权委托书,含有注册商标标签（带R标签或不带R)、驰名或知名商标、产品使用说明、产品包装盒、手提袋的。</li>
           <li>15、其他含有法律、行政法规和规章制度禁止内容的;</li>
         </ul>
       </div>
     </section>
     <section>
       <header>第二条：关于需要提供证件的印刷品</header>
       <div>
         <p>委托印刷品涉及到以下情况，按要求提供相关证件。</p>
         <ul>
           <li>1、委托印刷注册商标标识的，应当提供商标注册人所在地县级工商行政管理部门签章的《商标注册证》复印件或者《注册商标使用许可合同》；</li>
           <li>2、委托印刷布告、通告、重大活动工作证、通行证、在社会上流通使用的票证的，应当提供主管部门的《证明》；</li>
           <li>3、委托印刷机关、团体、部队、企业事业单位内部使用的有价票证或者无价票证，或者印刷有单位名称的介绍信、工作证、会员证、出入证、学位证书、学历证书或者其他学业证书等专用证件的，应当提供《委托印刷证明》；</li>
           <li>4、委托印刷宗教用品的，应当提供省、自治区、直辖市人民政府宗教事务管理部门的批准文件和省、自治区、直辖市人民政府出版行政部门核发的《准印证》。</li>
         </ul>
       </div>
     </section>
     <section>
       <header>第三条：关于印刷品质量问题</header>
       <div>
         <ul>
           <li>1、名片之家印刷品质量问题的处理期限为30日，您在收到订单时及时验货，出现质量问题请第一时间与我司联系；如果自您收到印刷品之日起超过30日内未提出异议的，视为您承印的印刷品全部合格。</li>
           <li>2、名片之家不承担印刷品外的额外经济损失。</li>
           <li>3、承印的印刷品不可与显示器中的色彩进行对比，从印刷角度考虑这种没有可比性，因此类问题出现的售后名片之家不予处理。</li>
         </ul>
       </div>
     </section>
     <section>
       <header>第四条：其他</header>
       <div>
         <ul>
           <li>1、您在名片之家网站上提交订单即视为委托印刷，也视为您保证提交印刷的产品以及相关材料真实性；否则，因此产生的任何侵权、经济纠纷或行政处罚等，均由您自行承担。</li>
           <li>2、本协议为双方自愿同意签订，不存在任何隐瞒、欺诈、胁迫等情形存在。</li>
           <li>3、本协议自您在提交承印件之日起生效，后续上传订单均按照本合同约定执行。</li>
         </ul>
       </div>
     </section>
     <footer>
       <el-button @click="handleBeforeDiaClose">关闭</el-button>
     </footer>
   </article>
  </el-dialog>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  model: {
    prop: 'value',
    event: 'change',
  },
  computed: {
    visible: {
      get() {
        return this.value;
      },
      set(bool) {
        this.$emit('change', bool);
      },
    },
  },
  methods: {
    handleBeforeDiaClose() {
      this.$emit('change', false);
    },
  },
};
</script>

<style lang='scss'>
.mp-register-agreement-wrap {
  > .el-dialog__header {
    height: 45px;
    box-sizing: border-box;
    padding: 14px 10px;
    padding-left: 23px;
    margin: 0 10px;
    border-bottom: 1px solid #e5e5e5;
    > .el-dialog__title {
      font-size: 16px;
      color: #333;
      line-height: 16px;
      height: 16px;
    }
    > .el-dialog__headerbtn {
      top: 8px;
      font-size: 20px;
    }
    position: relative;
    &::before {
      content: '';
      position: absolute;
      height: 16px;
      width: 3px;
      background-color: #428dfa;
      left: 10px;
      top: 15px;
    }
  }
  > .el-dialog__body {
    padding-top: 18px;
    max-height: 755px;
    overflow: auto;
    box-sizing: border-box;
    > article {
      font-size: 14px;
      line-height: 24px;
      > header {
        color: #333;
      }
      > section {
        > header {
          color: #333;
          font-weight: 700;
          padding-top: 10px;
          padding-bottom: 8px;
        }
        > div {
          > p {
            margin-bottom: 6px;
            color: #666;
          }
          > ul {
            > li {
              line-height: 24px;
              padding-bottom: 1px;
              color: #666;
            }
          }
        }
      }
      > footer {
        text-align: center;
        margin-top: 23px;
        margin-bottom: 15px;
        > button {
          width: 110px;
          height: 35px;
          padding: 0;
          color: #428dfa;
          border-color: #428dfa;
        }
      }
    }
  }
}
</style>
